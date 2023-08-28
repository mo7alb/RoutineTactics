import React from "react";
import { Button, KeyboardAvoidingView, Text, View } from "react-native";
import { errorStyles } from "../styles/error";
import { useAuth } from "../../hooks/useAuth";
import Input from "../UI/input";

export default function RegisterForm() {
	const { errors, control, signUp } = useAuth();

	return (
		<>
			<View style={errorStyles.errorContainer}>
				{errors.email && (
					<Text style={errorStyles.error}>{errors.email.message}</Text>
				)}
				{errors.password && (
					<Text style={errorStyles.error}>{errors.password.message}</Text>
				)}
			</View>
			<KeyboardAvoidingView>
				<Input
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
					autoCapitalize="none"
					autoCorrect={false}
					placeholder="Email address"
					error={errors.email != null}
				/>
				<Input
					name="password"
					control={control}
					rules={{
						required: "Password is required",
						minLength: {
							value: 6,
							message: "Password should be at least 6 characters long",
						},
					}}
					autoCapitalize="none"
					autoCorrect={false}
					placeholder="Password"
					secureTextEntry={true}
					error={errors.password != null}
				/>

				<Button title="Register" onPress={signUp} />
			</KeyboardAvoidingView>
		</>
	);
}
