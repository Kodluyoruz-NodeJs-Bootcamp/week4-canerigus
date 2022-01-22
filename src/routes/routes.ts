import * as controllers from "../controller/routes";
import { requireLogin, authenticateToken } from "../utils/middleware";
import { Router } from 'express';

const router = Router();

//home page
router.route('/')
  .get(controllers.renderHome)
//register routes
router.route('/register')
  .get(controllers.renderRegister)
  .post(controllers.register)
//login routes
router.route('/login')
  .get(controllers.renderLogin)
  .post(controllers.login)
//users route
router.route('/users')
  .get(requireLogin, authenticateToken, controllers.renderUsers)
//logout
router.route('/logout')
  .get(controllers.logout)

export default router;