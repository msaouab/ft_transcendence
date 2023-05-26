
import { PrismaClient, User } from '@prisma/client'
const prisma = new PrismaClient()
import { createHash } from 'crypto';
import e from 'express';
// {
//     login: 'ren-nasr',
//     email: 'ren-nasr@student.1337.ma',
//     firstName: 'rida',
//     lastName: 'ennasry',
//     password: 'ren-nasr',
// },
const users = [
    {
        login: 'ichoukri',
        email: 'ichoukri@student.1337.ma',
        firstName: 'Ismail',
        lastName: 'Choukri',
    },
    {
        login: 'msaouab',
        email: 'msaouab@student.1337.ma',
        firstName: 'mohamed',
        lastName: 'saouab',
    },
    // {
    //     login: 'ren-nasr',
    //     email: 'ren-nasr@student.1337.ma',
    //     firstName: 'rida',
    //     lastName: 'ennasry',
    // },
    {
        login: 'mbehhar',
        email: 'mbehhar@student.1337.ma',
        firstName: 'Mohamed',
        lastName: 'Behhar',
    },
    {
        login: 'rbenjell',
        email: 'rbenjell@student.1337.ma',
        firstName: 'Reda',
        lastName: 'Benjelloun',
    },
]

const messages = [
    "Hello there, How are you doing? How are you doing?, How are you doing? , How are you doing? , How are you doing? ",
    "How are you doing?",
    "I'm fine, thanks",
    "What about you? What about you? What about you? What about you? What about you? What about you? ",
    "I'm fine too",
    "Where are you from?",
    "I'm from Morocco I'm from Morocco I'm from Morocco I'm from Morocco I'm from Morocco I'm from Morocco I'm from Morocco ",
    "What about you?",
    "I'm from Morocco too",
    "Nice to meet you",
    "Nice to meet you too I'm from Morocco I'm from Morocco I'm from Morocco I'm from Morocco",
    "What do you do for a living?",
    "I'm a software engineer",
    "What about you? What about you? What about you What about you?, What about you? What about you? What about you? ",
    "I'm a student ",
    "What do you study?",
    "I study computer science",
    "That's cool That's cool That's cool That's cool  That's cool That's cool That's cool That's cool That's cool ",
    "Yeah",
    "What do you do in your free time? Yeah Yeah Yeah Yeah Yeah",
    "I like to play video games",
    "What about you?  hat about you? hat about you?",
    "I like to play video games too I like to play video games too I like to play video games too I like to play video games too I like to play video games too",
    "What games do you play?",
    "I play League of Legends",
    "I play League of Legends too, I play League of Legends I play League of Legends I play League of Legends I play League of Legends I play League of Legends ",
    "What rank are you?",
    "I'm Diamond 2",
    "I'm Diamond 1",
    "Nice",
    "Yeah",
    "What's your favorite champion?",
    "My favorite champion is Yasuo",
    "My favorite champion is Yasuo too",
    "Nice",
    "Yeah",
];




// class FriendshipInvites {
//     id: string;
//     sender_id: string;
//     receiver_id: string;
//     status: string;
//     created_at: Date;
// }


const getRoomId = async (senderId: string, receiverId: string) => {
    const roomName = [senderId, receiverId].sort().join('-');
    const secretKey = process.env.SECRET_KEY;
    // hash the room name using md5
    const hash = createHash('md5');
    const hashedRoomName = hash.update(roomName + secretKey).digest('hex');
    return hashedRoomName;
}




// async function getRandomUser(usersArr: any): Promise<User> {

//     const randomUser = usersArr[Math.floor(Math.random() * usersArr.length)]
//     // get user by login
//     const user = await prisma.user.findUnique({
//         where: {
//             login: randomUser.login,

//         },
//     })
//     return user
// }

async function main() {
    console.log(`Start seeding ...`)
    for (const user of users) {
        // let newArr = users.filter((user) => user.login !== 'ren-nasr')
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

    }

    //     // add id to users arr 
    //     await prisma.channel.create({
    //         data: {
    //             name: `channel-${Math.floor(Math.random() * 100)}`,
    //             chann_type: 'Public',
    //             owner_id: userCreate.id,
    //             limit_members: 10,
    //         },
    //     })

    //     console.log(`Created user with id: ${userCreate.id}`)
    // }

    // let user = await prisma.user.findUnique({
    //     where: {
    //         login: 'ren-nasr',
    //     },
    // })





    // adding a seed for private chat room and messages 
    // creating 10 private chat rooms two rooms for each user, each rooms should have ren-nasr as a member
    // then at each room we create 50 messages, while selecting a random user to be the sender or the receiver from the room members
    // for (let i = 0; i < 5; i++) {
    // let newArr = users.filter((user) => user.login !== 'ren-nasr')
    let user1 = await prisma.user.findUnique({
        where: {
            // login: newArr[i].login,
            login: 'ichoukri'
        },
    })


    // // while (user1.login === 'ren-nasr') {
    // //     user1 = await getRandomUser(    
    // // }

    // // user 2 should be ren-nasr

    const user2 = await prisma.user.findUnique({
        where: {
            login: 'ren-nasr',
        },
    })

    console.log(user1)
    console.log(user2)
    const privateChatRoom = await prisma.privateChatRoom.create({
        data: {
            id: await getRoomId(user1.id, user2.id),
            sender_id: user1.id, receiver_id: user2.id,

        },
    })
    // console.log(`Created private chat room with id: ${privateChatRoom.id}`)
    for (let j = 0; j < 50; j++) {
        let sender = Math.random() >= 0.5 ? user1 : user2
        let receiver = sender.id === user1.id ? user2 : user1
        let content = messages[Math.floor(Math.random() * messages.length)]
        const privateMessage = await prisma.privateMessage.create({
            data: {
                sender_id: sender.id,
                receiver_id: receiver.id,
                chatRoom_id: privateChatRoom.id,
                dateCreated: new Date(),
                content: content,
                seen: Math.random() >= 0.5 ? true : false,
                id: sender.id + receiver.id + Date.now().toString(),
            },
        })
        console.log(`Created private message with id: ${privateMessage.id}`)
    }
        //create an array of object each object contains name and description attributes
        const achievements = [
            {
                name: 'Here We Go',
                description: 'Played your first game.',
                image: "/achievements/here_we_go.png",

            },
            {
                name: 'Ace',
                description: 'Win a game with a perfect score.',
                image: "/achievements/ace.png",
            },
            {
                name: 'Atlas Athlete',
                description: 'Score 50 pts',
                image: "/achievements/Atlas_athlete.jpeg",
            },
            {
                name: 'Kasbah King',
                description: 'Win five 5 games in a row.',
                image: "/achievements/Kasbah_king.jpeg",
            },
            {
                name: 'Intouchable',
                description: 'Win 5 games without losing or draw in any game',
                image: "/achievements/Intouchable.png",
            },
            {
                name: 'Kang the conqueror',
                description: 'Win 20 games without losing or draw in any game',
                image: "/achievements/kang.jpg",
            },
            {
                name: 'Are u okay ?',
                description: 'Just checking after your mediocre performance.',
                image: "/achievements/ok.png",
            }
        ]
        for (let index = 0; index < achievements.length; index++) {
            const element = achievements[index];
            await prisma.achievements.create({
                data: {
                    name: element.name,
                    description: element.description,
                    image: element.image,
                }
            })
            
        }

    // creatigng channels


    // const rennasr = await prisma.user.findUnique({
    //     where: {
    //         login: 'ren-nasr',
    //     },
    // })

}





main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })


// remove this whole file later




