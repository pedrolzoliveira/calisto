import { Router } from 'express';
import { z } from 'zod';
import { createProfile } from './use-cases/create-profile';
import { prismaClient } from '@/src/infra/database/prisma/client';
import { deleteProfile } from './use-cases/delete-profile';
import { updateProfile } from './use-cases/update-profile';
import { sanitizeWhiteSpace } from '@/src/utils/sanitize-white-space';
import { layout } from '@/src/infra/http/www/templates/layout';
import { profilesPage } from '@/src/infra/http/www/templates/pages/profiles';
import { header } from '@/src/infra/http/www/templates/header';
import { profilesTable } from '@/src/infra/http/www/templates/tables/profiles';
import { newProfilePage } from '@/src/infra/http/www/templates/pages/new-profile';
import { editProfilePage } from '@/src/infra/http/www/templates/pages/edit-profile';
import { userAuthenticated } from '../users/middlewares/user-authenticated';

export const profilesController = Router();

profilesController.post('/',
  userAuthenticated,
  async (req, res) => {
    const { name, categories } = z.object({
      name: z.string().trim(),
      categories: z.string().array().transform(value => value.map(sanitizeWhiteSpace))
    }).parse(req.body);

    await createProfile({ name, categories, userId: req.session.user!.id });

    const profiles = await prismaClient.profile.findMany({
      select: {
        id: true,
        name: true,
        categories: {
          select: { category: true }
        }
      },
      orderBy: { createdAt: 'asc' },
      where: { userId: req.session.user!.id }
    }).then(profiles =>
      profiles.map(profile => ({
        ...profile,
        categories: profile.categories.map(({ category }) => category)
      }))
    );

    return res.renderTemplate(
      profilesTable({ profiles })
    );
  });

profilesController.put('/',
  userAuthenticated,
  async (req, res) => {
    const data = z.object({
      id: z.string().uuid(),
      name: z.string(),
      categories: z.string().array()
    }).parse(req.body);

    await updateProfile(data);

    const profiles = await prismaClient.profile.findMany({
      select: {
        id: true,
        name: true,
        categories: {
          select: { category: true }
        }
      },
      orderBy: { createdAt: 'asc' },
      where: { userId: req.session.user!.id }
    }).then(profiles =>
      profiles.map(profile => ({
        ...profile,
        categories: profile.categories.map(({ category }) => category)
      }))
    );

    return res.renderTemplate(
      profilesTable({ profiles })
    );
  });

profilesController.delete('/',
  userAuthenticated,
  async (req, res) => {
    const { id } = z.object({
      id: z.string().uuid()
    }).parse(req.query);

    await deleteProfile(id);

    const profiles = await prismaClient.profile.findMany({
      select: {
        id: true,
        name: true,
        categories: {
          select: { category: true }
        }
      },
      orderBy: { createdAt: 'asc' },
      where: { userId: req.session.user!.id }
    }).then(
      profiles => profiles.map(profile => ({
        ...profile,
        categories: profile.categories.map(({ category }) => category)
      }))
    );

    return res.renderTemplate(
      profilesTable({ profiles })
    );
  });

profilesController.get('/',
  userAuthenticated,
  async (req, res) => {
    const profiles = await prismaClient.profile.findMany({
      select: {
        id: true,
        name: true,
        categories: {
          select: { category: true }
        }
      },
      orderBy: { createdAt: 'asc' },
      where: { userId: req.session.user!.id }
    }).then(profiles =>
      profiles.map(profile => ({
        ...profile,
        categories: profile.categories.map(({ category }) => category)
      }))
    );

    return res.renderTemplate(
      layout({
        header: header(),
        body: profilesPage({ profiles })
      })
    );
  });

profilesController.get('/new',
  userAuthenticated,
  (req, res) => {
    return res.renderTemplate(
      layout({
        header: header(),
        body: newProfilePage()
      })
    );
  });

profilesController.get('/edit',
  userAuthenticated,
  async (req, res) => {
    const { id } = z.object({
      id: z.string().uuid()
    }).parse(req.query);

    const profile = await prismaClient.profile.findFirst({
      where: { id, userId: req.session.user!.id },
      select: {
        id: true,
        name: true,
        categories: {
          select: {
            category: true
          }
        }
      }
    }).then(profile => {
      if (!profile) {
        return null;
      }

      return {
        ...profile,
        categories: profile.categories.map(({ category }) => category)
      };
    });

    if (!profile) {
    // TODO: handle this case
      return res.send('profile not found');
    }

    return res.renderTemplate(
      layout({
        header: header(),
        body: editProfilePage({ profile })
      })
    );
  });
