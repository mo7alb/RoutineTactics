import React from "react";
import { StyleSheet, Text, View } from "react-native";
import TaskList from "./TaskList";

export default function ProjectCard() {
	const project = {
		name: "Project Name",
		description: "This is a project",
		dueDate: new Date(),
		tasks: [
			{ id: 1, name: "task 1", completed: false },
			{ id: 2, name: "task 2", completed: false },
		],
	};
	return (
		<View style={styles.container}>
			<Text>{project.name}</Text>
			<Text>{project.dueDate.toUTCString()}</Text>
			<TaskList tasks={project.tasks} />
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		borderColor: "black",
		borderWidth: 1,
		padding: 5,
		margin: 3,
	},
});
