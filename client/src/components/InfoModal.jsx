import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Info, X, BookOpen } from 'lucide-react'

/**
 * Floating bottom-right trigger button and accessible modal dialog displaying
 * project overview, GitHub source repository, and MkDocs documentation links.
 */
export default function InfoModal() {
  const { t } = useTranslation()

  // Local visibility state for the modal dialog
  const [open, setOpen] = useState(false)

  return (
    <>
      {/* Fixed bottom-right trigger button */}
      <button
        onClick={() => setOpen(true)}
        aria-label={t('infoAriaLabel')}
        className="fixed bottom-5 right-5 z-20 flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-slate-900/70 text-slate-300 shadow-lg backdrop-blur-md transition hover:border-sky-400/50 hover:text-white"
      >
        <Info className="h-4 w-4" />
      </button>

      {/* Modal Overlay & Dialog */}
      {open && (
        // Clicking the darkened backdrop closes the modal
        <div
          onClick={() => setOpen(false)}
          className="fixed inset-0 z-30 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
        >
          {/* `e.stopPropagation()` prevents clicks inside the modal card from bubbling up to the backdrop */}
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-sm rounded-2xl border border-white/10 bg-slate-900 p-6 text-slate-200 shadow-2xl"
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h3 className="text-base font-semibold text-white">{t('modalTitle')}</h3>
              <button
                onClick={() => setOpen(false)}
                className="rounded-lg p-1 text-slate-400 hover:bg-white/5 hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Localized Project Summary */}
            <p className="mt-4 text-xs leading-relaxed text-slate-400">
              {t('modalDescription')}
            </p>

            {/* External Action Links (GitHub Repo & Documentation Portal) */}
            <div className="mt-5 flex flex-col gap-2">
              <a
                href="https://github.com/joaohb07/weather-app"
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 py-2.5 text-xs font-medium text-slate-100 transition hover:bg-white/10"
              >
                <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24" aria-hidden="true">
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                  />
                </svg>
                <span>{t('githubLink')}</span>
              </a>
              <a
                href="https://joaohb07.github.io/documentation/apps/weather_app/"
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 py-2.5 text-xs font-medium text-slate-100 transition hover:bg-white/10"
              >
                <BookOpen className="h-4 w-4" />
                <span>{t('docsLink')}</span>
              </a>
            </div>

            {/* Author Attribution Footer */}
            <p className="mt-5 text-center text-[11px] text-slate-500">
              {t('developedBy')}
            </p>
          </div>
        </div>
      )}
    </>
  )
}