import React from "react";
import {
	Button,
	KeyboardAvoidingView,
	StyleSheet,
	TextInput,
	View,
	Text,
	Alert,
} from "react-native";
import { useForm, Controller } from "react-hook-form";
import { signInWithEmailAndPassword } from "firebase/auth";
import { Auth } from "../../config/firebaseConfig";

export default function LoginForm() {
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

	const signIn = async (data: { email: string; password: string }) => {
		try {
			const response = await signInWithEmailAndPassword(
				Auth,
				data.email,
				data.password
			);

			console.log(response);
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
			else console.log(code);
		}
	};

	return (
		<KeyboardAvoidingView>
			<View style={styles.errorContainer}>
				{errors.email && (
					<Text style={styles.error}>{errors.email.message}</Text>
				)}
				{errors.password && (
					<Text style={styles.error}>{errors.password.message}</Text>
				)}
			</View>
			<Controller
				name="email"
				control={control}
				rules={{
					required: "Email address is required",
					pattern: {
						value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
						message:
							"Email address should be of the form something@example.com",
					},
				}}
				render={({ field: { onChange, onBlur, value } }) => (
					<TextInput
						placeholder="Email address"
						style={styles.input}
						value={value}
						onChangeText={onChange}
						onBlur={onBlur}
						autoCapitalize="none"
						autoCorrect={false}
					/>
				)}
			/>
			<Controller
				name="password"
				control={control}
				rules={{
					required: "Password is required",
					minLength: {
						value: 6,
						message: "Password should be at least 6 characters long",
					},
				}}
				render={({ field: { onChange, onBlur, value } }) => (
					<TextInput
						placeholder="Password"
						style={styles.input}
						secureTextEntry={true}
						value={value}
						onChangeText={onChange}
						onBlur={onBlur}
						autoCapitalize="none"
						autoCorrect={false}
					/>
				)}
			/>

			<Button
				title="Login"
				color="#841584"
				accessibilityLabel="Log into routine tactics"
				onPress={handleSubmit(signIn)}
			/>
		</KeyboardAvoidingView>
	);
}

const styles = StyleSheet.create({
	input: {
		borderWidth: 1,
		paddingHorizontal: 10,
		paddingVertical: 6,
		borderRadius: 10,
		marginHorizontal: 15,
		marginVertical: 5,
	},
	submit: {
		marginHorizontal: 15,
	},
	errorContainer: {
		padding: 2,
		marginVertical: 10,
	},
	error: {
		textAlign: "center",
		color: "red",
		marginBottom: 5,
		fontSize: 18,
	},
});
