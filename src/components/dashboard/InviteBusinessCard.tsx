"use client";

import { useEffect, useRef, useState } from "react";

type InviteBusinessCardProps = {
  onScanQR?: () => void;
  onInviteSMS?: () => void;
};

export default function InviteBusinessCard({
  onScanQR,
  onInviteSMS,
}: InviteBusinessCardProps) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // بستن منو با کلیک بیرون
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // بستن منو با Escape
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    };

    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  const handleScanQR = () => {
    setIsOpen(false);
    onScanQR?.();
  };

  const handleInviteSMS = () => {
    setIsOpen(false);
    onInviteSMS?.();
  };

  return (
    <section
      dir="rtl"
      className="
        home-invite-card
        relative
        w-full
        overflow-visible
        rounded-[28px]
        bg-gradient-to-l
        from-[#4037F5]
        via-[#4656EE]
        to-[#7A2FF2]
        px-7
        py-7
        shadow-[0_12px_35px_rgba(74,63,230,0.16)]
        sm:px-8
        sm:py-8
      "
    >
      <div className="flex min-h-[190px] items-center justify-between gap-8">
        {/* متن اصلی */}
        <div className="flex-1 text-right">
          {/* Label */}
          <div
            className="
              mb-4
              inline-flex
              items-center
              gap-2
              rounded-full
              bg-white/15
              px-4
              py-2
              text-sm
              font-medium
              text-white
              backdrop-blur-sm
            "
          >
            <svg
              width="17"
              height="17"
              viewBox="0 0 24 24"
              fill="none"
              aria-hidden="true"
            >
              <path
                d="M12 2L14.2 8.1L20.5 9.2L15.8 13.5L17 20L12 16.8L7 20L8.2 13.5L3.5 9.2L9.8 8.1L12 2Z"
                fill="currentColor"
              />
            </svg>

            تخفیف‌های لحظه‌آخری
          </div>

          {/* عنوان */}
          <h2
            className="
              m-0
              text-2xl
              font-bold
              leading-[1.8]
              tracking-tight
              text-white
              sm:text-[28px]
            "
          >
            می‌خوام اضافه‌ش کنم؛ شاید یه تخفیف خوب گذاشت
          </h2>

          {/* توضیح */}

        </div>

        {/* دکمه + منوی انتخاب روش */}
        <div
  ref={menuRef}
  className="
    relative
    flex
    shrink-0
    flex-col
    items-stretch
    gap-3
  "
>
  <button
    type="button"
    onClick={() => setIsOpen((prev) => !prev)}
    aria-expanded={isOpen}
    aria-haspopup="menu"
    className="
      flex
      min-w-[190px]
      items-center
      justify-center
      gap-3
      rounded-2xl
      bg-white
      px-6
      py-4
      text-base
      font-bold
      text-[#3159E8]
      shadow-[0_8px_20px_rgba(0,0,0,0.10)]
      transition-all
      duration-200
      hover:-translate-y-0.5
      hover:shadow-[0_10px_25px_rgba(0,0,0,0.14)]
      active:translate-y-0
      focus:outline-none
      focus:ring-4
      focus:ring-white/30
    "
  >
    <span>اضافه کن</span>

    <span
      className="
        flex
        h-9
        w-9
        items-center
        justify-center
        rounded-xl
        bg-[#EEF3FF]
        text-[#3159E8]
      "
    >
      {isOpen ? (
        <svg
          width="21"
          height="21"
          viewBox="0 0 24 24"
          fill="none"
          aria-hidden="true"
        >
          <path
            d="M6 6L18 18M18 6L6 18"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
          />
        </svg>
      ) : (
        <svg
          width="21"
          height="21"
          viewBox="0 0 24 24"
          fill="none"
          aria-hidden="true"
        >
          <path
            d="M12 5V19M5 12H19"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
          />
        </svg>
      )}
    </span>
  </button>

  <a
    href="/business-guide"
    className="
      flex
      min-w-[190px]
      items-center
      justify-center
      gap-2
      rounded-2xl
      border
      border-white/25
      bg-white/10
      px-5
      py-3
      text-sm
      font-bold
      text-white
      backdrop-blur-sm
      transition-all
      duration-200
      hover:bg-white/20
      hover:border-white/40
    "
  >
    <span>راهنمایی بیشتر</span>

    <svg
      width="17"
      height="17"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M14 6L8 12L14 18"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  </a>

          {/* Dropdown */}
          {isOpen && (
            <div
              role="menu"
              className="
                absolute
                left-0
                top-[calc(100%+10px)]
                z-50
                w-[270px]
                overflow-hidden
                rounded-2xl
                border
                border-slate-100
                bg-white
                p-2
                shadow-[0_18px_45px_rgba(20,30,80,0.18)]
              "
            >
              {/* QR */}
              <button
                type="button"
                role="menuitem"
                onClick={handleScanQR}
                className="
                  flex
                  w-full
                  items-center
                  gap-3
                  rounded-xl
                  px-3
                  py-3
                  text-right
                  transition-colors
                  hover:bg-slate-50
                "
              >
                <span
                  className="
                    flex
                    h-11
                    w-11
                    shrink-0
                    items-center
                    justify-center
                    rounded-xl
                    bg-blue-50
                    text-blue-600
                  "
                >
                  <svg
                    width="23"
                    height="23"
                    viewBox="0 0 24 24"
                    fill="none"
                    aria-hidden="true"
                  >
                    <path
                      d="M4 4H9V9H4V4ZM15 4H20V9H15V4ZM4 15H9V20H4V15ZM15 15H17V17H15V15ZM18 18H20V20H18V18ZM15 19H17V20H15V19ZM18 15H20V17H18V15Z"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>

                <span className="flex-1">
                  <span className="block text-sm font-bold text-slate-800">
                    اسکن QR Code مجموعه
                  </span>

                  <span className="mt-0.5 block text-xs text-slate-400">
                    سریع و مستقیم
                  </span>
                </span>

                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  className="text-slate-400"
                  aria-hidden="true"
                >
                  <path
                    d="M9 18L15 12L9 6"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>

              {/* Divider */}
              <div className="mx-3 h-px bg-slate-100" />

              {/* SMS */}
              <button
                type="button"
                role="menuitem"
                onClick={handleInviteSMS}
                className="
                  flex
                  w-full
                  items-center
                  gap-3
                  rounded-xl
                  px-3
                  py-3
                  text-right
                  transition-colors
                  hover:bg-slate-50
                "
              >
                <span
                  className="
                    flex
                    h-11
                    w-11
                    shrink-0
                    items-center
                    justify-center
                    rounded-xl
                    bg-purple-50
                    text-purple-600
                  "
                >
                  <svg
                    width="23"
                    height="23"
                    viewBox="0 0 24 24"
                    fill="none"
                    aria-hidden="true"
                  >
                    <path
                      d="M5 5H19C20.1 5 21 5.9 21 7V16C21 17.1 20.1 18 19 18H9L5 21V18H5C3.9 18 3 17.1 3 16V7C3 5.9 3.9 5 5 5Z"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M7 9H17M7 13H14"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                    />
                  </svg>
                </span>

                <span className="flex-1">
                  <span className="block text-sm font-bold text-slate-800">
                    دعوت با ارسال SMS
                  </span>

                  <span className="mt-0.5 block text-xs text-slate-400">
                    ارسال درخواست مستقیم
                  </span>
                </span>

                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  className="text-slate-400"
                  aria-hidden="true"
                >
                  <path
                    d="M9 18L15 12L9 6"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}