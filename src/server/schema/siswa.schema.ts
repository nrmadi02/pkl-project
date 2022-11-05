import { array, boolean, object, string, TypeOf, z } from 'zod';

export const createSiswaSchema = object({
    nama: string().min(1, 'Nama harus diisi'),
    nis: string().min(1, 'NIP harus diisi'),
    email: string().email('Email tidak benar'),
    jenisKelamin: string().min(1, 'Jenis Kelamin harus diisi'),
    potoProfile: string().nullable(),
    kelas: string().min(1, "Kelas harus dipilih"),
})

export const updateSiswaSchema = object({
    nama: string().min(1, 'Nama harus diisi'),
    nis: string().min(1, 'NIP harus diisi'),
    email: string().email('Email tidak benar'),
    jenisKelamin: string().min(1, 'Jenis Kelamin harus diisi'),
    potoProfile: string().nullable(),
    kelas: string().min(1, "Kelas harus dipilih"),
    id: string().min(1, 'ID siswa harus diisi')
})

export const uploadSiswaSchema = object({
    data: array(object({
        nama: string().min(1, 'Nama harus diisi'),
        nis: string().min(1, 'NIP harus diisi'),
        email: string().email('Email tidak benar'),
        jenisKelamin: string().min(1, 'Jenis Kelamin harus diisi'),
    }), { required_error: 'Data harus ada' }),
    // data: array(object({})),
    kelas: string().min(1, "Kelas harus dipilih"),
})

export type CreateSiswaSchema = TypeOf<typeof createSiswaSchema>
export type UpdateSiswaSchema = TypeOf<typeof updateSiswaSchema>
export type UploadSiswaSchema = TypeOf<typeof uploadSiswaSchema>