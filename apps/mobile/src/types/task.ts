import { TaskComment } from "./comment";

type Task = {
	id?: string;
	title: string;
	description?: string;
	labels: string[];
	createdAt: string | Date;
	dueDate?: string | Date;
	completed: boolean;
	projectId: string;
	comments: TaskComment[];
	createdById: string;
	assignedToId?: string;
};

export { Task };
