import type { HttpContext } from '@adonisjs/core/http'
import Journal from '#models/journal'
import { DateTime } from 'luxon'
import { createJournalValidator } from '#validators/journal_validator'
import logger from '@adonisjs/core/services/logger'


export default class JournalsController {
    // Create a new journal entry
  async store({ request, response, auth }: HttpContext) {
    try {
        const userId = auth.user!.id
    
        // Check daily limit
        const reachedLimit = await Journal.reachedDailyLimit(userId)
        if (reachedLimit) {
            return response.tooManyRequests({
                message: 'Daily journal limit reached (maximum 5 entries per day)'
            })
        }
    
        const body = request.all()
        const payload = await createJournalValidator.validate(body)

        logger.info('validated payload %s', payload)
    
        // Create journal entry
        const journal = await Journal.create({
          userId,
          ...payload
        })
    
        logger.info('Journal was created successfully: %s', journal)
    

        return response.created({
            message: 'Journal entry saved successfully',
            data: journal
        })
    } catch (error) {
        logger.error('Error saving journal: %s', error.toJSON())
        return response.badRequest({
            message: 'Failed to save journal entry'
        })
    }
  }

  // Get user's journal entries for today
  async index({ auth, view }: HttpContext) {
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

    return view.render('pages/journals/index', { journals: decryptedJournals, mood: {
      1: {
          state: 'good',
          emoji: '😊',
      },
      2: {
          state: 'neutral',
          emoji: '😐',
      },
      3: {
          state: 'challenging',
          emoji: '😔',
      }
  }})
  }
}