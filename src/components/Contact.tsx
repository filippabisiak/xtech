import { useEffect, useRef, useState, type FormEvent } from 'react'
import { useLanguage } from '../i18n/LanguageContext.tsx'

const ACCESS_KEY = import.meta.env.VITE_WEB3FORMS_ACCESS_KEY as string | undefined

export function Contact() {
  const { lang, t } = useLanguage()
  const sectionRef = useRef<HTMLElement>(null)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [company, setCompany] = useState('')
  const [phone, setPhone] = useState('')
  const [message, setMessage] = useState('')
  const [bot, setBot] = useState(false)
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle')

  function clearStatus() {
    if (status !== 'idle' && status !== 'sending') setStatus('idle')
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (bot) {
      setStatus('sent')
      return
    }

    setStatus('sending')
    try {
      if (!ACCESS_KEY) throw new Error('missing key')
      const res = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          access_key: ACCESS_KEY,
          name,
          email,
          company,
          phone,
          message,
          subject: t.contact.form.subject,
          from_name: name || 'XTech',
        }),
      })
      const data = (await res.json()) as { success?: boolean }
      if (!res.ok || !data.success) throw new Error('send failed')
      setName('')
      setEmail('')
      setCompany('')
      setPhone('')
      setMessage('')
      setStatus('sent')
    } catch {
      setStatus('error')
    }
  }

  useEffect(() => {
    const section = sectionRef.current
    if (!section) return
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)')
    const show = () => {
      const top = section.getBoundingClientRect().top
      const entered = top < window.innerHeight * 0.78
      if (reduce.matches || entered) section.classList.add('is-in')
    }
    show()
    window.addEventListener('scroll', show, { passive: true })
    window.addEventListener('resize', show)
    reduce.addEventListener('change', show)
    return () => {
      window.removeEventListener('scroll', show)
      window.removeEventListener('resize', show)
      reduce.removeEventListener('change', show)
    }
  }, [lang])

  return (
    <section className="contact" id="kontakt" ref={sectionRef}>
      <div className="container contact-inner">
        <div className="contact-head">
          <h2 className="contact-title">
            <span className="route-title-text">{t.contact.title}</span>
          </h2>
          <p className="lede">{t.contact.body}</p>
        </div>

        <form className="contact-form" onSubmit={onSubmit}>
          <span className="contact-orbit" aria-hidden="true" />
          <input
            className="contact-honey"
            type="checkbox"
            tabIndex={-1}
            autoComplete="off"
            aria-hidden="true"
            checked={bot}
            onChange={(event) => setBot(event.target.checked)}
          />

          <div className="contact-fields">
            <label htmlFor="contact-name">
              {t.contact.form.name}
              <input
                id="contact-name"
                name="name"
                type="text"
                autoComplete="name"
                required
                maxLength={120}
                value={name}
                onChange={(event) => {
                  setName(event.target.value)
                  clearStatus()
                }}
              />
            </label>
            <label htmlFor="contact-email">
              {t.contact.form.email}
              <input
                id="contact-email"
                name="email"
                type="email"
                inputMode="email"
                autoComplete="email"
                required
                maxLength={254}
                value={email}
                onChange={(event) => {
                  setEmail(event.target.value)
                  clearStatus()
                }}
              />
            </label>
            <label htmlFor="contact-company">
              {t.contact.form.company}
              <input
                id="contact-company"
                name="company"
                type="text"
                autoComplete="organization"
                maxLength={160}
                value={company}
                onChange={(event) => {
                  setCompany(event.target.value)
                  clearStatus()
                }}
              />
            </label>
            <label htmlFor="contact-phone">
              {t.contact.form.phone}
              <input
                id="contact-phone"
                name="phone"
                type="tel"
                inputMode="tel"
                autoComplete="tel"
                maxLength={40}
                value={phone}
                onChange={(event) => {
                  setPhone(event.target.value)
                  clearStatus()
                }}
              />
            </label>
            <label htmlFor="contact-message" className="contact-field-full">
              {t.contact.form.message}
              <textarea
                id="contact-message"
                name="message"
                required
                maxLength={4000}
                value={message}
                onChange={(event) => {
                  setMessage(event.target.value)
                  clearStatus()
                }}
              />
            </label>
          </div>

          <button className="btn btn-primary" type="submit" disabled={status === 'sending'}>
            {status === 'sending' ? t.contact.form.sending : t.contact.form.submit}
          </button>

          <p
            className={`contact-status${status === 'error' ? ' is-error' : ''}${status === 'sent' ? ' is-ok' : ''}`}
            role="status"
            aria-live="polite"
          >
            {status === 'sent' ? t.contact.form.sent : status === 'error' ? t.contact.form.error : ''}
          </p>
        </form>
      </div>
    </section>
  )
}
