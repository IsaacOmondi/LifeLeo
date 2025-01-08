/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import router from '@adonisjs/core/services/router'

router.on('/').render('pages/home')

router.get('/google/redirect', async ({ ally }) => {
    return ally.use('google').redirect()
})

router.get('/google/callback', async ({ ally }) => {
    const google = ally.use('google')

    if (google.accessDenied()) {
        return 'You have cancelled the login process'
    }

    /**
     * OAuth state verification failed. This happens when the CSRF cookie gets expired
     */
    if (google.stateMisMatch()) {
        return 'We are unable to verify the request. Please try again'
    }
    
    /**
     * GitHub responded with some error
     */
    if (google.hasError()) {
        return google.getError()
    }
  
    const user = google.user()
    return user
  })