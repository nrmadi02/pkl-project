import { boolean, object, string, TypeOf, z } from 'zod';

export const createGuruSchema = object({
    nama: string().min(1, 'Nama harus diisi'),
    nip: string().min(1, 'NIP harus diisi'),
    email: string().email('Email tidak benar'),
    jenisKelamin: string().min(1, 'Jenis Kelamin harus diisi'),
    jenisGuru: string().min(1, 'Jenis Guru harus diisi'),
    potoProfile: string().nullable(),
    waliKelas: boolean().default(false),
    namaKelas: string().default(""),
})

export const updateGuruSchema = object({
    nama: string().min(1, 'Nama harus diisi'),
    nip: string().min(1, 'NIP harus diisi'),
    email: string().email('Email tidak benar'),
    jenisKelamin: string().min(1, 'Jenis Kelamin harus diisi'),
    jenisGuru: string().min(1, 'Jenis Guru harus diisi'),
    potoProfile: string().nullable(),
    waliKelas: boolean().default(false),
    namaKelas: string().default(""),
    id: string().min(1, 'ID guru harus diisi')
})

export type CreateGuruSchema = TypeOf<typeof createGuruSchema>
export type UpdateGuruSchema = TypeOf<typeof updateGuruSchema>