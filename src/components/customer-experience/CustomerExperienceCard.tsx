import {
  Award,
  Clock,
  Users,
} from "lucide-react";

interface CustomerExperienceItem {
  title: string;
  total_mentions: number;
  positive_mentions: number;
  negative_mentions: number;
  positive_percentage: number;
  negative_percentage: number;
}

interface Props {
  item: CustomerExperienceItem;
}

export default function CustomerExperienceCard({
  item,
}: Props) {
  const getIcon = () => {
    if (item.title.includes("زمان")) {
      return <Clock size={25} strokeWidth={1.8} />;
    }

    if (item.title.includes("برخورد")) {
      return <Users size={25} strokeWidth={1.8} />;
    }

    return <Award size={25} strokeWidth={1.8} />;
  };

  const isPositive =
    item.positive_percentage >= 50;

  return (
    <div className="business-experience-card">
      <div className="business-experience-top">
        <div className="business-experience-icon">
          {getIcon()}
        </div>

        <span className="business-experience-count">
          بر اساس تجربه{" "}
          {item.total_mentions.toLocaleString("fa-IR")} مشتری
        </span>
      </div>

      <div className="mt-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h3 className="business-experience-title">
            {item.title}
          </h3>

          <span
            className={
              isPositive
                ? "business-experience-status business-experience-status-positive"
                : "business-experience-status business-experience-status-negative"
            }
          >
            {isPositive
              ? "مثبت"
              : "نیاز به بررسی"}
          </span>
        </div>

        <div className="mt-4 flex items-end justify-between gap-4">
          <div>
            <div
              className={
                isPositive
                  ? "business-experience-percent business-experience-percent-positive"
                  : "business-experience-percent business-experience-percent-negative"
              }
            >
              {item.positive_percentage.toLocaleString(
                "fa-IR"
              )}
              ٪
            </div>

            <div className="business-experience-percent-label">
              رضایت مشتریان
            </div>
          </div>
        </div>
      </div>

      <div className="business-experience-bar mt-5" dir="ltr">
        <div
          className="business-experience-bar-positive"
          style={{
            width: `${Math.max(
              0,
              Math.min(100, item.positive_percentage)
            )}%`,
          }}
        />

        <div
          className="business-experience-bar-negative"
          style={{
            width: `${Math.max(
              0,
              Math.min(100, item.negative_percentage)
            )}%`,
          }}
        />
      </div>

		<div
		  className="business-experience-footer mt-4"
		  dir="ltr"
		>
        <span className="business-positive-count">
          ✓{" "}
          {item.positive_mentions.toLocaleString("fa-IR")} مثبت
        </span>

        <span className="business-negative-count">
          ×{" "}
          {item.negative_mentions.toLocaleString("fa-IR")} منفی
        </span>
      </div>
    </div>
  );
}