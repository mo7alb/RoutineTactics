import { View, Text, Button, SafeAreaView } from "react-native";
import React from "react";
import ProjectList from "../components/ProjectList";
import { signOut } from "firebase/auth";
import { Auth } from "../config/firebaseConfig";
import { useAuthContext } from "../context/AuthContext";
import { fetchProjects } from "../api/projects";

export default function Dashboard() {
	const user = useAuthContext();
	if (user == null) return;

	const data = fetchProjects(user);
	console.log(`data in component ${JSON.stringify(data)}`);
	return (
		<SafeAreaView>
			<Text>Dashboard</Text>
			<Button title="Create New Project" />
			<ProjectList />
			<Button title="Logout" onPress={async () => await signOut(Auth)} />
			{/* {data.map(project => (
				<Text>{project.id}</Text>
			))} */}
		</SafeAreaView>
	);
}
