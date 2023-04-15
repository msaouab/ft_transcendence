
import { PrismaClient, User } from '@prisma/client'
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


class FriendshipInvites {
    id: string;
    sender_id: string;
    receiver_id: string;
    status: string;
    created_at: Date;
}


async function getRandomUser(): Promise<User> {
    const randomUser = users[Math.floor(Math.random() * users.length)]
    // get user by login
    const user = await prisma.user.findUnique({
        where: {
            login: randomUser.login,
        },
    })
    return user
}

async function main() {
    console.log(`Start seeding ...`)
    for (const user of users) {
        const checkUser = await prisma.user.findUnique({
            where: {
                login: user.login,
            },
        })
        if (checkUser) {
            console.log(`User with login ${user.login} already exists`)
            continue
        }
        const userCreate = await prisma.user.create({
            data: user,
        })
        // add id to users arr 

        console.log(`Created user with id: ${userCreate.id}`)
    }
    //     for (let i = 0; i < 3; i++) {
    //         const sender = await getRandomUser()
    //         const receiver = await getRandomUser()
    //         const friendshipInvites = await prisma.friendshipInvites.create({

    //             data: {
    //                 sender_id: sender.id,
    //                 receiver_id: receiver.id,
    //                 status: 'Pending',
    //             },
    //         })
    //         console.log(`${sender.login} sent an invite to ${receiver.login}`)
    //     }
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
