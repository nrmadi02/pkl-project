import { Kelas } from "@prisma/client";
import { object, string } from "zod";
import { createKelasSchema, updateKelasSchema } from "../schema/kelas.schema";
import { createRouter } from "./context";

export const kelasRoutes = createRouter()
    .mutation('create', {
        input: createKelasSchema,
        resolve: async ({ input, ctx }) => {
            const existKelas = await ctx.prisma.kelas.findFirst({
                where: {
                    name: input.name
                }
            })

            if (existKelas) {
                return {
                    code: "400",
                    message: "Kelas sudah terdaftar",
                }
            }

            const kelas = await ctx.prisma.kelas.create({
                data: {
                    name: input.name
                }
            }) as Kelas

            return {
                status: 201,
                message: "Kelas berhasil ditambahkan",
                result: {
                    kelas: kelas.name
                },
            }
        }
    })
    .mutation('delete', {
        input: string(),
        resolve: async ({ ctx, input }) => {
            const deleteKelas = await ctx.prisma.kelas.delete({
                where: {
                    id: input
                }
            })

            return {
                status: 200,
                message: 'Kelas berhasil dihapus',
            }
        }
    })
    .mutation('update', {
        input: updateKelasSchema,
        resolve: async ({ ctx, input }) => {
            const updateKelas = await ctx.prisma.kelas.update({
                where: {
                    id: input.id
                },
                data: {
                    name: input.name
                }
            }) as Kelas

            return {
                status: 200,
                message: 'Kelas berhasil diubah',
            }

        }
    })
    .query('getAll', {
        resolve: async ({ ctx }) => {
            const allKelas = await ctx.prisma.kelas.findMany({
                orderBy: {
                    name: 'asc'
                }
            }) as Kelas[]
            return {
                status: 200,
                message: 'Semua kelas berhasil diambil',
                result: allKelas
            }
        }
    })