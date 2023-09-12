import React from "react";
import { StyleSheet, View, Text } from "react-native";
import { Link } from "expo-router";
import Register from "../../components/register";
import Container from "../../components/UI/Container";

/**
 * A react component that represents the register screen
 * @component
 */
export default function RegisterScreen() {
	return (
		<Container title="Register" settings={false}>
			<View style={styles.container}>
				<Register />
				<View style={styles.login}>
					<Text>Have an account already, </Text>
					<Link href="/login" style={styles.loginText}>
						Login
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
