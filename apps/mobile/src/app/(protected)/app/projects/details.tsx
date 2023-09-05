import React from "react";
import { View, Text, StyleSheet } from "react-native";
import Container from "../../../../components/UI/container";
import { useLocalSearchParams, Link } from "expo-router";
import { useAuthContext } from "../../../../context/AuthContext";
import OpenModal from "../../../../components/UI/modal/OpenModal";
import TaskList from "../../../../components/TaskList";
import EditIcon from "../../../../components/UI/editIcon";
import DeleteIcon from "../../../../components/UI/deleteIcon";
import { Ionicons } from "@expo/vector-icons";
import Loading from "../../../../components/UI/loading";
import Error from "../../../../components/UI/error";
import { useGetProjectQuery } from "../../../../hooks/useGetProjectQuery";

export default function ProjectDetails() {
	const { id } = useLocalSearchParams();

	const user = useAuthContext();
	if (user == null) return <View>Unauthenticated</View>;

	const { project, isLoading, isError, error } = useGetProjectQuery(
		user,
		id as string
	);

	if (project == null) return null;

	if (isLoading) {
		return <Loading title="Project Details" />;
	}

	if (isError) {
		return <Error title="Project Details" error={error} />;
	}

	return (
		<Container title="Project Details">
			{/* Opens up a new task form */}
			<OpenModal
				path={{ pathname: "/app/tasks/new", params: { id: id as string } }}
			/>
			{/* Project details */}
			<View>
				<Text>{project.name}</Text>
				<Text>{project.description}</Text>
				{project.dueDate != null ? (
					<Text>{new Date(project.dueDate).toDateString()}</Text>
				) : null}
			</View>
			{/* display edit and delete buttons for project owner */}
			{user.uid == project.userId && (
				<View style={styles.iconContainer}>
					<Link
						href={{
							pathname: "/app/members",
							params: { id: project.id! },
						}}
					>
						<Ionicons
							name="person-circle-outline"
							size={24}
							color="black"
						/>
					</Link>
					<EditIcon
						path={{
							pathname: "/app/projects/update",
							params: { id: project.id! },
						}}
					/>
					<DeleteIcon
						path={{
							pathname: "/app/projects/delete",
							params: { id: project.id! },
						}}
					/>
				</View>
			)}

			{/* Display list of tasks */}
			<TaskList tasks={project.tasks} categories={project.categories} />
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
