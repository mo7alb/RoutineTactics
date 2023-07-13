import { View, Text, Button } from "react-native";
import React from "react";
import { ScreenProps } from "../types/screenProps";

export default function Home({ navigation }: ScreenProps) {
	return (
		<View>
			<Text>Home</Text>
			<Button title="Login" onPress={() => navigation.navigate("Login")} />
			<Button
				title="Register"
				onPress={() => navigation.navigate("Login")}
			/>
		</View>
	);
}
