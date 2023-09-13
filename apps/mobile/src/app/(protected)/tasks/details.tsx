import { useLocalSearchParams } from "expo-router";
import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import Container from "../../../components/UI/Container";
import DeleteIcon from "../../../components/UI/DeleteIcon";
import EditIcon from "../../../components/UI/EditIcon";
import FetchError from "../../../components/UI/FetchError";
import Loading from "../../../components/UI/Loading";
import { useAuthContext } from "../../../context/authContext";
import Comments from "../../../components/comments";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { editTask, getTask } from "../../../api/tasks";
import AssignTask from "../../../components/assignTask";
import { Task } from "../../../types/task";

/**
 * A react component to render details of a task along with the comments
 * @component
 */
export default function TaskDetails() {
	const { id } = useLocalSearchParams();

	const user = useAuthContext();
	const queryClient = useQueryClient();

	const {
		isLoading: loadingTask,
		isError: isTaskError,
		error: TaskError,
		data,
	} = useQuery({
		queryFn: () => getTask(user!, id as string),
		queryKey: ["task", id],
	});
	const changeTask = useMutation({
		mutationFn: (changedTask: Task) =>
			editTask(user!, id as string, changedTask),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["tasks"] });
			queryClient.invalidateQueries({ queryKey: ["task", id] });
		},
	});

	if (!user) return null;

	if (loadingTask)
		return <Loading title="Task Details" message="Loading Task" />;
	else if (isTaskError)
		return <FetchError title="Task Details" error={TaskError} />;

	return (
		<Container settings={true} title="Task Details">
			<View style={styles.containerWrapper}>
				<View style={styles.detailContainer}>
					<Text style={styles.taskTitle}>{data.title}</Text>
					{data.description && (
						<Text style={styles.taskDescription}>{data.description}</Text>
					)}
					{data.dueDate != null && (
						<Text style={styles.taskDueDate}>
							{new Date(data.dueDate).toDateString()}
						</Text>
					)}
				</View>
				<View style={styles.iconContainer}>
					{user.uid == data.createdById && (
						<>
							<EditIcon
								path={{
									pathname: "/tasks/edit",
									// @ts-ignore
									params: { id: data.id!, projectId: data.projectId },
								}}
							/>
							<DeleteIcon
								path={{
									pathname: "/tasks/delete",
									params: { id: data.id! },
								}}
							/>
						</>
					)}
				</View>
			</View>
			<AssignTask task={data} />

			<View style={{ maxHeight: "85%" }}>
				<Comments comments={data.comments} taskId={data.id!} />
			</View>
			<Pressable
				style={[styles.btn, data.completed ? styles.btnCompleted : {}]}
				onPress={() =>
					changeTask.mutate({ ...data, completed: !data.completed })
				}
			>
				<Text style={styles.btnText}>
					{data.completed ? "Completed" : "Done"}
				</Text>
			</Pressable>
		</Container>
	);
}

const styles = StyleSheet.create({
	containerWrapper: {
		display: "flex",
		flexDirection: "row",
	},
	detailContainer: {
		width: "85%",
		paddingLeft: 15,
	},
	iconContainer: {
		width: "15%",
		display: "flex",
		flexDirection: "column",
	},
	taskTitle: {
		fontSize: 18,
		fontWeight: "600",
	},
	taskDescription: {
		fontSize: 16,
		flexWrap: "wrap",
	},
	taskDueDate: {
		fontSize: 17,
		fontWeight: "500",
	},
	btn: {
		backgroundColor: "#555",
		width: "90%",
		paddingVertical: 15,
		alignSelf: "center",
		marginRight: 10,
		borderRadius: 10,
		// marginTop: 10,
	},
	btnCompleted: { backgroundColor: "green" },
	btnText: { color: "white", textAlign: "center", fontSize: 16 },
});
