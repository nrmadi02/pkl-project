import { boolean, object, string, TypeOf, z } from 'zod';

const MAX_FILE_SIZE = 500000;
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

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

export type CreateGuruSchema = TypeOf<typeof createGuruSchema>