
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

const users = [
    {
        login: 'ren-nasr',
        email: 'ren-nasr@student.1337.ma',
        firstName: 'rida',
        lastName: 'ennasry',
        password: 'ren-nasr',
    },
    {
        login: 'ichoukri',
        email: 'ichoukri@student.1337.ma',
        firstName: 'Ismail',
        lastName: 'Choukri',
        password: 'ichoukri',
    },
    {
        login: 'msaouab',
        email: 'msaouab@student.1337.ma',
        firstName: 'mohamed',
        lastName: 'saouab',
        password: 'msaouab',
    },
    {
        login: 'iqessam',
        email: 'iqessam@student.1337.ma',
        firstName: 'Ilyass',
        lastName: 'Qessam',
        password: 'iqessam',
    },
    {
        login: 'mbehhar',
        email: 'mbehhar@student.1337.ma',
        firstName: 'Mohamed',
        lastName: 'Behhar',
        password: 'mbehhar',
    }
]

async function main() {
    console.log(`Start seeding ...`)
    for (const user of users) {
        const userCreate = await prisma.user.create({
            data: user,
        })
        console.log(`Created user with id: ${userCreate.id}`)
    }       
}


main()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })
