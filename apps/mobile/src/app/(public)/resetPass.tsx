import { View, Text, Alert, StyleSheet, Pressable } from "react-native";
import React from "react";
import Container from "../../components/UI/Container";
import Form from "../../components/UI/Form";
import { useForm } from "react-hook-form";
import { sendPasswordResetEmail } from "firebase/auth";
import { Auth } from "../../config/firebase";
import { errorStyles } from "../../components/UI/AuthFormErrors";
import { Link, router } from "expo-router";
import { AntDesign } from "@expo/vector-icons";

/**
 * A react component that renders a screen allowing existing users to change their passwords
 * @component
 */
export default function ResetPassword() {
	const {
		control,
		handleSubmit,
		reset,
		formState: { errors },
	} = useForm({ defaultValues: { email: "" } });

	const handleResetPassword = handleSubmit(async data => {
		try {
			await sendPasswordResetEmail(Auth, data.email);
			Alert.alert(
				"Success",
				"Check your email for a link to change your password"
			);
			reset();
		} catch (error) {
			// @ts-ignore
			if (error.code == "auth/user-not-found")
				Alert.alert("Error", "No user with the email is found");
			else Alert.alert("Error", "An error occured, please try again later");
		}
	});

	return (
		<Container settings={false} title="Rest Password">
			<View style={styles.centerItems}>
				<View style={errorStyles.errorContainer}>
					{errors.email != undefined && (
						<Text style={errorStyles.error}>{errors.email.message}</Text>
					)}
				</View>
				<Form
					control={control}
					errors={errors}
					inputs={[
						{
							name: "email",
							rules: {
								required: "Email address is required",
								pattern: {
									value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
									message:
										"Email address should be of the form something@example.com",
								},
							},
							secure: false,
							placeholder: "Email address",
							Icon: <AntDesign name="unlock" size={24} color="black" />,
						},
					]}
					action={handleResetPassword}
					label="Reset password"
				/>

				<Pressable
					onPress={() => router.push("/(public)/login")}
					style={styles.login}
				>
					<Text style={styles.loginText}>Login</Text>
				</Pressable>
			</View>
		</Container>
	);
}

const styles = StyleSheet.create({
	centerItems: {
		display: "flex",
		justifyContent: "center",
		flex: 1,
	},
	login: {
		display: "flex",
		flexDirection: "row",
		justifyContent: "center",
		marginTop: 20,
	},
	loginText: {
		color: "#555",
	},
});
