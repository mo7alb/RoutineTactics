import { Link, router } from "expo-router";
import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import Container from "../../components/UI/Container";
import LoginForm from "../../components/login/Form";

/**
 * A react component that represents the login screen
 * @component
 */
export default function LoginScreen() {
	return (
		<Container title="Login" settings={false}>
			<View style={styles.container}>
				<Text style={styles.subtitle}>Welcome back,</Text>
				<LoginForm />
				<Pressable
					style={styles.forgotPass}
					onPress={() => router.push("/(public)/resetPass")}
				>
					<Text style={styles.btnText}>Forgot Password?</Text>
				</Pressable>
				<View style={styles.register}>
					<Text>Don't have an account, </Text>
					<Link href="/register" style={styles.registerText}>
						Register
					</Link>
				</View>
			</View>
		</Container>
	);
}

const styles = StyleSheet.create({
	container: {
		display: "flex",
		justifyContent: "center",
		flex: 1,
	},
	subtitle: {
		fontWeight: "bold",
		fontSize: 21,
		marginLeft: 15,
	},
	forgotPass: {
		alignSelf: "flex-end",
		padding: 15,
		marginVertical: 5,
	},
	btnText: {
		fontSize: 14,
	},
	register: {
		display: "flex",
		flexDirection: "row",
		justifyContent: "center",
	},
	registerText: {
		color: "#555",
	},
});
