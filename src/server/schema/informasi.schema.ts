import { object, string, TypeOf} from "zod";

export const createInformasiSchema = object({
    judul: string().min(1, 'Judul harus diisi'),
    deskripsi: string().min(1, 'Deskripsi harus diisi'),
    isi: string().min(1, 'Isi Informasi harus diisi'),
    sampul: string().nullable(),
    pembuat: string().min(1, 'Pembuat harus diisi'),
    status: string().min(1, "Status harus diisi"),
    userID: string().min(1, "User ID harus diisi")
})

export const updateInformasiSchema = object({
    judul: string().min(1, 'Judul harus diisi'),
    deskripsi: string().min(1, 'Deskripsi harus diisi'),
    isi: string().min(1, 'Isi Informasi harus diisi'),
    sampul: string().nullable(),
    pembuat: string().min(1, 'Pembuat harus diisi'),
    status: string().min(1, "Status harus diisi"),
    userID: string().min(1, "User ID harus diisi"),
    id: string().min(1, "ID harus diisi")
})

export type CreateInformasiSchema = TypeOf<typeof createInformasiSchema>
export type UpdateInformasiSchema = TypeOf<typeof updateInformasiSchema>