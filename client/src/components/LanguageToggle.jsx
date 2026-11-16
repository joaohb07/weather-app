import { useTranslation } from 'react-i18next'

/**
 * Crisp inline SVG icon representing the United States flag (English locale).
 * Marked `aria-hidden="true"` because adjacent text and `aria-label` describe the button.
 */
function UsFlagIcon() {
  return (
    <svg className="h-3.5 w-5 rounded-[2px] shadow-xs" viewBox="0 0 60 40" aria-hidden="true">
      <rect width="60" height="40" fill="#b22234" />
      <path d="M0 6h60M0 14h60M0 22h60M0 30h60M0 38h60" stroke="#fff" strokeWidth="3.2" />
      <rect width="26" height="22" fill="#3c3b6e" />
      <circle cx="6" cy="5" r="1.2" fill="#fff" />
      <circle cx="13" cy="5" r="1.2" fill="#fff" />
      <circle cx="20" cy="5" r="1.2" fill="#fff" />
      <circle cx="9.5" cy="11" r="1.2" fill="#fff" />
      <circle cx="16.5" cy="11" r="1.2" fill="#fff" />
      <circle cx="6" cy="17" r="1.2" fill="#fff" />
      <circle cx="13" cy="17" r="1.2" fill="#fff" />
      <circle cx="20" cy="17" r="1.2" fill="#fff" />
    </svg>
  )
}

/**
 * Diagonal split SVG icon combining Brazil (top-left) and Portugal (bottom-right)
 * using SVG `<clipPath>` polygons to represent Lusophone/Portuguese localization.
 */
function PtBrFlagIcon() {
  return (
    <svg className="h-3.5 w-5 rounded-[2px] shadow-xs" viewBox="0 0 60 40" aria-hidden="true">
      <defs>
        {/* Top-left triangle clip path for Brazil */}
        <clipPath id="br-half">
          <polygon points="0,0 60,0 0,40" />
        </clipPath>
        {/* Bottom-right triangle clip path for Portugal */}
        <clipPath id="pt-half">
          <polygon points="60,0 60,40 0,40" />
        </clipPath>
      </defs>

      {/* Brazil (top-left half) */}
      <g clipPath="url(#br-half)">
        <rect width="60" height="40" fill="#009c3b" />
        <polygon points="30,4 54,20 30,36 6,20" fill="#ffdf00" />
        <circle cx="24" cy="16" r="6" fill="#002776" />
      </g>

      {/* Portugal (bottom-right half) */}
      <g clipPath="url(#pt-half)">
        <rect width="60" height="40" fill="#da291c" />
        <rect width="24" height="40" fill="#046a38" />
        <circle cx="38" cy="24" r="6" fill="#ffcc00" />
      </g>

      {/* Subtle diagonal divider stroke */}
      <line x1="60" y1="0" x2="0" y2="40" stroke="#0f172a" strokeWidth="1.5" />
    </svg>
  )
}

/**
 * Top floating segmented pill allowing users to toggle the active UI and API language
 * between English (`en`) and Portuguese (`pt`).
 */
export default function LanguageToggle() {
  const { i18n } = useTranslation()

  // Normalize regional variants (e.g. 'pt-BR') to determine the active toggle state
  const currentLang = i18n.language?.startsWith('pt') ? 'pt' : 'en'

  return (
    <div
      role="group"
      aria-label="Language switcher"
      className="fixed top-5 left-1/2 z-20 flex -translate-x-1/2 items-center gap-1 rounded-full border border-white/10 bg-slate-900/75 p-1 shadow-xl backdrop-blur-md"
    >
      {/* English toggle button */}
      <button
        type="button"
        data-testid="lang-en"
        aria-label="Switch to English"
        aria-pressed={currentLang === 'en'}
        onClick={() => i18n.changeLanguage('en')}
        className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition ${
          currentLang === 'en'
            ? 'bg-sky-500 text-slate-950 shadow-sm'
            : 'text-slate-300 hover:bg-white/5 hover:text-white'
        }`}
      >
        <UsFlagIcon />
        <span>EN</span>
      </button>

      {/* Portuguese toggle button */}
      <button
        type="button"
        data-testid="lang-pt"
        aria-label="Mudar para Português"
        aria-pressed={currentLang === 'pt'}
        onClick={() => i18n.changeLanguage('pt')}
        className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition ${
          currentLang === 'pt'
            ? 'bg-sky-500 text-slate-950 shadow-sm'
            : 'text-slate-300 hover:bg-white/5 hover:text-white'
        }`}
      >
        <PtBrFlagIcon />
        <span>PT</span>
      </button>
    </div>
  )
}