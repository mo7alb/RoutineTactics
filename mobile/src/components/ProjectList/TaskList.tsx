import { StyleSheet, Text, View } from "react-native";
import React from "react";

interface Task {
	id: number;
	name: string;
	completed: boolean;
}

interface Props {
	tasks: Task[];
}

export default function TaskList({ tasks }: Props) {
	return (
		<View>
			{tasks.map(task => (
				<View key={task.id}>
					<Text>{task.name}</Text>
				</View>
			))}
		</View>
	);
}

const styles = StyleSheet.create({});
