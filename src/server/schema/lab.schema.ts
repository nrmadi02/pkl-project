import { object, string, TypeOf } from "zod";

export const createPengajuanLabSchema = object({
    type: string().min(1, 'Type harus diisi'),
    deskripsi: string().min(1, 'Deskripsi harus diisi'),
    start_jam: string().min(1, 'Jam Awal harus diisi'),
    end_jam: string().min(1, 'Jam Akhir harus diisi'),
    status: string().min(1, 'Status harus diisi'),
    tanggal: string().min(1, 'Tanggal harus diisi'),
    guruID: string().min(1, 'Id harus diisi'),
})

export const updatePengajuanLabSchema = object({
    id: string().min(1, 'ID harus diisi'),
    type: string().min(1, 'Type harus diisi'),
    deskripsi: string().min(1, 'Deskripsi harus diisi'),
    start_jam: string().min(1, 'Jam Awal harus diisi'),
    end_jam: string().min(1, 'Jam Akhir harus diisi'),
    status: string().min(1, 'Status harus diisi'),
    tanggal: string().min(1, 'Tanggal harus diisi'),
    guruID: string().min(1, 'ID Guru harus diisi'),
})

export const updateStatusPengajuanSchema = object({
    id: string().min(1, 'Id harus diisi'),
    status: string().min(1, 'Status harus diisi'),
})

export type CreatePengajuanLabSchema = TypeOf<typeof createPengajuanLabSchema>
export type UpdatePengajuanLabSchema = TypeOf<typeof updatePengajuanLabSchema>
export type updateStatusPengajuanSchema = TypeOf<typeof updateStatusPengajuanSchema>