export function serializeProperty(property) {
  if (!property) return property
  return { ...property, price: Number(property.price), area: property.area === null ? null : Number(property.area) }
}

export function serializeUser(user) {
  if (!user) return user
  const safeUser = { ...user }
  delete safeUser.password
  return safeUser
}
