import { z } from 'zod'
import prisma from '../utils/prisma.js'

export const inquirySchema = z.object({
  name: z.string().trim().min(2).max(80),
  email: z.string().trim().email(),
  phone: z.string().trim().max(30).optional(),
  message: z.string().trim().min(10).max(2000),
  propertyId: z.string().min(1)
})

export async function createInquiry(req, res, next) {
  try {
    const property = await prisma.property.findUnique({
      where: { id: req.body.propertyId }
    })

    if (!property) {
      return res.status(404).json({
        message: 'Property not found.'
      })
    }

    const inquiry = await prisma.inquiry.create({
      data: {
        ...req.body,
        userId: req.user.id
      }
    })

    res.status(201).json({ inquiry })
  } catch (error) {
    next(error)
  }
}

export async function listInquiries(req, res, next) {
  try {
    let where

    if (req.user.role === 'ADMIN') {
      where = {}
    } else if (req.user.role === 'AGENT') {
      where = {
        property: {
          ownerId: req.user.id
        }
      }
    } else {
      where = {
        userId: req.user.id
      }
    }

    const inquiries = await prisma.inquiry.findMany({
      where,
      include: {
        property: {
          select: {
            id: true,
            title: true,
            ownerId: true
          }
        },
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    res.json({ inquiries })
  } catch (error) {
    next(error)
  }
}

export async function getInquiry(req, res, next) {
  try {
    const inquiry = await prisma.inquiry.findUnique({
      where: {
        id: req.params.id
      },
      include: {
        property: true,
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    })

    if (!inquiry) {
      return res.status(404).json({
        message: 'Inquiry not found.'
      })
    }

    const canAccess =
      req.user.role === 'ADMIN' ||
      inquiry.property.ownerId === req.user.id ||
      inquiry.userId === req.user.id

    if (!canAccess) {
      return res.status(403).json({
        message: 'You do not have access to this inquiry.'
      })
    }

    res.json({ inquiry })
  } catch (error) {
    next(error)
  }
}