import { Task } from "./task";

type Project = {
	id?: string;
	name: string;
	description?: string;
	createdAt: string;
	dueDate: string;
	userId: string;
	categories: string[];
	projectMembers: string[];
	Task: Task[];
};

export { Project };
