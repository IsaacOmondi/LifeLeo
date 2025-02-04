import vine from '@vinejs/vine'

export const createJournalValidator = vine.compile(
    vine.object({
        mood: vine.number().in([1,2,3]),
        note: vine.string().optional(),
    })
)