import { View, Text, Button } from "react-native";
import React from "react";
import ProjectList from "../components/ProjectList";

export default function Home() {
	return (
		<View>
			<Text>Home</Text>
			<Button title="Create New Project" />
			<ProjectList />
		</View>
	);
}
