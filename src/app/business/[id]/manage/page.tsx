"use client";

import {
  AlertCircle,
  ArrowRight,
  CheckCircle2,
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
  getCitiesByProvince,
} from "@/services/location.service";


interface BusinessResponse {

  id: number;

  name: string;

  owner_user_id: number;

  province_id: number;

  city_id: number;

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

  description: string | null;

  phone: string | null;

}


interface BusinessLocationUpdate {

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


  const [token, setToken] =
    useState<string | null>(null);


  const [business, setBusiness] =
    useState<BusinessResponse | null>(null);


  const [completion, setCompletion] =
    useState<BusinessCompletionResponse | null>(
      null
    );


  const [services, setServices] =
    useState<BusinessServiceResponse[]>([]);


  const [provinceName, setProvinceName] =
    useState("");


  const [cityName, setCityName] =
    useState("");


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


  async function loadBusiness(
    activeToken: string
  ) {

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


      setBusiness(
        businessData
      );


      setCompletion(
        completionData
      );


      setServices(
        serviceData
      );


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

        const provinces =
          await getProvinces();


        const province =
          provinces.find(
            item =>
              item.id ===
              businessData.province_id
          );


        setProvinceName(
          province?.name ?? ""
        );


        const cities =
          await getCitiesByProvince(
            businessData.province_id
          );


        const city =
          cities.find(
            item =>
              item.id ===
              businessData.city_id
          );


        setCityName(
          city?.name ?? ""
        );

      } catch (
        locationError
      ) {

        console.log(
          locationError
        );

      }

    } catch (
      requestError
    ) {

      console.log(
        requestError
      );


      setError(
        "دریافت اطلاعات کسب‌وکار با مشکل مواجه شد."
      );

    } finally {

      setLoading(false);

    }

  }


  useEffect(() => {

    if (
      !businessId ||
      Number.isNaN(businessId)
    ) {

      setError(
        "شناسه کسب‌وکار نامعتبر است."
      );

      setLoading(false);

      return;

    }


    const activeToken =
      getToken();


    if (!activeToken) {

      router.push("/login");

      return;

    }


    setToken(
      activeToken
    );


    loadBusiness(
      activeToken
    );

  }, [
    businessId,
    router,
  ]);


  function clearMessages() {

    setError("");

    setSuccess("");

  }


  async function handleProfileSubmit(
    event: FormEvent<HTMLFormElement>
  ) {

    event.preventDefault();


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


    if (!token) {

      router.push("/login");

      return;

    }


    const latitude =
      Number(
        locationForm.latitude
      );


    const longitude =
      Number(
        locationForm.longitude
      );


    if (
      !Number.isFinite(latitude) ||
      !Number.isFinite(longitude)
    ) {

      setError(
        "لطفاً عرض و طول جغرافیایی معتبر وارد کنید."
      );

      return;

    }


    clearMessages();

    setSavingLocation(true);


    try {

      const data:
        BusinessLocationUpdate = {

        latitude,

        longitude,

        address:
          locationForm.address.trim() ||
          null,

      };


      const updated =
        await apiPatch<BusinessResponse>(

          `/businesses/${businessId}/location?token=${encodeURIComponent(token)}`,

          data

        );


      setBusiness(
        updated
      );


      setLocationForm({

        latitude:
          updated.latitude !== null
            ? String(updated.latitude)
            : "",

        longitude:
          updated.longitude !== null
            ? String(updated.longitude)
            : "",

        address:
          updated.address ?? "",

      });


      setSuccess(
        "اطلاعات موقعیت با موفقیت ذخیره شد."
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
        "ذخیره موقعیت انجام نشد."
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
              موقعیت کسب‌وکار
            </h2>

            <p
              className="
                mt-1
                text-sm
                leading-6
                text-slate-500
              "
            >
              استان و شهر ثبت‌شده در حال حاضر فقط نمایش داده می‌شوند.
              آدرس و مختصات مکانی را می‌توانید ویرایش کنید.
            </p>

          </div>


          <div
            className="
              mb-5
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
                استان
              </label>

              <div
                className="
                  rounded-2xl
                  border
                  border-slate-200
                  bg-slate-100
                  px-4
                  py-3
                  text-sm
                  text-slate-600
                "
              >
                {provinceName ||
                  "نامشخص"}
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
                شهر
              </label>

              <div
                className="
                  rounded-2xl
                  border
                  border-slate-200
                  bg-slate-100
                  px-4
                  py-3
                  text-sm
                  text-slate-600
                "
              >
                {cityName ||
                  "نامشخص"}
              </div>

            </div>

          </div>


          <form
            onSubmit={
              handleLocationSubmit
            }
            className="
              space-y-5
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
                  Latitude
                </label>

                <input
                  type="number"
                  step="any"
                  value={
                    locationForm.latitude
                  }
                  onChange={event =>
                    setLocationForm(
                      previous => ({

                        ...previous,

                        latitude:
                          event.target.value,

                      })
                    )
                  }
                  placeholder="مثلاً 35.6892"
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
                  Longitude
                </label>

                <input
                  type="number"
                  step="any"
                  value={
                    locationForm.longitude
                  }
                  onChange={event =>
                    setLocationForm(
                      previous => ({

                        ...previous,

                        longitude:
                          event.target.value,

                      })
                    )
                  }
                  placeholder="مثلاً 51.3890"
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
                    focus:border-violet-400
                    focus:bg-white
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
                آدرس
              </label>

              <textarea
                value={
                  locationForm.address
                }
                onChange={event =>
                  setLocationForm(
                    previous => ({

                      ...previous,

                      address:
                        event.target.value,

                    })
                  )
                }
                rows={3}
                placeholder="آدرس کامل کسب‌وکار"
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
                  savingLocation
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

                <Save
                  size={18}
                />

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