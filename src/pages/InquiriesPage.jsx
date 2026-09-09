import { useEffect, useState } from 'react'
import { Link, Navigate } from 'react-router-dom'
import SiteHeader from '../components/SiteHeader'
import { api } from '../services/api'
import { useAuth } from '../context/AuthContext'

export default function InquiriesPage() {
  const { token, user } = useAuth()
  const [inquiries, setInquiries] = useState([])
  const [message, setMessage] = useState('')

  useEffect(() => {
    if (user?.role !== 'ADMIN') return

    api.getInquiries(token)
      .then((data) => setInquiries(data.inquiries || []))
      .catch((error) => setMessage(error.message))
  }, [token, user])

  if (user?.role !== 'ADMIN') {
    return <Navigate to="/dashboard" replace />
  }

  return (
    <div className="site-shell">
      <SiteHeader />

      <main className="dashboard-page">
        <div className="dashboard-head">
          <div>
            <p className="eyebrow">ADMIN workspace</p>
            <h1>All inquiries</h1>
          </div>

          <Link className="button button-dark" to="/dashboard">
            Back to dashboard
          </Link>
        </div>

        {message && <p className="form-message">{message}</p>}

        <section className="dashboard-panel">
          <div className="panel-heading">
            <h2>All inquiries ({inquiries.length})</h2>
          </div>

          <div className="managed-list">
            {inquiries.length === 0 ? (
              <p>No inquiries found.</p>
            ) : (
              inquiries.map((inquiry) => (
                <div className="inquiry-item" key={inquiry.id}>
                  <b>{inquiry.name}</b>

                  <small>
                    {inquiry.email}
                    {' · '}
                    {inquiry.property?.title || 'Property unavailable'}
                  </small>

                  <p>{inquiry.message}</p>

                  {inquiry.createdAt && (
                    <small>
                      {new Date(inquiry.createdAt).toLocaleString()}
                    </small>
                  )}
                </div>
              ))
            )}
          </div>
        </section>
      </main>
    </div>
  )
}