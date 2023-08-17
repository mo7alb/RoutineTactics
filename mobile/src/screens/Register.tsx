import { Text, SafeAreaView, Button, StyleSheet } from "react-native";
import React from "react";
import { NavigationProp } from "@react-navigation/native";
import RegisterForm from "../components/RegisterForm";

export default function Register({
	navigation,
}: {
	navigation: NavigationProp<any, any>;
}) {
	return (
		<SafeAreaView>
			<Text>Register</Text>
			<RegisterForm />
			<Button title="Login" onPress={() => navigation.navigate("Login")} />
		</SafeAreaView>
	);
}
