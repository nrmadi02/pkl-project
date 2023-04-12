import moment from "moment";
import { object, string } from "zod";
import {
  createKonselingSchema,
  updateStatusKonselingSchema,
} from "../schema/konseling.schema";
import { createPengajuanLabSchema } from "../schema/lab.schema";
import { createRouter } from "./context";

export const konselingRoutes = createRouter()
  .mutation("create", {
    input: createKonselingSchema,
    resolve: async ({ ctx, input }) => {
      const newKonseling = await ctx.prisma.konseling.create({
        data: {
          jam: "",
          keluhan: input.keluhan,
          status: "Menunggu",
          tanggal: new Date(input.tanggal),
          siswaID: input.siswaID,
        },
      });

      return {
        status: 201,
        message: "Data konseling berhasil ditambahkan",
      };
    },
  })
  .mutation("updateStatus", {
    input: updateStatusKonselingSchema,
    resolve: async ({ ctx, input }) => {
      const updateStatus = await ctx.prisma.konseling.update({
        where: {
          id: input.id,
        },
        data: {
          status: input.status,
          jam: input.jam,
        },
      });

      return {
        status: 200,
        message: "Data konseling berhasil diubah",
      };
    },
  })
  .query("getAll", {
    resolve: async ({ ctx }) => {
      const allData = await ctx.prisma.konseling.findMany({
        include: {
          siswa: true,
        },
        orderBy: {
          updatedAt: "desc",
        },
      });
      return {
        status: 200,
        message: "Data berhasil diambil",
        result: allData,
      };
    },
  })
  .query("getAllWithFilter", {
    input: object({
      star_date: string(),
      end_date: string(),
      status: string(),
    }),
    resolve: async ({ ctx, input }) => {
      const allData = await ctx.prisma.konseling.findMany({
        include: {
          siswa: true,
        },
        where: {
          status: {
            contains: input.status,
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
          updatedAt: "desc",
        },
      });
      return {
        status: 200,
        message: "Data berhasil diambil",
        result: allData,
      };
    },
  })
  .query("downloadData", {
    resolve: async ({ ctx }) => {
      const allData = await ctx.prisma.konseling.findMany({
        where: {
          status: {
            equals: "Disetujui",
          },
        },
        include: {
          siswa: true,
        },
      });

      const dataDownload: any = [];

      allData.map((item, idx) => {
        const data = {
          nama: item.siswa.nama,
          kelas: item.siswa.kelas,
          keluhan: item.keluhan,
          jam: item.jam,
          tanggal: moment(item.tanggal).format("DD/MM/YYYY"),
        };
        dataDownload.push(data);
      });

      return {
        status: 200,
        message: "Data berhasil diambil",
        result: dataDownload,
      };
    },
  })
  .query("getBySiswaID", {
    input: string(),
    resolve: async ({ ctx, input }) => {
      const getData = await ctx.prisma.konseling.findMany({
        where: {
          siswaID: input,
        },
        take: 5,
        orderBy: {
          updatedAt: "desc",
        },
        include: {
          siswa: true,
        },
      });
      return {
        status: 200,
        message: "Data berhasil diambil",
        result: getData,
      };
    },
  })
  .mutation("delete", {
    input: string(),
    resolve: async ({ ctx, input }) => {
      const deleteData = await ctx.prisma.konseling.delete({
        where: {
          id: input,
        },
      });

      return {
        status: 200,
        message: "Data berhasil dihapus",
      };
    },
  });
