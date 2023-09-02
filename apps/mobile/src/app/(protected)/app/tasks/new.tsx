import {
	Text,
	SafeAreaView,
	StyleSheet,
	ActivityIndicator,
} from "react-native";
import React from "react";
import CloseModal from "../../../../components/UI/modal/CloseModal";
import NewTaskForm from "../../../../components/NewTask";
import { useLocalSearchParams } from "expo-router";
import Container from "../../../../components/UI/container";
import { useAuthContext } from "../../../../context/AuthContext";
import { useGetProjectQuery } from "../../../../hooks/useGetProjectQuery";

export default function NewTask() {
	const { id } = useLocalSearchParams();
	const user = useAuthContext();
	if (user == null) return;

	const { project, isError, error, isLoading } = useGetProjectQuery(
		user,
		id as string
	);

	if (project == null) return null;

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
		<SafeAreaView style={styles.container}>
			<CloseModal />
			<Text style={styles.title}>New task</Text>
			<NewTaskForm projectId={project.id!} categories={project.categories} />
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	container: {
		height: "100%",
		justifyContent: "center",
	},
	title: {
		fontWeight: "bold",
		fontSize: 30,
		textAlign: "center",
		marginBottom: 25,
	},
});
