import { View, Text, SafeAreaView, StyleSheet } from "react-native";
import React from "react";
import { containerStyles } from "../../components/styles/container";
import { Link } from "expo-router";
import LoginForm from "../../components/login/LoginForm";

export default function LoginScreen() {
	return (
		<SafeAreaView style={containerStyles.container}>
			<Text style={containerStyles.title}>login</Text>
			<LoginForm />
			<View style={styles.register}>
				<Text>Don't have an account</Text>
				<Link href="/register" style={styles.registerText}>
					Register
				</Link>
			</View>
		</SafeAreaView>
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
