import {
  MapPin,
  ArrowLeft,
} from "lucide-react";

interface Props {
  city?: string;
  onChangeCity?: () => void;
}

export default function CityCard({
  city,
  onChangeCity,
}: Props) {
  return (
    <div
      className="
        home-city-card
        group
        mb-5
        flex
        items-center
        justify-between
        rounded-3xl
        border
        border-blue-100/60
        bg-blue-50
        p-4
        transition-all
        duration-300
        hover:-translate-y-0.5
        hover:shadow-[0_10px_26px_rgba(37,99,235,0.08)]
      "
    >

      <span className="home-city-art" aria-hidden="true">
        <svg viewBox="0 0 720 170" fill="none">
          <path d="M0 132C92 107 151 116 218 93C290 68 351 80 419 91C493 103 562 85 720 42V170H0V132Z" fill="#E9E2FF" opacity="0.72" />
          <path d="M0 145C111 123 180 131 259 112C341 92 401 102 470 111C557 122 617 99 720 73V170H0V145Z" fill="#D8D1F8" opacity="0.62" />
          <path d="M132 112L150 63L169 112H132ZM188 112L205 48L224 112H188ZM251 112L268 73L286 112H251Z" fill="#C8C0E9" opacity="0.62" />
          <rect x="348" y="46" width="74" height="70" rx="4" fill="#E2B48D" opacity="0.9" />
          <path d="M339 46L385 17L431 46H339Z" fill="#C58F6B" opacity="0.9" />
          <rect x="377" y="67" width="16" height="49" rx="2" fill="#B87855" />
          <rect x="361" y="58" width="12" height="12" rx="2" fill="#F6E9D7" />
          <rect x="398" y="58" width="12" height="12" rx="2" fill="#F6E9D7" />
          <rect x="480" y="73" width="54" height="43" rx="4" fill="#D4A27E" opacity="0.85" />
          <path d="M470 73L507 48L544 73H470Z" fill="#BD8664" opacity="0.85" />
          <rect x="502" y="89" width="11" height="27" fill="#A96E50" />
          <circle cx="104" cy="101" r="16" fill="#9EBB83" opacity="0.78" />
          <rect x="99" y="99" width="10" height="25" rx="5" fill="#6D8E5A" />
          <circle cx="579" cy="102" r="18" fill="#A7C58E" opacity="0.78" />
          <rect x="574" y="100" width="10" height="25" rx="5" fill="#71935E" />
          <circle cx="624" cy="95" r="12" fill="#B8D39B" opacity="0.75" />
          <rect x="621" y="94" width="7" height="23" rx="3.5" fill="#769A60" />
        </svg>
      </span>

      {/* اطلاعات شهر */}
      <div
        className="
          flex
          items-center
          gap-4
        "
      >

        {/* آیکون موقعیت */}
        <div
          className="
            flex
            h-11
            w-11
            shrink-0
            items-center
            justify-center
            rounded-2xl
            bg-white/75
            text-blue-600
            backdrop-blur-md
            ring-1
            ring-blue-100/70
            shadow-sm
            transition-all
            duration-300
            group-hover:scale-105
          "
        >
          <MapPin
            size={22}
            strokeWidth={2}
            aria-hidden="true"
          />
        </div>


        <div
          className="
            text-right
          "
        >

          <p
            className="
              text-sm
              font-medium
              text-slate-500
            "
          >
            شهر انتخابی من
          </p>

          <h3
            className="
              mt-1
              text-lg
              font-black
              text-slate-900
            "
          >
            {city || "انتخاب نشده"}
          </h3>

        </div>

      </div>


      {/* تغییر شهر */}
      <button
        type="button"
		onClick={onChangeCity}
        className="
          group/change
          flex
          items-center
          gap-2
          rounded-2xl
          bg-white/80
          px-4
          py-2
          font-bold
          text-blue-600
          shadow-sm
          ring-1
          ring-white/80
          backdrop-blur-md
          transition-all
          duration-300
          hover:bg-white
          hover:shadow-md
        "
      >

        <span>
          تغییر شهر
        </span>

        <ArrowLeft
          size={16}
          strokeWidth={2.2}
          className="
            transition-transform
            duration-300
            group-hover/change:-translate-x-1
          "
          aria-hidden="true"
        />

      </button>

    </div>
  );
}