import { DateTime } from 'luxon'
import { BaseModel, column, beforeSave } from '@adonisjs/lucid/orm'
import encryption from '@adonisjs/core/services/encryption'

export enum MoodType {
  GOOD = 1,
  NEUTRAL = 2,
  CHALLENGING = 3,
}

export default class Journal extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare userId: number

  @column()
  declare mood: MoodType

  @column()
  declare note: string | null

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  // Encrypt note before saving
  @beforeSave()
  static async encryptNote(journal: Journal) {
    if (journal.$dirty.note) {
      journal.note = journal.note ? encryption.encrypt(journal.note) : null
    }
  }

  // Method to decrypt note when reading
  public decryptNote(): string | null {
    if (!this.note) return null
    return encryption.decrypt(this.note)
  }

  // Static method to check daily entry limit
  static async reachedDailyLimit(userId: number): Promise<boolean> {
    const today = DateTime.now().startOf('day')
    const count = await this.query()
      .where('user_id', userId)
      .whereRaw('DATE(created_at) = ?', [today.toSQL()])
      .count('* as total')

    return (count[0].$extras.total || 0) >= 5
  }
}