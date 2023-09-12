import { useQueries } from "@tanstack/react-query";
import { router } from "expo-router";
import React, { useEffect } from "react";
import { Alert, FlatList, StyleSheet, Text, View } from "react-native";
import { getInvitations } from "../../api/invitations";
import { getProjects } from "../../api/project";
import { getTasks } from "../../api/tasks";
import Container from "../../components/UI/Container";
import FetchError from "../../components/UI/FetchError";
import Loading from "../../components/UI/Loading";
import NewButton from "../../components/UI/NewButton";
import ProjectList from "../../components/project/List";
import TaskCard from "../../components/task/Card";
import { useAuthContext } from "../../context/authContext";

/**
 * A react component that renders the dashboard or the screen user lands into after
 * autheticating
 *
 * this screen displays a list of projects and tasks that the user is a part of
 *
 * @component
 */
export default function Dashboard() {
	const user = useAuthContext();
	if (!user) return null;

	// query all projects, tasks, and invitations
	const results = useQueries({
		queries: [
			{ queryFn: () => getProjects(user), queryKey: ["projects"] },
			{
				queryFn: () => getTasks(user),
				queryKey: ["tasks"],
			},
			{ queryFn: () => getInvitations(user), queryKey: ["invitations"] },
		],
	});

	const projects = results[0];
	const tasks = results[1];
	const invitations = results[2];

	// if user does have any invitations, redirect them to the invitations modal
	useEffect(() => {
		if (invitations.data == undefined) return;
		if (invitations.data.length > 0) {
			Alert.alert("Message", "You might have some invitations", [
				{
					text: "see Invitations",
					onPress: () => router.push("/projects/invitations"),
				},
				{
					text: "ignore Invitations",
					style: "cancel",
				},
			]);
		}
	}, [invitations.data]);

	// in case the query data is loading, show an activity indicator
	if (projects.isLoading || tasks.isLoading || results[2].isLoading) {
		return <Loading title="Dashboard" message="Loading Projects and Tasks" />;
	}

	// in case of an error, notify the user
	if (projects.isError || tasks.isError) {
		return (
			<FetchError
				title="Dashboard"
				error={projects.isError ? projects.error : tasks.error}
			/>
		);
	}

	return (
		<Container title="Dashboard" settings={true}>
			{/* Create a new project button */}
			<NewButton path="/(protected)/projects/new" />
			<ProjectList projects={projects.data} />
			<View style={styles.container}>
				<Text style={styles.subtitle}>Tasks</Text>
				{tasks.data.length === 0 && (
					<Text style={styles.noTaskText}>
						No Tasks, start by creating projects and tasks
					</Text>
				)}
				{tasks.data.length !== 0 && (
					<FlatList
						style={styles.taskList}
						data={tasks.data}
						renderItem={({ item: task }) => <TaskCard task={task} />}
					/>
				)}
			</View>
		</Container>
	);
}

const styles = StyleSheet.create({
	container: {
		maxHeight: "50%",
		marginTop: 20,
	},
	subtitle: {
		fontWeight: "500",
		fontSize: 25,
		paddingLeft: 20,
	},
	taskList: {
		alignSelf: "center",
	},
	noTaskText: { paddingLeft: 20 },
});
