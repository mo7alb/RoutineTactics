import { Link } from "expo-router";
import { sendEmailVerification, signOut, updatePassword } from "firebase/auth";
import React from "react";
import { useForm } from "react-hook-form";
import { Alert, Pressable, StyleSheet, Text, View } from "react-native";
import { errorStyles } from "../../components/UI/AuthFormErrors";
import Container from "../../components/UI/Container";
import Form from "../../components/UI/Form";
import { Auth } from "../../config/firebase";
import { useAuthContext } from "../../context/authContext";
import { AntDesign } from "@expo/vector-icons";

const defaultValues = {
	password: "",
	passwordConfirm: "",
};

const inputs = [
	{
		name: "password",
		rules: {
			required: "Password is required",
			minLength: {
				value: 6,
				message: "Password should be at least 6 characters long",
			},
		},
		placeholder: "Password",
		secure: true,
		Icon: <AntDesign name="unlock" size={24} color="black" />,
	},
	{
		name: "passwordConfirm",
		rules: {
			required: "Password is required",
			minLength: {
				value: 6,
				message: "Password should be at least 6 characters long",
			},
		},
		placeholder: "Confirm Password",
		secure: true,
		Icon: <AntDesign name="unlock" size={24} color="black" />,
	},
];

/**
 * A settings screen which allows user to verify email, change password and log out of the application
 * @component
 */
export default function Settings() {
	const user = useAuthContext();
	if (!user) return null;

	const {
		control,
		handleSubmit,
		setError,
		reset,
		formState: { errors },
	} = useForm({ defaultValues });

	const changePassword = handleSubmit(async data => {
		if (data.password !== data.passwordConfirm) {
			setError("passwordConfirm", {
				message: "The passwords should match one another",
			});
			return;
		}
		try {
			await updatePassword(user, data.password);
			reset();
			Alert.alert("Message", "Password updated successfully");
		} catch {
			Alert.alert(
				"Error",
				"An error occured while changing the password, try again later"
			);
		}
	});

	return (
		<Container title="Settings" settings={false}>
			<View style={{ marginVertical: 10 }}>
				<Text style={{ textAlign: "center" }}>Welcome, {user.email}</Text>
			</View>
			{!user.emailVerified && (
				<View
					style={{
						marginBottom: 15,
						alignItems: "center",
					}}
				>
					<Text>Your email address is not verified</Text>
					<Pressable
						onPress={() => sendEmailVerification(user)}
						style={styles.btn}
					>
						<Text style={styles.btnText}>Verify email address</Text>
					</Pressable>
				</View>
			)}

			<View>
				<Text style={styles.subTitle}>Update Password</Text>
				<View style={errorStyles.errorContainer}>
					{errors.password && (
						<Text style={errorStyles.error}>
							{errors.password.message}
						</Text>
					)}
					{errors.passwordConfirm && (
						<Text style={errorStyles.error}>
							{errors.passwordConfirm.message}
						</Text>
					)}
				</View>

				<Form
					inputs={inputs}
					control={control}
					errors={errors}
					action={changePassword}
					label="Change Password"
				/>
			</View>

			<Link href={{ pathname: "/(protected)/projects/invitations" }} asChild>
				<Pressable style={styles.btn}>
					<Text style={styles.btnText}>Invitations</Text>
				</Pressable>
			</Link>

			<View style={styles.container}>
				<Pressable
					onPress={() => signOut(Auth)}
					style={[styles.btn, styles.btnDanger]}
				>
					<Text style={styles.btnText}>Log out</Text>
				</Pressable>
			</View>
		</Container>
	);
}

const styles = StyleSheet.create({
	container: {
		display: "flex",
		flex: 1,
		justifyContent: "flex-end",
		alignItems: "center",
	},
	btn: {
		marginVertical: 5,
		borderRadius: 20,
		backgroundColor: "#555",
		paddingVertical: 15,
		width: "90%",
		alignSelf: "center",
	},
	btnDanger: {
		backgroundColor: "#DF6653",
	},
	btnText: {
		color: "white",
		textAlign: "center",
		fontSize: 18,
	},
	subTitle: {
		fontSize: 20,
		fontWeight: "500",
		textAlign: "center",
	},
});
