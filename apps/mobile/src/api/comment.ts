import { User } from "firebase/auth";

const baseURL = process.env.EXPO_PUBLIC_API_URL;

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

export { createComment };
