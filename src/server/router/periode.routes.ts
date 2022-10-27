import { Kelas, Periode } from "@prisma/client";
import { string } from "zod";
import { createPeriodeSchema } from "../schema/periode.schema";
import { createRouter } from "./context";

export const periodeRoutes = createRouter()
    .mutation('createOrUpdate', {
        input: createPeriodeSchema,
        resolve: async ({ input, ctx }) => {

            const existPeriode = await ctx.prisma.periode.findFirst()

            if(existPeriode){
                console.log('Periode sudah ada')
                const updatePeriode = await ctx.prisma.periode.update({
                    where: {
                        periode: existPeriode.periode,
                    },
                    data: {
                        periode: input.periode
                    }
                })

                return {
                    status: 200,
                    message: "periode berhasil diubah",
                }
            }

            const periode = await ctx.prisma.periode.create({
                data: {
                    periode: input.periode,
                }
            }) as Periode

            return {
                status: 201,
                message: "Periode berhasil ditambahkan",
                result: {
                    periode: periode.periode
                },
            }
        }
    })
    .query('get', {
        resolve: async ({ctx}) => {
            const periode = await ctx.prisma.periode.findFirst() as Periode
            return {
                message: "Get periode berhasil",
                code: 200,
                result: periode.periode
            }
        }
    })