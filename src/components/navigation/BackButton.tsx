"use client";

import { ArrowLeft } from "lucide-react";

export default function BackButton() {
  return (
    <button
      type="button"
      onClick={() => window.history.back()}
      className="
        inline-flex
        items-center
        gap-2
        rounded-xl
        border
        border-slate-200
        bg-white/90
        px-4
        py-2.5
        text-sm
        font-bold
        text-slate-600
        shadow-sm
        backdrop-blur
        transition
        hover:border-violet-200
        hover:bg-white
        hover:text-violet-600
      "
    >
      <ArrowLeft size={17} />
      بازگشت
    </button>
  );
}