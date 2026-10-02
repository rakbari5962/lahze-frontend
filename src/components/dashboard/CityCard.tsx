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