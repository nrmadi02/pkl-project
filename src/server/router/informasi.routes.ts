import cloudinary from 'cloudinary';
import { number, object, string } from 'zod';
import { createInformasiSchema, updateInformasiSchema } from "../schema/informasi.schema";
import { createRouter } from "./context";

export const informasiRoutes = createRouter()
  .mutation("create", {
    input: createInformasiSchema,
    resolve: async ({ input, ctx }) => {
      cloudinary.v2.config({
        api_key: "596333455586164",
        cloud_name: "dw4pgfxml",
        api_secret: "HeaQCFB2uUCsBlBi4cL5uufPboA",
      });

      const cloudinaryUpload = (file: any) =>
        cloudinary.v2.uploader.upload(file);
      let dataFoto = null;

      if (input.sampul) {
        const result = await cloudinaryUpload(input.sampul);
        dataFoto = result.secure_url;
      }

      const { deskripsi, isi, judul, pembuat, status, userID } = input;

      const newInformasi = await ctx.prisma.informasi.create({
        data: {
          deskripsi: deskripsi,
          isi: isi,
          judul: judul,
          pembuat: pembuat,
          sampul: String(dataFoto),
          status: status,
          userID: userID,
        },
      });

      return {
        status: 201,
        message: "Informasi berhasil ditambahkan",
        result: newInformasi,
      };
    },
  })
  .mutation("update", {
    input: updateInformasiSchema,
    resolve: async ({ ctx, input }) => {
      cloudinary.v2.config({
        api_key: "596333455586164",
        cloud_name: "dw4pgfxml",
        api_secret: "HeaQCFB2uUCsBlBi4cL5uufPboA",
      });

      const cloudinaryUpload = (file: any) =>
        cloudinary.v2.uploader.upload(file);
      let dataFoto = null;

      if (input.sampul) {
        const result = await cloudinaryUpload(input.sampul);
        dataFoto = result.secure_url;
      }

      const { deskripsi, isi, judul, pembuat, status, userID, id } = input;

      const existInformasi = await ctx.prisma.informasi.findFirst({
        where: {
          id: id,
        },
      });

    //   console.log(dataFoto)

      const updateInformasi = await ctx.prisma.informasi.update({
        where: {
          id: id,
        },
        data: {
          isi: isi,
          deskripsi: deskripsi,
          judul: judul,
          pembuat: pembuat,
          status: status,
          sampul: dataFoto ? dataFoto : existInformasi?.sampul,
        },
      });

      return {
        status: 200,
        message: "Data informasi berhasil diubah",
        result: updateInformasi,
      };
    },
  })
  .mutation("delete", {
    input: string(),
    resolve: async ({ ctx, input }) => {
      const deleteInformasi = await ctx.prisma.informasi.delete({
        where: {
          id: input,
        },
      });

      return {
        status: 200,
        message: "Data informasi berhasil dihapus",
      };
    },
  })
  .mutation("updateStatus", {
    input: object({
      id: string(),
      status: string(),
    }),
    resolve: async ({ ctx, input }) => {
      const updateInformasi = await ctx.prisma.informasi.update({
        where: {
          id: input.id,
        },
        data: {
          status: input.status,
        },
      });

      return {
        status: 200,
        message: "Status informasi berhasil diubah",
      };
    },
  })
  .query("getAll", {
    input: number(),
    resolve: async ({ ctx, input }) => {
      const getAllInformasi = await ctx.prisma.informasi.findMany({
        take: input,
      });
      return {
        status: 200,
        message: "Data informasi berhasil diambil",
        reuslt: getAllInformasi,
      };
    },
  })
  .query("getAllAccept", {
    input: number(),
    resolve: async ({ ctx, input }) => {
      const getAllInformasi = await ctx.prisma.informasi.findMany({
        where: {
          status: {
            equals: "Disetujui",
          },
        },
        take: input,
        orderBy: {
          createdAt: "desc",
        },
      });
      return {
        status: 200,
        message: "Data informasi berhasil diambil",
        reuslt: getAllInformasi,
      };
    },
  })
  .query("getAllByUser", {
    input: string(),
    resolve: async ({ ctx, input }) => {
      const getAllInformasi = await ctx.prisma.informasi.findMany({
        where: {
          userID: input,
        },
      });
      return {
        status: 200,
        message: "Data informasi berhasil diambil",
        reuslt: getAllInformasi,
      };
    },
  })
  .query("getDetailByID", {
    input: string(),
    resolve: async ({ ctx, input }) => {
      const getDetail = await ctx.prisma.informasi.findFirst({
        where: {
          id: input,
        },
      });
      return {
        status: 200,
        message: "Data informasi berhasil diambil",
        reuslt: getDetail,
      };
    },
  });