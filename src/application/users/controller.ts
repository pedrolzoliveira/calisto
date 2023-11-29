import { Router } from 'express'
import { html } from '@lit-labs/ssr'
import { z } from 'zod'

import { layout } from '@/src/infra/http/www/templates/layout'
import { signInPage } from '@/src/infra/http/www/templates/pages/sign-in'
import { signUpPage } from '@/src/infra/http/www/templates/pages/sign-up'
import { signIn } from './use-cases/sign-in'
import { signUp } from './use-cases/sign-up'
import { userUnauthenticated } from './middlewares/user-unauthenticated'
import { emailAvailable } from './use-cases/email-available'
import { signUpForm } from '@/src/infra/http/www/templates/forms/sign-up'
import { signInForm } from '@/src/infra/http/www/templates/forms/sign-in'

export const usersController = Router()

usersController.get('/sign-in',
  userUnauthenticated,
  (req, res) => {
    return res.renderTemplate(
      layout({
        body: signInPage()
      })
    )
  })

usersController.post('/sign-in',
  userUnauthenticated,
  async (req, res) => {
    const data = z.object({
      email: z.string().email(),
      password: z.string()
    }).parse(req.body)

    try {
      req.session.user = await signIn(data)
      return res
        .setHeader('HX-Push-Url', '/news')
        .setHeader('HX-Redirect', '/news')
        .end()
    } catch (error) {
      const signInFormData = {
        email: {
          value: data.email
        },
        password: {
          value: data.password
        }
      }

      if (error instanceof Error && error.message === 'Email ou senha incorretos') {
        return res.renderTemplate(
          signInForm({
            ...signInFormData,
            error: error.message
          })
        )
      }

      return res.renderTemplate(
        signInForm({
          ...signInFormData,
          error: 'Erro desconhecido ao logar'
        })
      )
    }
  })

usersController.get('/sign-up',
  userUnauthenticated,
  (req, res) => {
    return res.renderTemplate(
      layout({
        body: signUpPage()
      })
    )
  })

usersController.post('/sign-up',
  userUnauthenticated,
  async (req, res) => {
    const data = z.object({
      email: z.string().email(),
      password: z.string()
    }).parse(req.body)

    try {
      req.session.user = await signUp(data)
      return res
        .setHeader('HX-Push-Url', '/news')
        .setHeader('HX-Redirect', '/news')
        .end()
    } catch (error) {
      const signUpFormData = {
        email: {
          value: data.email
        },
        password: {
          value: data.password
        },
        confirmPassword: {
          value: data.password
        }
      }
      if (error instanceof Error && error.message === 'Email já cadastrado') {
        return res.renderTemplate(
          signUpForm({
            ...signUpFormData,
            error: error.message,
            email: {
              ...signUpFormData.email,
              error: error.message
            }
          })
        )
      }

      return res.renderTemplate(
        signUpForm({
          ...signUpFormData,
          error: 'Erro desconhecido ao cadastrar'
        })
      )
    }
  })

usersController.post('/sign-up/email',
  async (req, res) => {
    const validation = z.string().email('Email invalido').safeParse(req.body.email)

    let error: string | undefined
    let email = String(req.body.email)

    if (validation.success) {
      email = validation.data
      const emailIsAvailable = await emailAvailable(email)

      if (!emailIsAvailable) {
        error = 'Email já cadastrado'
      }
    } else {
      error = validation.error.errors[0].message
    }

    return res.renderTemplate(signUpForm.email(email, error))
  })

usersController.get('/sign-out',
  (req, res) => {
    req.session.destroy(() => {
      return res.redirect('/users/sign-in')
    })
  })
