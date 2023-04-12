import moment from "moment";
import { object, string } from "zod";
import {
  createTindakSchema,
  updateTindakSchema,
} from "../schema/tindak.schema";
import { createRouter } from "./context";

export const tindaklanjutRoutes = createRouter()
  .mutation("create", {
    input: createTindakSchema,
    resolve: async ({ ctx, input }) => {
      const createTindak = await ctx.prisma.tindaklanjut.create({
        data: {
          deskripsi: input.deskripsi,
          penanganan: input.penanganan,
          penindak: input.penindak,
          tanggal: new Date(input.tanggal),
          tindakan: input.tindakan,
          type: input.type,
          siswaID: input.siswaID,
        },
      });

      return {
        status: 201,
        message: "Panggilan siswa berhasil ditambahkan",
        // result: pelanggaran
      };
    },
  })
  .mutation("edit", {
    input: updateTindakSchema,
    resolve: async ({ ctx, input }) => {
      const updateTindak = await ctx.prisma.tindaklanjut.update({
        where: {
          id: input.id,
        },
        data: {
          deskripsi: input.deskripsi,
          penindak: input.penindak,
          type: input.type,
        },
      });

      return {
        status: 200,
        message: "Tindak lanjut berhasil diubah",
        // result: pelanggaran
      };
    },
  })
  .mutation("delete", {
    input: string(),
    resolve: async ({ ctx, input }) => {
      const deleteTindak = await ctx.prisma.tindaklanjut.delete({
        where: {
          id: input,
        },
      });

      return {
        status: 200,
        message: "Panggilan siswa berhasil dihapus",
      };
    },
  })
  .query("getByIDSiswa", {
    input: string(),
    resolve: async ({ ctx, input }) => {
      const tindakan = await ctx.prisma.tindaklanjut.findMany({
        where: {
          siswaID: input,
        },
      });

      return {
        status: 200,
        message: "Panggilan siswa berhasil diambil",
        result: tindakan,
      };
    },
  })
  .query("getAllWithFilter", {
    input: object({
      star_date: string(),
      end_date: string(),
      type: string(),
    }),
    resolve: async ({ ctx, input }) => {
      const allData = await ctx.prisma.tindaklanjut.findMany({
        include: {
          siswa: true,
        },
        where: {
          type: {
            contains: input.type
          },
          AND: [
            input.star_date != "" && input.end_date != ""
              ? {
                  tanggal: {
                    lte: new Date(input.end_date).toISOString(),
                    gte: new Date(input.star_date).toISOString(),
                  },
                }
              : {},
          ],
        },
        orderBy: {
          tanggal: "desc",
        },
      });
      return {
        status: 200,
        message: "Data berhasil diambil",
        result: allData,
      };
    },
  });
