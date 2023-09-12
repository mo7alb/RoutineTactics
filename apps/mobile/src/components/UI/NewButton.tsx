import React from "react";
import { StyleSheet, View } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Link } from "expo-router";

type Props = {
	path: string | { pathname: string; params: { id: string } };
};

/**
 * A react component that renders an icon to open a model for creating a new item (either project or task)
 * @component
 */
export default function NewButton({ path }: Props) {
	return (
		<View style={styles.btn}>
			<Link href={path}>
				<Ionicons name="add" size={25} color="white" />
			</Link>
		</View>
	);
}

const styles = StyleSheet.create({
	btn: {
		marginBottom: 10,
		backgroundColor: "#777",
		padding: 10,
		borderRadius: 30,
		position: "absolute",
		zIndex: 1,
		bottom: 15,
		right: 15,
	},
});
