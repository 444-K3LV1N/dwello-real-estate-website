import { Link } from 'react-router-dom'
import siteConfig from '../config/siteConfig'
import ArrowUpRight from './ArrowUpRight'
import { useAuth } from '../context/AuthContext'

export default function SiteHeader() {
  const { user, logout } = useAuth()

  return (
    <header className="site-header">
      <Link
        className="brand"
        to="/"
        aria-label={`${siteConfig.name} home`}
      >
        <span className="brand-mark">{siteConfig.logo}</span>
        <span>{siteConfig.name}</span>
      </Link>

      <nav className="main-nav" aria-label="Main navigation">
        <Link to="/">Home</Link>

        <Link to="/properties">
          Properties
        </Link>

        <Link to="/about">
          About Us
        </Link>

        <a href="/#contact">
          Contact
        </a>

        {user && (
          <Link
            to={
              user.role === 'USER'
                ? '/favorites'
                : '/dashboard'
            }
          >
            {user.role === 'USER'
              ? 'Favorites'
              : 'Dashboard'}
          </Link>
        )}
      </nav>

      {user ? (
        <button
          className="header-cta"
          type="button"
          onClick={logout}
        >
          Sign out
        </button>
      ) : (
        <Link
          className="header-cta"
          to="/login"
        >
          Find a Property <ArrowUpRight />
        </Link>
      )}
    </header>
  )
}