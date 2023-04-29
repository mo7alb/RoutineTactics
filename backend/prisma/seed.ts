import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
	const users = await prisma.user.createMany({
		data: [
			{ email: "me@mo.io", password: "pass123" },
			{ email: "me@mo.com", password: "pass123" },
			{ email: "me@mo.net", password: "pass123" },
			{ email: "me@mo.dev", password: "pass123" },
		],
	});

	console.log(`Added ${users.count} users`);
}

main()
	.then(async () => {
		await prisma.$disconnect();
	})

	.catch(async e => {
		console.error(e);

		await prisma.$disconnect();

		process.exit(1);
	});
