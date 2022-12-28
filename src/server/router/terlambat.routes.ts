import { createTerlambatSchema } from './../schema/terlambat.schema';
import moment from "moment";
import { string } from "zod";
import {
  createTindakSchema,
  updateTindakSchema,
} from "../schema/tindak.schema";
import { createRouter } from "./context";

export const terlambatRoutes = createRouter()
    .mutation('create', {
        input: createTerlambatSchema,
        resolve: async ({ctx, input}) => {
            const {akumulasi, pencatat, siswaID, tanggal, waktu} = input
            const newTerlambat = await ctx.prisma.terlambat.create({
              data: {
                akumulasi: false,
                pencatat: pencatat,
                tanggal: new Date(tanggal),
                waktu: Number(waktu),
                siswaID: siswaID,
              },
            });
            return {
              status: 201,
              message: "Data terlambat berhasil ditambahkan",
              // result: pelanggaran
            };
        }
    })
    .mutation('delete', {
        input: string(),
        resolve: async ({input, ctx}) => {
            const deleteTerlambat = await ctx.prisma.terlambat.delete({
                where: {
                    id: input
                }
            })

            return {
              status: 200,
              message: "Data terlambat berhasil dihapus",
              // result: pelanggaran
            };
        }
    })
    .query('getByIDSiswa', {
      input: string(),
      resolve: async ({ctx, input}) => {
        const data = await ctx.prisma.terlambat.findMany({
          where: {
            siswaID: input
          }
        })

        return {
          status: 200,
          message: "Data terlambat berhasil diambil",
          result: data
        };
      }
    })
    .mutation('updateAkumulasi', {
        input: string(),
        resolve: async ({ctx, input}) => {
            const waktuTerlambat = await ctx.prisma.terlambat.aggregate({
              where: {
                siswaID: input,
                AND: {
                  akumulasi: {
                    not: true,
                  },
                },
              },
              _sum: {
                waktu: true,
              },
            });
            const waktuAkumulasi = Number(waktuTerlambat._sum.waktu)
            if (waktuAkumulasi >= 15) {
                const update = await ctx.prisma.terlambat.updateMany({
                    where: {
                        siswaID: input,
                        AND: {
                            akumulasi: {
                                not: true
                            }
                        }
                    },
                    data: {
                        akumulasi: true
                    }
                })
                if (waktuAkumulasi >= 15 && waktuAkumulasi <= 25) {
                  const addPoint = await ctx.prisma.pelanggaran.create({
                    data: {
                      deskripsi: "Terlambat",
                      pemberi: "BK",
                      point: 1,
                      type: "Kerajinan",
                      siswaID: input,
                    },
                  });
                } else if (waktuAkumulasi > 25 ) {
                  const addPoint = await ctx.prisma.pelanggaran.create({
                    data: {
                      deskripsi: "Terlambat",
                      pemberi: "BK",
                      point: 2,
                      type: "Kerajinan",
                      siswaID: input,
                    },
                  });
                }

                return {
                  status: 200,
                  message: "Data terlambat berhasil diakumulasi",
                  // result: pelanggaran
                };
            }

            return {
              status: 400,
              message: "Akumulasi waktu terlambat belum mencapai 15 Menit",
            };
        }
    })