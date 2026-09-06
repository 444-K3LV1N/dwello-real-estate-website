import { Link } from 'react-router-dom'
import ArrowUpRight from './ArrowUpRight'

export default function PropertyCard({ property, favoriteIds = [], onFavorite }) {
  const isFavorite = favoriteIds.includes(property.id)
  return <article className="property-card"><div className="property-image"><img src={property.image} alt={property.title} /><span>{property.featured ? 'Featured' : property.status.replace('_', ' ')}</span>{onFavorite && <button aria-label={`${isFavorite ? 'Remove' : 'Save'} ${property.title}`} type="button" onClick={() => onFavorite(property.id)}>{isFavorite ? '♥' : '♡'}</button>}</div><div className="property-details"><div><h3>{property.title}</h3><p>{property.location}, {property.city}</p></div><strong>₦{Number(property.price).toLocaleString()}</strong></div><Link className="card-link" to={`/properties/${property.id}`}>View property <ArrowUpRight /></Link></article>
}
