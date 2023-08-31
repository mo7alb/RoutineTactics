import { Text, SafeAreaView, ActivityIndicator } from "react-native";
import React from "react";
import { useLocalSearchParams } from "expo-router";
import { useQuery } from "@tanstack/react-query";
import { getProject } from "../../../../api/project";
import { useAuthContext } from "../../../../context/AuthContext";
import CloseModal from "../../../../components/UI/modal/CloseModal";
import Container from "../../../../components/UI/container";
import UpdateProjectForm from "../../../../components/UpdateProject";
import { modalStyles } from "../../../../components/styles/modal";

export default function UpdateProject() {
	const { id } = useLocalSearchParams();

	const user = useAuthContext();
	if (!user) return null;

	const { data, isError, error, isLoading } = useQuery({
		queryKey: ["project", id],
		queryFn: () => getProject(user, id as string),
	});

	if (isLoading) {
		return (
			<Container title="Edit project">
				<ActivityIndicator />
			</Container>
		);
	}

	if (isError) {
		return (
			<Container title="Edit project">
				<Text>
					{error instanceof Error ? error.message : "an error occured"}
				</Text>
			</Container>
		);
	}

	return (
		<SafeAreaView style={modalStyles.container}>
			<CloseModal />
			<Text style={modalStyles.title}>Edit Project</Text>
			<UpdateProjectForm user={user} project={data} />
		</SafeAreaView>
	);
}
