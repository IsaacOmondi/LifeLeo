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
const JournalsController = () => import('#controllers/journals_controller')

export const middleware = router.named({
    auth: () => import('#middleware/auth_middleware')
})
  
router.on('/').render('pages/home')

router.get('/google/redirect', async ({ ally }) => {
    return ally.use('google').redirect()
})

router.get('/google/callback', [AuthController, 'callback'])


router.group(() => {
    router.get('/journals/create', async ({ view }) => {
        return view.render('pages/journals/create')
    }).as('journals.create')
    
    router.post('/journals', [JournalsController, 'store']).as('journals.store')
    router.get('/journals', [JournalsController, 'index'])
}).use(middleware.auth())

router.get('/dashboard', async ({ auth }) => {
    if (auth.isAuthenticated) {
        const user = auth.getUserOrFail()
        return user
    }
}).use(middleware.auth())