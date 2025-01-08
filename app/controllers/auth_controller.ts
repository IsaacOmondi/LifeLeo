import type { HttpContext } from '@adonisjs/core/http'
import User from '#models/user'

export default class AuthController {

    async callback({ ally, auth, response }: HttpContext) {
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
         * Google responded with some error
         */
        if (google.hasError()) {
            return google.getError()
        }

        const googleUser = await google.user()

        if (!googleUser) {
            return 'We encountered a problem verifying the user from Google Sign In'
        }

        if (googleUser.emailVerificationState === 'unverified') {
            return 'We are unable to verify the request. Please try again'
        }

        const userPayload = {
            full_name: googleUser.name,
            email: googleUser.email,
            avatar_url: googleUser.avatarUrl,
        }

        const user = await User.updateOrCreate({email: googleUser.email }, userPayload)

        await auth.use('web').login(user)

        response.redirect('/dashboard')
    }
}