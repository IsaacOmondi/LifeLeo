/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import router from '@adonisjs/core/services/router'
const AuthController = () => import('#controllers/auth_controller')

export const middleware = router.named({
    auth: () => import('#middleware/auth_middleware')
})
  
router.on('/').render('pages/home')

router.get('/google/redirect', async ({ ally }) => {
    return ally.use('google').redirect()
})

router.get('/google/callback', [AuthController, 'callback'])

router.get('dashboard', async ({ auth }) => {
    if (auth.isAuthenticated) {
        const user = auth.getUserOrFail()
        return user
    }
}).use(middleware.auth())