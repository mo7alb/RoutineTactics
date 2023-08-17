import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { Project } from "../types/project";

export default function ProjectDetails() {
	const project = {
		name: "Something",
		description: "This is some project",
		dueDate: "tommorow",
	};
	return (
		<View>
			<Text>{project.name}</Text>
			<Text>{project.description}</Text>
			<Text>{project.dueDate}</Text>
		</View>
	);
}

const styles = StyleSheet.create({});
