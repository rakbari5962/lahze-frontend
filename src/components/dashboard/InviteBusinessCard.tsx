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
        px-7
        py-7
      "
    >
      <span className="home-invite-bg-orb home-invite-bg-orb-one" aria-hidden="true" />
      <span className="home-invite-bg-orb home-invite-bg-orb-two" aria-hidden="true" />

      <span className="home-invite-content">
        <span className="home-invite-copy">
          <span className="home-invite-badge">
            <span className="home-invite-badge-icon" aria-hidden="true">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path d="M4 12L20 4L15 20L10 14L4 12Z" fill="currentColor" />
                <path d="M10 14L13 11" stroke="white" strokeWidth="1.7" strokeLinecap="round" />
              </svg>
            </span>
            دعوت کسب‌وکار مورد علاقه
          </span>

          <h2>
            دعوت کسب‌وکار مورد علاقه
          </h2>

          <p>
            کسب‌وکاری که دوست دارید هنوز در لحظه نیست؟
            <br />
            دعوتش کنید و به جامعه لحظه اضافه کنید.
          </p>

          <span className="home-invite-doodle" aria-hidden="true">
            <svg viewBox="0 0 190 72" fill="none">
              <path
                d="M8 53C45 65 72 58 104 39C125 27 142 15 170 13"
                stroke="currentColor"
                strokeWidth="3"
                strokeLinecap="round"
                strokeDasharray="7 7"
              />
              <path
                d="M157 8L172 13L163 24"
                stroke="currentColor"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
        </span>

        <span className="home-invite-visual" aria-hidden="true">
          <span className="home-invite-paper-plane">
            <svg viewBox="0 0 250 170" fill="none">
              <path d="M24 105L211 22L143 146L111 101L24 105Z" fill="#7B3FF2" />
              <path d="M24 105L211 22L111 101L24 105Z" fill="#9A68FF" />
              <path d="M111 101L143 146L126 91" fill="#5F2AD1" />
              <path d="M111 101L126 91L143 146" stroke="#4B20A9" strokeWidth="4" strokeLinejoin="round" />
              <path d="M126 91L188 40" stroke="#C8B2FF" strokeWidth="5" strokeLinecap="round" opacity="0.8" />
            </svg>
          </span>

          <span className="home-invite-store">
            <svg viewBox="0 0 250 190" fill="none">
              <path d="M45 73H205L187 38H63L45 73Z" fill="#FF5E82" />
              <path d="M45 73H205V91C205 105 194 115 180 115C166 115 156 105 156 91C156 105 146 115 132 115C118 115 108 105 108 91C108 105 98 115 84 115C70 115 60 105 60 91C60 105 50 115 36 115C28 115 21 111 17 105L45 73Z" fill="#FF7A96" />
              <rect x="47" y="111" width="158" height="61" rx="8" fill="#F5A66E" />
              <rect x="73" y="127" width="42" height="45" rx="6" fill="#FFF2DF" />
              <rect x="126" y="129" width="55" height="12" rx="6" fill="#FFF2DF" />
              <rect x="126" y="148" width="43" height="8" rx="4" fill="#FFD5BC" />
              <circle cx="192" cy="151" r="10" fill="#6C3DEB" />
              <path d="M192 145V157M186 151H198" stroke="white" strokeWidth="2.4" strokeLinecap="round" />
              <circle cx="61" cy="45" r="8" fill="#F8D05F" />
              <circle cx="189" cy="49" r="6" fill="#A7D5FF" />
            </svg>
          </span>
        </span>

        <span
          ref={menuRef}
          className="
            home-invite-actions
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
            className="home-invite-cta"
          >
            <span>دعوت کسب‌وکار</span>
            <span className="home-invite-cta-icon">
              {isOpen ? (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path d="M6 6L18 18M18 6L6 18" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
                </svg>
              ) : (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path d="M12 5V19M5 12H19" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
                </svg>
              )}
            </span>
          </button>

          <a href="/business-guide" className="home-invite-guide">
            <span>راهنمایی بیشتر</span>
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M14 6L8 12L14 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </a>

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
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                  <svg width="23" height="23" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <path d="M4 4H9V9H4V4ZM15 4H20V9H15V4ZM4 15H9V20H4V15ZM15 15H17V17H15V15ZM18 18H20V20H18V18ZM15 19H17V20H15V19ZM18 15H20V17H18V15Z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
                <span className="flex-1">
                  <span className="block text-sm font-bold text-slate-800">اسکن QR Code مجموعه</span>
                  <span className="mt-0.5 block text-xs text-slate-400">سریع و مستقیم</span>
                </span>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="text-slate-400" aria-hidden="true">
                  <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>

              <div className="mx-3 h-px bg-slate-100" />

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
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-purple-50 text-purple-600">
                  <svg width="23" height="23" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <path d="M5 5H19C20.1 5 21 5.9 21 7V16C21 17.1 20.1 18 19 18H9L5 21V18H5C3.9 18 3 17.1 3 16V7C3 5.9 3.9 5 5 5Z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M7 9H17M7 13H14" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                  </svg>
                </span>
                <span className="flex-1">
                  <span className="block text-sm font-bold text-slate-800">دعوت با ارسال SMS</span>
                  <span className="mt-0.5 block text-xs text-slate-400">ارسال درخواست مستقیم</span>
                </span>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="text-slate-400" aria-hidden="true">
                  <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            </div>
          )}
        </span>
      </span>
    </section>
  );
}
