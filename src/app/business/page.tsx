"use client";

import {
  AlertCircle,
  ArrowLeft,
  CheckCircle2,
  MapPin,
  Plus,
  Store,
  Trash2,
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
  deleteBusiness,
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
	
  const [deletingBusinessId, setDeletingBusinessId] =
	useState<number | null>(null);


  const [loading, setLoading] =
    useState(true);


  const [error, setError] =
    useState(false);

function getBusinessDeletionBlockerMessage(
  blocker: {
    type: string;
    count: number;
    statuses?: string[];
  }
): string {
  switch (blocker.type) {
    case "NON_TERMINAL_BOOKING":
      if (blocker.statuses?.includes("PENDING_CONFIRMATION")) {
        return `• ${blocker.count} رزرو در انتظار تأیید وجود دارد. تا تعیین تکلیف این رزروها، امکان حذف کسب‌وکار وجود ندارد.`;
      }

      if (blocker.statuses?.includes("CONFIRMED")) {
        return `• ${blocker.count} رزرو تأییدشده وجود دارد. تا تکمیل یا لغو این رزروها، امکان حذف کسب‌وکار وجود ندارد.`;
      }

      if (blocker.statuses?.includes("NO_SHOW_REPORTED")) {
        return `• ${blocker.count} رزرو در حال بررسی وضعیت عدم حضور مشتری است. تا تعیین تکلیف این رزروها، امکان حذف کسب‌وکار وجود ندارد.`;
      }

      return `• ${blocker.count} رزرو فعال یا تعیین‌تکلیف‌نشده وجود دارد. تا تعیین تکلیف آن‌ها، امکان حذف کسب‌وکار وجود ندارد.`;

    case "PENDING_NO_SHOW":
      return `• ${blocker.count} مورد عدم حضور مشتری در حال بررسی است. تا پایان بررسی، امکان حذف کسب‌وکار وجود ندارد.`;

    case "NON_TERMINAL_OPPORTUNITY":
      return `• ${blocker.count} فرصت فعال یا تعیین‌تکلیف‌نشده وجود دارد. تا پایان یا لغو این فرصت‌ها، امکان حذف کسب‌وکار وجود ندارد.`;

    case "ACTIVE_WALLET_HOLD":
      return `• ${blocker.count} مبلغ در حساب کسب‌وکار در حال نگهداری است. تا تعیین تکلیف این مبلغ، امکان حذف کسب‌وکار وجود ندارد.`;

    case "UNKNOWN_WALLET_HOLD_STATUS":
      return `• ${blocker.count} مورد مالی با وضعیت نامشخص وجود دارد. تا تعیین تکلیف آن، امکان حذف کسب‌وکار وجود ندارد.`;

    case "NON_COMPLETED_FINANCIAL_TRANSACTION":
		return `• ${blocker.count} تراکنش مالی هنوز تکمیل نشده است. تا تکمیل یا تعیین تکلیف این تراکنش‌ها، امکان حذف کسب‌وکار وجود ندارد.`;

    default:
      return `• ${blocker.count} مورد تعیین‌تکلیف‌نشده وجود دارد که مانع حذف کسب‌وکار است.`;
  }
}

async function handleDeleteBusiness(
  businessId: number,
  businessName: string
) {
  console.log(
    "DELETE BUSINESS CLICK:",
    businessId,
    businessName
  );

  const confirmed = window.confirm(
	`آیا مطمئن هستید که می‌خواهید کسب‌وکار «${businessName}» را حذف کنید؟\n\nاین عملیات کسب‌وکار را از حالت فعال خارج می‌کند و داده‌های تاریخی آن حذف نمی‌شوند.`
  );

  if (!confirmed) {
	return;
  }

  const token = getToken();

  if (!token) {
	router.push("/login");
	return;
  }

  try {
	setDeletingBusinessId(businessId);

	await deleteBusiness(
	  token,
	  businessId
	);

	setBusinesses(currentBusinesses =>
	  currentBusinesses.filter(
		business =>
		  business.id !== businessId
	  )
	);

  } catch (err) {
	console.error(
	  "Failed to delete business:",
	  err
	);

	const message =
	  err instanceof Error
		? err.message
		: "";

	if (
	  message.includes(
		"BUSINESS_DELETION_BLOCKED"
	  )
	) {
	  try {
		const jsonText =
		  message.split(" - ")[1];

		const payload =
		  JSON.parse(jsonText);

		const blockers =
		  payload?.detail?.blockers ?? [];

		const blockerText = blockers
		  .map(getBusinessDeletionBlockerMessage)
		  .join("\n");

		window.alert(
		  `امکان حذف این کسب‌وکار وجود ندارد.\n\nموارد زیر مانع حذف هستند:\n\n${blockerText}`
		);

	  } catch {
		window.alert(
		  "امکان حذف این کسب‌وکار وجود ندارد؛ برای این کسب‌وکار موارد فعال یا تسویه‌نشده وجود دارد."
		);
	  }

	} else if (
	  message.includes(
		"BUSINESS_OWNER_REQUIRED"
	  )
	) {
	  window.alert(
		"شما مالک این کسب‌وکار نیستید."
	  );

	} else if (
	  message.includes(
		"BUSINESS_NOT_FOUND"
	  )
	) {
	  window.alert(
		"این کسب‌وکار پیدا نشد."
	  );

	} else if (
	  message.includes(
		"BUSINESS_ALREADY_DELETED"
	  )
	) {
	  window.alert(
		"این کسب‌وکار قبلاً حذف شده است."
	  );

	} else {
	  window.alert(
		"حذف کسب‌وکار با خطا مواجه شد. لطفاً دوباره تلاش کنید."
	  );
	}

  } finally {
	setDeletingBusinessId(null);
  }
}


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


        const uniqueProvinceIds = Array.from(
		  new Set(
			businessList
			  .map((business) => business.province_id)
			  .filter(
				(provinceId): provinceId is number =>
				  provinceId !== null
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
				  business.province_id === null
					? undefined
					: provinceMap.get(business.province_id),

              city_name:
				  business.province_id === null ||
				  business.city_id === null
					? undefined
					: cityMap
						.get(business.province_id)
						?.get(business.city_id),

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
        className="business-management-page min-h-screen px-4 py-8 sm:px-6 lg:px-8"
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
          business-management-page
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
            className="business-error-card w-full p-8 text-center sm:p-12"
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
	  className="business-management-page min-h-screen px-4 py-5 sm:px-6 lg:px-8"
    >

      <div className="business-management-shell mx-auto w-full max-w-[1360px]">

		<div
		  dir="ltr"
		  className="business-back-wrap mb-5 flex justify-start"
		>
		  <button
			type="button"
			onClick={() => window.history.back()}
			className="business-back-button inline-flex items-center gap-2 rounded-2xl px-4 py-3 text-sm font-extrabold transition-all duration-300"
		  >
			<ArrowLeft size={17} />
			بازگشت
		  </button>
		</div>

        {/* Header */}

        <div
		  className="
			business-management-header
			mb-6
			flex
			flex-col
			gap-5
			sm:flex-row
			sm:items-center
			sm:justify-between
		  "
        >

          <div className="business-header-copy">

            <div className="business-header-eyebrow mb-2 flex items-center gap-2">

              <Store
                size={18}
              />

              <span>
                مدیریت کسب‌وکارهای من
              </span>

            </div>


            <h1 className="business-page-title">
			  کسب‌وکارهای من
            </h1>


            <p className="business-page-subtitle mt-2">
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

          <div className="business-empty-state rounded-[28px] p-8 text-center sm:p-12">

            <div
              className="business-empty-icon mx-auto mb-5 flex h-[72px] w-[72px] items-center justify-center rounded-[22px]"
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
					  className="business-management-card overflow-hidden rounded-[26px] transition-all duration-300"
                  >

                    <div className="business-card-content p-5 sm:p-6">

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

                          <div className="business-card-icon flex h-14 w-14 shrink-0 items-center justify-center rounded-[18px]">

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

                            <h2 className="business-card-title truncate">
                              {business.name}
                            </h2>


                            {locationText && (

                              <div className="business-card-location mt-1.5 flex items-center gap-1.5">

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
						  className={`business-status-badge business-status-${business.status?.toLowerCase() ?? "unknown"} shrink-0 rounded-full px-3 py-1.5 text-xs font-extrabold`}
						>
                          {statusLabel}
                        </span>

                      </div>


                      {/* Completion */}

                      {completion && (

                        <div className="business-completion-panel mt-5 rounded-[18px] p-4">

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


                            <span className="business-completion-percent text-lg font-black">
                              {completion.completion_percentage}٪
                            </span>

                          </div>


                          <div className="business-progress-track h-2 overflow-hidden rounded-full">

                            <div
								className="business-progress-fill h-full rounded-full transition-all"
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

                      <div className="business-card-actions mt-5 flex flex-col gap-3 sm:flex-row">

                        <button
                          type="button"
                          onClick={() =>
                            router.push(
                              `/business/${business.id}/manage`
                            )
                          }
                          className="business-manage-button flex flex-1 items-center justify-center gap-2 rounded-2xl px-5 py-3.5 text-sm font-black transition-all duration-300"
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
						  disabled={
							deletingBusinessId === business.id
						  }
						  onClick={() =>
							handleDeleteBusiness(
							  business.id,
							  business.name
							)
						  }
						  className="business-delete-button flex items-center justify-center gap-2 rounded-2xl px-5 py-3.5 text-sm font-extrabold transition-all duration-300 disabled:cursor-not-allowed disabled:opacity-50"
						>
						  <Trash2 size={18} />

						  {deletingBusinessId === business.id
							? "در حال حذف..."
							: "حذف کسب‌وکار"
						  }
						</button>

                        <button
                          type="button"
                          onClick={() =>
                            router.push(
                              `/business/${business.id}`
                            )
                          }
                          className="business-view-button rounded-2xl px-5 py-3.5 text-sm font-extrabold transition-all duration-300"
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