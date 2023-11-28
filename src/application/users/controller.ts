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
      return res.redirect('/news')
    } catch (error) {
      return res.renderTemplate(
        html`
        <div>Error ao se logar</div>
      `
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
      return res.redirect('/news')
    } catch (error) {
      return res.renderTemplate(
        html`
        <div>Error ao se cadastrar</div>
      `
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
