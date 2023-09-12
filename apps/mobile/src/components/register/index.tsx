import { createUserWithEmailAndPassword } from "firebase/auth";
import React from "react";
import { Alert } from "react-native";
import { Auth } from "../../config/firebase";
import { registerPushNotifications } from "../../config/pushnotifications";
import { useAuthForm } from "../../hooks/useAuthForm";
import AuthFormErrors from "../UI/AuthFormErrors";
import Form from "../UI/Form";
import { router } from "expo-router";

const API_url = process.env.EXPO_PUBLIC_API_URL;

/**
 * A react component that renders the register form for new users to register
 * @component
 * @example
 * return <Register />
 */
export default function Register() {
	const { inputs, control, handleSubmit, errors } = useAuthForm();

	// Create a new account
	const signUp = handleSubmit(
		async (data: { email: string; password: string }) => {
			try {
				const firebaseResponse = await createUserWithEmailAndPassword(
					Auth,
					data.email,
					data.password
				);
				const token = await firebaseResponse.user.getIdToken();
				const notificationTokenResponse = await registerPushNotifications();

				await fetch(`${API_url}/api/user`, {
					method: "POST",
					headers: {
						Accept: "application/json",
						"Content-Type": "application/json",
						Authorization: `Bearer ${token}`,
					},
					body: JSON.stringify({
						notificationToken: notificationTokenResponse,
					}),
				});

				router.replace("/(protected)/dashboard");
			} catch (error) {
				// @ts-ignore
				const code = error.code;

				if (code == "auth/email-already-in-use")
					Alert.alert("Error", "Email address already exists");
				else Alert.alert("Error", "Something went wrong, try again later");
			}
		}
	);

	return (
		<>
			<AuthFormErrors errors={errors} />
			<Form
				inputs={inputs}
				control={control}
				errors={errors}
				action={signUp}
				label="Register"
			/>
		</>
	);
}
