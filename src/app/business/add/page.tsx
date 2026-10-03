"use client";

import {
  FormEvent,
  useEffect,
  useState
} from "react";

import { useRouter } from "next/navigation";

import { getToken } from "@/lib/auth";

import {
  getCitiesByProvince,
  getProvinces
} from "@/services/location.service";

import { createBusiness } from "@/services/business.service";

import type {
  City,
  Province
} from "@/services/location.service";

import type {
  CreateBusinessRequest
} from "@/types/business";


export default function AddBusinessPage() {

  const router = useRouter();


  const [name, setName] = useState("");
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


  useEffect(() => {

    let cancelled = false;


    async function loadProvinces() {

      try {

        const data = await getProvinces();

        if (!cancelled) {
          setProvinces(data);
        }

      } catch (error: unknown) {

        if (!cancelled) {
          setError(
            error instanceof Error
              ? error.message
              : "خطا در دریافت استان‌ها."
          );
        }

      } finally {

        if (!cancelled) {
          setLoadingProvinces(false);
        }

      }

    }


    loadProvinces();


    return () => {
      cancelled = true;
    };

  }, []);


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

        const data = await getCitiesByProvince(provinceId);

        if (!cancelled) {
          setCities(data);
        }

      } catch (error: unknown) {

        if (!cancelled) {
          setError(
            error instanceof Error
              ? error.message
              : "خطا در دریافت شهرها."
          );
        }

      } finally {

        if (!cancelled) {
          setLoadingCities(false);
        }

      }

    }


    loadCities();


    return () => {
      cancelled = true;
    };

  }, [provinceId]);


  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {

    event.preventDefault();


    if (submitting) {
      return;
    }


    setError("");


    const trimmedName = name.trim();


    if (!trimmedName) {
      setError("لطفاً نام کسب و کار را وارد کنید.");
      return;
    }


    if (provinceId === null) {
      setError("لطفاً استان را انتخاب کنید.");
      return;
    }


    if (cityId === null) {
      setError("لطفاً شهر را انتخاب کنید.");
      return;
    }


    const token = getToken();


    if (!token) {
      setError(
        "نشست شما معتبر نیست. لطفاً دوباره وارد حساب کاربری شوید."
      );
      return;
    }


    const services = servicesText
      .split("\n")
      .map(service => service.trim())
      .filter(Boolean);


    const request: CreateBusinessRequest = {

      name: trimmedName,

      province_id: provinceId,

      city_id: cityId,

      services,

      description: description.trim() || null,

      phone: phone.trim() || null

    };


    setSubmitting(true);


    try {

      const created = await createBusiness(
        token,
        request
      );


      if (
        !Number.isInteger(created.id) ||
        created.id <= 0
      ) {

        throw new Error(
          "پاسخ نامعتبر از سرور دریافت شد."
        );

      }


      router.push("/");

    } catch (error: unknown) {

      setError(
        error instanceof Error
          ? error.message
          : "ثبت کسب و کار انجام نشد. لطفاً دوباره تلاش کنید."
      );

    } finally {

      setSubmitting(false);

    }

  }


  return (

    <main
      dir="rtl"
      className="min-h-screen bg-zinc-950 p-4 sm:p-6"
    >

      <div className="mx-auto w-full max-w-3xl">

        <div className="rounded-[32px] border border-slate-100 bg-white p-6 shadow-sm sm:p-10">

          <div className="mb-8">

            <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">
              افزودن کسب و کار خودم
            </h1>

            <p className="mt-2 text-sm leading-7 text-slate-500">
              اطلاعات کسب و کار خود را وارد کنید تا ثبت شود.
            </p>

          </div>


          {error && (

            <div
              role="alert"
              className="mb-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm leading-6 text-red-700"
            >
              {error}
            </div>

          )}


          <form
            onSubmit={handleSubmit}
            className="space-y-6"
          >

            <div>

              <label
                htmlFor="business-name"
                className="mb-2 block text-sm font-bold text-slate-700"
              >
                نام کسب و کار
              </label>

              <input
                id="business-name"
                type="text"
                value={name}
                onChange={event => setName(event.target.value)}
                disabled={submitting}
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-purple-500 focus:ring-2 focus:ring-purple-100 disabled:bg-slate-50"
                placeholder="مثلاً سالن زیبایی فلان"
              />

            </div>


            <div className="grid gap-5 sm:grid-cols-2">

              <div>

                <label
                  htmlFor="business-province"
                  className="mb-2 block text-sm font-bold text-slate-700"
                >
                  استان
                </label>

                <select
                  id="business-province"
                  value={provinceId ?? ""}
                  onChange={event => {
                    const value = event.target.value;

                    setProvinceId(
                      value ? Number(value) : null
                    );

                    setError("");
                  }}
                  disabled={
                    submitting ||
                    loadingProvinces
                  }
                  className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-purple-500 focus:ring-2 focus:ring-purple-100 disabled:bg-slate-50"
                >

                  <option value="">
                    {
                      loadingProvinces
                        ? "در حال دریافت استان‌ها..."
                        : "استان را انتخاب کنید"
                    }
                  </option>

                  {provinces.map(province => (

                    <option
                      key={province.id}
                      value={province.id}
                    >
                      {province.name}
                    </option>

                  ))}

                </select>

              </div>


              <div>

                <label
                  htmlFor="business-city"
                  className="mb-2 block text-sm font-bold text-slate-700"
                >
                  شهر
                </label>

                <select
                  id="business-city"
                  value={cityId ?? ""}
                  onChange={event => {
                    const value = event.target.value;

                    setCityId(
                      value ? Number(value) : null
                    );

                    setError("");
                  }}
                  disabled={
                    submitting ||
                    provinceId === null ||
                    loadingCities
                  }
                  className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-purple-500 focus:ring-2 focus:ring-purple-100 disabled:bg-slate-50"
                >

                  <option value="">
                    {
                      loadingCities
                        ? "در حال دریافت شهرها..."
                        : "شهر را انتخاب کنید"
                    }
                  </option>

                  {cities.map(city => (

                    <option
                      key={city.id}
                      value={city.id}
                    >
                      {city.name}
                    </option>

                  ))}

                </select>

              </div>

            </div>


            <div>

              <label
                htmlFor="business-services"
                className="mb-2 block text-sm font-bold text-slate-700"
              >
                خدمات
              </label>

              <textarea
                id="business-services"
                value={servicesText}
                onChange={event =>
                  setServicesText(event.target.value)
                }
                disabled={submitting}
                rows={5}
                className="w-full resize-y rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-purple-500 focus:ring-2 focus:ring-purple-100 disabled:bg-slate-50"
                placeholder={
                  "هر خدمت را در یک خط وارد کنید\nمثلاً:\nکوتاهی مو\nرنگ مو\nکراتین"
                }
              />

              <p className="mt-2 text-xs text-slate-400">
                هر خدمت را در یک خط وارد کنید.
              </p>

            </div>


            <div>

              <label
                htmlFor="business-description"
                className="mb-2 block text-sm font-bold text-slate-700"
              >
                توضیحات
              </label>

              <textarea
                id="business-description"
                value={description}
                onChange={event =>
                  setDescription(event.target.value)
                }
                disabled={submitting}
                rows={4}
                className="w-full resize-y rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-purple-500 focus:ring-2 focus:ring-purple-100 disabled:bg-slate-50"
                placeholder="توضیح کوتاهی درباره کسب و کار"
              />

            </div>


            <div>

              <label
                htmlFor="business-phone"
                className="mb-2 block text-sm font-bold text-slate-700"
              >
                شماره تماس
              </label>

              <input
                id="business-phone"
                type="tel"
                value={phone}
                onChange={event =>
                  setPhone(event.target.value)
                }
                disabled={submitting}
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-purple-500 focus:ring-2 focus:ring-purple-100 disabled:bg-slate-50"
                placeholder="شماره تماس کسب و کار"
              />

            </div>


            <button
              type="submit"
              disabled={
                submitting ||
                loadingProvinces ||
                loadingCities
              }
              className="w-full rounded-2xl bg-purple-600 py-4 font-bold text-white transition hover:bg-purple-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {
                submitting
                  ? "در حال ثبت کسب و کار..."
                  : "ثبت کسب و کار"
              }
            </button>

          </form>

        </div>

      </div>

    </main>

  );

}