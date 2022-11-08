import { number, object, string, TypeOf } from "zod";

export const createPelanggaranSchema = object({
    type: string().min(1, "Pilih jenis tata tertib"),
    deskripsi: string().min(1, "Tambahkan deskripsi"),
    point: string().min(1, "Point harus diberikan"),
    pemeberi: string().min(1, "Pemberi harus diisi"),
    siswaID: string().uuid("ID siswa harus diisi")
})

export type CreatePelanggaranSchema = TypeOf<typeof createPelanggaranSchema>