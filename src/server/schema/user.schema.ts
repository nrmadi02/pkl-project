import { object, string, TypeOf, enum as Enum } from 'zod';

export const createUserSchema = object({
  name: string().min(1, "Nama harus diisi"),
  email: string().email('Invalid email'),
  nomorInduk: string().min(1, "NIP/NIS harus diisi"),
  password: string().min(1, "Password harus diisi"),
  role: Enum([
    'siswa',
    'admin',
    'perpus',
    'wali',
    'bk',
    'guru',
    'lab'
  ]),
})

export const loginUserSchema = object({
  nomorInduk: string({ required_error: 'NIP/NIS harus di isi' }).min(1, "NIP/NIS harus diisi"),
  password: string({ required_error: 'Password harus di isi' }).min(1, "Password harus diisi"),
});

export type CreateUserInput = TypeOf<typeof createUserSchema>;
export type LoginUserInput = TypeOf<typeof loginUserSchema>;