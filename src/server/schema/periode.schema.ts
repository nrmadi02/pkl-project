import { object, string, TypeOf } from "zod";

export const createPeriodeSchema = object({
    periode: string().min(1, 'periode harus diisi')
})

export type CreatePeriodeSchema = TypeOf<typeof createPeriodeSchema>