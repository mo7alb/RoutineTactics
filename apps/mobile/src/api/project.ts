import { User } from "firebase/auth";
import { Project } from "../types/project";

const baseURL = process.env.EXPO_PUBLIC_API_URL;

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
	if (response.status !== 200) throw new Error("Error fetching projects");

	return await response.json();
}

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
	if (response.status !== 201) throw new Error("Error creating project");
}

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
	if (response.status !== 200) throw new Error("Error fetching project");
	return await response.json();
}

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
	if (response.status !== 204) throw new Error("Error editing project");
}

async function deleteProject(user: User, projectId: string) {
	const token = await user.getIdToken();
	const response = await fetch(`${baseURL}/api/projects/${projectId}`, {
		method: "DELETE",
		headers: {
			Authorization: `Bearer ${token}`,
		},
	});
	if (response.status !== 204) throw new Error("Error deleting project");
}

export { getProjects, createProject, getProject, editProject, deleteProject };
