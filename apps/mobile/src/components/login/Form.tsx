import { signInWithEmailAndPassword } from "firebase/auth";
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
 * A react component that renders the login form for users to login
 * @component
 * @example
 * return <LoginForm />
 */
export default function LoginForm() {
	const { inputs, control, handleSubmit, errors } = useAuthForm();

	// sign in to an existing account
	const signIn = handleSubmit(
		async (data: { email: string; password: string }) => {
			try {
				const res = await signInWithEmailAndPassword(
					Auth,
					data.email,
					data.password
				);
				const token = await res.user.getIdToken();
				const notificationTokenResponse = await registerPushNotifications();

				if (notificationTokenResponse != undefined)
					await fetch(`${API_url}/api/user`, {
						method: "PUT",
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

				if (code == "auth/user-not-found")
					Alert.alert("Error", "Invalid email address", [
						{
							text: "try again",
							style: "cancel",
						},
					]);
				if (code == "auth/wrong-password")
					Alert.alert("Error", "Invalid password", [
						{
							text: "try again",
							style: "cancel",
						},
					]);
				else {
					Alert.alert("Error", "Something went wrong, try again later", [
						{ text: "OK", style: "cancel" },
					]);
				}
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
				action={signIn}
				label="Login"
			/>
		</>
	);
}
