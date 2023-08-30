import React from "react";
import { View, Text, StyleSheet, ActivityIndicator } from "react-native";
import { Feather } from "@expo/vector-icons";
import { AntDesign } from "@expo/vector-icons";
import Container from "../../../components/UI/container";
import { useLocalSearchParams, Redirect, Link } from "expo-router";
import { useAuthContext } from "../../../context/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { getProject } from "../../../api/project";
import { Task } from "../../../types/task";

export default function ProjectDetails() {
	const { id } = useLocalSearchParams();

	const user = useAuthContext();
	if (user == null) return <View>Unauthenticated</View>;

	const { data, isError, error, isLoading } = useQuery({
		queryKey: ["project", id],
		queryFn: () => getProject(user, id as string),
	});

	if (isLoading) {
		return (
			<Container title="Project Details">
				<ActivityIndicator />
			</Container>
		);
	}

	if (isError) {
		return (
			<Container title="Project Details">
				<Text>
					{error instanceof Error ? error.message : "an error occured"}
				</Text>
			</Container>
		);
	}

	return (
		<Container title="Project Details">
			<View>
				<Text>{data.name}</Text>
				<Text>{data.description}</Text>
				{data.dueDate != null ? (
					<Text>{new Date(data.dueDate).toDateString()}</Text>
				) : null}
			</View>
			{user.uid == data.userId && (
				<View style={styles.iconContainer}>
					<Link
						href={{
							pathname: "/projects/edit",
							params: { id: data.id },
						}}
					>
						<Feather
							name="edit"
							size={24}
							color="black"
							style={styles.edit}
						/>
					</Link>
					<Link
						href={{
							pathname: "/projects/delete",
							params: { id: data.id },
						}}
					>
						<AntDesign
							name="delete"
							size={24}
							color="black"
							style={styles.delete}
						/>
					</Link>
				</View>
			)}
			<Text>{JSON.stringify(data.categories)}</Text>
			{/* list of tasks */}
			{data.Task.length != 0 ? (
				<TaskList tasks={data.Task} />
			) : (
				<Text>No Tasks. Get started by adding new Tasks</Text>
			)}
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
	edit: {},
	delete: {
		borderRadius: 20,
	},
});

type Props = {
	tasks: Task[];
};

function TaskList({ tasks }: Props) {
	return (
		<View>
			{tasks.map(task => (
				<TaskCard task={task} />
			))}
		</View>
	);
}

function TaskCard({ task }) {
	return (
		<View>
			<Text>{task.title}</Text>
		</View>
	);
}
