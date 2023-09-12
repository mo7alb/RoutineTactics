import React, { useEffect, useState } from "react";
import {
	Dimensions,
	Text,
	ScrollView,
	StyleSheet,
	View,
	FlatList,
} from "react-native";
import { Task } from "../../types/task";
import Dropdown from "../UI/DropDown";
import TaskCard from "./Card";

type Props = {
	tasks: Task[];
	categories: string[];
};

/**
 * A react component to render a list of tasks.
 * @component
 */
export default function TaskList({ tasks, categories }: Props) {
	const [tasksToDisplay, setTasksToDisplay] = useState<Task[]>([]);
	const [label, setLabel] = useState("pending");

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
		<View style={styles.container}>
			<Dropdown
				options={["all", "pending", "completed", ...categories]}
				label="Select Label"
				selected={label}
				setSelected={setLabel}
			/>

			{tasksToDisplay.length == 0 && (
				<Text style={styles.noTaskTest}>
					No Tasks. Get started by adding new Tasks
				</Text>
			)}

			{tasksToDisplay.length > 0 && (
				<FlatList
					data={tasksToDisplay}
					renderItem={({ item }) => <TaskCard task={item} />}
				/>
			)}
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		height: "90%",
	},
	list: {
		flex: 1,
	},
	noTaskTest: {
		paddingLeft: 20,
	},
});
