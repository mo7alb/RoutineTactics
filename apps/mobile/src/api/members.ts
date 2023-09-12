import { User } from "firebase/auth";

const baseURL = process.env.EXPO_PUBLIC_API_URL;

/**
 * Sends a fetch request to the backend api to get a list of members for a project
 * @param user current user using the app
 * @param projectId id of the project for which the members are being fetched
 */
async function getMembers(user: User, projectId: string) {
	const token = await user.getIdToken();

	const response = await fetch(
		`${baseURL}/api/projects/members/${projectId}`,
		{
			method: "GET",
			headers: {
				Accept: "application/json",
				"Content-Type": "application/json",
				Authorization: `Bearer ${token}`,
			},
		}
	);

	if (response.status != 200) throw new Error("Unable to fetch members");
	return await response.json();
}

/**
 * Sends a fetch request to the backend api to leave a project
 * @param user current user using the app
 * @param projectId id of the project for which the member is being deleted
 */
async function leaveProject(user: User, projectId: string) {
	const token = await user.getIdToken();

	const response = await fetch(
		`${baseURL}/api/projects/members/${projectId}`,
		{
			method: "DELETE",
			headers: {
				Accept: "application/json",
				"Content-Type": "application/json",
				Authorization: `Bearer ${token}`,
			},
		}
	);

	if (response.status != 204) throw new Error("Unable to delete membership");
}

/**
 * Sends a fetch request to the backend api to leave a project
 * @param user current user using the app
 * @param projectId id of the project for which the member is being deleted
 */
async function removeMember(user: User, projectId: string, userId: string) {
	const token = await user.getIdToken();

	const response = await fetch(
		`${baseURL}/api/projects/members/${projectId}`,
		{
			method: "DELETE",
			headers: {
				Accept: "application/json",
				"Content-Type": "application/json",
				Authorization: `Bearer ${token}`,
			},
			body: JSON.stringify({ userId }),
		}
	);

	if (response.status != 204) throw new Error("Unable to remove member");
}

export { getMembers, leaveProject, removeMember };
