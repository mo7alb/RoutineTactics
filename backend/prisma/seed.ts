import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
	const users = await prisma.user.createMany({
		data: [
			{
				fullName: "John Doe",
				email: "john@doe.net",
				username: "doe",
				password: "secret123",
			},
			{
				fullName: "John Doe",
				email: "john2@doe.net",
				username: "doe2",
				password: "secret123",
			},
			{
				fullName: "John Doe",
				email: "john3@doe.net",
				username: "doe3",
				password: "secret123",
			},
		],
	});

	const user1 = await prisma.user.findFirst({
		where: { username: "doe" },
	});
	const user2 = await prisma.user.findFirst({
		where: { username: "doe2" },
	});
	const user3 = await prisma.user.findFirst({
		where: { username: "doe3" },
	});

	if (user1 == null || user2 == null || user3 == null) return;

	const projects = await prisma.project.createMany({
		data: [
			{
				name: "Android",
				description: "Mobile Operating system",
				userId: user1.id,
			},
			{
				name: "React",
				description: "UI library",
				userId: user2.id,
			},
			{
				name: "Linux",
				description: "OS kernel",
				userId: user3.id,
			},
		],
	});

	const project1 = await prisma.project.findFirst({
		where: { name: "Android" },
	});
	const project2 = await prisma.project.findFirst({
		where: { name: "React" },
	});
	const project3 = await prisma.project.findFirst({
		where: { name: "Linux" },
	});

	if (project1 == null || project2 == null || project3 == null) return;

	const members = await prisma.projectMember.createMany({
		data: [
			{
				projectId: project1.id,
				userId: user2.id,
			},
			{
				projectId: project1.id,
				userId: user3.id,
			},
			{
				projectId: project2.id,
				userId: user1.id,
			},
			{
				projectId: project2.id,
				userId: user3.id,
			},
			{
				projectId: project3.id,
				userId: user1.id,
			},
			{
				projectId: project3.id,
				userId: user2.id,
			},
		],
	});

	const task = await prisma.task.create({
		data: {
			name: "Create server components",
			description:
				"Create a type of component that would render on the server and repond with html to client",
			projectId: project2.id,
			createdById: user2.id,
		},
	});
	const comments = await prisma.comment.createMany({
		data: [
			{
				comment: "How do we achieve that?",
				userId: user3.id,
				taskId: task.id,
			},
			{
				comment: "By creating a new virtual dom which runs on the server",
				userId: user2.id,
				taskId: task.id,
			},
		],
	});

	console.log(`Added ${users.count} users`);
	console.log(`Added ${projects.count} projects`);
	console.log(`Added ${members.count} team members`);
	console.log(`Added 1 task`);
	console.log(`Added ${comments.count} comments`);
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
