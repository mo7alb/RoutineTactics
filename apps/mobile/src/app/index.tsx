import React from "react";
import { View, Text, SafeAreaView, StyleSheet } from "react-native";
import { Link } from "expo-router";
import Container from "../components/UI/container";

export default function HomeScreen() {
	return (
		<Container>
			<Text>Home</Text>
			<Link href="/(public)/login">Login</Link>

			<View style={styles.reigster}>
				<Text>Don't have an account</Text>
				<Link href="/(public)/register" style={styles.registerText}>
					Register
				</Link>
			</View>
		</Container>
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
