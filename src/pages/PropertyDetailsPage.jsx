import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import ArrowUpRight from '../components/ArrowUpRight'
import SiteHeader from '../components/SiteHeader'
import { api } from '../services/api'
import { useAuth } from '../context/AuthContext'

export default function PropertyDetailsPage() {
  const { id } = useParams()
  const { token, user } = useAuth()
  const [property, setProperty] = useState(null)
  const [state, setState] = useState('loading')
  const [form, setForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: '',
    message: ''
  })
  const [message, setMessage] = useState('')

  useEffect(() => {
    api.getProperty(id)
      .then((data) => {
        setProperty(data.property)
        setState('ready')
      })
      .catch((error) => {
        setMessage(error.message)
        setState('error')
      })
  }, [id])

  const submitInquiry = async (event) => {
    event.preventDefault()

    try {
      await api.createInquiry(
        { ...form, propertyId: id },
        token
      )

      setMessage('Your inquiry has been sent. We will be in touch shortly.')
      setForm({ ...form, phone: '', message: '' })
    } catch (error) {
      setMessage(error.message)
    }
  }

  if (state === 'loading') {
    return <div className="page-state">Loading property...</div>
  }

  if (state === 'error') {
    return <div className="page-state error-state">{message}</div>
  }

  return (
    <div className="site-shell">
      <SiteHeader />

      <main className="details-page">
        <Link className="back-link" to="/">
          ← Back to properties
        </Link>

        <div className="details-layout">
          <div>
            <img
              className="details-image"
              src={property.image}
              alt={property.title}
            />

            <div className="details-gallery">
              {property.images?.map((image) => (
                <img
                  key={image.id}
                  src={image.url}
                  alt=""
                />
              ))}
            </div>
          </div>

          <div className="details-copy">
            <p className="eyebrow">
              {property.propertyType} · {property.status}
            </p>

            <h1>{property.title}</h1>

            <p className="details-location">
              {property.location}, {property.city}, {property.state}
            </p>

            <strong className="details-price">
              ₦{Number(property.price).toLocaleString()}
            </strong>

            <p className="details-description">
              {property.description}
            </p>

            <div className="details-specs">
              <span>
                <b>{property.bedrooms ?? '—'}</b> Bedrooms
              </span>

              <span>
                <b>{property.bathrooms ?? '—'}</b> Bathrooms
              </span>

              <span>
                <b>{property.area ?? '—'}</b> m²
              </span>
            </div>

            {/* Demo Agent is visible only to ADMIN users */}
            {user?.role === 'ADMIN' && (
              <div className="agent-box">
                <span className="brand-mark">
                  {property.owner?.name?.[0] || 'A'}
                </span>

                <div>
                  <b>{property.owner?.name}</b>
                  <small>Dwello agent</small>
                </div>
              </div>
            )}
          </div>
        </div>

        <section className="inquiry-section">
          <div>
            <p className="eyebrow">
              Interested in this property?
            </p>

            <h2>Start a conversation.</h2>

            <p>
              Tell us what you are looking for and the Dwello team
              will follow up.
            </p>
          </div>

          <form onSubmit={submitInquiry}>
            {message && (
              <p className="form-message">{message}</p>
            )}

            <input
              value={form.name}
              onChange={(event) =>
                setForm({
                  ...form,
                  name: event.target.value
                })
              }
              placeholder="Your name"
              required
            />

            <input
              type="email"
              value={form.email}
              onChange={(event) =>
                setForm({
                  ...form,
                  email: event.target.value
                })
              }
              placeholder="Email address"
              required
            />

            <input
              value={form.phone}
              onChange={(event) =>
                setForm({
                  ...form,
                  phone: event.target.value
                })
              }
              placeholder="Phone number"
            />

            <textarea
              value={form.message}
              onChange={(event) =>
                setForm({
                  ...form,
                  message: event.target.value
                })
              }
              placeholder="How can we help?"
              required
            />

            <button
              className="button button-dark"
              type="submit"
            >
              Send inquiry <ArrowUpRight />
            </button>
          </form>
        </section>
      </main>
    </div>
  )
}