import {
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
        relative
        w-full
        overflow-hidden
        rounded-[28px]
        text-white
        text-right
        cursor-pointer
        transition-all
        duration-300
        ease-out
        hover:-translate-y-1
        active:translate-y-0
      "
    >
      <span className="home-hero-glow home-hero-glow-one" aria-hidden="true" />
      <span className="home-hero-glow home-hero-glow-two" aria-hidden="true" />
      <span className="home-hero-wave home-hero-wave-one" aria-hidden="true" />
      <span className="home-hero-wave home-hero-wave-two" aria-hidden="true" />

      <span className="home-hero-copy">
        <span className="home-hero-badge">
          <span className="home-hero-badge-icon" aria-hidden="true">⚡</span>
          فرصت‌های امروز
        </span>

        <span className="home-hero-title">{title}</span>
        <span className="home-hero-subtitle">{subtitle}</span>

        <span className="home-hero-cta">
          <span>مشاهده فرصت‌ها</span>
          <ArrowLeft size={20} strokeWidth={2.3} aria-hidden="true" />
        </span>
      </span>

      <span className="home-hero-visual" aria-hidden="true">
        <span className="home-hero-photo home-hero-photo-back home-hero-photo-left">
          <svg viewBox="0 0 360 250" fill="none">
            <rect width="360" height="250" rx="22" fill="#F8EDE8" />
            <rect x="28" y="28" width="120" height="118" rx="12" fill="#E6D5CA" />
            <rect x="43" y="43" width="90" height="88" rx="8" fill="#FFF8F4" />
            <path d="M88 52V121" stroke="#B98B76" strokeWidth="5" strokeLinecap="round" />
            <path d="M54 87H122" stroke="#B98B76" strokeWidth="5" strokeLinecap="round" />
            <rect x="184" y="42" width="108" height="128" rx="22" fill="#D7B49E" />
            <path d="M206 104C206 75 228 62 238 62C248 62 270 75 270 104V148H206V104Z" fill="#3B2A26" />
            <path d="M217 105C217 91 226 83 238 83C250 83 259 91 259 105V135H217V105Z" fill="#CBA88D" />
            <rect x="45" y="174" width="90" height="34" rx="17" fill="#FFFFFF" opacity="0.9" />
            <circle cx="66" cy="191" r="7" fill="#F05A7E" />
            <rect x="80" y="184" width="40" height="7" rx="3.5" fill="#8B6F64" />
            <path d="M315 52C326 62 331 80 327 97" stroke="#7D5CF5" strokeWidth="6" strokeLinecap="round" opacity="0.5" />
          </svg>
        </span>

        <span className="home-hero-photo home-hero-photo-back home-hero-photo-right">
          <svg viewBox="0 0 360 250" fill="none">
            <rect width="360" height="250" rx="22" fill="#F5E9E2" />
            <rect x="22" y="26" width="128" height="150" rx="14" fill="#DCC5B8" />
            <rect x="39" y="43" width="94" height="92" rx="8" fill="#FFF9F5" />
            <path d="M53 61H119M53 78H119M53 95H119M53 112H119" stroke="#C69A83" strokeWidth="4" strokeLinecap="round" />
            <path d="M201 66C201 47 216 34 236 34C256 34 271 47 271 66V146H201V66Z" fill="#D6A98E" />
            <path d="M218 75C218 61 227 52 236 52C245 52 254 61 254 75V121H218V75Z" fill="#3D2D2A" />
            <circle cx="312" cy="68" r="19" fill="#C4D7A7" />
            <rect x="303" y="87" width="18" height="66" rx="9" fill="#8AA26D" />
            <rect x="173" y="171" width="116" height="32" rx="16" fill="#FFFFFF" opacity="0.9" />
            <circle cx="193" cy="187" r="7" fill="#FF6B8A" />
            <rect x="208" y="181" width="58" height="7" rx="3.5" fill="#8B6F64" />
          </svg>
        </span>

        <span className="home-hero-photo home-hero-photo-main">
          <svg viewBox="0 0 420 290" fill="none">
            <defs>
              <linearGradient id="heroRoom" x1="0" y1="0" x2="420" y2="290" gradientUnits="userSpaceOnUse">
                <stop stopColor="#FCEDE5" />
                <stop offset="1" stopColor="#EED8CB" />
              </linearGradient>
              <linearGradient id="heroWood" x1="0" y1="0" x2="1" y2="1">
                <stop stopColor="#D2A181" />
                <stop offset="1" stopColor="#A97052" />
              </linearGradient>
            </defs>
            <rect width="420" height="290" rx="24" fill="url(#heroRoom)" />
            <rect x="24" y="22" width="145" height="134" rx="16" fill="#D6B4A3" />
            <rect x="40" y="38" width="113" height="102" rx="10" fill="#FFF9F5" />
            <path d="M52 51H141M52 69H141M52 87H141M52 105H141M52 123H141" stroke="#C7A18D" strokeWidth="5" strokeLinecap="round" />
            <path d="M96 43V136" stroke="#C7A18D" strokeWidth="5" strokeLinecap="round" />

            <rect x="208" y="28" width="145" height="112" rx="16" fill="#CDA58D" />
            <rect x="224" y="44" width="113" height="80" rx="10" fill="#FFF8F2" />
            <circle cx="280" cy="83" r="30" fill="#F0D9C8" />
            <path d="M258 89C262 69 273 60 280 60C287 60 298 69 302 89" stroke="#6B4A3C" strokeWidth="9" strokeLinecap="round" />
            <path d="M262 103H298" stroke="#B58268" strokeWidth="7" strokeLinecap="round" />

            <rect x="34" y="178" width="124" height="72" rx="24" fill="url(#heroWood)" />
            <rect x="52" y="166" width="88" height="22" rx="11" fill="#F5E3D7" />
            <circle cx="76" cy="176" r="7" fill="#7F5E4E" />
            <circle cx="118" cy="176" r="7" fill="#7F5E4E" />
            <path d="M96 189V239" stroke="#8C5D43" strokeWidth="7" strokeLinecap="round" />

            <path d="M190 164C190 144 208 130 236 130C264 130 282 144 282 164V225H190V164Z" fill="#40302D" />
            <path d="M207 168C207 151 218 143 236 143C254 143 265 151 265 168V205H207V168Z" fill="#B78467" />
            <rect x="218" y="202" width="36" height="20" rx="10" fill="#E2B79E" />
            <path d="M205 223H267" stroke="#4C3934" strokeWidth="9" strokeLinecap="round" />
            <path d="M212 224L198 252M260 224L274 252" stroke="#4C3934" strokeWidth="8" strokeLinecap="round" />

            <rect x="302" y="178" width="72" height="18" rx="9" fill="#C28F74" />
            <rect x="314" y="194" width="10" height="47" rx="5" fill="#9A6C55" />
            <rect x="353" y="194" width="10" height="47" rx="5" fill="#9A6C55" />
            <circle cx="321" cy="164" r="22" fill="#AFC58E" />
            <circle cx="345" cy="151" r="25" fill="#BFD59D" />
            <circle cx="367" cy="168" r="18" fill="#95B277" />

            <rect x="44" y="242" width="332" height="48" rx="24" fill="#FFFFFF" opacity="0.5" />
          </svg>

          <span className="home-hero-urgency">ظرفیت محدود</span>
          <span className="home-hero-time">
            <span className="home-hero-time-dot" />
            ۲ ساعت باقی مانده
          </span>
        </span>

        <span className="home-hero-doodle">
          <svg viewBox="0 0 180 120" fill="none">
            <path
              d="M15 70C58 86 83 84 122 61C136 53 145 45 155 32"
              stroke="currentColor"
              strokeWidth="3.5"
              strokeLinecap="round"
              strokeDasharray="7 8"
            />
            <path
              d="M142 28L157 31L151 45"
              stroke="currentColor"
              strokeWidth="3.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
      </span>
    </button>
  );
}
