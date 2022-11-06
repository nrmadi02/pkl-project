import { PrismaClient } from '@prisma/client';

let prismaFront: PrismaClient;

if (process.env.NODE_ENV === 'production') {
    prismaFront = new PrismaClient();
} else {
    if (!global.prisma) {
        global.prisma = new PrismaClient();
    }
    prismaFront = global.prisma;
}

export default prismaFront;