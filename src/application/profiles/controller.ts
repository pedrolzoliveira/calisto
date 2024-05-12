import { Router } from 'express';
import { prismaClient } from '@/src/infra/database/prisma/client';
import { deleteProfile } from './use-cases/delete-profile';
import { layout } from '@/src/infra/http/www/templates/layout';
import { profilesPage } from '@/src/infra/http/www/templates/pages/profiles';
import { header } from '@/src/infra/http/www/templates/header';
import { profilesTable } from '@/src/infra/http/www/templates/tables/profiles';
import { newProfilePage } from '@/src/infra/http/www/templates/pages/new-profile';
import { editProfilePage } from '@/src/infra/http/www/templates/pages/edit-profile';
import { userAuthenticated } from '../users/middlewares/user-authenticated';
import { profileSchema } from './zod-schemas';

export const profilesController = Router();

profilesController.delete('/',
  userAuthenticated,
  async (req, res) => {
    const { id } = profileSchema.pick({ id: true }).parse(req.body);

    const belongsToUser = Boolean(
      await prismaClient.profile.findFirst({
        select: { id: true },
        where: { id, userId: req.session.user!.id }
      })
    );

    if (belongsToUser) {
      await deleteProfile(id);
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
        body: newProfilePage()
      })
    );
  });

profilesController.get('/edit',
  userAuthenticated,
  async (req, res) => {
    try {
      const { id } = profileSchema.pick({ id: true }).parse(req.query);

      const profile = await prismaClient.profile.findFirstOrThrow({
        where: { id, userId: req.session.user!.id },
        select: {
          id: true,
          name: true,
          categories: true
        }
      });

      return res.renderTemplate(
        layout({
          header: header(),
          body: editProfilePage({ profile })
        })
      );
    } catch {
      const redirectUrl = '/profiles';
      return req.headers['hx-request']
        ? res.setHeader('HX-Redirect', redirectUrl).end()
        : res.redirect(redirectUrl);
    }
  });
