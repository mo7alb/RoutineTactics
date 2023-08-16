import { useForm } from "react-hook-form";
import { Alert } from "react-native";
import { Auth } from "../config/firebaseConfig";
import {
	signInWithEmailAndPassword,
	createUserWithEmailAndPassword,
} from "firebase/auth";

export const useAuth = () => {
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
				else
					Alert.alert("Error", "Something went wrong, try again later", [
						{ text: "OK", style: "cancel" },
					]);
			}
		}
	);

	const signUp = handleSubmit(async data => {
		try {
			await createUserWithEmailAndPassword(Auth, data.email, data.password);
		} catch (error) {
			// @ts-ignore
			const code = error.code;
			console.log(code);
			if (code == "auth/email-already-in-use")
				Alert.alert("Error", "Email address already exists");
			else Alert.alert("Error", "Something went wrong, try again later");
		}
	});

	return { control, errors, signIn, signUp };
};
