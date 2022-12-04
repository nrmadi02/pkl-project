import { createGuruSchema, updateGuruSchema } from "./../schema/guru.schema";
import { createRouter } from "./context";
import { object, string, z } from "zod";
import { hash } from "argon2";
import { Guru, Siswa, User } from "@prisma/client";
import cloudinary from "cloudinary";
import {
  createSiswaSchema,
  updateSiswaSchema,
  uploadSiswaSchema,
} from "../schema/siswa.schema";

export const siswaRoutes = createRouter()
  .mutation("create", {
    input: createSiswaSchema,
    resolve: async ({ input, ctx }) => {
      cloudinary.v2.config({
        api_key: "596333455586164",
        cloud_name: "dw4pgfxml",
        api_secret: "HeaQCFB2uUCsBlBi4cL5uufPboA",
      });

      const cloudinaryUpload = (file: any) =>
        cloudinary.v2.uploader.upload(file);
      let dataFoto = null;

      if (input.potoProfile) {
        const result = await cloudinaryUpload(input.potoProfile);
        dataFoto = result.secure_url;
      }

      const existSiswa = await ctx.prisma.siswa.findFirst({
        where: {
          OR: {
            nis: input.nis,
            email: input.email,
          },
        },
      });

      if (existSiswa) {
        return {
          status: "400",
          message: "Siswa sudah ada",
        };
      }

      const hashedPassword = await hash(input.nis);

      const tambahSiswa = (await ctx.prisma.siswa.create({
        data: {
          email: input.email,
          nama: input.nama,
          nis: input.nis,
          jenisKelamin: input.jenisKelamin,
          kelas: input.kelas,
          fotoProfile: dataFoto ? dataFoto : null,
          user: {
            create: {
              email: input.email,
              name: input.nama,
              nomorInduk: input.nis,
              password: hashedPassword,
              role: "siswa",
            },
          },
        },
      })) as Siswa;

      return {
        status: 201,
        message: "Siswa berhasil ditambahkan",
        result: tambahSiswa,
      };
    },
  })
  .query("getAll", {
    input: z.string(),
    resolve: async ({ ctx, input }) => {
      const dataSiswa = input
        ? ((await ctx.prisma.siswa.findMany({
            where: {
              OR: {
                kelas: input,
              },
            },
            include: {
              pelanggaran: true,
            },
          })) as Siswa[])
        : await ctx.prisma.siswa.findMany({
            include: {
              pelanggaran: true,
            },
          });

      return {
        status: 200,
        message: "Data siswa berhasil diambil",
        result: dataSiswa,
      };
    },
  })
  .mutation("delete", {
    input: z.object({
      id: z.string(),
    }),
    resolve: async ({ input, ctx }) => {
      const siswaByID = await ctx.prisma.siswa.findFirst({
        where: {
          id: input.id,
        },
      });
      const deleteSiswa = ctx.prisma.siswa.delete({
        where: {
          id: input.id,
        },
      });
      const deleteUser = ctx.prisma.user.delete({
        where: {
          id: siswaByID?.userID,
        },
      });
      await ctx.prisma.$transaction([deleteSiswa, deleteUser]);
      return {
        status: 200,
        message: "Siswa berhasil dihapus",
      };
    },
  })
  .query("getByID", {
    input: object({
      id: string(),
      star_date: string(),
      end_date: string(),
      type: string(),
    }),
    resolve: async ({ ctx, input }) => {
      const siswaByID = await ctx.prisma.siswa.findFirst({
        where: {
          id: input.id,
        },
      });
      const pelanggaran = await ctx.prisma.pelanggaran.findMany({
        where: {
          siswaID: input.id,
          type: {
            contains: input.type,
          },
          AND: [
            input.star_date != "" && input.end_date != ""
              ? {
                  createdAt: {
                    lte: new Date(input.end_date),
                    gte: new Date(input.star_date),
                  },
                }
              : {},
          ],
        },
        orderBy: {
          createdAt: "desc",
        },
      });
      const points = await ctx.prisma.pelanggaran.aggregate({
        where: {
          siswaID: input.id,
        },
        _sum: {
          point: true,
        },
      });
      return {
        status: 200,
        message: "Data siswa berhasil diambil",
        result: siswaByID,
        points: points._sum.point,
        pelanggaran: pelanggaran,
      };
    },
  })
  .mutation("update", {
    input: updateSiswaSchema,
    resolve: async ({ ctx, input }) => {
      cloudinary.v2.config({
        api_key: "596333455586164",
        cloud_name: "dw4pgfxml",
        api_secret: "HeaQCFB2uUCsBlBi4cL5uufPboA",
      });

      const cloudinaryUpload = (file: any) =>
        cloudinary.v2.uploader.upload(file);
      let dataFoto = null;

      if (input.potoProfile) {
        const result = await cloudinaryUpload(input.potoProfile);
        dataFoto = result.secure_url;
      }

      const existSiswa = await ctx.prisma.siswa.findFirst({
        where: {
          id: input.id,
        },
      });

      const hashedPassword = await hash(input.nis);

      const updateSiswa = (await ctx.prisma.siswa.update({
        where: {
          id: input.id,
        },
        data: {
          email: input.email,
          nama: input.nama,
          nis: input.nis,
          jenisKelamin: input.jenisKelamin,
          kelas: input.kelas,
          fotoProfile: dataFoto ? dataFoto : existSiswa?.fotoProfile,
          user: {
            update: {
              email: input.email,
              name: input.nama,
              nomorInduk: input.nis,
              password: hashedPassword,
            },
          },
        },
      })) as Siswa;

      return {
        status: 200,
        message: "Data siswa berhasil diubah",
        result: updateSiswa,
      };
    },
  })
  .mutation("createBulk", {
    input: uploadSiswaSchema,
    resolve: async ({ ctx, input }) => {
      const insertData = async () => {
        input.data.map(async (itm) => {
          const hashedPassword = await hash(itm.nis);
          const _ = await ctx.prisma.siswa.create({
            data: {
              email: itm.email,
              nama: itm.nama,
              nis: itm.nis,
              jenisKelamin: itm.jenisKelamin,
              kelas: input.kelas,
              fotoProfile: null,
              user: {
                create: {
                  email: itm.email,
                  name: itm.nama,
                  nomorInduk: itm.nis,
                  password: hashedPassword,
                  role: "siswa",
                },
              },
            },
          });
        });
        Promise.resolve("sukses");
      };

      await insertData();
      return {
        status: 201,
        message: "Siswa berhasil ditambahkan",
      };
    },
  });
