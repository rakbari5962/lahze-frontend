"use client";

import {
  AlertCircle,
  ArrowLeft,
  CheckCircle2,
  MapPin,
  Plus,
  Store,
} from "lucide-react";

import {
  useEffect,
  useState,
} from "react";

import { useRouter } from "next/navigation";

import {
  getToken,
} from "@/lib/auth";

import {
  getMyBusinesses,
  getBusinessCompletion,
} from "@/services/business.service";

import {
  getProvinces,
  getCitiesByProvince,
} from "@/services/location.service";

import type {
  BusinessListItem,
  BusinessCompletionResponse,
} from "@/types/business";


interface BusinessCardData
  extends BusinessListItem {

  completion?: BusinessCompletionResponse;

  province_name?: string;

  city_name?: string;

}


export default function MyBusinessesPage() {

  const router = useRouter();


  const [businesses, setBusinesses] =
    useState<BusinessCardData[]>([]);


  const [loading, setLoading] =
    useState(true);


  const [error, setError] =
    useState(false);


  useEffect(() => {

    async function loadBusinesses() {

      const token = getToken();


      if (!token) {

        router.push("/login");

        return;

      }


      try {

        setLoading(true);

        setError(false);


        const businessList =
          await getMyBusinesses(token);


        if (
          businessList.length === 0
        ) {

          setBusinesses([]);

          return;

        }


        const provinces =
          await getProvinces();


        const provinceMap =
          new Map(
            provinces.map(
              province => [
                province.id,
                province.name
              ]
            )
          );


        const uniqueProvinceIds =
          Array.from(
            new Set(
              businessList.map(
                business =>
                  business.province_id
              )
            )
          );


        const cityResults =
          await Promise.all(

            uniqueProvinceIds.map(
              async provinceId => {

                const cities =
                  await getCitiesByProvince(
                    provinceId
                  );


                return [
                  provinceId,
                  cities
                ] as const;

              }
            )

          );


        const cityMap =
          new Map<number, Map<number, string>>();


        cityResults.forEach(
          ([provinceId, cities]) => {

            cityMap.set(

              provinceId,

              new Map(
                cities.map(
                  city => [
                    city.id,
                    city.name
                  ]
                )
              )

            );

          }
        );


        const completionResults =
          await Promise.all(

            businessList.map(
              async business => {

                try {

                  const completion =
                    await getBusinessCompletion(
                      token,
                      business.id
                    );


                  return [
                    business.id,
                    completion
                  ] as const;

                } catch (completionError) {

                  console.log(
                    completionError
                  );


                  return [
                    business.id,
                    undefined
                  ] as const;

                }

              }
            )

          );


        const completionMap =
          new Map(
            completionResults
          );


        const enrichedBusinesses =
          businessList.map(
            business => ({

              ...business,

              province_name:
                provinceMap.get(
                  business.province_id
                ),

              city_name:
                cityMap
                  .get(
                    business.province_id
                  )
                  ?.get(
                    business.city_id
                  ),

              completion:
                completionMap.get(
                  business.id
                ),

            })
          );


        setBusinesses(
          enrichedBusinesses
        );


      } catch (error) {

        console.log(
          error
        );

        setError(true);

      } finally {

        setLoading(false);

      }

    }


    loadBusinesses();

  }, [router]);


  if (loading) {

    return (

      <main
        dir="rtl"
        className="
          min-h-screen
          bg-slate-50
          px-4
          py-8
          sm:px-6
          lg:px-8
        "
      >

        <div
          className="
            mx-auto
            flex
            min-h-[60vh]
            max-w-6xl
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
                font-medium
                text-slate-500
              "
            >
              در حال دریافت کسب‌وکارهای شما...
            </p>

          </div>

        </div>

      </main>

    );

  }


  if (error) {

    return (

      <main
        dir="rtl"
        className="
          min-h-screen
          bg-slate-50
          px-4
          py-8
          sm:px-6
          lg:px-8
        "
      >

        <div
          className="
            mx-auto
            flex
            min-h-[60vh]
            max-w-2xl
            items-center
            justify-center
          "
        >

          <div
            className="
              w-full
              rounded-3xl
              border
              border-red-100
              bg-white
              p-8
              text-center
              shadow-sm
            "
          >

            <div
              className="
                mx-auto
                mb-4
                flex
                h-14
                w-14
                items-center
                justify-center
                rounded-2xl
                bg-red-50
                text-red-500
              "
            >

              <AlertCircle
                size={28}
              />

            </div>


            <h1
              className="
                mb-2
                text-xl
                font-extrabold
                text-slate-900
              "
            >
              دریافت اطلاعات با مشکل مواجه شد
            </h1>


            <p
              className="
                mb-6
                text-sm
                leading-7
                text-slate-500
              "
            >
              لطفاً دوباره تلاش کنید.
            </p>


            <button
              type="button"
              onClick={() =>
                window.location.reload()
              }
              className="
                rounded-2xl
                bg-violet-600
                px-6
                py-3
                font-bold
                text-white
                transition
                hover:bg-violet-700
              "
            >
              تلاش دوباره
            </button>

          </div>

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
          max-w-6xl
        "
      >

        {/* Header */}

        <div
          className="
            mb-8
            flex
            flex-col
            gap-5
            sm:flex-row
            sm:items-center
            sm:justify-between
          "
        >

          <div>

            <div
              className="
                mb-2
                flex
                items-center
                gap-2
                text-sm
                font-medium
                text-violet-600
              "
            >

              <Store
                size={18}
              />

              <span>
                مدیریت کسب‌وکارهای من
              </span>

            </div>


            <h1
              className="
                text-2xl
                font-extrabold
                tracking-tight
                text-slate-900
                sm:text-3xl
              "
            >
              کسب‌وکارهای من
            </h1>


            <p
              className="
                mt-2
                text-sm
                leading-6
                text-slate-500
              "
            >
              کسب‌وکارهای ثبت‌شده خود را مشاهده و مدیریت کنید.
            </p>

          </div>


          <button
            type="button"
            onClick={() =>
              router.push("/business/add")
            }
            className="
              inline-flex
              items-center
              justify-center
              gap-2
              rounded-2xl
              bg-violet-600
              px-5
              py-3
              font-bold
              text-white
              shadow-sm
              transition
              hover:bg-violet-700
            "
          >

            <Plus
              size={20}
            />

            افزودن کسب‌وکار

          </button>

        </div>


        {/* Empty State */}

        {businesses.length === 0 && (

          <div
            className="
              rounded-[28px]
              border
              border-slate-200
              bg-white
              p-8
              text-center
              shadow-sm
              sm:p-12
            "
          >

            <div
              className="
                mx-auto
                mb-5
                flex
                h-20
                w-20
                items-center
                justify-center
                rounded-3xl
                bg-violet-50
                text-violet-600
              "
            >

              <Store
                size={36}
                strokeWidth={1.8}
              />

            </div>


            <h2
              className="
                mb-2
                text-xl
                font-extrabold
                text-slate-900
              "
            >
              هنوز کسب‌وکاری ثبت نکرده‌اید
            </h2>


            <p
              className="
                mx-auto
                mb-6
                max-w-md
                text-sm
                leading-7
                text-slate-500
              "
            >
              کسب‌وکار خود را ثبت کنید تا بتوانید اطلاعات آن را
              مدیریت کرده و برای فرصت‌های جدید آماده باشید.
            </p>


            <button
              type="button"
              onClick={() =>
                router.push("/business/add")
              }
              className="
                inline-flex
                items-center
                gap-2
                rounded-2xl
                bg-violet-600
                px-6
                py-3
                font-bold
                text-white
                transition
                hover:bg-violet-700
              "
            >

              <Plus
                size={20}
              />

              افزودن کسب‌وکار من

            </button>

          </div>

        )}


        {/* Business List */}

        {businesses.length > 0 && (

          <div
            className="
              grid
              gap-5
              md:grid-cols-2
            "
          >

            {businesses.map(
              business => {

                const completion =
                  business.completion;


                const statusLabel =
                  business.status === "ACTIVE"
                    ? "فعال"
                    : business.status === "READY"
                    ? "آماده"
                    : business.status === "PROFILE_INCOMPLETE"
                    ? "پروفایل ناقص"
                    : business.status === "DRAFT"
                    ? "پیش‌نویس"
                    : business.status === "SUSPENDED"
                    ? "معلق"
                    : "نامشخص";


                const locationText =
                  [
                    business.city_name,
                    business.province_name,
                  ]
                    .filter(Boolean)
                    .join("، ");


                return (

                  <div
                    key={business.id}
                    className="
                      overflow-hidden
                      rounded-[28px]
                      border
                      border-slate-200
                      bg-white
                      shadow-sm
                      transition
                      hover:-translate-y-0.5
                      hover:shadow-md
                    "
                  >

                    <div
                      className="
                        p-6
                        sm:p-7
                      "
                    >

                      {/* Card Header */}

                      <div
                        className="
                          flex
                          items-start
                          justify-between
                          gap-4
                        "
                      >

                        <div
                          className="
                            flex
                            min-w-0
                            items-center
                            gap-4
                          "
                        >

                          <div
                            className="
                              flex
                              h-14
                              w-14
                              shrink-0
                              items-center
                              justify-center
                              rounded-2xl
                              bg-violet-50
                              text-violet-600
                            "
                          >

                            <Store
                              size={27}
                              strokeWidth={1.8}
                            />

                          </div>


                          <div
                            className="
                              min-w-0
                            "
                          >

                            <h2
                              className="
                                truncate
                                text-lg
                                font-extrabold
                                text-slate-900
                              "
                            >
                              {business.name}
                            </h2>


                            {locationText && (

                              <div
                                className="
                                  mt-1.5
                                  flex
                                  items-center
                                  gap-1.5
                                  text-sm
                                  text-slate-500
                                "
                              >

                                <MapPin
                                  size={15}
                                />

                                <span>
                                  {locationText}
                                </span>

                              </div>

                            )}

                          </div>

                        </div>


                        <span
                          className="
                            shrink-0
                            rounded-full
                            bg-slate-100
                            px-3
                            py-1.5
                            text-xs
                            font-bold
                            text-slate-600
                          "
                        >
                          {statusLabel}
                        </span>

                      </div>


                      {/* Completion */}

                      {completion && (

                        <div
                          className="
                            mt-7
                            rounded-2xl
                            bg-slate-50
                            p-4
                          "
                        >

                          <div
                            className="
                              mb-3
                              flex
                              items-center
                              justify-between
                              gap-3
                            "
                          >

                            <div
                              className="
                                flex
                                items-center
                                gap-2
                                text-sm
                                font-bold
                                text-slate-700
                              "
                            >

                              {completion.is_complete ? (

                                <CheckCircle2
                                  size={18}
                                  className="
                                    text-emerald-500
                                  "
                                />

                              ) : (

                                <AlertCircle
                                  size={18}
                                  className="
                                    text-amber-500
                                  "
                                />

                              )}

                              تکمیل اطلاعات

                            </div>


                            <span
                              className="
                                text-sm
                                font-extrabold
                                text-violet-600
                              "
                            >
                              {completion.completion_percentage}٪
                            </span>

                          </div>


                          <div
                            className="
                              h-2
                              overflow-hidden
                              rounded-full
                              bg-slate-200
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


                          {!completion.is_complete &&
                            completion.missing_items.length > 0 && (

                              <p
                                className="
                                  mt-3
                                  text-xs
                                  leading-6
                                  text-slate-500
                                "
                              >
                                اطلاعات ناقص:
                                {" "}
                                {completion.missing_items.join("، ")}
                              </p>

                            )}

                        </div>

                      )}


                      {/* Actions */}

                      <div
                        className="
                          mt-6
                          flex
                          flex-col
                          gap-3
                          sm:flex-row
                        "
                      >

                        <button
                          type="button"
                          onClick={() =>
                            router.push(
                              `/business/${business.id}/manage`
                            )
                          }
                          className="
                            flex
                            flex-1
                            items-center
                            justify-center
                            gap-2
                            rounded-2xl
                            bg-violet-600
                            px-5
                            py-3.5
                            font-bold
                            text-white
                            transition
                            hover:bg-violet-700
                          "
                        >

                          {completion &&
                          !completion.is_complete
                            ? "تکمیل اطلاعات"
                            : "مدیریت کسب‌وکار"
                          }

                          <ArrowLeft
                            size={18}
                          />

                        </button>


                        <button
                          type="button"
                          onClick={() =>
                            router.push(
                              `/business/${business.id}`
                            )
                          }
                          className="
                            rounded-2xl
                            border
                            border-slate-200
                            bg-white
                            px-5
                            py-3.5
                            font-bold
                            text-slate-700
                            transition
                            hover:bg-slate-50
                          "
                        >
                          مشاهده
                        </button>

                      </div>

                    </div>

                  </div>

                );

              }
            )}

          </div>

        )}

      </div>

    </main>

  );

}