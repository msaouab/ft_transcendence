import { PrismaClient, User } from "@prisma/client";
const prisma = new PrismaClient();
import { createHash } from "crypto";
const users = [
	{
		login: "Moulinette_42",
		email: "Bot@student.1337.ma",
		firstName: "Bot",
		lastName: "Bot",
	},
];

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

const getRoomId = async (senderId: string, receiverId: string) => {
	const roomName = [senderId, receiverId].sort().join("-");
	const secretKey = process.env.SECRET_KEY;
	// hash the room name using md5
	const hash = createHash("md5");
	const hashedRoomName = hash.update(roomName + secretKey).digest("hex");
	return hashedRoomName;
};

async function main() {
	for (const user of users) {
		const checkUser = await prisma.user.findUnique({
			where: {
				login: user.login,
			},
		});
		if (checkUser) {
			continue;
		}
		const userCreate = await prisma.user.create({
			data: user,
		});
	}

	let user1 = await prisma.user.findUnique({
		where: {
			login: "test",
		},
	});

	const user2 = await prisma.user.findUnique({
		where: {
			login: "ren-nasr",
		},
	});
	// const privateChatRoom = await prisma.privateChatRoom.create({
	// 	data: {
	// 		id: await getRoomId(user1.id, user2.id),
	// 		sender_id: user1.id,
	// 		receiver_id: user2.id,
	// 	},
	// });
	// for (let j = 0; j < 50; j++) {
	// 	let sender = Math.random() >= 0.5 ? user1 : user2;
	// 	let receiver = sender.id === user1.id ? user2 : user1;
	// 	let content = messages[Math.floor(Math.random() * messages.length)];
	// 	const privateMessage = await prisma.privateMessage.create({
	// 		data: {
	// 			sender_id: sender.id,
	// 			receiver_id: receiver.id,
	// 			chatRoom_id: privateChatRoom.id,
	// 			dateCreated: new Date(),
	// 			content: content,
	// 			seen: Math.random() >= 0.5 ? true : false,
	// 			id: sender.id + receiver.id + Date.now().toString(),
	// 		},
	// 	});
	// }
	//create an array of object each object contains name and description attributes
	const achievements = [
		{
			name: "Here We Go",
			description: "Played your first game.",
			image: "/achievements/here_we_go.png",
		},
		{
			name: "Ace",
			description: "Win a game with a perfect score.",
			image: "/achievements/ace.png",
		},
		{
			name: "Atlas Athlete",
			description: "Score 50 pts",
			image: "/achievements/Atlas_athlete.jpeg",
		},
		{
			name: "Kasbah King",
			description: "Win five 5 games in a row.",
			image: "/achievements/Kasbah_king.jpeg",
		},
		{
			name: "Intouchable",
			description: "Win 5 games without losing or draw in any game",
			image: "/achievements/Intouchable.png",
		},
		{
			name: "Kang the conqueror",
			description: "Win 20 games without losing or draw in any game",
			image: "/achievements/kang.jpg",
		},
		{
			name: "Are u okay ?",
			description: "Just checking after your mediocre performance.",
			image: "/achievements/ok.png",
		},
	];
	for (let index = 0; index < achievements.length; index++) {
		const element = achievements[index];
		await prisma.achievements.create({
			data: {
				name: element.name,
				description: element.description,
				image: element.image,
			},
		});
	}
}

main()
	.catch((e) => {
		console.error(e);
		process.exit(1);
	})
	.finally(async () => {
		await prisma.$disconnect();
	});
