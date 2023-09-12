import { User } from "firebase/auth";
import { Project } from "../types/project";

const baseURL = process.env.EXPO_PUBLIC_API_URL;

/**
 * Sends a fetch request to the backend api to fetch a list of projects for a user
 * @param user current user using the application
 * @returns a list of Projects
 */
async function getProjects(user: User): Promise<Project[]> {
	const token = await user.getIdToken();
	const response = await fetch(`${baseURL}/api/projects`, {
		method: "GET",
		headers: {
			Accept: "application/json",
			"Content-Type": "application/json",
			Authorization: `Bearer ${token}`,
		},
	});

	if (response.status === 500)
		throw new Error("An error occured at our API, try again later");

	return await response.json();
}

/**
 * Sends a fetch request to the backend api to create a new project
 * @param user user creating the project
 * @param project the project data with which the new project is being created
 */
async function createProject(user: User, project: Project) {
	const token = await user.getIdToken();
	const response = await fetch(`${baseURL}/api/projects`, {
		method: "POST",
		headers: {
			Accept: "application/json",
			"Content-Type": "application/json",
			Authorization: `Bearer ${token}`,
		},
		body: JSON.stringify(project),
	});

	if (response.status === 500)
		throw new Error("An error occured at our API, try again later");
	else if (response.status !== 201) throw new Error("Error creating project");
}

/**
 * Sends a fetch request to the backend api to fetch a single project
 * @param user current user using the application
 * @returns a Project
 */
async function getProject(user: User, projectId: string): Promise<Project> {
	const token = await user.getIdToken();
	const response = await fetch(`${baseURL}/api/projects/${projectId}`, {
		method: "GET",
		headers: {
			Accept: "application/json",
			"Content-Type": "application/json",
			Authorization: `Bearer ${token}`,
		},
	});
	if (response.status === 500)
		throw new Error("An error occured at our API, try again later");
	else if (response.status !== 200) throw new Error("Error fetching project");
	return await response.json();
}

/**
 * Sends a fetch request to the backend api to edit an existing project
 * @param user user creating the project
 * @param projectId id of the project being updated
 * @param project the project data with which the project is being updated with
 */
async function editProject(user: User, projectId: string, project: Project) {
	const token = await user.getIdToken();
	const response = await fetch(`${baseURL}/api/projects/${projectId}`, {
		method: "PUT",
		headers: {
			Accept: "application/json",
			"Content-Type": "application/json",
			Authorization: `Bearer ${token}`,
		},
		body: JSON.stringify(project),
	});
	if (response.status === 500)
		throw new Error("An error occured at our API, try again later");
	else if (response.status !== 204) throw new Error("Error editing project");
}

/**
 * Sends a fetch request to the backend api to delete an existing project
 * @param user user creating the project
 * @param projectId id of the project being deleted
 */
async function deleteProject(user: User, projectId: string) {
	const token = await user.getIdToken();
	const response = await fetch(`${baseURL}/api/projects/${projectId}`, {
		method: "DELETE",
		headers: {
			Authorization: `Bearer ${token}`,
		},
	});
	if (response.status === 500)
		throw new Error("An error occured at our API, try again later");
	else if (response.status !== 204) throw new Error("Error deleting project");
}

export { getProjects, createProject, getProject, editProject, deleteProject };
