import * as HooksController from '../controllers/hooks.controller';

/**
 * Attach hook routes to router
 * @param router
 * @returns void
 */
const hookRoutes = router => {
  router.get('/uninstall', (req, res) => res.redirect('/'));
  router.post('/uninstall', HooksController.uninstall);
};

export default hookRoutes;
