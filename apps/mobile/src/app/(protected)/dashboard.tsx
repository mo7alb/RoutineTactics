import { Button, StyleSheet } from "react-native";
import React from "react";
import { signOut } from "firebase/auth";
import { Auth } from "../../config/firebase";
import ProjectList from "../../components/ProjectList";
import Container from "../../components/UI/container";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Link } from "expo-router";

export default function Dashboard() {
	return (
		<Container title="Dashboard">
			<Link href="/newProject" style={styles.modalToggle}>
				<Ionicons name="add" size={32} color="teal" />
			</Link>

			<ProjectList />
			<Button title="logout" onPress={() => signOut(Auth)} />
		</Container>
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
