import React, { useEffect, useState } from "react";
import { Dimensions, Text, ScrollView, StyleSheet } from "react-native";
import TaskCard from "./Card";
import { Task } from "../../types/task";

type Props = {
	tasks: Task[];
	categories: string[];
};

export default function TaskList({ tasks, categories }: Props) {
	const [tasksToDisplay, setTasksToDisplay] = useState<Task[]>([]);
	const [label, setLabel] = useState("pending");
	const [labels, setLabels] = useState<string[]>([
		"all",
		"pending",
		"completed",
		...categories,
	]);

	useEffect(() => {
		if (label === "all") {
			setTasksToDisplay(tasks);
		} else if (label === "pending") {
			setTasksToDisplay(tasks.filter(task => !task.completed));
		} else if (label === "completed") {
			setTasksToDisplay(tasks.filter(task => task.completed));
		} else {
			setTasksToDisplay(
				tasks.filter(task => task.labels.indexOf(label) !== -1)
			);
		}
	}, [tasks, label]);

	return (
		<>
			<ScrollView style={styles.container}>
				{tasksToDisplay.length == 0 && (
					<Text>No Tasks. Get started by adding new Tasks</Text>
				)}
				{tasksToDisplay.map(task => (
					<TaskCard task={task} key={task.id} />
				))}
			</ScrollView>
		</>
	);
}

const styles = StyleSheet.create({
	container: {
		height: Dimensions.get("window").height * 0.8,
	},
});
