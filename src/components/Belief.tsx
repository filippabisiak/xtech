import { useRef } from 'react'
import { useLanguage } from '../i18n/LanguageContext.tsx'
import { useQuoteLock } from '../lib/useQuoteLock.ts'
import { QuoteWords } from './QuoteWords.tsx'

const RESET = ['#top']

export function Belief() {
  const { lang, t } = useLanguage()
  const sectionRef = useRef<HTMLElement>(null)
  useQuoteLock(sectionRef, {
    prevId: 'top',
    selfId: 'credo',
    lang,
    resetHrefs: RESET,
  })

  return (
    <section className="belief" id="credo" ref={sectionRef}>
      <div className="belief-pin">
        <div className="container">
          <QuoteWords words={t.belief.words} lang={lang} />
        </div>
      </div>
    </section>
  )
}
