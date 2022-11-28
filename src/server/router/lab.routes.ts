import { object, string } from "zod";
import { createPengajuanLabSchema } from "../schema/lab.schema";
import { createRouter } from "./context";

export const labRoutes = createRouter()
    .mutation("create", {
        input: createPengajuanLabSchema,
        resolve: async ({ ctx, input }) => {
            const existLab = await ctx.prisma.lab.findFirst({
                where: {
                    AND: [
                        { start_jam: input.start_jam },
                        { end_jam: input.end_jam },
                        { tanggal: input.tanggal }
                    ]
                }
            })
            if (existLab) {
                return {
                    status: "400",
                    message: "Pengajuan sudah ada",
                };
            }
            const lab = await ctx.prisma.lab.create({
                data: input
            })

            return {
                status: 201,
                message: "Pengajuan berhasil ditambahkan",
                result: lab
            }
        }
    })
    .mutation('delete', {
        input: string(),
        resolve: async ({ctx, input}) => {
            const deleteLab = await ctx.prisma.lab.delete({
                where: {
                    id: input
                }
            })

            return {
                status: 200,
                message: 'Pengajuan berhasil dihapus',
              }
        }
    })
    .mutation('updateStatusByID', {
        input: object({
            id: string(),
            status: string()
        }),
        resolve: async ({input, ctx}) => {
            const updateStatus = await ctx.prisma.lab.update({
                where: {
                    id: input.id
                },
                data: {
                    status: input.status
                }
            })

            return {
                status: 200,
                message: "Status pengajuan berhasil diubah",
                result: updateStatus
            }
        }
    })
    .query('getAll', {
        resolve: async ({ctx}) => {
            const all = await ctx.prisma.lab.findMany({
                orderBy: {
                    createdAt: 'asc'
                },
                include: {
                    guru: true
                }
            })

            return {
                status: 200,
                message: "Pengajuan lab berhasil diambil",
                result: all
            }
        }
    })
    .query('getAllByIDGuru', {
        input: string(),
        resolve: async ({ctx, input}) => {
            const allByIDGuru = await ctx.prisma.lab.findMany({
                where: {
                    guruID: input
                },
                orderBy: {
                    createdAt: 'asc'
                },
                include: {
                    guru: true
                }
            })
            console.log(input)

            return {
                status: 200,
                message: "Pengajuan lab berhasil diambil",
                result: allByIDGuru
            }
        }
    })