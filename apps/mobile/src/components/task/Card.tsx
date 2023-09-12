import { Pressable, StyleSheet, Text, View } from "react-native";
import { Task } from "../../types/task";
import { Link } from "expo-router";
import { AntDesign } from "@expo/vector-icons";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { editTask } from "../../api/tasks";
import { useAuthContext } from "../../context/authContext";

type Props = {
	task: Task;
};

/**
 * A react component to render a single task
 * @component
 * @example
 * const task = { title: "task", completed: false, description: "this is a task"}
 * return <TaskCard task={task} />
 */
export default function TaskCard({ task }: Props) {
	const taskDueDate = task.dueDate == null ? null : new Date(task.dueDate);
	const queryClient = useQueryClient();

	const user = useAuthContext();

	// update the task
	const taskCompleted = useMutation({
		mutationFn: (completed: boolean) =>
			editTask(user!, task.id!, { ...task, completed }),
		onSuccess: () => {
			queryClient.invalidateQueries(["tasks"]);
			queryClient.invalidateQueries(["project", task.projectId]);
		},
	});

	if (!user) return null;
	return (
		<View style={styles.container}>
			<Link
				href={{
					pathname: "/tasks/details",
					params: { id: task.id! },
				}}
				asChild
			>
				<Pressable style={styles.details}>
					<Text style={styles.title}>{task.title}</Text>
					{taskDueDate != undefined && taskDueDate < new Date() && (
						<AntDesign
							name="exclamationcircle"
							size={24}
							color="#DC143C"
						/>
					)}
					<AntDesign name="right" size={24} color="black" />
				</Pressable>
			</Link>
			<Pressable
				onPress={() => taskCompleted.mutate(!task.completed)}
				style={styles.completed}
			>
				<AntDesign
					name="checkcircleo"
					size={24}
					color={task.completed ? "green" : "black"}
				/>
			</Pressable>
		</View>
	);
}

const styles = StyleSheet.create({
	title: {
		fontWeight: "bold",
		fontSize: 20,
		textAlign: "left",
	},
	container: {
		borderColor: "black",
		borderBottomWidth: 1,
		display: "flex",
		flexDirection: "row",
		justifyContent: "space-between",
		padding: 5,
		marginVertical: 15,
		width: "98%",
		alignSelf: "center",
	},
	details: {
		width: "90%",
		display: "flex",
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
	},
	completed: {
		width: "7%",
	},
	date: {
		fontWeight: "bold",
		color: "#A9A9A9",
	},
});
