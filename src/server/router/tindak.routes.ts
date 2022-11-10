import { string } from "zod";
import { createTindakSchema, updateTindakSchema } from "../schema/tindak.schema";
import { createRouter } from "./context";

export const tindaklanjutRoutes = createRouter()
    .mutation('create', {
        input: createTindakSchema,
        resolve: async ({ctx, input}) => {
            const createTindak = await ctx.prisma.tindaklanjut.create({
                data: input
            })

            return {
                status: 201,
                message: "Tindak lanjut berhasil ditambahkan",
                // result: pelanggaran 
            }
        }
    })
    .mutation('edit', {
        input: updateTindakSchema,
        resolve: async ({ctx, input}) => {
            const updateTindak = await ctx.prisma.tindaklanjut.update({
                where: {
                    id: input.id
                },
                data: {
                    deskripsi: input.deskripsi,
                    penindak: input.penindak,
                    type: input.type
                }
            })

            return {
                status: 200,
                message: "Tindak lanjut berhasil diubah",
                // result: pelanggaran
            }
        }
    })
    .mutation('delete', {
        input: string(),
        resolve: async ({ctx, input}) => {
            const deleteTindak = await ctx.prisma.tindaklanjut.delete({
                where: {
                    id: input
                }
            })

            return {
                status: 200,
                message: "Tindak lanjut berhasil dihapus",
            }
        }
    })
    .query('getByIDSiswa', {
        input: string(),
        resolve: async ({ctx, input}) => {
            const tindakan = await ctx.prisma.tindaklanjut.findMany({
                where: {
                    siswaID: input
                }
            })

            return {
                status: 200,
                message: "Tindak lanjut berhasil diambil",
                result: tindakan
            }

        }
    })