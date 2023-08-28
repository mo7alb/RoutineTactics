import React from "react";
import { View, Text, SafeAreaView } from "react-native";
import { Link } from "expo-router";
import { containerStyles } from "../components/styles/container";
import RegisterForm from "../components/RegisterForm";

export default function RegisterScreen() {
	return (
		<SafeAreaView style={containerStyles.container}>
			<View>
				<Text>Register</Text>
				<RegisterForm />
				<Link href="/">Login</Link>
			</View>
		</SafeAreaView>
	);
}
