export interface Project {
	id: string;
	name: string;
	description: string;
	dueDate: string | Date;
	categories: string[];
}
