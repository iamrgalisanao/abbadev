import { useState } from 'react'
import { ArrowRight, CheckCircle2 } from 'lucide-react'
import { EMAIL_PATTERN } from '../lib/patterns'
import { consult } from './content.js'

const ENDPOINT = import.meta.env.VITE_CONSULTATION_ENDPOINT || '/api/consultation'
// The n8n workflow drops briefs with a shorter challenge, so enforce it here.
const MIN_CHALLENGE = 10

function Select({ name, label, options, defaultValue = options[0] }) {
  return (
    <label className="v2-field">
      <span>{label}</span>
      <select name={name} defaultValue={defaultValue}>
        {options.map((opt) => <option key={opt}>{opt}</option>)}
      </select>
    </label>
  )
}

export default function ConsultForm() {
  const [status, setStatus] = useState('idle')
  const [message, setMessage] = useState('')
  const { fields } = consult

  const handleSubmit = async (event) => {
    event.preventDefault()
    if (status === 'submitting') return

    const form = event.currentTarget
    const payload = Object.fromEntries(new FormData(form).entries())
    const email = String(payload.email || '').trim()
    const challenge = String(payload.challenge || '').trim()

    // Honeypot: real visitors never see or fill this field.
    if (payload.website) {
      setStatus('submitted')
      return
    }
    delete payload.website

    if (!EMAIL_PATTERN.test(email)) {
      setStatus('error')
      setMessage('Enter a valid business email address, such as name@company.com.')
      return
    }
    if (challenge.length < MIN_CHALLENGE) {
      setStatus('error')
      setMessage('Add a sentence or two about the workflow so we can prepare.')
      return
    }

    setStatus('submitting')
    setMessage('')

    try {
      const response = await fetch(ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...payload,
          email,
          challenge,
          formType: 'v2-consultation',
          source: 'abbadev.com',
          pageUrl: window.location.href,
          submittedAt: new Date().toISOString(),
        }),
      })
      if (!response.ok) throw new Error(`Consultation brief failed with status ${response.status}`)
      setStatus('submitted')
      form.reset()
    } catch (error) {
      console.error(error)
      setStatus('error')
      setMessage(`The brief could not be sent right now. Please try again, or email ${consult.email}.`)
    }
  }

  if (status === 'submitted') {
    return (
      <div className="v2-form v2-form-done" role="status">
        <CheckCircle2 size={34} aria-hidden="true" />
        <h3 className="v2-h3">Brief received.</h3>
        <p className="v2-body">Thanks. A systems architect will reply within one business day.</p>
        <button className="v2-link" type="button" onClick={() => setStatus('idle')}>
          Send another brief <ArrowRight size={15} />
        </button>
      </div>
    )
  }

  return (
    <form className="v2-form" onSubmit={handleSubmit}>
      <div className="v2-form-grid">
        <label className="v2-field">
          <span>Name <em aria-hidden="true">*</em></span>
          <input name="name" type="text" autoComplete="name" required placeholder="Your name" />
        </label>
        <label className="v2-field">
          <span>Work email <em aria-hidden="true">*</em></span>
          <input
            name="email"
            type="email"
            autoComplete="email"
            required
            pattern="^[^\s@]+@[^\s@]+\.[^\s@]{2,}$"
            title="Enter a valid email address, such as name@company.com."
            placeholder="you@company.com"
          />
        </label>
        <label className="v2-field">
          <span>Company</span>
          <input name="company" type="text" autoComplete="organization" placeholder="Company or organization" />
        </label>
        <Select name="workFocus" label="Work focus" options={fields.workFocus} />
        <Select name="companyStage" label="Company stage" options={fields.companyStage} />
        <Select name="urgency" label="Timeline" options={fields.urgency} defaultValue="This quarter" />
        <Select name="engagement" label="Preferred engagement" options={fields.engagement} />
        <Select name="budget" label="Budget range" options={fields.budget} />
        <label className="v2-field v2-field--full">
          <span>The workflow <em aria-hidden="true">*</em></span>
          <textarea
            name="challenge"
            required
            minLength={MIN_CHALLENGE}
            rows={5}
            placeholder="Describe the process, bottleneck, decision point, or system you want to improve."
          />
        </label>
        <label className="v2-form-hp" aria-hidden="true">
          Website
          <input name="website" type="text" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      <div className="v2-form-actions">
        <button className="v2-pill v2-pill--solid v2-pill--lg" type="submit" disabled={status === 'submitting'}>
          {status === 'submitting' ? 'Sending brief…' : 'Send consultation brief'}
          <ArrowRight size={18} aria-hidden="true" />
        </button>
        <small className="v2-form-note">We only use your details to reply to this brief.</small>
      </div>
      {status === 'error' && message ? (
        <p className="v2-form-feedback" role="alert">{message}</p>
      ) : null}
    </form>
  )
}
