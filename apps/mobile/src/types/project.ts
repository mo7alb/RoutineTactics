import { Task } from "./task";

type Project = {
	id?: string;
	name: string;
	description?: string;
	createdAt?: string;
	dueDate: Date | string;
	userId?: string;
	categories: string[];
	projectMembers: string[];
	tasks: Task[];
};

export { Project };
