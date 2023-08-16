import { View, Text, Button, SafeAreaView } from "react-native";
import React from "react";
import ProjectList from "../components/ProjectList";
import { signOut } from "firebase/auth";
import { Auth } from "../config/firebaseConfig";

export default function Dashboard() {
	return (
		<SafeAreaView>
			<Text>Dashboard</Text>
			<Button title="Create New Project" />
			<ProjectList />
			<Button title="Logout" onPress={async () => await signOut(Auth)} />
		</SafeAreaView>
	);
}
