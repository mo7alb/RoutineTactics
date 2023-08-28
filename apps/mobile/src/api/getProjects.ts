import { User } from "firebase/auth";

const baseURL = process.env.EXPO_PUBLIC_API_URL;

async function getProjects(user: User) {
	const token = await user.getIdToken();
	const response = await fetch(`${baseURL}/api/projects`, {
		method: "GET",
		headers: {
			Accept: "application/json",
			"Content-Type": "application/json",
			Authorization: `Bearer ${token}`,
		},
	});
	if (response.status !== 200) throw new Error();
	return await response.json();
}

export { getProjects };
