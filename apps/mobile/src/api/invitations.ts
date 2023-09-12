import { User } from "firebase/auth";
import { Invitation } from "../types/invitation";

const baseURL = process.env.EXPO_PUBLIC_API_URL;

/**
 * Sends a fetch request to the backend api to get all invitations of the current user
 * @param user current user using the app
 * @returns a list of invitations
 */
export const getInvitations = async (user: User): Promise<Invitation[]> => {
	const token = await user.getIdToken();
	const response = await fetch(`${baseURL}/api/invitations`, {
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

/**
 * Sends a fetch request to the backend api to create a new invitation
 * @param user current user using the app
 * @param email email to which the
 * @param user current user using the app
 */
export const createInvitation = async (
	user: User,
	email: string,
	projectId: string
) => {
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

	if (response.status == 404) throw new Error("User does not exist");

	if (response.status != 201) throw new Error("Unable to add new member");
};

/**
 * Sends a fetch request to the backend api to update an existing invitation
 * @param user current user using the app
 * @param accepted a boolean to know if an invitation is being accepted or rejected
 * @param invitiationId the id of the invitation to be updated
 */
export const updateInvitation = async (
	user: User,
	accepted: boolean,
	invitiationId: string
) => {
	const token = await user.getIdToken();

	const response = await fetch(`${baseURL}/api/invitations/${invitiationId}`, {
		method: "PUT",
		headers: {
			Accept: "application/json",
			"Content-Type": "application/json",
			Authorization: `Bearer ${token}`,
		},
		body: JSON.stringify({ status: accepted ? "ACCEPTED" : "REJECTED" }),
	});

	if (response.status != 204) throw new Error("Unable to update invitation");
};
