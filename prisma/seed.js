import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

const password = await bcrypt.hash('DwelloDemo123!', 12)
const users = await Promise.all([
  prisma.user.upsert({ where: { email: 'user@dwello.ng' }, update: {}, create: { name: 'Demo User', email: 'user@dwello.ng', password, role: 'USER' } }),
  prisma.user.upsert({ where: { email: 'agent@dwello.ng' }, update: {}, create: { name: 'Demo Agent', email: 'agent@dwello.ng', password, role: 'AGENT' } }),
  prisma.user.upsert({ where: { email: 'admin@dwello.ng' }, update: {}, create: { name: 'Demo Admin', email: 'admin@dwello.ng', password, role: 'ADMIN' } }),
])
const agent = users[1]

await prisma.favorite.deleteMany()
await prisma.inquiry.deleteMany()
await prisma.propertyImage.deleteMany()
await prisma.property.deleteMany()

const properties = [
  { title: 'The Cedar Residence', description: 'A calm, contemporary family residence with generous entertaining spaces and thoughtful finishes.', price: 185000000, location: 'Old Ikoyi', city: 'Lagos', state: 'Lagos', propertyType: 'House', bedrooms: 4, bathrooms: 5, area: 420, image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=85', featured: true },
  { title: 'Marina View Apartment', description: 'An elegant apartment with expansive views, concierge service, and walkable access to the waterfront.', price: 95000000, location: 'Victoria Island', city: 'Lagos', state: 'Lagos', propertyType: 'Apartment', bedrooms: 3, bathrooms: 3, area: 210, image: 'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1200&q=85', featured: true },
  { title: 'The Palm House', description: 'A private Lekki home designed around light, privacy, and an easy indoor-outdoor lifestyle.', price: 320000000, location: 'Lekki Phase 1', city: 'Lagos', state: 'Lagos', propertyType: 'Duplex', bedrooms: 5, bathrooms: 6, area: 560, image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=85', featured: true },
  { title: 'Bodija Garden Court', description: 'A well-appointed apartment in a quiet Ibadan neighbourhood, close to schools and everyday amenities.', price: 28000000, location: 'Bodija', city: 'Ibadan', state: 'Oyo', propertyType: 'Apartment', bedrooms: 3, bathrooms: 3, area: 180, image: 'https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?auto=format&fit=crop&w=1200&q=85', featured: false },
  { title: 'Wuse II Corner Plot', description: 'A serviced parcel in a sought-after Abuja district, suitable for a private residence or investment.', price: 75000000, location: 'Wuse II', city: 'Abuja', state: 'FCT', propertyType: 'Land', bedrooms: null, bathrooms: null, area: 900, image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1200&q=85', featured: false },
]

for (const property of properties) {
  await prisma.property.create({ data: { ...property, ownerId: agent.id, images: { create: [{ url: property.image }] } } })
}

console.log('Seeded Dwello demo users and properties.')
await prisma.$disconnect()
