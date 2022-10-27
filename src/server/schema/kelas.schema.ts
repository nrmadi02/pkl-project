import { object, string, TypeOf } from "zod";

export const createKelasSchema = object({
    name: string().min(1, 'Nama kelas harus diisi')
})

export type CreateKelasSchema = TypeOf<typeof createKelasSchema>