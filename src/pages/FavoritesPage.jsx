import { useEffect, useState } from 'react'
import SiteHeader from '../components/SiteHeader'
import PropertyCard from '../components/PropertyCard'
import { api } from '../services/api'
import { useAuth } from '../context/AuthContext'

export default function FavoritesPage() { const { token } = useAuth(); const [favorites, setFavorites] = useState([]); useEffect(() => { api.getFavorites(token).then((data) => setFavorites(data.favorites)) }, [token]); const remove = async (id) => { await api.removeFavorite(id, token); setFavorites(favorites.filter(({ propertyId }) => propertyId !== id)) }; return <div className="site-shell"><SiteHeader /><main className="simple-page"><p className="eyebrow">Your collection</p><h1>Saved properties.</h1>{favorites.length ? <div className="property-grid">{favorites.map(({ property }) => <PropertyCard key={property.id} property={property} favoriteIds={[property.id]} onFavorite={remove} />)}</div> : <div className="page-state">You have not saved any properties yet.</div>}</main></div> }
