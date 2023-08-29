type Task = {
	id?: string;
	title: string;
	description?: string;
	labels: string[];
	createdAt: string;
	dueDate?: string;
	completed: boolean;
	projectId: string;
	Comment: Comment[];
	createdById: string;
	assignedToId?: string;
};

export { Task };
