import { object, string, TypeOf } from "zod";

export const createKonselingSchema = object({
  tanggal: string().min(1, "Tanggal harus diisi"),
  keluhan: string().min(1, "Keluhan harus diisi"),
  siswaID: string().min(1, "Siswa ID harus diisi"),
});

export const updateStatusKonselingSchema = object({
  jam: string().min(1, "Jam harus diisi"),
  status: string().min(1, "Status harus diisi"),
  id: string().min(1, "ID harus diisi")
});

export type CreateKonselingSchema = TypeOf<typeof createKonselingSchema>;
export type UpdateStatusKonselingSchema = TypeOf<typeof updateStatusKonselingSchema>;