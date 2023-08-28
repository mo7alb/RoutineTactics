import React from "react";
import { View, Text, SafeAreaView, StyleSheet } from "react-native";
import { Link } from "expo-router";
import { containerStyles } from "../components/styles/container";

export default function HomeScreen() {
	return (
		<SafeAreaView style={containerStyles.container}>
			<Text>Home</Text>
			<Link href="/login">Login</Link>

			<View style={styles.reigster}>
				<Text>Don't have an account</Text>
				<Link href="/register" style={styles.registerText}>
					Register
				</Link>
			</View>
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	reigster: {
		display: "flex",
		flexDirection: "row",
		justifyContent: "center",
		alignItems: "center",
	},
	registerText: {
		// paddingTop: 11,
		paddingLeft: 3,
		color: "blue",
	},
});
