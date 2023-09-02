import { View, Text, ActivityIndicator, StyleSheet } from "react-native";
import React from "react";
import Container from "../../../../components/UI/container";
import { useAuthContext } from "../../../../context/AuthContext";
import { useLocalSearchParams } from "expo-router";
import DeleteIcon from "../../../../components/UI/deleteIcon";
import EditIcon from "../../../../components/UI/editIcon";
import Comments from "../../../../components/Comments";
import Loading from "../../../../components/UI/loading";
import Error from "../../../../components/UI/error";
import { useGetTaskQuery } from "../../../../hooks/useGetTaskQuery";

export default function TaskDetails() {
	const { id } = useLocalSearchParams();

	const user = useAuthContext();
	if (user == null) return <View>Unauthenticated</View>;

	const { task, isError, error, isLoading } = useGetTaskQuery(
		id as string,
		user
	);
	if (task == undefined) return null;

	if (isLoading) return <Loading title="Task Details" />;

	if (isError) return <Error title="Task Details" error={error} />;

	return (
		<Container title="Task Details">
			{/* display task details */}
			<View>
				<Text>{task.title}</Text>
				<Text>{task.description}</Text>
				{task.dueDate != null && (
					<Text>{new Date(task.dueDate).toDateString()}</Text>
				)}
			</View>
			{user.uid == task.createdById && (
				<View style={styles.iconContainer}>
					<EditIcon
						path={{
							pathname: "/app/tasks/update",
							params: { id: task.id! },
						}}
					/>
					<DeleteIcon
						path={{
							pathname: "/app/tasks/delete",
							params: { id: task.id! },
						}}
					/>
				</View>
			)}
			<Text>{JSON.stringify(task.labels)}</Text>
			<Comments comments={task.comments} taskId={task.id!} />
		</Container>
	);
}

const styles = StyleSheet.create({
	iconContainer: {
		display: "flex",
		flexDirection: "row",
		position: "absolute",
		top: 10,
		right: 10,
		padding: 10,
	},
});
