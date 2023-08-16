import { View, Text, SafeAreaView, Button } from "react-native";
import React from "react";
import { NavigationProp } from "@react-navigation/native";

export default function Register({
	navigation,
}: {
	navigation: NavigationProp<any, any>;
}) {
	return (
		<SafeAreaView>
			<Text>Register</Text>

			<Button title="Login" onPress={() => navigation.navigate("Login")} />
		</SafeAreaView>
	);
}
