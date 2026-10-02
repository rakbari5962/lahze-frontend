"use client";

import {
  UserRound,
  Sparkles,
} from "lucide-react";

interface Props {
  name?: string;
  phone?: string;
}

export default function DashboardHeader({
  name,
  phone,
}: Props) {
  return (
    <div
      className="
        home-header
        flex
        items-center
        justify-between
        mb-8
        gap-6
      "
    >

      {/* خوش آمدگویی */}
      <div
        className="
          flex
          items-center
          gap-4
          text-right
        "
      >

        {/* آیکون خوش‌آمدگویی */}
        <div
          className="
            flex
            h-12
            w-12
            shrink-0
            items-center
            justify-center
            rounded-2xl
            bg-blue-50
            text-blue-600
            ring-1
            ring-blue-100/70
            shadow-sm
          "
        >
          <Sparkles
            size={23}
            strokeWidth={2}
            aria-hidden="true"
          />
        </div>

        <div>
          <h1
            className="
              text-3xl
              font-black
              text-slate-900
            "
          >
            سلام {name || "کاربر"}
          </h1>

          <p
            className="
              mt-2
              text-sm
              font-medium
              text-slate-500
            "
          >
            آماده‌ای فرصت‌های امروز رو پیدا کنی؟
          </p>
        </div>

      </div>


      {/* اطلاعات کاربر */}
      <div
        className="
          flex
          items-center
          gap-4
        "
      >

        <div
          className="
            text-right
          "
        >

          <p
            className="
              text-base
              font-black
              text-slate-900
            "
          >
            {name || "کاربر"}
          </p>

          <p
            className="
              mt-1
              text-sm
              text-slate-500
            "
          >
            {phone}
          </p>

        </div>


        {/* آواتار */}
        <div
          className="
            flex
            h-14
            w-14
            shrink-0
            items-center
            justify-center
            rounded-full
            bg-blue-50/80
            text-blue-600
            backdrop-blur-md
            ring-1
            ring-blue-100/80
            shadow-sm
            transition-all
            duration-300
            hover:scale-105
            hover:shadow-md
          "
        >
          <UserRound
            size={25}
            strokeWidth={2}
            aria-hidden="true"
          />
        </div>

      </div>

    </div>
  );
}