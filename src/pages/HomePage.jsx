import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import ArrowUpRight from '../components/ArrowUpRight'
import PropertyCard from '../components/PropertyCard'
import SiteHeader from '../components/SiteHeader'
import siteConfig from '../config/siteConfig'
import { api } from '../services/api'
import { useAuth } from '../context/AuthContext'

export default function HomePage() {
  const [filters, setFilters] = useState({
    location: '',
    type: '',
    minPrice: '',
    maxPrice: ''
  })

  const [properties, setProperties] = useState([])
  const [state, setState] = useState('loading')
  const [message, setMessage] = useState('')
  const { token, user } = useAuth()
  const [favoriteIds, setFavoriteIds] = useState([])

  const loadProperties = async (
    params = { featured: 'true', limit: 3 }
  ) => {
    setState('loading')

    try {
      const data = await api.getProperties(params)
      setProperties(data.properties)
      setState(data.properties.length ? 'ready' : 'empty')
    } catch (error) {
      setMessage(error.message)
      setState('error')
    }
  }

  useEffect(() => {
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

  const updateFilter = (event) => {
    setFilters({
      ...filters,
      [event.target.name]: event.target.value
    })
  }

  const submitSearch = (event) => {
    event.preventDefault()

    loadProperties({
      ...filters,
      featured: undefined,
      page: 1,
      limit: 6
    })
  }

  const toggleFavorite = async (id) => {
    if (!token) return

    const exists = favoriteIds.includes(id)

    try {
      if (exists) {
        await api.removeFavorite(id, token)

        setFavoriteIds(
          favoriteIds.filter(
            (favoriteId) => favoriteId !== id
          )
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
        <section className="hero" id="home">
          <div className="hero-copy">
            <p className="eyebrow">
              Live beautifully, live {siteConfig.name}
            </p>

            <h1>
              Find a place
              <br />
              <em>to call home.</em>
            </h1>

            <p className="hero-text">
              Thoughtfully selected homes and exceptional spaces
              for the way you want to live in Nigeria.
            </p>

            <div className="hero-actions">
              <Link
                className="button button-dark"
                to="/properties"
              >
                Explore Properties <ArrowUpRight />
              </Link>

              <a
                className="button button-light"
                href="#contact"
              >
                Contact Us
              </a>
            </div>
          </div>

          <div className="hero-visual">
            <img
              src="https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1600&q=90"
              alt="Modern sunlit living room"
            />

            <div className="hero-note">
              <span>01</span>
              <span>
                Curated homes
                <br />
                across Nigeria
              </span>
            </div>

            <div className="hero-stamp">
              {siteConfig.name.toUpperCase()}
              <br />
              <span>EST. 2014</span>
            </div>
          </div>
        </section>

        <form
          className="search-panel"
          aria-label="Property search"
          onSubmit={submitSearch}
        >
          <div className="search-heading">
            <span className="search-icon">⌕</span>

            <div>
              <p>Find your next address</p>
              <small>Search our collection</small>
            </div>
          </div>

          <label>
            Location
            <input
              name="location"
              value={filters.location}
              onChange={updateFilter}
              type="text"
              placeholder="Where do you want to live?"
            />
          </label>

          <label>
            Property Type
            <select
              name="type"
              value={filters.type}
              onChange={updateFilter}
            >
              <option value="">Select type</option>
              <option>Apartment</option>
              <option>House</option>
              <option>Duplex</option>
              <option>Land</option>
            </select>
          </label>

          <label>
            Min Price
            <input
              name="minPrice"
              value={filters.minPrice}
              onChange={updateFilter}
              type="number"
              min="0"
              placeholder="₦ Minimum"
            />
          </label>

          <label>
            Max Price
            <input
              name="maxPrice"
              value={filters.maxPrice}
              onChange={updateFilter}
              type="number"
              min="0"
              placeholder="₦ Maximum"
            />
          </label>

          <button
            className="search-button"
            type="submit"
          >
            Search <ArrowUpRight />
          </button>
        </form>

        <section
          className="properties-section"
          id="properties"
        >
          <div className="section-heading">
            <div>
              <p className="eyebrow">
                {filters.location || 'Our collection'}
              </p>

              <h2>
                {filters.location
                  ? 'Matching spaces.'
                  : 'Spaces with a story.'}
              </h2>
            </div>

            <Link
              className="text-link"
              to="/properties"
            >
              View all properties <ArrowUpRight />
            </Link>
          </div>

          {state === 'loading' && (
            <div className="page-state">
              Finding the right spaces...
            </div>
          )}

          {state === 'error' && (
            <div className="page-state error-state">
              {message}
            </div>
          )}

          {state === 'empty' && (
            <div className="page-state">
              No properties match those criteria.
            </div>
          )}

          {state === 'ready' && (
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
          )}
        </section>

        <section
          className="about-section"
          id="about"
        >
          <div className="about-image">
            <img
              src="https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1000&q=85"
              alt="Elegant contemporary interior"
            />

            <span className="vertical-label">
              THE {siteConfig.name.toUpperCase()} STANDARD
            </span>
          </div>

          <div className="about-copy">
            <p className="eyebrow">
              Why {siteConfig.name}
            </p>

            <h2>
              Property is personal.
              <br />
              <em>We make it feel easy.</em>
            </h2>

            <p>
              From the first viewing to the keys in your hand,
              {siteConfig.name} brings clarity, care, and local
              expertise to every move.
            </p>

            <div className="stats">
              <div>
                <strong>10+</strong>
                <span>
                  Years of
                  <br />
                  experience
                </span>
              </div>

              <div>
                <strong>2.4k</strong>
                <span>
                  Happy
                  <br />
                  homeowners
                </span>
              </div>

              <div>
                <strong>14</strong>
                <span>
                  Neighbourhoods
                  <br />
                  covered
                </span>
              </div>
            </div>

          <Link
  className="button button-dark"
  to="/about"
>
  Our story <ArrowUpRight />
</Link>
          </div>
        </section>

        <section
          className="cta-section"
          id="contact"
        >
          <p className="eyebrow">
            Your next chapter starts here
          </p>

          <h2>
            Let’s find your
            <br />
            <em>place in the world.</em>
          </h2>

       <a
  className="button button-accent"
  href={`https://mail.google.com/mail/?view=cm&fs=1&to=${siteConfig.contactEmail}`}
  target="_blank"
  rel="noopener noreferrer"
>
  Talk to {siteConfig.name} <ArrowUpRight />
</a>
        </section>
      </main>

      <footer className="site-footer">
        <Link
          className="brand"
          to="/"
        >
          <span className="brand-mark">
            {siteConfig.logo}
          </span>
          <span>{siteConfig.name}</span>
        </Link>

        <p>
          {siteConfig.tagline
            .split('. ')
            .map((line) => (
              <span key={line}>
                {line}.
                <br />
              </span>
            ))}
        </p>

        <div className="footer-links">
          <Link to="/properties">
            Properties
          </Link>

          <a href="/#about">
            About Us
          </a>

          <a href="/#contact">
            Contact
          </a>
        </div>

        <div className="footer-meta">
          <span>
            © 2026 {siteConfig.name}
          </span>

          <span>
            {siteConfig.address}
          </span>
        </div>
      </footer>
    </div>
  )
}