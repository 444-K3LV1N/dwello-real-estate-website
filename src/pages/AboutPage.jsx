import { Link } from 'react-router-dom'
import ArrowUpRight from '../components/ArrowUpRight'
import SiteHeader from '../components/SiteHeader'
import siteConfig from '../config/siteConfig'

export default function AboutPage() {
  return (
    <div className="site-shell">
      <SiteHeader />

      <main className="about-page">
        <section className="about-page-hero">
          <div>
            <p className="eyebrow">About {siteConfig.name}</p>

            <h1>
              Property is personal.
              <br />
              <em>We make it feel easy.</em>
            </h1>

            <p>
              {siteConfig.name} helps people find exceptional homes
              and make confident property decisions across Nigeria.
            </p>
          </div>

          <div className="about-page-image">
            <img
              src="https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1200&q=85"
              alt="Elegant contemporary interior"
            />
          </div>
        </section>

        <section className="about-story">
          <div>
            <p className="eyebrow">Our story</p>
            <h2>
              A better way to
              <br />
              <em>find home.</em>
            </h2>
          </div>

          <div className="about-story-copy">
            <p>
              At {siteConfig.name}, we believe finding a property
              should feel exciting, not overwhelming.
            </p>

            <p>
              From the first search to the final handover, we bring
              clarity, care, and local expertise to every step of
              the journey.
            </p>

            <p>
              Our collection brings together thoughtfully selected
              homes and exceptional spaces for people who want to
              live well.
            </p>
          </div>
        </section>

        <section className="about-values">
          <div>
            <strong>10+</strong>
            <span>Years of experience</span>
          </div>

          <div>
            <strong>2.4k</strong>
            <span>Happy homeowners</span>
          </div>

          <div>
            <strong>14</strong>
            <span>Neighbourhoods covered</span>
          </div>
        </section>

        <section className="about-page-cta">
          <p className="eyebrow">Ready when you are</p>

          <h2>
            Let's find your
            <br />
            <em>place in the world.</em>
          </h2>

          <div className="about-page-actions">
            <Link
              className="button button-dark"
              to="/properties"
            >
              Explore Properties <ArrowUpRight />
            </Link>

            <a
              className="button button-light"
              href={`mailto:${siteConfig.contactEmail}`}
            >
              Talk to {siteConfig.name} <ArrowUpRight />
            </a>
          </div>
        </section>
      </main>
    </div>
  )
}