import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import React from "react";
import Container from "../../../../components/UI/container";
import CloseModal from "../../../../components/UI/modal/CloseModal";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import { useLocalSearchParams, router } from "expo-router";
import { deleteProject } from "../../../../api/project";
import { useAuthContext } from "../../../../context/AuthContext";
import { deleteTask } from "../../../../api/task";
import { useGetTaskQuery } from "../../../../hooks/useGetTaskQuery";

export default function DeleteTask() {
	const { id } = useLocalSearchParams();

	const user = useAuthContext();
	if (!user) return null;

	const { task } = useGetTaskQuery(id as string, user);

	const queryClient = useQueryClient();

	const mutation = useMutation({
		mutationFn: () => deleteTask(user, id as string),
		onSuccess: () => {
			queryClient.invalidateQueries(["project", task?.projectId]);
		},
		onError: error => alert(error),
	});

	const handleDeleteTask = () => {
		mutation.mutate();
		if (router.canGoBack())
			router.replace({
				pathname: "/app/projects/details",
				params: { id: task?.projectId },
			});
		else router.replace({ pathname: "/app/dashboard" });
	};

	return (
		<Container>
			<CloseModal />
			<View style={styles.container}>
				<Text style={styles.title}>Delete Task</Text>
				<Text style={styles.warning}>
					Are you sure you want to delete this task?
				</Text>
				<TouchableOpacity style={styles.btn} onPress={handleDeleteTask}>
					<Text style={styles.btnText}>Delete Task</Text>
				</TouchableOpacity>
			</View>
		</Container>
	);
}

const styles = StyleSheet.create({
	close: {
		width: 55,
		height: 55,
		marginBottom: 10,
		borderWidth: 1,
		borderColor: "#f2f2f2",
		padding: 10,
		borderRadius: 10,
		alignSelf: "center",
		position: "absolute",
		zIndex: 1,
		right: 15,
		top: 60,
	},
	container: {
		height: "100%",
		justifyContent: "center",
		alignItems: "center",
	},
	title: {
		fontWeight: "bold",
		color: "red",
		fontSize: 30,
		marginBottom: 25,
	},
	warning: {
		fontSize: 18,
	},
	btn: {
		width: "90%",
		backgroundColor: "#DF6653",
		paddingVertical: 10,
		marginVertical: 10,
		borderRadius: 20,
	},
	btnText: {
		color: "white",
		textAlign: "center",
		fontSize: 18,
	},
});
