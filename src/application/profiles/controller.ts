import { Router } from 'express'
import { z } from 'zod'
import { CreateProfile } from './use-cases/create-profile'
import { prismaClient } from '@/src/infra/database/prisma/client'
import { deleteProfile } from './use-cases/delete-profile'
import { updateProfile } from './use-cases/update-profile'

export const profilesController = Router()

profilesController.post('/', async (req, res) => {
  const { name, categories } = z.object({
    name: z.string(),
    categories: z.string()
  }).parse(req.body)

  await CreateProfile({
    name,
    categories: categories.split(',').filter(Boolean)
  })

  const profiles = await prismaClient.profile.findMany({
    select: { id: true, name: true, categories: true },
    orderBy: { createdAt: 'asc' }
  })

  return res.render('tables/profiles', { profiles })
})

profilesController.put('/', async (req, res) => {
  const { id, name, categories } = z.object({
    id: z.string().uuid(),
    name: z.string(),
    categories: z.string()
  }).parse(req.body)

  await updateProfile({
    id,
    name,
    categories: categories.split('\n').filter(Boolean)
  })

  const profiles = await prismaClient.profile.findMany({
    select: { id: true, name: true, categories: true },
    orderBy: { createdAt: 'asc' }
  })

  return res.render('tables/profiles', { profiles })
})

profilesController.delete('/', async (req, res) => {
  const { id } = z.object({
    id: z.string().uuid()
  }).parse(req.query)

  await deleteProfile(id)

  const profiles = await prismaClient.profile.findMany({
    select: { id: true, name: true, categories: true },
    orderBy: { createdAt: 'asc' }
  })

  return res.render('tables/profiles', { profiles })
})

profilesController.get('/', async (req, res) => {
  const profiles = await prismaClient.profile.findMany({
    select: { id: true, name: true, categories: true },
    orderBy: { createdAt: 'asc' }
  })

  return res.render('pages/profiles', { profiles })
})

profilesController.get('/new', (req, res) => {
  return res.render('pages/profiles/new')
})

profilesController.get('/edit', async (req, res) => {
  const { id } = z.object({
    id: z.string().uuid()
  }).parse(req.query)

  const profile = await prismaClient.profile.findFirst({
    where: { id },
    select: { id: true, name: true, categories: true }
  })

  return res.render('pages/profiles/edit', { profile })
})
