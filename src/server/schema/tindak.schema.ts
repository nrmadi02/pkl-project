import { date, object, string, TypeOf } from "zod";

export const createTindakSchema = object({
    type: string().min(1, "Pilih jenis tata tertib"),
    deskripsi: string().min(1, "Tambahkan deskripsi"),
    penindak: string().min(1, "Penindak harus diberikan"),
    siswaID: string().uuid("ID siswa harus diisi"),
    penanganan: string().min(1, "Penanganan harus diisi"),
    tindakan: string().min(1, "Tindakan harus diisi"),
    tanggal: string()
})

export const updateTindakSchema = object({
    type: string().min(1, "Pilih jenis tata tertib"),
    deskripsi: string().min(1, "Tambahkan deskripsi"),
    penindak: string().min(1, "Penindak harus diberikan"),
    id: string().uuid("ID harus diisi"),
    penanganan: string().min(1, "Penanganan harus diisi"),
    tindakan: string().min(1, "Tindakan harus diisi"),
    tanggal: string()
})

export type CreateTindakSchema = TypeOf<typeof createTindakSchema>
export type UpdateTindakSchema = TypeOf<typeof updateTindakSchema>