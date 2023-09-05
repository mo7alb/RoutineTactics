import { User } from "firebase/auth";

const API_URL = process.env.EXPO_PUBLIC_API_URL;

const updateUser = async (user: User, notificationToken) => {
	const authToken = await user.getIdToken();
	return fetch(`${API_URL}/api/user`, {
		method: "PUT",
		headers: {
			Accept: "application/json",
			"Content-Type": "application/json",
			Authorization: `Bearer ${authToken}`,
		},
		body: JSON.stringify({ notificationToken }),
	});
};

const getInvitations = async (user: User) => {
	const token = await user.getIdToken();
	const response = await fetch(`${API_URL}/api/invitations`, {
		method: "GET",
		headers: {
			Accept: "application/json",
			"Content-Type": "application/json",
			Authorization: `Bearer ${token}`,
		},
	});

	if (response.status !== 200) throw new Error("Unable to fetch invitations");
	return await response.json();
};

export { updateUser, getInvitations };
