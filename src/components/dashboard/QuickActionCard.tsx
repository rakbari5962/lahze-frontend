import type { ReactNode } from "react";
import { ChevronLeft } from "lucide-react";

interface Props {
  title: string;
  subtitle: string;
  icon: ReactNode;

  theme?:
    | "red"
    | "green"
    | "purple"
    | "blue"
    | "yellow"
    | "teal";

  onClick?: () => void;
}

export default function QuickActionCard({
  title,
  subtitle,
  icon,
  theme = "blue",
  onClick,
}: Props) {
  const themes = {
    red: {
      box: "bg-red-50",
      icon: "text-red-500",
      arrow: "text-red-500",
      ring: "ring-red-100/70",
    },

    green: {
      box: "bg-green-50",
      icon: "text-green-600",
      arrow: "text-green-600",
      ring: "ring-green-100/70",
    },

    purple: {
      box: "bg-purple-50",
      icon: "text-purple-600",
      arrow: "text-purple-600",
      ring: "ring-purple-100/70",
    },

    blue: {
      box: "bg-blue-50",
      icon: "text-blue-600",
      arrow: "text-blue-600",
      ring: "ring-blue-100/70",
    },

    yellow: {
      box: "bg-yellow-50",
      icon: "text-yellow-600",
      arrow: "text-yellow-600",
      ring: "ring-yellow-100/70",
    },

    teal: {
      box: "bg-teal-50",
      icon: "text-teal-600",
      arrow: "text-teal-600",
      ring: "ring-teal-100/70",
    },
  };

  const style = themes[theme];

  return (
    <button
      type="button"
      onClick={onClick}
      className={`
        home-quick-card
        group
        w-full
        rounded-3xl
        p-6
        min-h-[120px]
        ${style.box}
        flex
        items-center
        justify-between
        border
        border-white/70
        shadow-sm
        transition-all
        duration-300
        ease-out
        hover:-translate-y-1
        hover:shadow-[0_14px_32px_rgba(15,23,42,0.08)]
        active:translate-y-0
      `}
    >
      {/* متن */}
      <div className="text-right">
        <h3
          className="
            text-xl
            font-black
            text-slate-900
          "
        >
          {title}
        </h3>

        <p
          className="
            mt-2
            text-xs
            font-medium
            leading-6
            text-slate-500
          "
        >
          {subtitle}
        </p>
      </div>

      {/* آیکون + فلش */}
      <div
        className="
          flex
          items-center
          gap-5
          flex-row-reverse
        "
      >
        {/* فلش */}
        <span
          className={`
            flex
            items-center
            justify-center
            transition-transform
            duration-300
            group-hover:-translate-x-1
            ${style.arrow}
          `}
        >
          <ChevronLeft
            size={21}
            strokeWidth={2}
            aria-hidden="true"
          />
        </span>

        {/* باکس شیشه‌ای آیکون */}
        <div
          className={`
            flex
            h-16
            w-16
            items-center
            justify-center
            rounded-2xl
            bg-white/65
            backdrop-blur-md
            ring-1
            ${style.ring}
            shadow-[0_6px_16px_rgba(15,23,42,0.06)]
            transition-all
            duration-300
            group-hover:scale-[1.04]
            group-hover:bg-white/80
            ${style.icon}
          `}
        >
          {icon}
        </div>
      </div>
    </button>
  );
}