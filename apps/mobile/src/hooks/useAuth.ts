import {
	createUserWithEmailAndPassword,
	signInWithEmailAndPassword,
} from "firebase/auth";
import { useForm } from "react-hook-form";
import { Auth } from "../config/firebase";
import { Alert } from "react-native";

function useAuth() {
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

	const signIn = handleSubmit(
		async (data: { email: string; password: string }) => {
			try {
				await signInWithEmailAndPassword(Auth, data.email, data.password);
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
					console.log(error);
					Alert.alert("Error", "Something went wrong, try again later", [
						{ text: "OK", style: "cancel" },
					]);
				}
			}
		}
	);
	const signUp = handleSubmit(
		async (data: { email: string; password: string }) => {
			try {
				await createUserWithEmailAndPassword(
					Auth,
					data.email,
					data.password
				);
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
