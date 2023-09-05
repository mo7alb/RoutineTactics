import { User } from "firebase/auth";

const baseURL = process.env.EXPO_PUBLIC_API_URL;

async function addMember(user: User, email: string, projectId: string) {
	const token = await user.getIdToken();

	const response = await fetch(`${baseURL}/api/invitations`, {
		method: "POST",
		headers: {
			Accept: "application/json",
			"Content-Type": "application/json",
			Authorization: `Bearer ${token}`,
		},
		body: JSON.stringify({ email, projectId }),
	});

	const responseData = await response.json();
	console.log(responseData);

	if (response.status != 204) throw new Error("Unable to add new member");
}

export { addMember };
