import type { ReactNode } from "react";

interface Props {
  title: string;
  value: string;
  icon: ReactNode;

  status?: string;

  theme?:
    | "blue"
    | "red"
    | "green"
    | "purple";
}

export default function StatsCard({
  title,
  value,
  icon,
  status,
  theme = "blue",
}: Props) {
  const themes = {
    blue: {
      icon: "text-blue-600",
      value: "text-blue-600",
      status: "text-blue-500",
      ring: "ring-blue-100/70",
    },

    red: {
      icon: "text-red-500",
      value: "text-red-500",
      status: "text-red-500",
      ring: "ring-red-100/70",
    },

    green: {
      icon: "text-green-600",
      value: "text-green-600",
      status: "text-green-600",
      ring: "ring-green-100/70",
    },

    purple: {
      icon: "text-purple-600",
      value: "text-purple-600",
      status: "text-purple-600",
      ring: "ring-purple-100/70",
    },
  };

  const style = themes[theme];

  return (
    <div
      data-stat-theme={theme}
      className="
        home-stats-card
        group
        rounded-3xl
        border
        border-slate-100
        bg-white
        p-6
        text-center
        shadow-sm
        transition-all
        duration-300
        ease-out
        hover:-translate-y-1.5
        hover:shadow-[0_16px_36px_rgba(15,23,42,0.09)]
      "
    >
      {/* آیکون شیشه‌ای */}
      <div
        className={`
          mx-auto
          mb-4
          flex
          h-14
          w-14
          items-center
          justify-center
          rounded-2xl
          bg-white/70
          backdrop-blur-md
          ring-1
          ${style.ring}
          shadow-[0_6px_18px_rgba(15,23,42,0.06)]
          transition-all
          duration-300
          group-hover:scale-105
          group-hover:bg-white/90
          ${style.icon}
        `}
      >
        {icon}
      </div>

      {/* عدد */}
      <p
        className={`
          text-3xl
          font-black
          tracking-tight
          transition-colors
          duration-300
          ${style.value}
        `}
      >
        {value}
      </p>

      {/* وضعیت */}
      {status && (
        <div
          className={`
            mt-2
            flex
            items-center
            justify-center
            gap-1.5
            text-[11px]
            font-medium
            ${style.status}
          `}
        >
          <span
            className="
              h-1.5
              w-1.5
              rounded-full
              bg-current
              opacity-70
            "
          />

          <span>{status}</span>
        </div>
      )}

      {/* عنوان */}
      <p
        className="
          mt-2
          text-xs
          font-medium
          text-slate-500
        "
      >
        {title}
      </p>
    </div>
  );
}