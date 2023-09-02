import { View, Text, SafeAreaView } from "react-native";
import React from "react";
import { modalStyles } from "../../../../components/styles/modal";
import CloseModal from "../../../../components/UI/modal/CloseModal";
import { useLocalSearchParams } from "expo-router";
import { useQuery } from "@tanstack/react-query";
import { getTask } from "../../../../api/task";
import { useAuthContext } from "../../../../context/AuthContext";
import Loading from "../../../../components/UI/loading";
import Error from "../../../../components/UI/error";
import UpdateTaskForm from "../../../../components/UpdateTask";
import { useGetTaskQuery } from "../../../../hooks/useGetTaskQuery";

export default function UpdateTask() {
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
		<SafeAreaView style={modalStyles.container}>
			<CloseModal />
			<Text style={modalStyles.title}>Edit Task</Text>
			<UpdateTaskForm task={task} />
		</SafeAreaView>
	);
}
