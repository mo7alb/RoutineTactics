import { User } from "firebase/auth";

const baseURL = process.env.EXPO_PUBLIC_API_URL;

/**
 * Sends a fetch request to the backend api fetching a single commnet
 * @param user current user using the app
 * @param id id of the comment
 * @returns json data from the api
 */
async function getComment(user: User, id: string) {
	const token = await user.getIdToken();
	const response = await fetch(`${baseURL}/api/comments/${id}`, {
		method: "GET",
		headers: {
			Accept: "application/json",
			"Content-Type": "application/json",
			Authorization: `Bearer ${token}`,
		},
	});

	if (response.status != 200) throw new Error("Unable to fetch comment");
	return response.json();
}

/**
 * Sends a fetch request to the backend api to create a new comment
 * @param user current user using the app
 * @param taskId id of the task to which the user is commenting on
 * @param comment the comment itself
 */
async function createComment(user: User, taskId: string, comment: string) {
	const token = await user.getIdToken();
	const response = await fetch(`${baseURL}/api/comments`, {
		method: "POST",
		headers: {
			Accept: "application/json",
			"Content-Type": "application/json",
			Authorization: `Bearer ${token}`,
		},
		body: JSON.stringify({ taskId, comment }),
	});

	if (response.status != 201) throw new Error("Unable to create comment");
}

/**
 * Sends a fetch request to the backend api to update an existing comment
 * @param user current user using the app
 * @param commentId id of the comment which is to be updated
 * @param comment the updated comment
 */
async function updateComment(user: User, commentId: string, comment: string) {
	const token = await user.getIdToken();
	const response = await fetch(`${baseURL}/api/comments/${commentId}`, {
		method: "PUT",
		headers: {
			Accept: "application/json",
			"Content-Type": "application/json",
			Authorization: `Bearer ${token}`,
		},
		body: JSON.stringify({ comment }),
	});

	if (response.status != 204) throw new Error("Unable to create comment");
}

/**
 * Sends a fetch request to the backend api to delete an existing comment
 * @param user current user using the app
 * @param commentId id of the comment which is to be deleted
 */
async function deleteComment(user: User, commentId: string) {
	const token = await user.getIdToken();
	const response = await fetch(`${baseURL}/api/comments/${commentId}`, {
		method: "DELETE",
		headers: {
			Accept: "application/json",
			"Content-Type": "application/json",
			Authorization: `Bearer ${token}`,
		},
	});

	if (response.status != 204) throw new Error("Unable to create comment");
}

export { getComment, createComment, updateComment, deleteComment };
