import { View, Text, Button, SafeAreaView, StyleSheet } from "react-native";
import React from "react";
import { NavigationProp } from "@react-navigation/native";

export default function Home({
	navigation,
}: {
	navigation: NavigationProp<any, any>;
}) {
	return (
		<SafeAreaView style={styles.container}>
			<Text>Home</Text>
			<Button title="Login" onPress={() => navigation.navigate("Login")} />
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
	reigster: {
		display: "flex",
		flexDirection: "row",
		justifyContent: "center",
	},
	registerText: {
		paddingTop: 11,
	},
});
