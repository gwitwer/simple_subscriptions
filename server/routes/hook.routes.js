import * as HooksController from '../controllers/hooks.controller';

/**
 * Attach hook routes to router
 * @param router
 * @returns void
 */
const hookRoutes = router => {
  router.get('/uninstall', HooksController.uninstall);
};

export default hookRoutes;
