import { boolean, object, string, TypeOf, z } from 'zod';

export const createPanggilSchema = object({
    no_surat: string().min(1, "No Surat harus diisi"),
    perihal: string().min(1, "Perihal harus diisi"),
    nama_ortu: string().min(1, "Nama orang tua harus diisi"),
    wali_kelas: string().min(1, "Nama Wali Kelas harus diisi"),
    nip_wali: string().min(1, "NIP Wali Kelas harus diisi"),
    nama_bk: string().min(1, "Nama Guru BK harus diisi"),
    nip_bk: string().min(1, "NIP Guru BK harus diisi"),
    tanggal:  string().min(1, "Tanggal harus diisi"),
    waktu: string().min(1, "Waktu/Jam harus diisi"),
    tempat: string().min(1, "Tempat harus diisi"),
    siswaID: string().uuid("ID siswa harus diisi")
})

export const updatePanggilSchema = object({
    no_surat: string().min(1, "No Surat harus diisi"),
    perihal: string().min(1, "Perihal harus diisi"),
    nama_ortu: string().min(1, "Nama orang tua harus diisi"),
    wali_kelas: string().min(1, "Nama Wali Kelas harus diisi"),
    nip_wali: string().min(1, "NIP Wali Kelas harus diisi"),
    nama_bk: string().min(1, "Nama Guru BK harus diisi"),
    nip_bk: string().min(1, "NIP Guru BK harus diisi"),
    tanggal:  string().min(1, "Tanggal harus diisi"),
    waktu: string().min(1, "Waktu/Jam harus diisi"),
    tempat: string().min(1, "Tempat harus diisi"),
    id: string().min(1, 'ID harus diisi'),
    siswaID: string().uuid("ID siswa harus diisi")
})

export type CreatePanggilSchema = TypeOf<typeof createPanggilSchema>
export type UpdatePanggilSchema = TypeOf<typeof updatePanggilSchema>