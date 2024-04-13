import { Router } from 'express';
import { createProfile } from './use-cases/create-profile';
import { prismaClient } from '@/src/infra/database/prisma/client';
import { deleteProfile } from './use-cases/delete-profile';
import { updateProfile } from './use-cases/update-profile';
import { layout } from '@/src/infra/http/www/templates/layout';
import { profilesPage } from '@/src/infra/http/www/templates/pages/profiles';
import { header } from '@/src/infra/http/www/templates/header';
import { profilesTable } from '@/src/infra/http/www/templates/tables/profiles';
import { newProfilePage } from '@/src/infra/http/www/templates/pages/new-profile';
import { editProfilePage } from '@/src/infra/http/www/templates/pages/edit-profile';
import { userAuthenticated } from '../users/middlewares/user-authenticated';
import { profileSchema } from './zod-schemas';

export const profilesController = Router();

profilesController.post('/',
  userAuthenticated,
  async (req, res) => {
    const { name, categories } = profileSchema.pick({
      name: true,
      categories: true
    }).parse(req.body);

    await createProfile({ name, categories, userId: req.session.user!.id });

    if (req.query.firstProfile) {
      return res.setHeader('HX-Redirect', '/news').end();
    }

    const profiles = await prismaClient.profile.findMany({
      select: {
        id: true,
        name: true,
        categories: true
      },
      orderBy: { createdAt: 'asc' },
      where: { userId: req.session.user!.id }
    });

    return res.renderTemplate(
      profilesTable({ profiles })
    );
  });

profilesController.put('/',
  userAuthenticated,
  async (req, res) => {
    const data = profileSchema.parse(req.body);

    await updateProfile(data);

    const profiles = await prismaClient.profile.findMany({
      select: {
        id: true,
        name: true,
        categories: true
      },
      orderBy: { createdAt: 'asc' },
      where: { userId: req.session.user!.id }
    });

    return res.renderTemplate(
      profilesTable({ profiles })
    );
  });

profilesController.delete('/',
  userAuthenticated,
  async (req, res) => {
    const { id } = profileSchema.pick({ id: true }).parse(req.query);

    await deleteProfile(id);

    const profiles = await prismaClient.profile.findMany({
      select: {
        id: true,
        name: true,
        categories: true
      },
      orderBy: { createdAt: 'asc' },
      where: { userId: req.session.user!.id }
    });

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
        categories: true
      },
      orderBy: { createdAt: 'asc' },
      where: { userId: req.session.user!.id }
    });

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
        body: newProfilePage(
          Boolean(req.query.firstProfile)
        )
      })
    );
  });

profilesController.get('/edit',
  userAuthenticated,
  async (req, res) => {
    const { id } = profileSchema.pick({ id: true }).parse(req.query);

    const profile = await prismaClient.profile.findFirst({
      where: { id, userId: req.session.user!.id },
      select: {
        id: true,
        name: true,
        categories: true
      }
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
