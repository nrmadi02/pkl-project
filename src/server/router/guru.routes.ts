import { createGuruSchema, updateGuruSchema } from './../schema/guru.schema';
import { createRouter } from "./context";
import { z } from "zod";
import { hash } from 'argon2';
import { Guru } from '@prisma/client';
import cloudinary from "cloudinary"

export const guruRoutes = createRouter()
    .mutation('create', {
        input: createGuruSchema,
        resolve: async ({ ctx, input }) => {

            cloudinary.v2.config({
                api_key: '596333455586164',
                cloud_name: 'dw4pgfxml',
                api_secret: 'HeaQCFB2uUCsBlBi4cL5uufPboA',
            })

            const cloudinaryUpload = (file: any) => cloudinary.v2.uploader.upload(file)
            let dataFoto = null

            if (input.potoProfile) {
                const result = await cloudinaryUpload(input.potoProfile)
                dataFoto = result.secure_url
            }

            const existGuru = await ctx.prisma.guru.findFirst({
                where: {
                    OR: {
                        nip: input.nip,
                        email: input.email
                    }
                }
            })

            if (existGuru) {
                return {
                    status: "400",
                    message: "Guru sudah ada",
                };
            }

            const hashedPassword = await hash(input.nip);

            const tambahGuru = await ctx.prisma.guru.create({
                data: {
                    email: input.email,
                    jenisGuru: input.jenisGuru,
                    nama: input.nama,
                    nip: input.nip,
                    jenisKelamin: input.jenisKelamin,
                    waliKelas: input.waliKelas,
                    namaKelas: input.waliKelas ? input.namaKelas : "",
                    fotoProfile: dataFoto ? dataFoto : null,
                    user: {
                        create: {
                            email: input.email,
                            name: input.nama,
                            nomorInduk: input.nip,
                            password: hashedPassword,
                            role: 'guru',
                        },
                    }
                }
            }) as Guru

            return {
                status: 201,
                message: "Guru berhasil ditambahkan",
                result: tambahGuru,
            };
        }
    })
    .query('getAll', {
        resolve: async ({ ctx, input }) => {
            const dataGuru = await ctx.prisma.guru.findMany() as Guru[]
            return {
                status: 200,
                message: "Data guru berhasil diambil",
                result: dataGuru
            };
        }
    })
    .mutation('delete', {
        input: z.object({
            id: z.string()
        }),
        resolve: async ({ input, ctx }) => {
            const guruByID = await ctx.prisma.guru.findFirst({
                where: {
                    id: input.id
                }
            })
            const deleteGuru = ctx.prisma.guru.delete({
                where: {
                    id: input.id
                }
            })
            const deleteUser = ctx.prisma.user.delete({
                where: {
                    id: guruByID?.userID
                }
            })
            await ctx.prisma.$transaction([deleteGuru, deleteUser])
            return {
                status: 200,
                message: 'Guru berhasil dihapus',
            }
        }
    })
    .query('getByID', {
        input: z.string(),
        resolve: async ({ ctx, input }) => {
            const guruByID = await ctx.prisma.guru.findFirst({
                where: {
                    id: input
                }
            })
            return {
                status: 200,
                message: "Data guru berhasil diambil",
                result: guruByID
            };
        }
    })
    .mutation('update', {
        input: updateGuruSchema,
        resolve: async ({ ctx, input }) => {

            cloudinary.v2.config({
                api_key: '596333455586164',
                cloud_name: 'dw4pgfxml',
                api_secret: 'HeaQCFB2uUCsBlBi4cL5uufPboA',
            })

            const cloudinaryUpload = (file: any) => cloudinary.v2.uploader.upload(file)
            let dataFoto = null

            if (input.potoProfile) {
                const result = await cloudinaryUpload(input.potoProfile)
                dataFoto = result.secure_url
            }

            const existGuru = await ctx.prisma.guru.findFirst({
                where: {
                    id: input.id
                }
            })

            const hashedPassword = await hash(input.nip);

            const tambahGuru = await ctx.prisma.guru.update({
                where: {
                    id: input.id
                },
                data: {
                    email: input.email,
                    jenisGuru: input.jenisGuru,
                    nama: input.nama,
                    nip: input.nip,
                    jenisKelamin: input.jenisKelamin,
                    waliKelas: input.waliKelas,
                    namaKelas: input.waliKelas ? input.namaKelas : "",
                    fotoProfile: dataFoto ? dataFoto : existGuru?.fotoProfile,
                    user: {
                        update: {
                            email: input.email,
                            name: input.nama,
                            nomorInduk: input.nip,
                            password: hashedPassword,
                        },
                    }
                }
            }) as Guru

            return {
                status: 200,
                message: "Guru berhasil diubah",
                result: tambahGuru,
            };
        }
    })
    .query('getByUserID', {
        input: z.string(),
        resolve: async ({ ctx, input }) => {
            const guruByUserID = await ctx.prisma.guru.findFirst({
                where: {
                    userID: input
                }
            })
            return {
                status: 200,
                message: "Data guru berhasil diambil",
                result: guruByUserID
            };
        }
    })

