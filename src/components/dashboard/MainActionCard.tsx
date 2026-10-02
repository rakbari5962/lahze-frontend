import {
  Zap,
  ArrowLeft,
} from "lucide-react";

interface Props {
  title: string;
  subtitle: string;
  onClick?: () => void;
}

export default function MainActionCard({
  title,
  subtitle,
  onClick,
}: Props) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="
        home-main-action
        group
        w-full
        rounded-3xl
        bg-gradient-to-l
        from-blue-600
        to-blue-500
        p-7
        text-white
        flex
        items-center
        justify-between
        border
        border-blue-400/20
        shadow-lg
        shadow-blue-200/30
        cursor-pointer
        transition-all
        duration-300
        ease-out
        hover:-translate-y-1
        hover:shadow-[0_18px_40px_rgba(79,70,229,0.18)]
        active:translate-y-0
      "
    >

      {/* متن */}
      <div
        className="
          text-right
        "
      >

        <h2
          className="
            text-2xl
            font-black
          "
        >
          {title}
        </h2>

        <p
          className="
            mt-2
            text-sm
            font-medium
            text-blue-100
          "
        >
          {subtitle}
        </p>

      </div>


      {/* سمت آیکون و فلش */}
      <div
        className="
          flex
          items-center
          gap-4
          flex-row-reverse
        "
      >

        {/* فلش */}
        <div
          className="
            flex
            h-9
            w-9
            items-center
            justify-center
            rounded-full
            bg-white/10
            text-white
            transition-all
            duration-300
            group-hover:bg-white/20
            group-hover:-translate-x-1
          "
        >
          <ArrowLeft
            size={18}
            strokeWidth={2}
            aria-hidden="true"
          />
        </div>


        {/* آیکون اصلی */}
        <div
          className="
            flex
            h-14
            w-14
            items-center
            justify-center
            rounded-2xl
            bg-white/20
            text-white
            backdrop-blur-md
            ring-1
            ring-white/20
            shadow-[0_8px_20px_rgba(0,0,0,0.08)]
            transition-all
            duration-300
            group-hover:scale-105
            group-hover:bg-white/25
          "
        >
          <Zap
            size={28}
            strokeWidth={2}
            fill="currentColor"
            aria-hidden="true"
          />
        </div>

      </div>

    </button>
  );
}