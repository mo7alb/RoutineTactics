import { AntDesign } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import LandingImage from "../../assets/images/landingImage.png";
import Container from "../components/UI/Container";

/**
 * A react component that represents the onboarding screen of the app
 * @component
 */
export default function HomeScreen() {
	return (
		<Container settings={false}>
			<View style={styles.titleContainer}>
				<Text style={styles.title}>Routine Tactics</Text>
			</View>
			<View style={styles.imageContainer}>
				<Image source={LandingImage} />
				<Text style={styles.subtitle}>Manage tasks efficiently</Text>
			</View>
			<Pressable
				style={styles.btn}
				onPress={() => router.push("/(public)/login")}
			>
				<Text style={styles.btnText}>Get Started</Text>
				<AntDesign name="right" size={24} color="black" />
			</Pressable>
		</Container>
	);
}

const styles = StyleSheet.create({
	titleContainer: {
		marginTop: 20,
	},
	title: {
		fontWeight: "bold",
		fontSize: 31,
		textAlign: "center",
	},
	imageContainer: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
	},
	subtitle: {
		fontWeight: "bold",
		fontSize: 23,
	},
	btn: {
		padding: 20,
		width: "90%",
		display: "flex",
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
		borderRadius: 10,
		backgroundColor: "#94A6B3",
		alignSelf: "center",
	},
	btnText: {
		fontWeight: "bold",
	},
});
