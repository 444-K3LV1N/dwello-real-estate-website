import { z } from 'zod'
import prisma from '../utils/prisma.js'
import { serializeProperty } from '../utils/serialize.js'

const numeric = z.coerce.number().nonnegative().optional()

export const propertySchema = z.object({
  title: z.string().trim().min(3).max(150),
  description: z.string().trim().min(10).max(5000),
  price: z.coerce.number().positive(),
  location: z.string().trim().min(2).max(120),
  city: z.string().trim().min(2).max(80),
  state: z.string().trim().min(2).max(80),
  propertyType: z.string().trim().min(2).max(50),
  bedrooms: numeric,
  bathrooms: numeric,
  area: numeric,
  image: z.string().url(),
  images: z.array(z.string().url()).optional(),
  status: z.enum(['AVAILABLE', 'SOLD', 'RENTED', 'DRAFT']).default('AVAILABLE'),
  featured: z.boolean().default(false)
})

const include = {
  owner: {
    select: {
      id: true,
      name: true,
      email: true
    }
  },
  images: true
}

function serialize(property) {
  return serializeProperty(property)
}

function propertyData(body, includeImages = true) {
  const { images = [], ...data } = body

  if (!includeImages) {
    return data
  }

  return {
    ...data,
    images: {
      create: [
        body.image,
        ...images.filter((url) => url !== body.image)
      ].map((url) => ({
        url
      }))
    }
  }
}

function filtersFromQuery(query) {
  const {
    location,
    city,
    state,
    type,
    minPrice,
    maxPrice,
    bedrooms,
    bathrooms,
    featured,
    status
  } = query

  const price = {}

  if (minPrice) {
    price.gte = Number(minPrice)
  }

  if (maxPrice) {
    price.lte = Number(maxPrice)
  }

  const validStatuses = [
    'AVAILABLE',
    'SOLD',
    'RENTED',
    'DRAFT'
  ]

  const selectedStatus = validStatuses.includes(status)
    ? status
    : 'AVAILABLE'

  return {
    status: selectedStatus,

    ...(location && {
      OR: [
        {
          location: {
            contains: location,
            mode: 'insensitive'
          }
        },
        {
          city: {
            contains: location,
            mode: 'insensitive'
          }
        },
        {
          state: {
            contains: location,
            mode: 'insensitive'
          }
        }
      ]
    }),

    ...(city && {
      city: {
        equals: city,
        mode: 'insensitive'
      }
    }),

    ...(state && {
      state: {
        equals: state,
        mode: 'insensitive'
      }
    }),

    ...(type && {
      propertyType: {
        equals: type,
        mode: 'insensitive'
      }
    }),

    ...(Object.keys(price).length > 0 && {
      price
    }),

    ...(bedrooms && {
      bedrooms: {
        gte: Number(bedrooms)
      }
    }),

    ...(bathrooms && {
      bathrooms: {
        gte: Number(bathrooms)
      }
    }),

    ...(featured === 'true' && {
      featured: true
    })
  }
}

export async function listProperties(req, res, next) {
  try {
    const page = Math.max(
      Number(req.query.page) || 1,
      1
    )

    const limit = Math.min(
      Math.max(Number(req.query.limit) || 9, 1),
      50
    )

    const where = filtersFromQuery(req.query)

    const [properties, total] = await Promise.all([
      prisma.property.findMany({
        where,
        include,
        orderBy: [
          {
            featured: 'desc'
          },
          {
            createdAt: 'desc'
          }
        ],
        skip: (page - 1) * limit,
        take: limit
      }),

      prisma.property.count({
        where
      })
    ])

    res.json({
      properties: properties.map(serialize),
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    })
  } catch (error) {
    next(error)
  }
}

export async function getProperty(req, res, next) {
  try {
    const property = await prisma.property.findUnique({
      where: {
        id: req.params.id
      },
      include
    })

    if (!property) {
      return res.status(404).json({
        message: 'Property not found.'
      })
    }

    res.json({
      property: serialize(property)
    })
  } catch (error) {
    next(error)
  }
}

export async function createProperty(req, res, next) {
  try {
    const property = await prisma.property.create({
      data: {
        ...propertyData(req.body),
        ownerId: req.user.id
      },
      include
    })

    res.status(201).json({
      property: serialize(property)
    })
  } catch (error) {
    next(error)
  }
}

export async function updateProperty(req, res, next) {
  try {
    const current = await prisma.property.findUnique({
      where: {
        id: req.params.id
      }
    })

    if (!current) {
      return res.status(404).json({
        message: 'Property not found.'
      })
    }

    if (
      req.user.role !== 'ADMIN' &&
      current.ownerId !== req.user.id
    ) {
      return res.status(403).json({
        message: 'You can only manage your own properties.'
      })
    }

    const { images = [], ...data } = req.body

    const property = await prisma.property.update({
      where: {
        id: req.params.id
      },

      data: {
        ...data,

        ...(images.length > 0 && {
          images: {
            deleteMany: {},

            create: [
              req.body.image,
              ...images.filter(
                (url) => url !== req.body.image
              )
            ].map((url) => ({
              url
            }))
          }
        })
      },

      include
    })

    res.json({
      property: serialize(property)
    })
  } catch (error) {
    next(error)
  }
}

export async function deleteProperty(req, res, next) {
  try {
    const current = await prisma.property.findUnique({
      where: {
        id: req.params.id
      }
    })

    if (!current) {
      return res.status(404).json({
        message: 'Property not found.'
      })
    }

    if (
      req.user.role !== 'ADMIN' &&
      current.ownerId !== req.user.id
    ) {
      return res.status(403).json({
        message: 'You can only manage your own properties.'
      })
    }

    await prisma.property.delete({
      where: {
        id: req.params.id
      }
    })

    res.status(204).end()
  } catch (error) {
    next(error)
  }
}