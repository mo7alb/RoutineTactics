import { View, Text, SafeAreaView, StyleSheet } from "react-native";
import React from "react";
import NewProjectForm from "../../components/NewProject/Form";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Link, router } from "expo-router";

export default function NewProject() {
	const isVisible = router.canGoBack();

	return (
		<SafeAreaView style={styles.container}>
			{!isVisible && <Link href="../">Dismiss</Link>}
			<Ionicons
				name="close"
				size={32}
				color="red"
				onPress={() => router.back()}
				style={styles.close}
			/>

			<NewProjectForm />
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	close: {
		width: 55,
		height: 55,
		marginBottom: 10,
		borderWidth: 1,
		borderColor: "#f2f2f2",
		padding: 10,
		borderRadius: 10,
		alignSelf: "center",
		position: "absolute",
		right: 15,
		top: 60,
	},
	container: {
		height: "100%",
		justifyContent: "center",
	},
});
