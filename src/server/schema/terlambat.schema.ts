import { boolean, date, number, object, string, TypeOf } from "zod";

export const createTerlambatSchema = object({
  waktu: string().min(1, "Waktu harus diisi"),
  pencatat: string().min(1, "Pencatat harus diisi"),
  siswaID: string().uuid("ID siswa harus diisi"),
  akumulasi: boolean(),
  tanggal: string().min(1, "Tanggal harus diisi"),
});

export type CreateTerlambatSchema = TypeOf<typeof createTerlambatSchema>;