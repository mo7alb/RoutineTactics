import { Task } from "./task";

type ProjectMember = {
	id: string;
	projectId: string;
	userId: string;
};

type Project = {
	id?: string;
	name: string;
	description?: string;
	createdAt?: string;
	dueDate: Date | string | null;
	userId?: string;
	categories: string[];
	members: ProjectMember[];
	tasks: Task[];
};

export { Project };
