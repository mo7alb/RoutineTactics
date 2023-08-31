import React from "react";
import { StyleSheet } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Link } from "expo-router";

type Path = string | { pathname: string; params: { id: string } };

type Props = {
	path: Path;
};

export default function OpenModal({ path }: Props) {
	return (
		<Link href={path} style={styles.modalToggle}>
			<Ionicons name="add" size={32} color="teal" />
		</Link>
	);
}

const styles = StyleSheet.create({
	modalToggle: {
		width: 55,
		height: 55,
		marginBottom: 10,
		borderWidth: 1,
		borderColor: "#f2f2f2",
		padding: 10,
		borderRadius: 10,
		alignSelf: "center",
		position: "absolute",
		zIndex: 1,
		bottom: 15,
		right: 15,
	},
});
