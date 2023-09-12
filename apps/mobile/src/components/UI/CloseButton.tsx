import React from "react";
import { router, Link } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";
import { StyleSheet, View } from "react-native";

/**
 * A react component used to close a modal
 * @component
 */
export default function CloseButton() {
	const isVisible = router.canGoBack();
	return (
		<>
			{!isVisible && <Link href="../">Dismiss</Link>}
			<Ionicons
				name="close"
				size={25}
				color="#DF6653"
				onPress={() => router.back()}
				style={styles.close}
			/>
		</>
	);
}

const styles = StyleSheet.create({
	close: {
		marginBottom: 10,
		padding: 10,
		borderRadius: 25,
		alignSelf: "center",
		position: "absolute",
		right: 15,
		top: 15,
		zIndex: 1,
	},
});
