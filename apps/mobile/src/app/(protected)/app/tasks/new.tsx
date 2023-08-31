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
import { useQuery } from "@tanstack/react-query";
import { getProject } from "../../../../api/project";
import Container from "../../../../components/UI/container";
import { useAuthContext } from "../../../../context/AuthContext";
import { User } from "firebase/auth";

export default function NewTask() {
	const { id } = useLocalSearchParams();
	const user = useAuthContext();

	const { data, isError, error, isLoading } = useQuery({
		queryKey: ["project", id],
		queryFn: () => getProject(user as User, id as string),
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
		<SafeAreaView style={styles.container}>
			<CloseModal />
			<Text style={styles.title}>New task</Text>
			<NewTaskForm projectId={data.id!} categories={data.categories} />
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
