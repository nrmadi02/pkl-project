import { Kelas } from "@prisma/client";
import { object, string } from "zod";
import { createKelasSchema, updateKelasSchema } from "../schema/kelas.schema";
import { createPelanggaranSchema } from "../schema/pelanggaran.schema";
import { createRouter } from "./context";

export const pelanggaranRoutes = createRouter()
    .mutation('create', {
        input: createPelanggaranSchema,
        resolve: async ({ ctx, input }) => {
            const { deskripsi, pemeberi, point, siswaID, type } = input
            
            const totalPoint = await ctx.prisma.pelanggaran.aggregate({
                where: {
                    siswaID: siswaID
                },
                _sum: {
                    point: true
                }
            })

            console.log(type)

            if(type == "Penghargaan"){
                if(Number(point) > Number(totalPoint._sum.point)){
                    console.log(point)
                    return {
                        status: 400,
                        message: "Penghargaan tidak bisa diberikan karena point pelanggaran siswa lebih kecil"
                    }
                }
            }

            const pelanggaran = await ctx.prisma.pelanggaran.create({
                data: {
                    deskripsi: deskripsi,
                    siswaID: siswaID,
                    pemberi: pemeberi,
                    point: type == "Penghargaan" ? -Math.abs(Number(point)) : Number(point),
                    type: type,
                }
            })

            return {
                status: 201,
                message: "Pelanggaran berhasil ditambahkan",
                // result: pelanggaran
            }
        }
    })