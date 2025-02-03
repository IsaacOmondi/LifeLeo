import type { HttpContext } from '@adonisjs/core/http'
import Journal from '#models/journal'
import { DateTime } from 'luxon'
import { createJournalValidator } from '#validators/journal_validator'
import logger from '@adonisjs/core/services/logger'


export default class JournalsController {
    // Create a new journal entry
  async store({ request, response, auth, session }: HttpContext) {
    try {
        const userId = auth.user!.id
    
        // Check daily limit
        const reachedLimit = await Journal.reachedDailyLimit(userId)
        if (reachedLimit) {
            session.flash('error', 'Daily journal limit reached (maximum 5 entries per day)')
            return response.redirect().back()
        //   return response.forbidden({ 
        //     message: 'Daily journal limit reached (maximum 5 entries per day)' 
        //   })
        }
    
        const body = request.all()
        const payload = await createJournalValidator.validate(body)

        logger.info('validated payload %s', payload)
    
        // Create journal entry
        const journal = await Journal.create({
          userId,
          ...payload
        })
    
        logger.info('Journal was created successfully', journal)
    
        // Flash success message
        // session.flash('success', 'Journal entry saved successfully!')

        // return response.created(journal) for api requests
        return response.created(journal)
    } catch (error) {
        console.error('Error saving journal:', error)
        
        // Handle errors appropriately
        if (request.accepts(['html', 'json']) === 'json') {
            return response.badRequest({
                message: 'Failed to save journal entry'
            })
        }

        session.flash('error', 'Failed to save journal entry')
        return response.redirect().back()
    }
    
  }

  // Get user's journal entries for today
  async index({ response, auth }: HttpContext) {
    const userId = auth.user!.id
    const today = DateTime.now().startOf('day')

    const journals = await Journal.query()
      .where('user_id', userId)
      .whereRaw('DATE(created_at) = ?', [today.toSQL()])
      .orderBy('created_at', 'desc')

    // Decrypt notes before sending response
    const decryptedJournals = journals.map(journal => ({
      ...journal.serialize(),
      note: journal.decryptNote()
    }))

    return response.ok(decryptedJournals)
  }
}