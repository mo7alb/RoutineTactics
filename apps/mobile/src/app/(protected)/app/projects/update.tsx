import { Text, SafeAreaView } from "react-native";
import React from "react";
import { useLocalSearchParams } from "expo-router";
import { useAuthContext } from "../../../../context/AuthContext";
import CloseModal from "../../../../components/UI/modal/CloseModal";
import UpdateProjectForm from "../../../../components/UpdateProject";
import { modalStyles } from "../../../../components/styles/modal";
import Loading from "../../../../components/UI/loading";
import Error from "../../../../components/UI/error";
import { useGetProjectQuery } from "../../../../hooks/useGetProjectQuery";

export default function UpdateProject() {
	const { id } = useLocalSearchParams();

	const user = useAuthContext();
	if (!user) return null;

	const { project, isError, error, isLoading } = useGetProjectQuery(
		user,
		id as string
	);
	if (project == null) return null;

	if (isLoading) {
		return <Loading title="Edit Project" />;
	}

	if (isError) {
		return <Error title="Edit project" error={error} />;
	}

	return (
		<SafeAreaView style={modalStyles.container}>
			<CloseModal />
			<Text style={modalStyles.title}>Edit Project</Text>
			<UpdateProjectForm user={user} project={project} />
		</SafeAreaView>
	);
}
