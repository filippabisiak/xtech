import type { CSSProperties } from 'react'
import type { BeliefWord } from '../i18n/translations.ts'

export function QuoteWords({ words, lang }: { words: BeliefWord[]; lang: string }) {
  let slot = -1

  return (
    <p className="belief-line" key={lang}>
      {words.map((word, index) => {
        if (!word.glue) slot += 1
        return (
          <span
            key={`${word.text}-${index}`}
            className={[
              'belief-word',
              word.elegant ? 'belief-elegant' : '',
              word.accent ? 'accent-text' : '',
              word.glue ? 'is-glue' : '',
            ]
              .filter(Boolean)
              .join(' ')}
            data-glue={word.glue ? '1' : '0'}
            style={{ '--slot': slot } as CSSProperties}
          >
            {index > 0 && !word.glue ? '\u00a0' : ''}
            {word.text}
          </span>
        )
      })}
    </p>
  )
}
