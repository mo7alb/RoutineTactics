import React from "react";
import { View } from "react-native";
import TaskCard from "./Card";
import { Task } from "../../types/task";

type Props = {
	tasks: Task[];
};

export default function TaskList({ tasks }: Props) {
	return (
		<View>
			{tasks.map(task => (
				<>
					<TaskCard task={task} key={task.id} />
				</>
			))}
		</View>
	);
}
