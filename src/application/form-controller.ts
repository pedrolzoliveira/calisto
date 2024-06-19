import { Router } from 'express';
import { userAuthenticated } from './users/middlewares/user-authenticated';
import { newProfileForm } from './profiles/forms/new-profile';
import { editProfileForm } from './profiles/forms/edit-profile';
import { signInForm } from './users/forms/sign-in';
import { signUpForm } from './users/forms/sign-up';
import { userUnauthenticated } from './users/middlewares/user-unauthenticated';

export const formController = Router();

formController.post(newProfileForm.route, userAuthenticated, newProfileForm.controller);
formController.put(editProfileForm.route, userAuthenticated, editProfileForm.controller);
formController.post(signInForm.route, userUnauthenticated, signInForm.controller);
formController.post(signUpForm.route, userUnauthenticated, signUpForm.controller);
