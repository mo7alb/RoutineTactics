import React from "react";
import { View, Text, Button, SafeAreaView, StyleSheet } from "react-native";
import { NavigationProp } from "@react-navigation/native";
import LoginForm from "../components/LoginForm";

export default function Login({
	navigation,
}: {
	navigation: NavigationProp<any, any>;
}) {
	return (
		<SafeAreaView style={styles.container}>
			<Text style={styles.title}>login</Text>
			<LoginForm />
			<View style={styles.reigster}>
				<Text style={styles.registerText}>Don't have an account</Text>
				<Button
					title="register"
					onPress={() => navigation.navigate("Register")}
				/>
			</View>
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: "center",
	},
	title: {
		textAlign: "center",
		fontSize: 30,
	},
	reigster: {
		display: "flex",
		flexDirection: "row",
		justifyContent: "center",
	},
	registerText: {
		paddingTop: 11,
	},
});
