"use client";

import { FormEvent, useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  Bell,
  CalendarDays,
  Check,
  ChevronDown,
  ChevronLeft,
  Info,
  Camera,
  MapPin,
  Send,
  Store,
  Users,
} from "lucide-react";

import { getToken } from "@/lib/auth";
import {
  getCitiesByProvince,
  getProvinces,
} from "@/services/location.service";
import {
  createBusiness,
  getBusinessCategories,
  suggestBusinessCategory,
} from "@/services/business.service";
import type { City, Province } from "@/services/location.service";
import type {
  BusinessCategoryOption,
  BusinessCategorySuggestionResponse,
  CreateBusinessRequest,
} from "@/types/business";

type RegistrationStep = 1 | 2 | 3;

const STEP_CONTENT: Record<RegistrationStep, { title: string; subtitle: string }> = {
  1: { title: "معرفی کسب‌وکار", subtitle: "نام و دسته‌بندی" },
  2: { title: "شهر و خدمات", subtitle: "انتخاب شهر و معرفی خدمات" },
  3: { title: "اطلاعات تکمیلی", subtitle: "توضیحات و تماس" },
};

export default function AddBusinessPage() {
  const router = useRouter();

  const [activeStep, setActiveStep] = useState<RegistrationStep>(1);
  const [name, setName] = useState("");
  const [categoryId, setCategoryId] = useState<number | null>(null);
  const [categorySelectionSource, setCategorySelectionSource] = useState<"manual" | "suggestion" | null>(null);
  const [categories, setCategories] = useState<BusinessCategoryOption[]>([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [categoriesLoadError, setCategoriesLoadError] = useState("");
  const [suggestion, setSuggestion] = useState<BusinessCategorySuggestionResponse | null>(null);
  const [suggestionLoading, setSuggestionLoading] = useState(false);
  const [suggestionError, setSuggestionError] = useState("");
  const [suggestionAccepted, setSuggestionAccepted] = useState(false);
  const suggestionRequestId = useRef(0);
  const [provinceId, setProvinceId] = useState<number | null>(null);
  const [cityId, setCityId] = useState<number | null>(null);
  const [servicesText, setServicesText] = useState("");
  const [description, setDescription] = useState("");
  const [phone, setPhone] = useState("");

  const [provinces, setProvinces] = useState<Province[]>([]);
  const [cities, setCities] = useState<City[]>([]);
  const [loadingProvinces, setLoadingProvinces] = useState(true);
  const [loadingCities, setLoadingCities] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [nameError, setNameError] = useState("");
  const [categoryError, setCategoryError] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function loadProvinces() {
      try {
        const data = await getProvinces();
        if (!cancelled) setProvinces(data);
      } catch (loadError: unknown) {
        if (!cancelled) {
          setError(
            loadError instanceof Error
              ? loadError.message
              : "خطا در دریافت استان‌ها.",
          );
        }
      } finally {
        if (!cancelled) setLoadingProvinces(false);
      }
    }

    void loadProvinces();
    return () => {
      cancelled = true;
    };
  }, []);

  const loadCategories = useCallback(async () => {
    setCategoriesLoading(true);
    setCategoriesLoadError("");
    try {
      const data = await getBusinessCategories();
      setCategories(data.filter((item) => item.is_active));
    } catch (loadError: unknown) {
      setCategoriesLoadError(
        loadError instanceof Error
          ? loadError.message
          : "دریافت دسته‌بندی‌ها انجام نشد.",
      );
    } finally {
      setCategoriesLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadCategories();
  }, [loadCategories]);

  function invalidateSuggestionForChangedInputs() {
    suggestionRequestId.current += 1;
    setSuggestion(null);
    setSuggestionError("");
    setSuggestionAccepted(false);
    setSuggestionLoading(false);
    if (categorySelectionSource === "suggestion") {
      setCategoryId(null);
      setCategorySelectionSource(null);
    }
  }

  async function requestCategorySuggestion() {
    const trimmedName = name.trim();
    if (trimmedName.length < 2) {
      setNameError("برای دریافت پیشنهاد، نام کسب‌وکار را وارد کنید.");
      return;
    }
    if (categoriesLoading) {
      setSuggestionError("ابتدا منتظر دریافت فهرست دسته‌بندی‌ها بمانید.");
      return;
    }
    if (categories.length === 0) {
      setSuggestionError("فهرست دسته‌بندی‌های فعال در دسترس نیست. می‌توانید دوباره تلاش کنید.");
      return;
    }

    const requestId = ++suggestionRequestId.current;
    setSuggestionLoading(true);
    setSuggestionError("");
    setSuggestion(null);
    setSuggestionAccepted(false);

    const services = servicesText.split("\n").map((value) => value.trim()).filter(Boolean);
    try {
      const result = await suggestBusinessCategory({
        name: trimmedName,
        services,
        description: description.trim() || null,
      });

      if (requestId !== suggestionRequestId.current) return;
      if (name.trim() !== trimmedName) return;

      const matchingCategory = result.category_id === null
        ? undefined
        : categories.find((item) => item.id === result.category_id && item.is_active);

      if (!matchingCategory) {
        setSuggestionError(result.reason || "پیشنهاد مناسبی پیدا نشد؛ لطفاً دسته‌بندی را دستی انتخاب کنید.");
        setSuggestion(null);
        return;
      }

      setSuggestion({ ...result, category_name: matchingCategory.name });
    } catch (requestError: unknown) {
      if (requestId !== suggestionRequestId.current) return;
      setSuggestionError(
        requestError instanceof Error
          ? requestError.message
          : "دریافت پیشنهاد دسته‌بندی انجام نشد. انتخاب دستی همچنان در دسترس است.",
      );
    } finally {
      if (requestId === suggestionRequestId.current) setSuggestionLoading(false);
    }
  }

  function acceptCategorySuggestion() {
    if (!suggestion || suggestion.category_id === null) return;
    const valid = categories.some((item) => item.id === suggestion.category_id && item.is_active);
    if (!valid) {
      setSuggestionError("این پیشنهاد دیگر در فهرست دسته‌بندی‌های فعال نیست. لطفاً دستی انتخاب کنید.");
      setSuggestion(null);
      return;
    }
    setCategoryId(suggestion.category_id);
    setCategorySelectionSource("suggestion");
    setSuggestionAccepted(true);
    setCategoryError("");
    setError("");
  }

  useEffect(() => {
    let cancelled = false;
    setCityId(null);
    setCities([]);

    if (provinceId === null) {
      setLoadingCities(false);
      return () => {
        cancelled = true;
      };
    }

    async function loadCities() {
      setLoadingCities(true);
      try {
        const data = await getCitiesByProvince(provinceId as number);
        if (!cancelled) setCities(data);
      } catch (loadError: unknown) {
        if (!cancelled) {
          setError(
            loadError instanceof Error
              ? loadError.message
              : "خطا در دریافت شهرها.",
          );
        }
      } finally {
        if (!cancelled) setLoadingCities(false);
      }
    }

    void loadCities();
    return () => {
      cancelled = true;
    };
  }, [provinceId]);

  function continueToNextStep() {
    setError("");

    if (activeStep === 1) {
      const trimmedName = name.trim();
      setNameError(trimmedName ? "" : "لطفاً نام کسب‌وکار را وارد کنید.");
      setCategoryError(categoryId !== null && categories.some((item) => item.id === categoryId && item.is_active) ? "" : "لطفاً یک دسته‌بندی معتبر انتخاب کنید.");
      if (!trimmedName || categoryId === null || !categories.some((item) => item.id === categoryId && item.is_active)) return;
      setActiveStep(2);
      return;
    }

    if (activeStep === 2) {
      if (provinceId === null) {
        setError("لطفاً استان را انتخاب کنید.");
        return;
      }
      if (cityId === null) {
        setError("لطفاً شهر را انتخاب کنید.");
        return;
      }
      setActiveStep(3);
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submitting) return;
    setError("");

    const trimmedName = name.trim();
    if (!trimmedName) {
      setActiveStep(1);
      setNameError("لطفاً نام کسب‌وکار را وارد کنید.");
      return;
    }
    if (categoryId === null || !categories.some((item) => item.id === categoryId && item.is_active)) {
      setActiveStep(1);
      setCategoryError("لطفاً یک دسته‌بندی معتبر انتخاب کنید.");
      return;
    }
    if (provinceId === null) {
      setActiveStep(2);
      setError("لطفاً استان را انتخاب کنید.");
      return;
    }
    if (cityId === null) {
      setActiveStep(2);
      setError("لطفاً شهر را انتخاب کنید.");
      return;
    }

    const token = getToken();
    if (!token) {
      setError("نشست شما معتبر نیست. لطفاً دوباره وارد حساب کاربری شوید.");
      return;
    }

    const services = servicesText
      .split("\n")
      .map((service) => service.trim())
      .filter(Boolean);

    // Preserve the current backend contract. Category is UI-only until the
    // backend schema and createBusiness request are updated in the next phase.
    const request: CreateBusinessRequest = {
      name: trimmedName,
      category_id: categoryId,
      province_id: provinceId,
      city_id: cityId,
      services,
      description: description.trim() || null,
      phone: phone.trim() || null,
    };

    setSubmitting(true);
    try {
      const created = await createBusiness(token, request);
      if (!Number.isInteger(created.id) || created.id <= 0) {
        throw new Error("پاسخ نامعتبر از سرور دریافت شد.");
      }
      router.push("/");
    } catch (submitError: unknown) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : "ثبت کسب‌وکار انجام نشد. لطفاً دوباره تلاش کنید.",
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main dir="rtl" className="lahze-onboarding-page">
      <header className="lahze-onboarding-header">
        <div className="lahze-onboarding-header-inner">
          <div className="lahze-onboarding-account" aria-label="حساب کاربری">
            <span className="lahze-onboarding-avatar">ل</span>
            <span className="lahze-onboarding-account-label">حساب کاربری</span>
            <ChevronDown size={15} aria-hidden="true" />
            <span className="lahze-onboarding-notification" aria-hidden="true">
              <Bell size={21} />
              <i />
            </span>
          </div>

          <nav className="lahze-onboarding-nav" aria-label="ناوبری اصلی">
            <Link href="/" className="lahze-onboarding-nav-link">خانه</Link>
            <Link href="/business" className="lahze-onboarding-nav-link">کسب‌وکارها</Link>
            <span className="lahze-onboarding-nav-link">فرصت‌ها</span>
            <span className="lahze-onboarding-nav-link">درباره لحظه</span>
          </nav>

          <Link href="/" className="lahze-onboarding-brand" aria-label="لحظه، صفحه اصلی">
            <span>لحظه</span>
            <span className="lahze-onboarding-brand-mark" aria-hidden="true">
              <i />
              <i />
              <i />
            </span>
          </Link>
        </div>
      </header>

      <div className="lahze-onboarding-main">
        <div className="lahze-onboarding-breadcrumb-wrap">
          <Link href="/" className="lahze-onboarding-breadcrumb">
            <ChevronLeft size={16} />
            بازگشت به داشبورد
          </Link>
        </div>

        <section className="lahze-onboarding-card" aria-labelledby="onboarding-title">
          <aside className="lahze-onboarding-aside">
            <div className="lahze-onboarding-illustration" aria-hidden="true">
              <svg viewBox="0 0 320 250" role="img">
                <defs>
                  <linearGradient id="lahze-awning" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0" stopColor="#9874ff" />
                    <stop offset="1" stopColor="#5d2fe9" />
                  </linearGradient>
                  <linearGradient id="lahze-window" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0" stopColor="#d9d1ff" />
                    <stop offset="1" stopColor="#9c88f6" />
                  </linearGradient>
                </defs>
                <circle cx="115" cy="72" r="58" fill="#e6e0ff" />
                <circle cx="219" cy="68" r="47" fill="#ece7ff" />
                <circle cx="67" cy="150" r="53" fill="#e9e3ff" />
                <ellipse cx="164" cy="205" rx="100" ry="17" fill="#e4deff" />
                <path d="M83 107h158l-11 25H94z" fill="#6e44ed" opacity=".18" />
                <rect x="84" y="119" width="158" height="92" rx="8" fill="#fff" stroke="#ded6ff" strokeWidth="4" />
                <rect x="100" y="139" width="67" height="51" rx="5" fill="url(#lahze-window)" />
                <path d="M105 179l48-34" stroke="#fff" strokeWidth="5" opacity=".28" />
                <rect x="184" y="140" width="36" height="71" rx="5" fill="#f7f5ff" stroke="#ded6ff" strokeWidth="3" />
                <rect x="196" y="151" width="12" height="25" rx="2" fill="#d6ccff" />
                <path d="M74 113l18-40h140l18 40z" fill="url(#lahze-awning)" />
                <path d="M74 113h176v18c0 12-16 18-29 8-12 10-26 9-38-1-13 11-28 11-42 0-13 11-27 11-40 0-12 10-27 11-27-7z" fill="#6535ed" />
                <path d="M112 74h28l-13 39H99z" fill="#b8a5ff" opacity=".8" />
                <path d="M156 74h28l5 39h-33z" fill="#cdbfff" opacity=".82" />
                <path d="M198 74h24l21 39h-34z" fill="#9c7cff" />
                <path d="M85 169c-18-17-16-37-5-47 13 6 19 22 14 37l-5 13" fill="#ab98ff" />
                <rect x="77" y="169" width="18" height="29" rx="4" fill="#9a83f5" />
                <path d="M72 177h28l-4 22H77z" fill="#7f60ed" />
                <circle cx="236" cy="186" r="27" fill="#6330ec" />
                <path d="M236 173v26M223 186h26" stroke="#fff" strokeWidth="4" strokeLinecap="round" />
              </svg>
            </div>

            <h2>شروع ساده، فرصت‌های بیشتر</h2>
            <p className="lahze-onboarding-aside-copy">
              با ثبت کسب‌وکار خود در لحظه، می‌توانید ظرفیت‌های خالی خود را به مشتریان واقعی نشان دهید و زمان‌های از دست‌رفته را به فرصت تبدیل کنید.
            </p>

            <div className="lahze-onboarding-benefits">
              <div><span><MapPin size={19} /></span><p>دیده شدن در شهر شما</p></div>
              <div><span><Users size={19} /></span><p>جذب مشتری در زمان‌های خالی</p></div>
              <div><span><CalendarDays size={19} /></span><p>مدیریت آسان فرصت‌ها</p></div>
            </div>
          </aside>

          <div className="lahze-onboarding-form-panel">
            <div className="lahze-onboarding-intro">
              <span className="lahze-onboarding-eyebrow">ثبت کسب‌وکار در لحظه</span>
              <h1 id="onboarding-title">بیایید با معرفی کسب‌وکار شما شروع کنیم</h1>
              <p>فقط چند مرحله کوتاه تا حضور در لحظه؛ نگران نباشید، بعداً هم می‌توانید اطلاعات بیشتری اضافه کنید.</p>
            </div>

            <div className="lahze-onboarding-stepper" aria-label={`مرحله ${activeStep} از ۳`}>
              {[1, 2, 3].map((stepNumber) => {
                const step = stepNumber as RegistrationStep;
                const isCurrent = activeStep === step;
                const isComplete = activeStep > step;
                return (
                  <div
                    className={`lahze-onboarding-step ${isCurrent ? "is-current" : ""} ${isComplete ? "is-complete" : ""}`}
                    key={step}
                  >
                    <span className="lahze-onboarding-step-number">
                      {isComplete ? <Check size={15} /> : step}
                    </span>
                    <strong>{STEP_CONTENT[step].title}</strong>
                    <small>{STEP_CONTENT[step].subtitle}</small>
                  </div>
                );
              })}
              <div className="lahze-onboarding-step-line" aria-hidden="true">
                <span style={{ width: `${activeStep === 1 ? 24 : activeStep === 2 ? 50 : 100}%` }} />
              </div>
            </div>

            {error && (
              <div className="lahze-onboarding-alert" role="alert">
                <Info size={18} />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} noValidate>
              {activeStep === 1 && (
                <div className="lahze-onboarding-step-fields" key="step-one">
                  <div className="lahze-onboarding-field-group">
                    <label htmlFor="business-name">نام کسب‌وکار <span>*</span></label>
                    <input
                      id="business-name"
                      type="text"
                      value={name}
                      onChange={(event) => {
                        setName(event.target.value);
                        invalidateSuggestionForChangedInputs();
                        if (event.target.value.trim()) setNameError("");
                        setError("");
                      }}
                      disabled={submitting}
                      autoComplete="organization"
                      aria-invalid={Boolean(nameError)}
                      aria-describedby={nameError ? "business-name-error" : "business-name-help"}
                      placeholder="مثلاً سالن زیبایی آترین"
                    />
                    {nameError ? (
                      <small className="lahze-onboarding-field-error" id="business-name-error">{nameError}</small>
                    ) : (
                      <small id="business-name-help">نامی را وارد کنید که به مشتریان نمایش داده شود.</small>
                    )}
                  </div>

                  <div className="lahze-onboarding-field-group">
                    <label htmlFor="business-category">دسته‌بندی <span>*</span></label>
                    <div className="lahze-onboarding-select-wrap">
                      <select
                        id="business-category"
                        value={categoryId ?? ""}
                        onChange={(event) => {
                          const selected = event.target.value ? Number(event.target.value) : null;
                          setCategoryId(selected);
                          setCategorySelectionSource(selected === null ? null : "manual");
                          setSuggestion(null);
                          setSuggestionAccepted(false);
                          setSuggestionError("");
                          setSuggestionLoading(false);
                          suggestionRequestId.current += 1;
                          if (selected !== null) setCategoryError("");
                          setError("");
                        }}
                        disabled={submitting || categoriesLoading || categories.length === 0}
                        aria-invalid={Boolean(categoryError)}
                        aria-describedby="business-category-help"
                      >
                        <option value="">
                          {categoriesLoading ? "در حال دریافت دسته‌بندی‌ها..." : categoriesLoadError ? "دریافت دسته‌بندی ناموفق بود" : categories.length === 0 ? "دسته‌بندی فعالی موجود نیست" : "دسته‌بندی کسب‌وکار خود را انتخاب کنید"}
                        </option>
                        {categories.map((option) => <option key={option.id} value={option.id}>{option.name}</option>)}
                      </select>
                      <ChevronDown size={17} aria-hidden="true" />
                    </div>
                    {categoryError ? (
                      <small className="lahze-onboarding-field-error">{categoryError}</small>
                    ) : (
                      <small id="business-category-help">دسته‌بندی مرتبط با کسب‌وکار خود را انتخاب کنید.</small>
                    )}
                    {categoriesLoadError && (
                      <div className="lahze-category-inline-error" role="alert">
                        <span>{categoriesLoadError}</span>
                        <button type="button" onClick={() => void loadCategories()} disabled={categoriesLoading || submitting}>تلاش دوباره</button>
                      </div>
                    )}
                    {!categoriesLoading && categories.length === 0 && !categoriesLoadError && (
                      <small className="lahze-onboarding-field-error">هیچ دسته‌بندی فعالی از سرور دریافت نشد.</small>
                    )}
                    <div className="lahze-category-suggestion-actions">
                      <button
                        type="button"
                        className="lahze-category-suggest-button"
                        onClick={() => void requestCategorySuggestion()}
                        disabled={submitting || suggestionLoading || categoriesLoading || categories.length === 0 || name.trim().length < 2}
                      >
                        {suggestionLoading ? <span className="lahze-category-spinner" aria-hidden="true" /> : <Info size={16} />}
                        {suggestionLoading ? "در حال بررسی..." : "پیشنهاد دسته‌بندی"}
                      </button>
                      {categoryId !== null && categorySelectionSource === "manual" && (
                        <span className="lahze-category-selection-status"><Check size={14} /> انتخاب دستی شما</span>
                      )}
                    </div>
                    {suggestionError && (
                      <div className="lahze-category-inline-error" role="status">{suggestionError}</div>
                    )}
                    {suggestion && (
                      <div className="lahze-category-suggestion-card" role="status">
                        <div className="lahze-category-suggestion-copy">
                          <span className="lahze-category-suggestion-eyebrow">پیشنهاد بر اساس تطبیق کلمات</span>
                          <strong>{suggestion.category_name}</strong>
                          <p>{suggestion.reason}</p>
                          <small>امتیاز تطبیق کلمات: {suggestion.confidence} از ۱۰۰؛ این مقدار احتمال آماری نیست.</small>
                        </div>
                        {suggestionAccepted && categoryId === suggestion.category_id ? (
                          <span className="lahze-category-accepted"><Check size={15} /> تأیید شد</span>
                        ) : (
                          <button type="button" className="lahze-category-accept-button" onClick={acceptCategorySuggestion} disabled={submitting}>تأیید دسته‌بندی</button>
                        )}
                      </div>
                    )}
                  </div>

                  <div className="lahze-onboarding-tip">
                    <span className="lahze-onboarding-tip-icon"><Info size={20} /></span>
                    <div>
                      <strong>نگران تکمیل همه جزئیات نباشید!</strong>
                      <p>پس از ثبت می‌توانید در هر زمان وارد پنل خود شوید و اطلاعات بیشتری اضافه کنید.</p>
                    </div>
                  </div>
                </div>
              )}

              {activeStep === 2 && (
                <div className="lahze-onboarding-step-fields" key="step-two">
                  <div className="lahze-onboarding-field-group">
                    <label htmlFor="business-province">استان <span>*</span></label>
                    <div className="lahze-onboarding-select-wrap">
                      <select
                        id="business-province"
                        value={provinceId ?? ""}
                        onChange={(event) => {
                          const value = event.target.value;
                          setProvinceId(value ? Number(value) : null);
                          setCityId(null);
                          setError("");
                        }}
                        disabled={submitting || loadingProvinces}
                      >
                        <option value="">{loadingProvinces ? "در حال دریافت استان‌ها..." : "استان را انتخاب کنید"}</option>
                        {provinces.map((province) => <option key={province.id} value={province.id}>{province.name}</option>)}
                      </select>
                      <ChevronDown size={17} aria-hidden="true" />
                    </div>
                  </div>

                  <div className="lahze-onboarding-field-group">
                    <label htmlFor="business-city">شهر <span>*</span></label>
                    <div className="lahze-onboarding-select-wrap">
                      <select
                        id="business-city"
                        value={cityId ?? ""}
                        onChange={(event) => {
                          const value = event.target.value;
                          setCityId(value ? Number(value) : null);
                          setError("");
                        }}
                        disabled={submitting || provinceId === null || loadingCities}
                      >
                        <option value="">
                          {provinceId === null ? "ابتدا استان را انتخاب کنید" : loadingCities ? "در حال دریافت شهرها..." : "شهر را انتخاب کنید"}
                        </option>
                        {cities.map((city) => <option key={city.id} value={city.id}>{city.name}</option>)}
                      </select>
                      <ChevronDown size={17} aria-hidden="true" />
                    </div>
                  </div>

                  <div className="lahze-onboarding-field-group">
                    <label htmlFor="business-services">خدمات کسب‌وکار</label>
                    <textarea
                      id="business-services"
                      value={servicesText}
                      onChange={(event) => { setServicesText(event.target.value); invalidateSuggestionForChangedInputs(); }}
                      disabled={submitting}
                      rows={4}
                      placeholder={"هر خدمت را در یک خط وارد کنید\nمثلاً:\nکوتاهی مو\nرنگ مو\nکراتین"}
                    />
                    <small>بعداً هم می‌توانید خدمات خود را ویرایش کنید.</small>
                  </div>

                  <div className="lahze-onboarding-tip">
                    <span className="lahze-onboarding-tip-icon"><MapPin size={20} /></span>
                    <div>
                      <strong>کسب‌وکارتان را در شهر درست معرفی کنید</strong>
                      <p>انتخاب شهر کمک می‌کند مشتریان فرصت‌های نزدیک به خود را بهتر پیدا کنند.</p>
                    </div>
                  </div>
                </div>
              )}

              {activeStep === 3 && (
                <div className="lahze-onboarding-step-fields" key="step-three">
                  <div className="lahze-onboarding-field-group">
                    <label htmlFor="business-description">توضیحات</label>
                    <textarea
                      id="business-description"
                      value={description}
                      onChange={(event) => { setDescription(event.target.value); invalidateSuggestionForChangedInputs(); }}
                      disabled={submitting}
                      rows={4}
                      placeholder="توضیح کوتاهی درباره کسب‌وکار و ویژگی‌های آن بنویسید"
                    />
                    <small>چند جمله کوتاه کافی است؛ نوشتن توضیحات اختیاری است.</small>
                  </div>

                  <div className="lahze-onboarding-field-group">
                    <label htmlFor="business-phone">شماره تماس</label>
                    <input
                      id="business-phone"
                      type="tel"
                      inputMode="tel"
                      autoComplete="tel"
                      value={phone}
                      onChange={(event) => setPhone(event.target.value)}
                      disabled={submitting}
                      placeholder="شماره تماس کسب‌وکار"
                    />
                  </div>

                  <div className="lahze-onboarding-summary">
                    <div className="lahze-onboarding-summary-icon"><Store size={20} /></div>
                    <div>
                      <strong>{name.trim() || "کسب‌وکار شما"}</strong>
                      <p>{categories.find((item) => item.id === categoryId)?.name || "دسته‌بندی انتخاب نشده"} · {cities.find((city) => city.id === cityId)?.name || "شهر انتخاب نشده"}</p>
                    </div>
                  </div>
                </div>
              )}

              <div className="lahze-onboarding-actions">
                <button
                  type="button"
                  className="lahze-onboarding-secondary-button"
                  disabled={submitting}
                  onClick={() => {
                    if (activeStep === 1) router.push("/");
                    else {
                      setError("");
                      setActiveStep((activeStep - 1) as RegistrationStep);
                    }
                  }}
                >
                  {activeStep === 1 ? "انصراف" : <><ArrowRight size={17} /> بازگشت</>}
                </button>

                {activeStep < 3 ? (
                  <button
                    type="button"
                    className="lahze-onboarding-primary-button"
                    onClick={continueToNextStep}
                    disabled={submitting || (activeStep === 2 && (loadingProvinces || loadingCities))}
                  >
                    ادامه
                    <ArrowLeft size={17} />
                  </button>
                ) : (
                  <button
                    type="submit"
                    className="lahze-onboarding-primary-button"
                    disabled={submitting || loadingProvinces || loadingCities}
                  >
                    {submitting ? "در حال ثبت کسب‌وکار..." : "ثبت کسب‌وکار"}
                    {!submitting && <Check size={17} />}
                  </button>
                )}
              </div>
            </form>
          </div>
        </section>
      </div>

      <footer className="lahze-onboarding-footer">
        <div className="lahze-onboarding-footer-inner">
          <Link href="/" className="lahze-onboarding-footer-brand">
            <span>لحظه</span>
            <span className="lahze-onboarding-brand-mark" aria-hidden="true"><i /><i /><i /></span>
            <small>هر زمان، یک فرصت واقعی</small>
          </Link>
          <nav className="lahze-onboarding-footer-links" aria-label="پیوندهای پایانی">
            <span>درباره ما</span>
            <span>تماس با ما</span>
            <span>قوانین و مقررات</span>
            <span>حریم خصوصی</span>
          </nav>
          <div className="lahze-onboarding-socials" aria-label="شبکه‌های اجتماعی">
            <span aria-label="اینستاگرام"><Camera size={19} /></span>
            <span aria-label="تلگرام"><Send size={18} /></span>
            <span aria-label="لینکدین" className="lahze-social-linkedin">in</span>
          </div>
          <p className="lahze-onboarding-copyright">© ۱۴۰۵ لحظه. تمامی حقوق محفوظ است.</p>
        </div>
      </footer>
    </main>
  );
}
