import React from "react";
import { router, Link } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";
import { StyleSheet } from "react-native";

export default function CloseModal() {
	const isVisible = router.canGoBack();
	console.log(isVisible);
	return (
		<>
			{!isVisible && <Link href="../">Dismiss</Link>}
			<Ionicons
				name="close"
				size={32}
				color="red"
				onPress={() => router.back()}
				style={styles.close}
			/>
		</>
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
		zIndex: 1,
	},
});
