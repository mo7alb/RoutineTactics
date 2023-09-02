import { View, Text, StyleSheet } from "react-native";
import React from "react";
import { Link } from "expo-router";
import LoginForm from "../../components/Login/LoginForm";
import Container from "../../components/UI/container";

export default function LoginScreen() {
	return (
		<Container title="Login">
			<LoginForm />
			<View style={styles.register}>
				<Text>Don't have an account</Text>
				<Link href="/register" style={styles.registerText}>
					Register
				</Link>
			</View>
		</Container>
	);
}

const styles = StyleSheet.create({
	register: {
		display: "flex",
		flexDirection: "row",
		justifyContent: "center",
	},
	registerText: {
		// paddingTop: 11,
		color: "blue",
	},
});
