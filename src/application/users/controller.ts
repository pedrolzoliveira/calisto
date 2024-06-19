import { Router } from 'express';
import { layout } from '@/src/infra/http/www/templates/layout';
import { signInPage } from '@/src/infra/http/www/templates/pages/sign-in';
import { signUpPage } from '@/src/infra/http/www/templates/pages/sign-up';
import { userUnauthenticated } from './middlewares/user-unauthenticated';
import { forgotPassword } from '@/src/infra/http/www/templates/pages/forgot-password';
import { sendPasswordRecoveryEmail } from './use-cases/send-password-recovery-email';
import { recoveryEmailSent } from '@/src/infra/http/www/templates/pages/recovery-email-sent';
import { passwordRecoveryPage } from '@/src/infra/http/www/templates/pages/password-recovery';
import { isTokenValid } from './use-cases/is-token-valid';
import { recoverPassword } from './use-cases/recover-password';
import { authRequestSchema, passwordRecoveryRequestSchema } from './zod-schemas';
import { logger } from '@/src/infra/logger';

export const usersController = Router();

usersController.get('/sign-in',
  userUnauthenticated,
  (req, res) => {
    return res.renderTemplate(
      layout({
        body: signInPage()
      })
    );
  });

usersController.get('/sign-up',
  userUnauthenticated,
  (req, res) => {
    return res.renderTemplate(
      layout({
        body: signUpPage()
      })
    );
  });

usersController.get('/sign-out',
  (req, res) => {
    req.session.destroy(() => {
      return res.redirect('/users/sign-in');
    });
  });

usersController.get('/forgot-password',
  (req, res) => {
    return res.renderTemplate(
      layout({
        body: forgotPassword()
      })
    );
  }
);

usersController.post('/forgot-password',
  async (req, res) => {
    try {
      const data = authRequestSchema.pick({
        email: true
      }).parse(req.body);
      await sendPasswordRecoveryEmail(data.email);
    } finally {
      // eslint-disable-next-line no-unsafe-finally
      return res.renderTemplate(
        layout({
          body: recoveryEmailSent()
        })
      );
    }
  }
);

usersController.get('/password-recovery/:token',
  async (req, res) => {
    try {
      const token = req.params.token;

      const tokenIsValid = await isTokenValid(token);

      if (!tokenIsValid) {
        return res.redirect('/users/forgot-password');
      }

      return res.renderTemplate(
        layout({
          body: passwordRecoveryPage(req.params.token)
        })
      );
    } catch (error) {
      logger.error(error);
      return res.redirect('/users/forgot-password');
    }
  }
);

usersController.post('/password-recovery',
  async (req, res) => {
    try {
      const data = passwordRecoveryRequestSchema.parse(req.body);
      await recoverPassword({ token: data.token, password: data.password });
    } finally {
      // eslint-disable-next-line no-unsafe-finally
      return res.redirect('/users/sign-in');
    }
  }
);
