import { useRef } from 'react'
import { useLanguage } from '../i18n/LanguageContext.tsx'
import { useQuoteLock } from '../lib/useQuoteLock.ts'
import { QuoteWords } from './QuoteWords.tsx'

const RESET = ['#top', '#credo', '#uslugi']

export function Bridge() {
  const { lang, t } = useLanguage()
  const sectionRef = useRef<HTMLElement>(null)
  useQuoteLock(sectionRef, {
    prevId: 'uslugi',
    selfId: 'most',
    lang,
    resetHrefs: RESET,
  })

  return (
    <section className="belief" id="most" ref={sectionRef}>
      <div className="belief-pin">
        <div className="container">
          <QuoteWords words={t.bridge.words} lang={lang} />
        </div>
      </div>
    </section>
  )
}
