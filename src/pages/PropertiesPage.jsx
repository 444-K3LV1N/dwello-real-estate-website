import { useEffect, useState } from 'react'
import PropertyCard from '../components/PropertyCard'
import SiteHeader from '../components/SiteHeader'
import { api } from '../services/api'
import { useAuth } from '../context/AuthContext'

export default function PropertiesPage() {
  const [properties, setProperties] = useState([])
  const [state, setState] = useState('loading')
  const [message, setMessage] = useState('')
  const { token, user } = useAuth()
  const [favoriteIds, setFavoriteIds] = useState([])

  useEffect(() => {
    const loadProperties = async () => {
      try {
        const data = await api.getProperties({
          status: 'AVAILABLE',
          limit: 50
        })

        setProperties(data.properties)
        setState(data.properties.length ? 'ready' : 'empty')
      } catch (error) {
        setMessage(error.message)
        setState('error')
      }
    }

    loadProperties()
  }, [])

  useEffect(() => {
    if (token && user?.role === 'USER') {
      api
        .getFavorites(token)
        .then((data) =>
          setFavoriteIds(
            data.favorites.map(({ propertyId }) => propertyId)
          )
        )
        .catch(() => {})
    }
  }, [token, user])

  const toggleFavorite = async (id) => {
    if (!token) return

    const exists = favoriteIds.includes(id)

    try {
      if (exists) {
        await api.removeFavorite(id, token)

        setFavoriteIds(
          favoriteIds.filter((favoriteId) => favoriteId !== id)
        )
      } else {
        await api.addFavorite(id, token)

        setFavoriteIds([...favoriteIds, id])
      }
    } catch (error) {
      setMessage(error.message)
    }
  }

  return (
    <div className="site-shell">
      <SiteHeader />

      <main>
        <section className="properties-page">
          <div className="properties-page-heading">
            <p className="eyebrow">Our collection</p>

            <h1>
              Available spaces.
            </h1>

            <p>
              Explore all of our currently available properties,
              thoughtfully selected for the way you want to live.
            </p>
          </div>

          {state === 'loading' && (
            <div className="page-state">
              Finding available spaces...
            </div>
          )}

          {state === 'error' && (
            <div className="page-state error-state">
              {message}
            </div>
          )}

          {state === 'empty' && (
            <div className="page-state">
              There are currently no available properties.
            </div>
          )}

          {state === 'ready' && (
            <>
              <div className="properties-count">
                {properties.length}{' '}
                {properties.length === 1 ? 'property' : 'properties'} available
              </div>

              <div className="property-grid">
                {properties.map((property) => (
                  <PropertyCard
                    key={property.id}
                    property={property}
                    favoriteIds={favoriteIds}
                    onFavorite={
                      user?.role === 'USER'
                        ? toggleFavorite
                        : null
                    }
                  />
                ))}
              </div>
            </>
          )}
        </section>
      </main>
    </div>
  )
}