import BookingButton from "@/components/booking/BookingButton";
import CustomerExperienceCard from "@/components/customer-experience/CustomerExperienceCard";
import BackButton from "@/components/navigation/BackButton";

import {
  getBusinessPublicProfile,
  getBusinessReviewSummary,
  getCustomerInsights,
} from "@/services/business.service";

import { getBusinessOpportunities } from "@/services/opportunity.service";

import {
  BarChart3,
  CalendarDays,
  CheckCircle2,
  Info,
  MessageCircle,
  Phone,
  ShieldCheck,
  Sparkles,
  Star,
  Store,
  Users,
} from "lucide-react";

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function BusinessPage({ params }: PageProps) {
  const { id } = await params;

  const businessId = Number(id);

  const profile = await getBusinessPublicProfile(businessId);

  console.log(
    "PROFILE:",
    JSON.stringify(profile, null, 2)
  );

  const reviewSummary = await getBusinessReviewSummary(
    businessId
  );

  const customerInsights = await getCustomerInsights(
    businessId
  );

  const opportunities = await getBusinessOpportunities(
    businessId
  );

  const hasReviews =
    profile.reputation.total_reviews > 0;

  const hasAverageRating =
    profile.reputation.average_rating !== null &&
    profile.reputation.average_rating !== undefined &&
    profile.reputation.average_rating !== "";

  const hasCustomerInsights =
    customerInsights.attributes.length > 0;

  return (
	  <main
		dir="rtl"
		className="business-public-page min-h-screen"
	  >
		<div className="business-public-shell mx-auto w-full max-w-[1360px] px-4 py-5 sm:px-6 lg:px-8 lg:py-7">

		  <div
			dir="ltr"
			className="mb-4 flex justify-start"
		  >
			<BackButton />
		  </div>

        {/* Hero */}
        <section className="business-hero mb-5 overflow-hidden">
          <div className="business-hero-decoration business-hero-decoration-one" />
          <div className="business-hero-decoration business-hero-decoration-two" />

          <div className="relative z-10 flex h-full flex-col gap-5 p-5 sm:p-6 lg:flex-row lg:items-center lg:justify-between lg:px-8 lg:py-6">
            <div className="flex min-w-0 items-center gap-4 sm:gap-5">
              <div className="business-hero-icon flex h-[72px] w-[72px] shrink-0 items-center justify-center rounded-[20px] sm:h-[78px] sm:w-[78px]">
                <Store size={40} strokeWidth={1.7} />
              </div>

              <div className="min-w-0">
                <div className="mb-2 inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-extrabold business-badge">
                  <Store size={14} />
                  <span>پروفایل کسب‌وکار</span>
                </div>

                <h1 className="business-hero-title text-3xl font-black leading-tight sm:text-4xl">
                  {profile.business.name}
                </h1>

                {profile.business.description && (
                  <p className="business-hero-description mt-3 max-w-2xl text-sm leading-7 sm:text-base">
                    {profile.business.description}
                  </p>
                )}

                {profile.business.phone && (
                  <div className="mt-4 inline-flex items-center gap-2 rounded-full px-4 py-2.5 text-sm font-bold business-phone">
                    <Phone size={16} />
                    <span dir="ltr">
                      {profile.business.phone}
                    </span>
                  </div>
                )}
              </div>
            </div>

            <div className="business-hero-side hidden lg:flex">
              <div className="business-hero-orb">
                <Sparkles size={26} />
              </div>
            </div>
          </div>
        </section>

        {/* Reputation + Review Analysis */}
        <div className="business-detail-top-grid mb-5 grid gap-5 lg:grid-cols-2">
          {/* Reputation */}
          <section className="business-card p-6 sm:p-7">
            <div className="business-section-heading">
              <div>
                <div className="business-section-label mb-1">
                  اعتبار و بازخورد
                </div>

                <h2 className="business-section-title flex items-center gap-2 text-xl font-black">
                  <ShieldCheck size={21} />
                  اعتبار کسب‌وکار
                </h2>
              </div>

              <div className="business-status-badge">
                {hasReviews ? (
                  <>
                    <Star size={14} />
                    <span>بر اساس بازخورد مشتریان</span>
                  </>
                ) : (
                  <>
                    <Star size={14} />
                    <span>هنوز امتیازی ثبت نشده</span>
                  </>
                )}
              </div>
            </div>

            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              <div className="business-stat-card">
                <div className="business-stat-icon">
                  <Star size={22} />
                </div>

                <div className="min-w-0">
                  <div className="business-stat-value text-2xl sm:text-3xl">
                    {hasAverageRating
                      ? profile.reputation.average_rating
                      : "بدون امتیاز"}
                  </div>

                  <p className="business-stat-label">
                    میانگین امتیاز
                  </p>
                </div>
              </div>

              <div className="business-stat-card">
                <div className="business-stat-icon">
                  <MessageCircle size={22} />
                </div>

                <div className="min-w-0">
                  <div className="business-stat-value text-2xl sm:text-3xl">
                    {profile.reputation.total_reviews.toLocaleString(
                      "fa-IR"
                    )}
                  </div>

                  <p className="business-stat-label">
                    نظر ثبت‌شده
                  </p>
                </div>
              </div>
            </div>

            <div className="business-info-strip mt-4">
              <Info size={18} className="shrink-0" />

              <p>
                {hasReviews
                  ? "امتیاز و اعتبار این کسب‌وکار بر اساس تجربه و بازخورد مشتریان نمایش داده می‌شود."
                  : "با ثبت اولین نظر مشتریان، امتیاز و اعتبار این کسب‌وکار در این بخش نمایش داده می‌شود."}
              </p>
            </div>
          </section>

          {/* Review Analysis */}
          <section className="business-card p-6 sm:p-7">
            <div className="business-section-heading">
              <div>
                <div className="business-section-label mb-1">
                  تحلیل بازخورد
                </div>

                <h2 className="business-section-title flex items-center gap-2 text-xl font-black">
                  <BarChart3 size={21} />
                  تحلیل تجربه مشتریان
                </h2>
              </div>
            </div>

            {reviewSummary.total_reviews === 0 ? (
			  <div className="business-empty-state mt-5 min-h-[150px]">
				<div className="business-empty-icon">
				  <BarChart3 size={30} />
				</div>

				<h3 className="mt-4 text-lg font-black">
				  هنوز نظری برای تحلیل وجود ندارد
				</h3>

				<p className="mt-2 max-w-md text-sm leading-7">
				  پس از ثبت نظر مشتریان، تحلیل‌های تکرارشونده و نقاط قابل بهبود در این بخش نمایش داده می‌شوند.
				</p>
			  </div>
			) : reviewSummary.weaknesses.length === 0 ? (
			  <div className="business-empty-state mt-5 min-h-[150px]">
				<div className="business-empty-icon">
				  <CheckCircle2 size={30} />
				</div>

				<h3 className="mt-4 text-lg font-black">
				  نکته منفی برجسته‌ای شناسایی نشده است
				</h3>

				<p className="mt-2 max-w-md text-sm leading-7">
				  در بررسی بازخوردهای ثبت‌شده، مورد مهمی برای بهبود در این بخش شناسایی نشده است.
				</p>
			  </div>
            ) : (
              <div className="mt-5 space-y-3">
                {reviewSummary.weaknesses.map(
                  (item, index) => (
                    <div
                      key={index}
                      className="business-weakness-card"
                    >
                      <div>
                        <div className="business-weakness-badge">
                          نیاز به بهبود
                        </div>

                        <h3 className="mt-2 text-base font-black">
                          {item.label}
                        </h3>

                        <p className="mt-2 text-sm leading-6">
                          {item.total_mentions.toLocaleString(
                            "fa-IR"
                          )}{" "}
                          تجربه مشتری بررسی شده
                        </p>
                      </div>

                      <div className="business-weakness-percent">
                        {item.negative_percentage}٪
                      </div>
                    </div>
                  )
                )}
              </div>
            )}
          </section>
        </div>

        {/* Customer Experience */}
        <section className="business-card mb-5 p-6 sm:p-7">
          <div className="business-section-heading">
            <div>
              <div className="business-section-label mb-1">
                بازخورد مشتریان
              </div>

              <h2 className="business-section-title flex items-center gap-2 text-xl font-black">
                <Users size={21} />
                تجربه مشتریان
              </h2>
            </div>
          </div>

          {hasCustomerInsights ? (
            <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
              {customerInsights.attributes.map(
                (item) => (
                  <CustomerExperienceCard
                    key={item.attribute_id}
                    item={{
                      title: item.label,
                      total_mentions: item.total_mentions,
                      positive_mentions:
                        item.positive_mentions,
                      negative_mentions:
                        item.negative_mentions,
                      positive_percentage:
                        item.positive_percentage,
                      negative_percentage:
                        item.negative_percentage,
                    }}
                  />
                )
              )}
            </div>
          ) : (
            <div className="business-empty-state mt-5 min-h-[150px]">
              <div className="business-empty-icon">
                <MessageCircle size={31} />
              </div>

              <h3 className="mt-4 text-lg font-black">
                هنوز داده کافی برای نمایش تجربه مشتریان وجود ندارد
              </h3>

              <p className="mt-2 max-w-xl text-center text-sm leading-7">
                با دریافت بازخوردهای بیشتر از مشتریان،
                شاخص‌های تجربه و موضوعات پرتکرار در این بخش
                نمایش داده می‌شوند.
              </p>
            </div>
          )}
        </section>

        {/* Opportunities */}
        <section className="business-card mb-5 p-6 sm:p-7">
          <div className="business-section-heading">
            <div>
              <div className="business-section-label mb-1">
                پیشنهادهای موجود
              </div>

              <h2 className="business-section-title flex items-center gap-2 text-xl font-black">
                <CalendarDays size={21} />
                فرصت‌های رزرو
              </h2>
            </div>
          </div>

          {opportunities.length === 0 ? (
            <div className="business-empty-state mt-5 min-h-[230px]">
              <div className="business-empty-icon">
                <CalendarDays size={31} />
              </div>

              <h3 className="mt-4 text-lg font-black">
                فعلاً فرصت رزرو فعالی وجود ندارد
              </h3>

              <p className="mt-2 max-w-xl text-center text-sm leading-7">
                فرصت‌های فعال این کسب‌وکار در این بخش نمایش
                داده می‌شوند.
              </p>
            </div>
          ) : (
            <div className="mt-6 space-y-4">
              {opportunities.map((item) => {
                const isFull =
                  item.reserved_count >= item.capacity;

                return (
                  <div
                    key={item.id}
                    className={`business-opportunity ${
                      isFull
                        ? "business-opportunity-disabled"
                        : ""
                    }`}
                  >
                    <div className="business-opportunity-top">
                      <div>
                        <div className="business-opportunity-badge">
                          فرصت ویژه رزرو
                        </div>

                        <h3 className="mt-3 text-lg font-black">
                          خدمات ویژه این کسب‌وکار
                        </h3>
                      </div>

                      <span
                        className={
                          isFull
                            ? "business-capacity-badge business-capacity-full"
                            : "business-capacity-badge"
                        }
                      >
                        {isFull ? "ظرفیت تکمیل شده" : "فعال"}
                      </span>
                    </div>

                    <div className="mt-5 grid gap-4 md:grid-cols-4">
                      <div className="business-opportunity-detail">
                        <span>قیمت اصلی</span>
                        <strong>
                          {item.original_price.toLocaleString(
                            "fa-IR"
                          )}{" "}
                          تومان
                        </strong>
                      </div>

                      <div className="business-opportunity-detail business-opportunity-highlight">
                        <span>قیمت نهایی</span>
                        <strong>
                          {item.final_price.toLocaleString(
                            "fa-IR"
                          )}{" "}
                          تومان
                        </strong>
                      </div>

                      <div className="business-opportunity-detail">
                        <span>تخفیف</span>
                        <strong>
                          {item.discount_percent.toLocaleString(
                            "fa-IR"
                          )}
                          ٪
                        </strong>
                      </div>

                      <div className="business-opportunity-detail">
                        <span>ظرفیت</span>
                        <strong>
                          {item.reserved_count.toLocaleString(
                            "fa-IR"
                          )}
                          /
                          {item.capacity.toLocaleString(
                            "fa-IR"
                          )}
                        </strong>
                      </div>
                    </div>

                    <div className="business-opportunity-footer">
                      <div className="business-start-time">
                        <CalendarDays size={17} />

                        <span>
                          شروع:{" "}
                          {new Date(
                            item.start_time
                          ).toLocaleString("fa-IR")}
                        </span>
                      </div>

                      {isFull ? (
                        <button
                          disabled
                          className="business-booking-disabled"
                        >
                          ظرفیت تکمیل شده
                        </button>
                      ) : (
                        <BookingButton
                          opportunityId={item.id}
                        />
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}