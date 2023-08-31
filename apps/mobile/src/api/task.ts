import { User } from "firebase/auth";
import { Task } from "../types/task";

const baseURL = process.env.EXPO_PUBLIC_API_URL;

async function createTask(user: User, task: Task, projectId: string) {
	const token = await user.getIdToken();
	const response = await fetch(`${baseURL}/api/tasks`, {
		method: "POST",
		headers: {
			Accept: "application/json",
			"Content-Type": "application/json",
			Authorization: `Bearer ${token}`,
		},
		body: JSON.stringify({ ...task, projectId }),
	});

	if (response.status != 201) throw new Error("Unable to create task");
}

async function updateTask(user: User, taskId: string, task: Task) {
	const token = await user.getIdToken();
	const response = await fetch(`${baseURL}/api/tasks/${taskId}`, {
		method: "PUT",
		headers: {
			Accept: "application/json",
			"Content-Type": "application/json",
			Authorization: `Bearer ${token}`,
		},
		body: JSON.stringify(task),
	});
	return await response.json();
}

async function deleteTask(user: User, taskId: string) {
	const token = await user.getIdToken();
	const response = await fetch(`${baseURL}/api/tasks/${taskId}`, {
		method: "DELETE",
		headers: {
			Accept: "application/json",
			"Content-Type": "application/json",
			Authorization: `Bearer ${token}`,
		},
	});
	return await response.json();
}

async function getTask(user: User, task: Task): Promise<Task> {
	const token = await user.getIdToken();
	const response = await fetch(`${baseURL}/api/tasks`, {
		method: "GET",
		headers: {
			Accept: "application/json",
			"Content-Type": "application/json",
			Authorization: `Bearer ${token}`,
		},
		body: JSON.stringify(task),
	});
	return await response.json();
}

export { createTask, updateTask, deleteTask, getTask };
