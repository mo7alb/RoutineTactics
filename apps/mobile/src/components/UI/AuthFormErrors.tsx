import React from "react";
import { Text, View, StyleSheet } from "react-native";

type Props = {
	errors: any;
};

/**
 * A react component that renders all the errors that occur in a login or registration form
 * @param Props
 * @component
 * @example
 * const { formState: { errors }} = useForm();
 * return <AuthFormErrors errors={errors} />
 */
export default function AuthFormErrors({ errors }: Props) {
	return (
		<View style={errorStyles.errorContainer}>
			{errors.email && (
				<Text style={errorStyles.error}>{errors.email.message}</Text>
			)}
			{errors.password && (
				<Text style={errorStyles.error}>{errors.password.message}</Text>
			)}
		</View>
	);
}

export const errorStyles = StyleSheet.create({
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
