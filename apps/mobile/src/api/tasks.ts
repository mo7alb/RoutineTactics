import { User } from "firebase/auth";
import { Task } from "../types/task";

const baseURL = process.env.EXPO_PUBLIC_API_URL;

/**
 * Sends a fetch request to the backend api to create a new task
 * @param user Current user
 * @param task task data used for creating the task
 * @param projectId id of the project to which the task is being created for
 */
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

/**
 * Sends a fetch request to update an existing task
 * @param user current user
 * @param taskId id of the task being updated
 * @param task the new data with which the task is being updated
 */
async function editTask(user: User, taskId: string, task: Task) {
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
	if (response.status != 204) throw new Error("Unable to update task");
}

/**
 * Sends a fetch request to delete an existing task
 * @param user current user
 * @param taskId id of the task being deleted
 */
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
	if (response.status != 204) throw new Error("Unable to delete task");
}

/**
 * Sends a fetch request to fetch a single task
 * @param user current user
 * @param taskId id of task being fetched
 * @returns a task
 */
async function getTask(user: User, taskId: string): Promise<Task> {
	const token = await user.getIdToken();
	const response = await fetch(`${baseURL}/api/tasks/${taskId}`, {
		method: "GET",
		headers: {
			Accept: "application/json",
			"Content-Type": "application/json",
			Authorization: `Bearer ${token}`,
		},
	});
	return await response.json();
}

/**
 * Sends a fetch request to fetch a list of tasks for a user
 * @param user current user
 * @returns A list of tasks
 */
async function getTasks(user: User): Promise<Task[]> {
	const token = await user.getIdToken();
	const response = await fetch(`${baseURL}/api/tasks`, {
		method: "GET",
		headers: {
			Accept: "application/json",
			"Content-Type": "application/json",
			Authorization: `Bearer ${token}`,
		},
	});
	return await response.json();
}

export { createTask, editTask, deleteTask, getTask, getTasks };
