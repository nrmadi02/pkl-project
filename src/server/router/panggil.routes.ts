import moment from "moment";
import { string } from "zod";
import { createPanggilSchema } from "../schema/panggil.schema";
import { createRouter } from "./context";

export const panggilRoutes = createRouter()
    .mutation('create', {
        input: createPanggilSchema,
        resolve: async ({ctx, input}) => {
            const {
                nama_bk,
                nama_ortu,
                nip_bk,
                nip_wali,
                no_surat,
                perihal,
                tanggal,
                tempat,
                waktu,
                wali_kelas,
                siswaID
            } = input

            const tambahPanggil = await ctx.prisma.panggilortu.create({
                data: {
                    nama_bk: nama_bk,
                    nama_ortu: nama_ortu,
                    nip_bk: nip_bk,
                    nip_wali: nip_wali,
                    no_surat: no_surat,
                    perihal: perihal,
                    tanggal: new Date(tanggal),
                    tempat: tempat,
                    waktu: waktu,
                    wali_kelas: wali_kelas,
                    siswaID: siswaID
                }
            })

            return {
                status: 201,
                message: "Panggilan Orang Tua berhasil ditambahkan",
                // result: pelanggaran 
            }

        }
    })
    .mutation('delete', {
        input: string(),
        resolve: async ({ctx, input}) => {
            const deletePanggil = await ctx.prisma.panggilortu.delete({
                where: {
                    id: input
                }
            })

            return {
                status: 200,
                message: "Panggilan orang tua berhasil dihapus",
            }
        }
    })
    .query('getAllByIDSiswa', {
        input: string(),
        resolve: async ({ctx, input}) => {
            const getAll = await ctx.prisma.panggilortu.findMany({
                where: {
                    siswaID: input,
                    createdAt: {
                        gte: new Date(moment().startOf('month').format('YYYY-MM-DD')),
                        lte: new Date(moment().endOf('month').format('YYYY-MM-DD'))
                    }
                },
                include: {
                    siswa: true
                }
            })

            return {
                status: 200,
                message: "Panggilan orang tua berhasil diambil",
                result: getAll
            }

        }
    })
    .query('getDetailByID', {
        input: string(),
        resolve: async ({ctx, input}) => {
            const getByID = await ctx.prisma.panggilortu.findFirst({
                where: {
                    id: input
                },
                include: {
                    siswa: true
                }
                
            })

            return {
                status: 200,
                message: "Panggilan orang tua berhasil diambil",
                result: getByID
            }
        }
    })