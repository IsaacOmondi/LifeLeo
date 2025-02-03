import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'journals'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')

      // Foreign key for user
      table.integer('user_id')
        .unsigned()
        .references('id')
        .inTable('users')
        .onDelete('CASCADE')
        .notNullable()

      // Mood enum (1=good, 2=neutral, 3=challenging)
      table.integer('mood').notNullable()
      
      // Note (to be encrypted)
      table.text('note').nullable()

      table.timestamp('created_at', { useTz: true})
      table.timestamp('updated_at', { useTz: true})
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}