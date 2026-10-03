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
      data-card-theme={theme}
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

      <span className="home-quick-illustration" aria-hidden="true">
        <svg viewBox="0 0 220 170" fill="none">
          <path d="M30 74L110 28L190 74" stroke="#8C66F4" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M48 68V143H172V68" fill="#E9E3FF" />
          <path d="M40 68H180L165 42H55L40 68Z" fill="#8E6CF5" />
          <path d="M40 68H180V82C180 92 172 99 162 99C152 99 145 92 145 82C145 92 138 99 128 99C118 99 110 92 110 82C110 92 103 99 93 99C83 99 75 92 75 82C75 92 68 99 58 99C48 99 40 92 40 82V68Z" fill="#A98BFF" />
          <rect x="65" y="101" width="38" height="42" rx="7" fill="#FFFFFF" />
          <rect x="116" y="112" width="34" height="31" rx="6" fill="#FFFFFF" />
          <circle cx="177" cy="42" r="18" fill="#FFF2B7" />
          <path d="M177 34V50M169 42H185" stroke="#8C66F4" strokeWidth="3" strokeLinecap="round" />
          <path d="M29 30L32 38L40 41L32 44L29 52L26 44L18 41L26 38L29 30ZM195 84L198 91L205 94L198 97L195 104L192 97L185 94L192 91L195 84Z" fill="#FFD76A" />
        </svg>
      </span>

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