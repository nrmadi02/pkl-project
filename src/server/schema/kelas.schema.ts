import { object, string, TypeOf } from "zod";

export const createKelasSchema = object({
    name: string().min(1, 'Nama kelas harus diisi')
})

export const updateKelasSchema = object({
    id: string().min(1, 'Id harus diisi'),
    name: string().min(1, 'Nama kelas harus diisi')
})

export type CreateKelasSchema = TypeOf<typeof createKelasSchema>
export type UpdateKelasSchema = TypeOf<typeof updateKelasSchema>