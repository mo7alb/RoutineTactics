import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Link, useLocalSearchParams } from "expo-router";
import Container from "../../../components/UI/Container";
import FetchError from "../../../components/UI/FetchError";
import Loading from "../../../components/UI/Loading";
import { useAuthContext } from "../../../context/authContext";
import { useProjects } from "../../../hooks/useProjects";
import { Ionicons } from "@expo/vector-icons";
import EditIcon from "../../../components/UI/EditIcon";
import DeleteIcon from "../../../components/UI/DeleteIcon";
import TaskList from "../../../components/task/List";
import NewButton from "../../../components/UI/NewButton";

/**
 * A react component to render details related to a specific project
 * @component
 */
export default function ProjectDetails() {
	const { id } = useLocalSearchParams();

	const user = useAuthContext();
	if (!user) return null;

	// fetch project
	const { project } = useProjects(user);
	const { data, loadingProject, isProjectError, projectError } = project(
		id as string
	);

	if (loadingProject)
		return <Loading title="Dashboard" message="Loading Project" />;
	else if (isProjectError)
		return <FetchError title="Dashboard" error={projectError} />;

	if (data == null) return null;

	return (
		<Container title="Project Details" settings={true}>
			<View style={styles.containerWrapper}>
				{/* Project details */}
				<View style={styles.detailContainer}>
					<Text style={styles.projectName}>{data.name}</Text>
					<Text style={styles.projectDescription}>{data.description}</Text>
					{data.dueDate != null && (
						<Text style={styles.projectDueDate}>
							{new Date(data.dueDate).toDateString()}
						</Text>
					)}
				</View>
				<View style={styles.iconContainer}>
					<Link
						href={{
							pathname: "/(protected)/projects/members",
							params: { id: data.id! },
						}}
					>
						<Ionicons
							name="person-circle-outline"
							size={24}
							color="black"
						/>
					</Link>
					{user.uid === data.userId && (
						<>
							<EditIcon
								path={{
									pathname: "/(protected)/projects/edit",
									params: { id: data.id! },
								}}
							/>
							<DeleteIcon
								path={{
									pathname: "/(protected)/projects/delete",
									params: { id: data.id! },
								}}
							/>
						</>
					)}
				</View>
			</View>
			<TaskList tasks={data.tasks} categories={data.categories} />
			<NewButton
				path={{ pathname: "/tasks/new", params: { id: data.id! } }}
			/>
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
	projectName: {
		fontSize: 18,
		fontWeight: "600",
	},
	projectDescription: {
		fontSize: 16,
		flexWrap: "wrap",
	},
	projectDueDate: {
		fontSize: 17,
		fontWeight: "500",
	},
});
