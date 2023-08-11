import { Router } from 'express'
import { z } from 'zod'
import { CreateProfile } from './use-cases/create-profile'
import { prismaClient } from '@/prisma/client'
import { deleteProfile } from './use-cases/delete-profile'
import { updateProfile } from './use-cases/update-profile'

export const profilesController = Router()

profilesController.post('/', async (req, res) => {
  const data = z.object({
    name: z.string(),
    categories: z.string().array()
  }).parse(req.body)

  const profile = await CreateProfile(data)

  return res.status(201).send(profile)
})

profilesController.put('/', async (req, res) => {
  const data = z.object({
    id: z.string().uuid(),
    name: z.string(),
    categories: z.string().array()
  }).parse(req.body)

  const profile = await updateProfile(data)

  return res.status(200).send(profile)
})

profilesController.delete('/', async (req, res) => {
  const { id } = z.object({
    id: z.string().uuid()
  }).parse(req.query)

  await deleteProfile(id)

  return res.sendStatus(200)
})

profilesController.get('/', async (req, res) => {
  const profiles = await prismaClient.profile.findMany({
    select: { id: true, name: true, categories: true },
    orderBy: { createdAt: 'asc' }
  })

  return res.status(200).send({
    count: profiles.length,
    profiles
  })
})
