import { Router } from 'express'
import { z } from 'zod'
import { CreateProfile } from './use-cases/create-profile'
import { prismaClient } from '@/src/infra/database/prisma/client'
import { deleteProfile } from './use-cases/delete-profile'
import { updateProfile } from './use-cases/update-profile'
import { sanitizeWhiteSpace } from '@/src/utils/sanitize-white-space'

const formatProfile = (
  profile: { id: string, name: string, categories: Array<{ category: string }> }

) => ({ ...profile, categories: profile.categories.map(({ category }) => category) })

export const profilesController = Router()

profilesController.post('/', async (req, res) => {
  const { name, categories } = z.object({
    name: z.string().trim(),
    categories: z.string().array().transform(value => value.map(sanitizeWhiteSpace))
  }).parse(req.body)

  await CreateProfile({ name, categories })

  const profiles = await prismaClient.profile.findMany({
    select: { id: true, name: true, categories: true },
    orderBy: { createdAt: 'asc' }
  })

  return res.render('partials/tables/profiles', { profiles, layout: false })
})

profilesController.put('/', async (req, res) => {
  const data = z.object({
    id: z.string().uuid(),
    name: z.string(),
    categories: z.string().array()
  }).parse(req.body)

  await updateProfile(data)

  const profiles = await prismaClient.profile.findMany({
    select: { id: true, name: true, categories: true },
    orderBy: { createdAt: 'asc' }
  })

  return res.render('partials/tables/profiles', { profiles, layout: false })
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

  return res.render('partials/tables/profiles', { profiles, layout: false })
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
    select: {
      id: true,
      name: true,
      categories: {
        select: {
          category: true
        }
      }
    }
  })

  if (!profile) {
    // TODO: handle this case
    return res.send('profile not found')
  }

  return res.render('pages/profiles/edit', { profile: formatProfile(profile) })
})
