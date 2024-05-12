import { Router } from 'express';
import { userAuthenticated } from './users/middlewares/user-authenticated';
import { newProfileForm } from './profiles/forms/new-profile';
import { editProfileForm } from './profiles/forms/edit-profile';

export const formController = Router();

formController.post(newProfileForm.route, userAuthenticated, newProfileForm.controller);
formController.put(editProfileForm.route, userAuthenticated, editProfileForm.controller);
