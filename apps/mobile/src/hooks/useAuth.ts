import {
	createUserWithEmailAndPassword,
	signInWithEmailAndPassword,
} from "firebase/auth";
import { useForm } from "react-hook-form";
import { Auth } from "../config/firebase";
import { Alert } from "react-native";
import { useRouter } from "expo-router";
import { registerPushNotifications } from "../config/pushNotification";

const API_url = process.env.EXPO_PUBLIC_API_URL;

function useAuth() {
	const router = useRouter();

	const {
		control,
		handleSubmit,
		formState: { errors },
	} = useForm({
		defaultValues: {
			email: "",
			password: "",
		},
	});

	// sign in to an existing account
	const signIn = handleSubmit(
		async (data: { email: string; password: string }) => {
			try {
				const res = await signInWithEmailAndPassword(
					Auth,
					data.email,
					data.password
				);
				console.log(res);
				router.replace("/(protected)/app");
			} catch (error) {
				// @ts-ignore
				const code = error.code;
				console.log(code);

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
					console.log(error);
					Alert.alert("Error", "Something went wrong, try again later", [
						{ text: "OK", style: "cancel" },
					]);
				}
			}
		}
	);

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

				const response = await fetch(`${API_url}/api/user`, {
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

				router.replace("/(protected)/app");
			} catch (error) {
				// @ts-ignore
				const code = error.code;
				console.log(code);
				if (code == "auth/email-already-in-use")
					Alert.alert("Error", "Email address already exists");
				else Alert.alert("Error", "Something went wrong, try again later");
			}
		}
	);

	return { control, errors, signIn, signUp };
}

export { useAuth };
