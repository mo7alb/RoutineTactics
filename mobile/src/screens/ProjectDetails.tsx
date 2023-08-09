import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { Project } from "../types/project";

export default function ProjectDetails({ project }: { project: Project }) {
	return (
		<View>
			<Text>{project.name}</Text>
			<Text>{project.description}</Text>
			<Text>
				{typeof project.dueDate === "string"
					? project.dueDate
					: project.dueDate.toUTCString()}
			</Text>
		</View>
	);
}

const styles = StyleSheet.create({});
