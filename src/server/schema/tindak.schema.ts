import { number, object, string, TypeOf } from "zod";

export const createTindakSchema = object({
    type: string().min(1, "Pilih jenis tata tertib"),
    deskripsi: string().min(1, "Tambahkan deskripsi"),
    penindak: string().min(1, "Penindak harus diberikan"),
    siswaID: string().uuid("ID siswa harus diisi")
})

export const updateTindakSchema = object({
    type: string().min(1, "Pilih jenis tata tertib"),
    deskripsi: string().min(1, "Tambahkan deskripsi"),
    penindak: string().min(1, "Penindak harus diberikan"),
    id: string().uuid("ID harus diisi")
})

export type CreateTindakSchema = TypeOf<typeof createTindakSchema>
export type UpdateTindakSchema = TypeOf<typeof updateTindakSchema>