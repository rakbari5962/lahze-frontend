"use client";
import dynamic from "next/dynamic";

import {
  AlertCircle,
  ArrowRight,
  CheckCircle2,
  ChevronDown,
  MapPin,
  Pencil,
  Plus,
  Save,
  Store,
  Trash2,
  X,
} from "lucide-react";

import {
  FormEvent,
  useCallback,
  useEffect,
  useState,
} from "react";

import {
  useParams,
  useRouter,
} from "next/navigation";

import {
  getToken,
} from "@/lib/auth";

import {
  apiGet,
  apiPatch,
  apiPost,
} from "@/services/api";

import {
  getProvinces,
  getCitiesByProvince
} from "@/services/location.service";

import type {
  Province,
  City
} from "@/services/location.service";

const BusinessLocationMap = dynamic(
  () =>
    import("@/components/business/BusinessLocationMap"),
  {
    ssr: false,
    loading: () => (
      <div className="business-location-map-loading">
        <MapPin size={22} />
        <span>در حال آماده‌سازی نقشه...</span>
      </div>
    ),
  }
);

interface BusinessResponse {
  id: number;
  name: string;
  owner_user_id: number;

  province_id: number | null;
  city_id: number | null;

  latitude: number | null;
  longitude: number | null;
  address: string | null;

  description: string | null;
  phone: string | null;
  status: string | null;
}



interface BusinessCompletionResponse {

  business_id: number;

  completion_percentage: number;

  is_complete: boolean;

  missing_items: string[];

  completed_items: string[];

}


interface BusinessServiceResponse {

  id: number;

  business_id: number;

  name: string;

  category: string | null;

  duration_minutes: number | null;

  price: number | null;

  description: string | null;

  is_active: boolean;

}


interface BusinessProfileUpdate {
  description?: string | null;
  phone?: string | null;

}


interface BusinessLocationUpdate {
  province_id: number;
  city_id: number;
  latitude: number;
  longitude: number;
  address: string | null;

}


interface BusinessServiceCreate {

  name: string;

  category?: string | null;

  duration_minutes?: number | null;

  price?: number | null;

  description?: string | null;

}


interface ServiceFormState {

  name: string;

  category: string;

  duration_minutes: string;

  price: string;

  description: string;

}


const emptyServiceForm: ServiceFormState = {

  name: "",

  category: "",

  duration_minutes: "",

  price: "",

  description: "",

};


async function apiDelete<T>(
  endpoint: string
): Promise<T> {

  const baseUrl =
    process.env.NEXT_PUBLIC_API_URL ||
    "http://127.0.0.1:8000";


  const response =
    await fetch(
      `${baseUrl}${endpoint}`,
      {
        method: "DELETE",
      }
    );


  if (!response.ok) {

    const errorText =
      await response.text();


    throw new Error(
      `API Error: ${response.status} - ${errorText}`
    );

  }


  return response.json();

}


export default function ManageBusinessPage() {

  const params =
    useParams();

  const router =
    useRouter();


  const businessId =
    Number(params.id);

  const [business, setBusiness] =
    useState<BusinessResponse | null>(null);


  const [completion, setCompletion] =
    useState<BusinessCompletionResponse | null>(
      null
    );


  const [services, setServices] =
    useState<BusinessServiceResponse[]>([]);


  const [provinces, setProvinces] = useState<Province[]>([]);
  const [cities, setCities] = useState<City[]>([]);

  const [provinceId, setProvinceId] = useState<number | null>(null);
  const [cityId, setCityId] = useState<number | null>(null);

  const [loadingCities, setLoadingCities] = useState(false);

  const provinceName =
  provinces.find(item => item.id === provinceId)?.name ?? "";

  const cityName =
  cities.find(item => item.id === cityId)?.name ?? "";
  

  const [loading, setLoading] =
    useState(true);


  const [savingProfile, setSavingProfile] =
    useState(false);


  const [savingLocation, setSavingLocation] =
    useState(false);


  const [savingService, setSavingService] =
    useState(false);


  const [deletingServiceId, setDeletingServiceId] =
    useState<number | null>(null);


  const [editingServiceId, setEditingServiceId] =
    useState<number | null>(null);


  const [serviceForm, setServiceForm] =
    useState<ServiceFormState>(
      emptyServiceForm
    );


  const [profileForm, setProfileForm] =
    useState({

      description: "",

      phone: "",

    });


  const [locationForm, setLocationForm] =
    useState({

      latitude: "",

      longitude: "",

      address: "",

    });


  const [error, setError] =
    useState("");


  const [success, setSuccess] =
    useState("");


useEffect(() => {
    if (!provinceId) {
	  return;
	}

    const selectedProvinceId = provinceId;
    let cancelled = false;

    async function loadCities() {
      try {
        setLoadingCities(true);

        const data =
          await getCitiesByProvince(selectedProvinceId);

        if (cancelled) {
          return;
        }

        setCities(data);

        /*
         * هنگام load اولیه، اگر شهر ذخیره‌شده
         * متعلق به استان فعلی نباشد، آن را پاک می‌کنیم.
         */
        setCityId(currentCityId => {
          if (currentCityId === null) {
            return null;
          }

          return data.some(
            city => city.id === currentCityId
          )
            ? currentCityId
            : null;
        });

      } catch (error) {
        if (!cancelled) {
          console.error(
            "خطا در دریافت شهرها:",
            error
          );

          setCities([]);
          setCityId(null);

          setError(
            "دریافت لیست شهرها با مشکل مواجه شد."
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

  const loadBusiness = useCallback(async (
	  activeToken: string,
	  isCancelled: () => boolean,
	) => {
	  await Promise.resolve();

	  if (isCancelled()) {
		return;
	  }

    setLoading(true);

    setError("");


    try {
	  const [
		businessData,
		completionData,
		serviceData,
	  ] = await Promise.all([
		apiGet<BusinessResponse>(
		  `/businesses/${businessId}/profile?token=${encodeURIComponent(activeToken)}`
		),
		apiGet<BusinessCompletionResponse>(
		  `/businesses/${businessId}/completion?token=${encodeURIComponent(activeToken)}`
		),
		apiGet<BusinessServiceResponse[]>(
		  `/businesses/${businessId}/services?token=${encodeURIComponent(activeToken)}`
		),
	  ]);

	  // اگر درخواست قبلی لغو شده، اطلاعات قدیمی را اعمال نکن.
	  if (isCancelled()) {
		return;
	  }

	  setBusiness(businessData);

	  setCompletion(completionData);

	  setServices(serviceData);


      setProfileForm({

        description:
          businessData.description ?? "",

        phone:
          businessData.phone ?? "",

      });


      setLocationForm({

        latitude:
          businessData.latitude !== null
            ? String(businessData.latitude)
            : "",

        longitude:
          businessData.longitude !== null
            ? String(businessData.longitude)
            : "",

        address:
          businessData.address ?? "",

      });


      try {

        const provincesData = await getProvinces();

		if (isCancelled()) {
		  return;
		}

		setProvinces(provincesData);

		const nextProvinceId =
		  businessData.province_id ?? null;

		if (nextProvinceId === null) {
		  setCities([]);
		  setLoadingCities(false);
		}

		setProvinceId(nextProvinceId);
		setCityId(businessData.city_id ?? null);

      } catch (
        locationError
      ) {

        console.log(
          locationError
        );

      }

    } catch (requestError) {
	  if (!isCancelled()) {
		console.log("BUSINESS LOAD ERROR:", requestError);

		setError(
		  "دریافت اطلاعات کسب‌وکار با مشکل مواجه شد."
		);
	  }
	} finally {
	  if (!isCancelled()) {
		setLoading(false);
	  }

    }

  }, [businessId]);


  useEffect(() => {
  let cancelled = false;

  void Promise.resolve().then(() => {
    if (cancelled) {
      return;
    }

    if (!businessId || Number.isNaN(businessId)) {
      setError("شناسه کسب‌وکار نامعتبر است.");
      setLoading(false);
      return;
    }

    const activeToken = getToken();

    if (!activeToken) {
      router.push("/login");
      return;
    }

    void loadBusiness(activeToken, () => cancelled);
  });

  return () => {
    cancelled = true;
  };
}, [
  businessId,
  router,
  loadBusiness,
]);


  function clearMessages() {

    setError("");

    setSuccess("");

  }


  async function handleProfileSubmit(
    event: FormEvent<HTMLFormElement>
  ) {

    event.preventDefault();

	const token = getToken();
    if (!token) {

      router.push("/login");

      return;

    }


    clearMessages();

    setSavingProfile(true);


    try {

      const data: BusinessProfileUpdate = {

        description:
          profileForm.description.trim() ||
          null,

        phone:
          profileForm.phone.trim() ||
          null,

      };


      const updated =
        await apiPatch<BusinessResponse>(

          `/businesses/${businessId}/profile?token=${encodeURIComponent(token)}`,

          data

        );


      setBusiness(
        updated
      );


      setProfileForm({

        description:
          updated.description ?? "",

        phone:
          updated.phone ?? "",

      });


      setSuccess(
        "اطلاعات پروفایل با موفقیت ذخیره شد."
      );


      const updatedCompletion =
        await apiGet<BusinessCompletionResponse>(
          `/businesses/${businessId}/completion?token=${encodeURIComponent(token)}`
        );


      setCompletion(
        updatedCompletion
      );

    } catch (
      requestError
    ) {

      console.log(
        requestError
      );


      setError(
        "ذخیره اطلاعات پروفایل انجام نشد."
      );

    } finally {

      setSavingProfile(false);

    }

  }

async function handleLocationSubmit(
  event: FormEvent<HTMLFormElement>
) {
  event.preventDefault();
  const token = getToken();
  if (!token) {
    router.push("/login");
    return;
  }

  clearMessages();

  if (!provinceId || !cityId) {
    setError("لطفاً استان و شهر را انتخاب کنید.");
    return;
  }

  const latitudeText = locationForm.latitude.trim();
  const longitudeText = locationForm.longitude.trim();

  if (!latitudeText || !longitudeText) {
    setError("لطفاً ابتدا موقعیت کسب‌وکار را روی نقشه انتخاب کنید.");
    return;
  }

  const latitude = Number(latitudeText);
  const longitude = Number(longitudeText);

  if (
    !Number.isFinite(latitude) ||
    !Number.isFinite(longitude) ||
    latitude < -90 ||
    latitude > 90 ||
    longitude < -180 ||
    longitude > 180
  ) {
    setError("مختصات جغرافیایی معتبر نیست.");
    return;
  }

  setSavingLocation(true);

  try {
    const data: BusinessLocationUpdate = {
      province_id: provinceId,
      city_id: cityId,
      latitude,
      longitude,
      address: locationForm.address.trim() || null,
    };

    const updated = await apiPatch<BusinessResponse>(
      `/businesses/${businessId}/location?token=${encodeURIComponent(token)}`,
      data
    );

    // فقط پس از موفقیت درخواست ذخیره، وضعیت محلی را به‌روز می‌کنیم.
    setBusiness(updated);

    setProvinceId(updated.province_id ?? provinceId);
    setCityId(updated.city_id ?? cityId);

    setLocationForm({
      latitude:
        updated.latitude !== null
          ? String(updated.latitude)
          : "",
      longitude:
        updated.longitude !== null
          ? String(updated.longitude)
          : "",
      address: updated.address ?? "",
    });

    setSuccess("استان، شهر و موقعیت کسب‌وکار با موفقیت ذخیره شدند.");

    // خطای به‌روزرسانی تکمیل پروفایل نباید ذخیره موفق را ناموفق جلوه دهد.
    try {
      const updatedCompletion =
        await apiGet<BusinessCompletionResponse>(
          `/businesses/${businessId}/completion?token=${encodeURIComponent(token)}`
        );

      setCompletion(updatedCompletion);
    } catch (completionError) {
      console.error(
        "خطا در به‌روزرسانی وضعیت تکمیل پروفایل:",
        completionError
      );
    }
  } catch (requestError) {
    console.error("خطا در ذخیره موقعیت کسب‌وکار:", requestError);

    setError(
      "ذخیره موقعیت انجام نشد. لطفاً اطلاعات را بررسی و دوباره تلاش کنید."
    );
  } finally {
    setSavingLocation(false);
  }
}



  function startEditService(
    service: BusinessServiceResponse
  ) {

    setEditingServiceId(
      service.id
    );


    setServiceForm({

      name:
        service.name,

      category:
        service.category ?? "",

      duration_minutes:
        service.duration_minutes !== null
          ? String(
              service.duration_minutes
            )
          : "",

      price:
        service.price !== null
          ? String(
              service.price
            )
          : "",

      description:
        service.description ?? "",

    });


    window.scrollTo({
      top:
        document.body.scrollHeight,
      behavior:
        "smooth",
    });

  }


  function cancelEditService() {

    setEditingServiceId(
      null
    );


    setServiceForm(
      emptyServiceForm
    );

  }


  function updateServiceField(
    field: keyof ServiceFormState,
    value: string
  ) {

    setServiceForm(
      previous => ({

        ...previous,

        [field]:
          value,

      })
    );

  }



  async function handleServiceSubmit(
    event: FormEvent<HTMLFormElement>
  ) {

    event.preventDefault();

	const token = getToken();
    if (!token) {

      router.push("/login");

      return;

    }


    if (
      !serviceForm.name.trim()
    ) {

      setError(
        "نام خدمت الزامی است."
      );

      return;

    }


    clearMessages();

    setSavingService(true);


    const duration =
      serviceForm.duration_minutes.trim()
        ? Number(
            serviceForm.duration_minutes
          )
        : null;


    const price =
      serviceForm.price.trim()
        ? Number(
            serviceForm.price
          )
        : null;


    if (
      duration !== null &&
      !Number.isFinite(duration)
    ) {

      setError(
        "مدت زمان خدمت معتبر نیست."
      );

      setSavingService(false);

      return;

    }


    if (
      price !== null &&
      !Number.isFinite(price)
    ) {

      setError(
        "قیمت خدمت معتبر نیست."
      );

      setSavingService(false);

      return;

    }


    const data:
      BusinessServiceCreate = {

      name:
        serviceForm.name.trim(),

      category:
        serviceForm.category.trim() ||
        null,

      duration_minutes:
        duration,

      price:
        price,

      description:
        serviceForm.description.trim() ||
        null,

    };


    try {

      if (
        editingServiceId !== null
      ) {

        const updated =
          await apiPatch<BusinessServiceResponse>(

            `/businesses/services/${editingServiceId}?token=${encodeURIComponent(token)}`,

            data

          );


        setServices(
          previous =>
            previous.map(
              service =>
                service.id ===
                editingServiceId
                  ? updated
                  : service
            )
        );


        setSuccess(
          "خدمت با موفقیت ویرایش شد."
        );

      } else {

        const created =
          await apiPost<BusinessServiceResponse>(

            `/businesses/${businessId}/services?token=${encodeURIComponent(token)}`,

            data

          );


        setServices(
          previous => [
            ...previous,
            created,
          ]
        );


        setSuccess(
          "خدمت جدید با موفقیت اضافه شد."
        );

      }


      setEditingServiceId(
        null
      );


      setServiceForm(
        emptyServiceForm
      );


      const updatedCompletion =
        await apiGet<BusinessCompletionResponse>(
          `/businesses/${businessId}/completion?token=${encodeURIComponent(token)}`
        );


      setCompletion(
        updatedCompletion
      );

    } catch (
      requestError
    ) {

      console.log(
        requestError
      );


      setError(
        editingServiceId !== null
          ? "ویرایش خدمت انجام نشد."
          : "افزودن خدمت انجام نشد."
      );

    } finally {

      setSavingService(false);

    }

  }


  async function handleDeactivateService(
    serviceId: number
  ) {
	const token = getToken();
    if (!token) {

      router.push("/login");

      return;

    }


    const confirmed =
      window.confirm(
        "آیا از غیرفعال کردن این خدمت مطمئن هستید؟"
      );


    if (!confirmed) {

      return;

    }


    clearMessages();

    setDeletingServiceId(
      serviceId
    );


    try {

      const updated =
        await apiDelete<BusinessServiceResponse>(

          `/businesses/services/${serviceId}?token=${encodeURIComponent(token)}`

        );


      setServices(
        previous =>
          previous.map(
            service =>
              service.id ===
              serviceId
                ? updated
                : service
          )
      );


      if (
        editingServiceId ===
        serviceId
      ) {

        cancelEditService();

      }


      setSuccess(
        "خدمت با موفقیت غیرفعال شد."
      );


      const updatedCompletion =
        await apiGet<BusinessCompletionResponse>(
          `/businesses/${businessId}/completion?token=${encodeURIComponent(token)}`
        );


      setCompletion(
        updatedCompletion
      );

    } catch (
      requestError
    ) {

      console.log(
        requestError
      );


      setError(
        "غیرفعال کردن خدمت انجام نشد."
      );

    } finally {

      setDeletingServiceId(
        null
      );

    }

  }


  if (loading) {

    return (

      <main
        dir="rtl"
        className="
          min-h-screen
          bg-slate-50
          px-4
          py-8
        "
      >

        <div
          className="
            mx-auto
            flex
            min-h-[60vh]
            max-w-5xl
            items-center
            justify-center
          "
        >

          <div
            className="
              text-center
            "
          >

            <div
              className="
                mx-auto
                mb-4
                h-10
                w-10
                animate-spin
                rounded-full
                border-4
                border-slate-200
                border-t-violet-600
              "
            />

            <p
              className="
                text-sm
                text-slate-500
              "
            >
              در حال دریافت اطلاعات کسب‌وکار...
            </p>

          </div>

        </div>

      </main>

    );

  }


  if (
    !business
  ) {

    return (

      <main
        dir="rtl"
        className="
          min-h-screen
          bg-slate-50
          px-4
          py-8
        "
      >

        <div
          className="
            mx-auto
            max-w-xl
            rounded-3xl
            border
            border-red-100
            bg-white
            p-8
            text-center
            shadow-sm
          "
        >

          <AlertCircle
            className="
              mx-auto
              mb-4
              text-red-500
            "
            size={36}
          />

          <h1
            className="
              mb-3
              text-xl
              font-extrabold
              text-slate-900
            "
          >
            کسب‌وکار پیدا نشد
          </h1>

          <p
            className="
              mb-6
              text-sm
              leading-7
              text-slate-500
            "
          >
            {error ||
              "امکان دریافت اطلاعات این کسب‌وکار وجود ندارد."}
          </p>

          <button
            type="button"
            onClick={() =>
              router.push("/business")
            }
            className="
              rounded-2xl
              bg-violet-600
              px-6
              py-3
              font-bold
              text-white
            "
          >
            بازگشت به کسب‌وکارهای من
          </button>

        </div>

      </main>

    );

  }


  return (

    <main
      dir="rtl"
      className="
        min-h-screen
        bg-slate-50
        px-4
        py-6
        sm:px-6
        lg:px-8
      "
    >

      <div
        className="
          mx-auto
          max-w-5xl
        "
      >

        {/* Top navigation */}

        <div
          className="
            mb-6
            flex
            items-center
            justify-between
            gap-4
          "
        >

          <button
            type="button"
            onClick={() =>
              router.push("/business")
            }
            className="
              inline-flex
              items-center
              gap-2
              text-sm
              font-bold
              text-slate-600
              transition
              hover:text-violet-600
            "
          >

            <ArrowRight
              size={18}
            />

            کسب‌وکارهای من

          </button>


          <button
            type="button"
            onClick={() =>
              router.push(
                `/business/${business.id}`
              )
            }
            className="
              rounded-xl
              border
              border-slate-200
              bg-white
              px-4
              py-2
              text-sm
              font-bold
              text-slate-600
              hover:bg-slate-50
            "
          >
            مشاهده صفحه عمومی
          </button>

        </div>


        {/* Header */}

        <section
          className="
            mb-6
            overflow-hidden
            rounded-[28px]
            border
            border-slate-200
            bg-white
            shadow-sm
          "
        >

          <div
            className="
              p-6
              sm:p-8
            "
          >

            <div
              className="
                flex
                flex-col
                gap-5
                sm:flex-row
                sm:items-center
                sm:justify-between
              "
            >

              <div
                className="
                  flex
                  items-center
                  gap-4
                "
              >

                <div
                  className="
                    flex
                    h-16
                    w-16
                    shrink-0
                    items-center
                    justify-center
                    rounded-2xl
                    bg-violet-50
                    text-violet-600
                  "
                >

                  <Store
                    size={31}
                    strokeWidth={1.8}
                  />

                </div>


                <div>

                  <p
                    className="
                      mb-1
                      text-sm
                      font-medium
                      text-violet-600
                    "
                  >
                    مدیریت کسب‌وکار
                  </p>

                  <h1
                    className="
                      text-2xl
                      font-extrabold
                      text-slate-900
                    "
                  >
                    {business.name}
                  </h1>

                  {(provinceName ||
                    cityName) && (

                    <div
                      className="
                        mt-2
                        flex
                        items-center
                        gap-2
                        text-sm
                        text-slate-500
                      "
                    >

                      <MapPin
                        size={16}
                      />

                      <span>
                        {[cityName, provinceName]
                          .filter(Boolean)
                          .join("، ")}
                      </span>

                    </div>

                  )}

                </div>

              </div>

            </div>

          </div>

        </section>


        {/* Messages */}

        {error && (

          <div
            className="
              mb-5
              flex
              items-start
              gap-3
              rounded-2xl
              border
              border-red-100
              bg-red-50
              p-4
              text-sm
              leading-6
              text-red-700
            "
          >

            <AlertCircle
              className="mt-0.5 shrink-0"
              size={18}
            />

            <span>
              {error}
            </span>

          </div>

        )}


        {success && (

          <div
            className="
              mb-5
              flex
              items-start
              gap-3
              rounded-2xl
              border
              border-emerald-100
              bg-emerald-50
              p-4
              text-sm
              leading-6
              text-emerald-700
            "
          >

            <CheckCircle2
              className="mt-0.5 shrink-0"
              size={18}
            />

            <span>
              {success}
            </span>

          </div>

        )}


        {/* Completion */}

        {completion && (

          <section
            className="
              mb-6
              rounded-[28px]
              border
              border-slate-200
              bg-white
              p-6
              shadow-sm
              sm:p-8
            "
          >

            <div
              className="
                mb-5
                flex
                items-center
                justify-between
                gap-4
              "
            >

              <div>

                <h2
                  className="
                    text-lg
                    font-extrabold
                    text-slate-900
                  "
                >
                  تکمیل اطلاعات کسب‌وکار
                </h2>

                <p
                  className="
                    mt-1
                    text-sm
                    text-slate-500
                  "
                >
                  اطلاعات کامل‌تر به آماده شدن پروفایل کمک می‌کند.
                </p>

              </div>


              <div
                className="
                  text-left
                "
              >

                <div
                  className="
                    text-2xl
                    font-extrabold
                    text-violet-600
                  "
                >
                  {completion.completion_percentage}٪
                </div>

              </div>

            </div>


            <div
              className="
                mb-5
                h-3
                overflow-hidden
                rounded-full
                bg-slate-100
              "
            >

              <div
                className="
                  h-full
                  rounded-full
                  bg-violet-600
                  transition-all
                "
                style={{
                  width:
                    `${Math.min(
                      100,
                      Math.max(
                        0,
                        completion.completion_percentage
                      )
                    )}%`,
                }}
              />

            </div>


            {completion.is_complete ? (

              <div
                className="
                  flex
                  items-center
                  gap-2
                  rounded-2xl
                  bg-emerald-50
                  p-4
                  text-sm
                  font-bold
                  text-emerald-700
                "
              >

                <CheckCircle2
                  size={19}
                />

                اطلاعات کسب‌وکار کامل است.

              </div>

            ) : (

              <div>

                <div
                  className="
                    mb-3
                    text-sm
                    font-bold
                    text-slate-700
                  "
                >
                  مواردی که هنوز نیاز به تکمیل دارند:
                </div>


                <div
                  className="
                    grid
                    gap-2
                    sm:grid-cols-2
                  "
                >

                  {completion.missing_items.map(
                    (
                      item,
                      index
                    ) => (

                      <div
                        key={index}
                        className="
                          flex
                          items-center
                          gap-2
                          rounded-xl
                          bg-amber-50
                          px-3
                          py-2.5
                          text-sm
                          text-amber-700
                        "
                      >

                        <AlertCircle
                          size={16}
                          className="shrink-0"
                        />

                        {item}

                      </div>

                    )
                  )}

                </div>

              </div>

            )}

          </section>

        )}


        {/* Profile */}

        <section
          className="
            mb-6
            rounded-[28px]
            border
            border-slate-200
            bg-white
            p-6
            shadow-sm
            sm:p-8
          "
        >

          <div
            className="
              mb-6
            "
          >

            <h2
              className="
                text-lg
                font-extrabold
                text-slate-900
              "
            >
              اطلاعات پروفایل
            </h2>

            <p
              className="
                mt-1
                text-sm
                text-slate-500
              "
            >
              توضیحات و شماره تماس کسب‌وکار را مدیریت کنید.
            </p>

          </div>


          <form
            onSubmit={
              handleProfileSubmit
            }
            className="
              space-y-5
            "
          >

            <div>

              <label
                className="
                  mb-2
                  block
                  text-sm
                  font-bold
                  text-slate-700
                "
              >
                توضیحات
              </label>

              <textarea
                value={
                  profileForm.description
                }
                onChange={event =>
                  setProfileForm(
                    previous => ({

                      ...previous,

                      description:
                        event.target.value,

                    })
                  )
                }
                rows={5}
                placeholder="درباره کسب‌وکار خود بنویسید..."
                className="
                  w-full
                  resize-y
                  rounded-2xl
                  border
                  border-slate-200
                  bg-slate-50
                  px-4
                  py-3
                  text-sm
                  text-slate-900
                  outline-none
                  transition
                  focus:border-violet-400
                  focus:bg-white
                  focus:ring-2
                  focus:ring-violet-100
                "
              />

            </div>


            <div>

              <label
                className="
                  mb-2
                  block
                  text-sm
                  font-bold
                  text-slate-700
                "
              >
                شماره تماس
              </label>

              <input
                type="tel"
                value={
                  profileForm.phone
                }
                onChange={event =>
                  setProfileForm(
                    previous => ({

                      ...previous,

                      phone:
                        event.target.value,

                    })
                  )
                }
                placeholder="شماره تماس کسب‌وکار"
                className="
                  w-full
                  rounded-2xl
                  border
                  border-slate-200
                  bg-slate-50
                  px-4
                  py-3
                  text-sm
                  text-slate-900
                  outline-none
                  transition
                  focus:border-violet-400
                  focus:bg-white
                  focus:ring-2
                  focus:ring-violet-100
                "
              />

            </div>


            <div
              className="
                flex
                justify-end
              "
            >

              <button
                type="submit"
                disabled={
                  savingProfile
                }
                className="
                  inline-flex
                  items-center
                  gap-2
                  rounded-2xl
                  bg-violet-600
                  px-5
                  py-3
                  font-bold
                  text-white
                  transition
                  hover:bg-violet-700
                  disabled:cursor-not-allowed
                  disabled:opacity-60
                "
              >

                <Save
                  size={18}
                />

                {savingProfile
                  ? "در حال ذخیره..."
                  : "ذخیره اطلاعات"}

              </button>

            </div>

          </form>

        </section>

		{/* Location */}

		<section className="business-location-card mb-6">

		  <div className="business-location-header">

			<div>
			  <div className="business-location-eyebrow">
				موقعیت و دسترسی
			  </div>

			  <h2 className="business-location-title">
				موقعیت کسب‌وکار
			  </h2>

			  <p className="business-location-description">
				نشانگر را روی محل دقیق کسب‌وکارتان قرار دهید و سپس موقعیت را ذخیره کنید.
			  </p>
			</div>

		  </div>




			{/* Province / City */}

			<form
			  onSubmit={handleLocationSubmit}
			  className="business-location-form"
			>
			  <div className="business-location-meta">

			  <div className="business-location-meta-item">

				<div className="business-location-meta-label">
				  استان
				</div>

				<div className="relative">

				  <select
					value={provinceId ?? ""}
					onChange={event => {

					  const value =
						event.target.value;

					  setProvinceId(
						value
						  ? Number(value)
						  : null
					  );

					  /*
					   * تغییر استان باید شهر قبلی را
					   * حتماً reset کند.
					   */
					  setCities([]);
					  setLoadingCities(false);
					  setCityId(null);

					  setError("");
					  setSuccess("");

					}}
					disabled={savingLocation}
					className="
					  w-full
					  rounded-xl
					  border
					  border-slate-200
					  bg-white
					  px-4
					  py-3
					  pr-4
					  text-right
					  text-slate-900
					  font-medium
					  outline-none
					  transition
					  focus:border-blue-500
					  focus:ring-4
					  focus:ring-blue-100
					  disabled:bg-slate-50
					  disabled:text-slate-400
					  appearance-none
					  cursor-pointer
					"
				  >

					<option value="">
					  انتخاب استان
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

				  <ChevronDown
					className="
					  absolute
					  left-4
					  top-1/2
					  -translate-y-1/2
					  text-slate-400
					  pointer-events-none
					"
					size={18}
				  />

				</div>

			  </div>


			  <div className="business-location-meta-item">

				<div className="business-location-meta-label">
				  شهر
				</div>

				<div className="relative">

				  <select
					value={cityId ?? ""}
					onChange={event => {

					  const value =
						event.target.value;

					  setCityId(
						value
						  ? Number(value)
						  : null
					  );

					  setError("");
					  setSuccess("");

					}}
					disabled={
					  !provinceId ||
					  loadingCities ||
					  savingLocation
					}
					className="
					  w-full
					  rounded-xl
					  border
					  border-slate-200
					  bg-white
					  px-4
					  py-3
					  pr-4
					  text-right
					  text-slate-900
					  font-medium
					  outline-none
					  transition
					  focus:border-blue-500
					  focus:ring-4
					  focus:ring-blue-100
					  disabled:bg-slate-50
					  disabled:text-slate-400
					  appearance-none
					  cursor-pointer
					"
				  >

					<option value="">
					  {loadingCities
						? "در حال دریافت شهرها..."
						: "انتخاب شهر"}
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

				  <ChevronDown
					className="
					  absolute
					  left-4
					  top-1/2
					  -translate-y-1/2
					  text-slate-400
					  pointer-events-none
					"
					size={18}
				  />

				</div>

			  </div>

			</div>
			<BusinessLocationMap
                    cityId={cityId}
				latitude={
				  locationForm.latitude.trim()
					? Number(locationForm.latitude)
					: null
				}
				longitude={
				  locationForm.longitude.trim()
					? Number(locationForm.longitude)
					: null
				}
				onLocationChange={(
				  latitude,
				  longitude
				) => {

				  setLocationForm(previous => ({
					...previous,
					latitude: String(latitude),
					longitude: String(longitude),
				  }));

				}}
			  />


   

			{/* Selected location */}

			<div className="business-location-selected">

			  <div className="business-location-selected-icon">
				<MapPin size={17} />
			  </div>

			  <div className="min-w-0">

				<div className="business-location-selected-label">
				  موقعیت انتخاب‌شده
				</div>

				<div className="business-location-selected-value">
				  {locationForm.latitude &&
				  locationForm.longitude
					? `نقطه انتخاب‌شده روی نقشه`
					: "هنوز موقعیتی انتخاب نشده است"}
				</div>

			  </div>

			</div>


			{/* Address */}

			<div className="business-location-address">

			  <label
				htmlFor="business-address"
				className="business-location-field-label"
			  >
				آدرس کسب‌وکار
			  </label>

			  <textarea
				id="business-address"
				value={locationForm.address}
				onChange={event =>
				  setLocationForm(previous => ({
					...previous,
					address: event.target.value,
				  }))
				}
				rows={3}
				placeholder="آدرس دقیق کسب‌وکار را وارد کنید"
				className="business-location-address-input"
			  />

			  <p className="business-location-address-hint">
				آدرس و موقعیت روی نقشه مکمل یکدیگر هستند و برای ثبت دقیق‌تر استفاده می‌شوند.
			  </p>

			</div>


			{/* Save */}

			<div className="business-location-actions">

			  <div className="business-location-save-hint">

				<MapPin size={16} />

				<span>
				  موقعیت انتخاب‌شده برای کسب‌وکار شما ذخیره می‌شود.
				</span>

			  </div>


			  <button
				type="submit"
				disabled={savingLocation}
				className="business-location-save-button"
			  >

				<Save size={18} />

				{savingLocation
				  ? "در حال ذخیره..."
				  : "ذخیره موقعیت"}

			  </button>

			</div>

		  </form>

		</section>


        {/* Services */}

        <section
          className="
            mb-6
            rounded-[28px]
            border
            border-slate-200
            bg-white
            p-6
            shadow-sm
            sm:p-8
          "
        >

          <div
            className="
              mb-6
              flex
              flex-col
              gap-3
              sm:flex-row
              sm:items-center
              sm:justify-between
            "
          >

            <div>

              <h2
                className="
                  text-lg
                  font-extrabold
                  text-slate-900
                "
              >
                خدمات کسب‌وکار
              </h2>

              <p
                className="
                  mt-1
                  text-sm
                  text-slate-500
                "
              >
                خدمات فعال کسب‌وکار را اضافه یا ویرایش کنید.
              </p>

            </div>

          </div>


          {/* Existing services */}

          <div
            className="
              mb-8
              space-y-3
            "
          >

            {services.length === 0 ? (

              <div
                className="
                  rounded-2xl
                  border
                  border-dashed
                  border-slate-300
                  bg-slate-50
                  p-6
                  text-center
                  text-sm
                  text-slate-500
                "
              >
                هنوز خدمتی ثبت نشده است.
              </div>

            ) : (

              services.map(
                service => (

                  <div
                    key={service.id}
                    className={`
                      rounded-2xl
                      border
                      p-4
                      transition
                      ${
                        service.is_active
                          ? "border-slate-200 bg-white"
                          : "border-slate-100 bg-slate-50 opacity-60"
                      }
                    `}
                  >

                    <div
                      className="
                        flex
                        flex-col
                        gap-4
                        sm:flex-row
                        sm:items-center
                        sm:justify-between
                      "
                    >

                      <div
                        className="
                          min-w-0
                        "
                      >

                        <div
                          className="
                            flex
                            flex-wrap
                            items-center
                            gap-2
                          "
                        >

                          <h3
                            className="
                              font-extrabold
                              text-slate-900
                            "
                          >
                            {service.name}
                          </h3>


                          {!service.is_active && (

                            <span
                              className="
                                rounded-full
                                bg-slate-200
                                px-2.5
                                py-1
                                text-xs
                                font-bold
                                text-slate-500
                              "
                            >
                              غیرفعال
                            </span>

                          )}

                        </div>


                        <div
                          className="
                            mt-2
                            flex
                            flex-wrap
                            gap-x-4
                            gap-y-1
                            text-xs
                            text-slate-500
                          "
                        >

                          {service.category && (

                            <span>
                              دسته: {service.category}
                            </span>

                          )}


                          {service.duration_minutes !==
                            null && (

                            <span>
                              مدت:
                              {" "}
                              {service.duration_minutes}
                              {" "}
                              دقیقه
                            </span>

                          )}


                          {service.price !== null && (

                            <span>
                              قیمت:
                              {" "}
                              {service.price.toLocaleString(
                                "fa-IR"
                              )}
                            </span>

                          )}

                        </div>


                        {service.description && (

                          <p
                            className="
                              mt-2
                              text-sm
                              leading-6
                              text-slate-500
                            "
                          >
                            {service.description}
                          </p>

                        )}

                      </div>


                      {service.is_active && (

                        <div
                          className="
                            flex
                            shrink-0
                            items-center
                            gap-2
                          "
                        >

                          <button
                            type="button"
                            onClick={() =>
                              startEditService(
                                service
                              )
                            }
                            className="
                              inline-flex
                              items-center
                              gap-1.5
                              rounded-xl
                              border
                              border-slate-200
                              px-3
                              py-2
                              text-xs
                              font-bold
                              text-slate-700
                              hover:bg-slate-50
                            "
                          >

                            <Pencil
                              size={15}
                            />

                            ویرایش

                          </button>


                          <button
                            type="button"
                            disabled={
                              deletingServiceId ===
                              service.id
                            }
                            onClick={() =>
                              handleDeactivateService(
                                service.id
                              )
                            }
                            className="
                              inline-flex
                              items-center
                              gap-1.5
                              rounded-xl
                              border
                              border-red-100
                              px-3
                              py-2
                              text-xs
                              font-bold
                              text-red-600
                              hover:bg-red-50
                              disabled:opacity-50
                            "
                          >

                            <Trash2
                              size={15}
                            />

                            {deletingServiceId ===
                            service.id
                              ? "در حال انجام..."
                              : "غیرفعال کردن"}

                          </button>

                        </div>

                      )}

                    </div>

                  </div>

                )
              )

            )}

          </div>


          {/* Add / Edit service */}

          <div
            className="
              rounded-3xl
              bg-slate-50
              p-5
              sm:p-6
            "
          >

            <div
              className="
                mb-5
                flex
                items-center
                justify-between
                gap-3
              "
            >

              <div>

                <h3
                  className="
                    font-extrabold
                    text-slate-900
                  "
                >
                  {editingServiceId !== null
                    ? "ویرایش خدمت"
                    : "افزودن خدمت جدید"}
                </h3>

                <p
                  className="
                    mt-1
                    text-xs
                    text-slate-500
                  "
                >
                  اطلاعات خدمت را وارد کنید.
                </p>

              </div>


              {editingServiceId !== null && (

                <button
                  type="button"
                  onClick={
                    cancelEditService
                  }
                  className="
                    inline-flex
                    items-center
                    gap-1
                    rounded-xl
                    px-3
                    py-2
                    text-xs
                    font-bold
                    text-slate-500
                    hover:bg-white
                  "
                >

                  <X
                    size={15}
                  />

                  انصراف

                </button>

              )}

            </div>


            <form
              onSubmit={
                handleServiceSubmit
              }
              className="
                space-y-4
              "
            >

              <div
                className="
                  grid
                  gap-4
                  sm:grid-cols-2
                "
              >

                <div>

                  <label
                    className="
                      mb-2
                      block
                      text-sm
                      font-bold
                      text-slate-700
                    "
                  >
                    نام خدمت *
                  </label>

                  <input
                    value={
                      serviceForm.name
                    }
                    onChange={event =>
                      updateServiceField(
                        "name",
                        event.target.value
                      )
                    }
                    placeholder="مثلاً اصلاح مو"
                    className="
                      w-full
                      rounded-2xl
                      border
                      border-slate-200
                      bg-white
                      px-4
                      py-3
                      text-sm
                      outline-none
                      focus:border-violet-400
                      focus:ring-2
                      focus:ring-violet-100
                    "
                  />

                </div>


                <div>

                  <label
                    className="
                      mb-2
                      block
                      text-sm
                      font-bold
                      text-slate-700
                    "
                  >
                    دسته‌بندی
                  </label>

                  <input
                    value={
                      serviceForm.category
                    }
                    onChange={event =>
                      updateServiceField(
                        "category",
                        event.target.value
                      )
                    }
                    placeholder="مثلاً خدمات مو"
                    className="
                      w-full
                      rounded-2xl
                      border
                      border-slate-200
                      bg-white
                      px-4
                      py-3
                      text-sm
                      outline-none
                      focus:border-violet-400
                      focus:ring-2
                      focus:ring-violet-100
                    "
                  />

                </div>


                <div>

                  <label
                    className="
                      mb-2
                      block
                      text-sm
                      font-bold
                      text-slate-700
                    "
                  >
                    مدت زمان (دقیقه)
                  </label>

                  <input
                    type="number"
                    min="0"
                    value={
                      serviceForm.duration_minutes
                    }
                    onChange={event =>
                      updateServiceField(
                        "duration_minutes",
                        event.target.value
                      )
                    }
                    placeholder="60"
                    className="
                      w-full
                      rounded-2xl
                      border
                      border-slate-200
                      bg-white
                      px-4
                      py-3
                      text-sm
                      outline-none
                      focus:border-violet-400
                      focus:ring-2
                      focus:ring-violet-100
                    "
                  />

                </div>


                <div>

                  <label
                    className="
                      mb-2
                      block
                      text-sm
                      font-bold
                      text-slate-700
                    "
                  >
                    قیمت
                  </label>

                  <input
                    type="number"
                    min="0"
                    value={
                      serviceForm.price
                    }
                    onChange={event =>
                      updateServiceField(
                        "price",
                        event.target.value
                      )
                    }
                    placeholder="مثلاً 500000"
                    className="
                      w-full
                      rounded-2xl
                      border
                      border-slate-200
                      bg-white
                      px-4
                      py-3
                      text-sm
                      outline-none
                      focus:border-violet-400
                      focus:ring-2
                      focus:ring-violet-100
                    "
                  />

                </div>

              </div>


              <div>

                <label
                  className="
                    mb-2
                    block
                    text-sm
                    font-bold
                    text-slate-700
                  "
                >
                  توضیحات خدمت
                </label>

                <textarea
                  value={
                    serviceForm.description
                  }
                  onChange={event =>
                    updateServiceField(
                      "description",
                      event.target.value
                    )
                  }
                  rows={3}
                  placeholder="توضیحات مربوط به این خدمت..."
                  className="
                    w-full
                    resize-y
                    rounded-2xl
                    border
                    border-slate-200
                    bg-white
                    px-4
                    py-3
                    text-sm
                    outline-none
                    focus:border-violet-400
                    focus:ring-2
                    focus:ring-violet-100
                  "
                />

              </div>


              <div
                className="
                  flex
                  justify-end
                "
              >

                <button
                  type="submit"
                  disabled={
                    savingService
                  }
                  className="
                    inline-flex
                    items-center
                    gap-2
                    rounded-2xl
                    bg-violet-600
                    px-5
                    py-3
                    font-bold
                    text-white
                    hover:bg-violet-700
                    disabled:cursor-not-allowed
                    disabled:opacity-60
                  "
                >

                  {editingServiceId !== null
                    ? <Save size={18} />
                    : <Plus size={18} />
                  }

                  {savingService
                    ? "در حال ذخیره..."
                    : editingServiceId !== null
                    ? "ذخیره تغییرات"
                    : "افزودن خدمت"
                  }

                </button>

              </div>

            </form>

          </div>

        </section>


        {/* Bottom action */}

        <div
          className="
            pb-8
            text-center
          "
        >

          <button
            type="button"
            onClick={() =>
              router.push("/business")
            }
            className="
              text-sm
              font-bold
              text-slate-500
              hover:text-violet-600
            "
          >
            ← بازگشت به فهرست کسب‌وکارهای من
          </button>

        </div>

      </div>

    </main>

  );

}