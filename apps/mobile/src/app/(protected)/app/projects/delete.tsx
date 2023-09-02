import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import { router, useLocalSearchParams } from "expo-router";
import Container from "../../../../components/UI/container";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteProject } from "../../../../api/project";
import { useAuthContext } from "../../../../context/AuthContext";
import CloseModal from "../../../../components/UI/modal/CloseModal";

export default function DeleteProject() {
	const { id } = useLocalSearchParams();

	const user = useAuthContext();
	if (!user) return null;

	const queryClient = useQueryClient();

	const mutation = useMutation({
		mutationFn: () => deleteProject(user, id as string),
		onSuccess: () => {
			queryClient.invalidateQueries(["projects"]);
		},
		onError: error => {
			console.error("An error occured");

			alert(error);
		},
	});
	const handleDeleteProject = () => {
		mutation.mutate();
		router.replace("/app/dashboard");
	};

	return (
		<Container>
			<CloseModal />
			<View style={styles.container}>
				<Text style={styles.title}>Delete Project</Text>
				<Text style={styles.warning}>
					Are you sure you want to delete this project?
				</Text>
				<TouchableOpacity style={styles.btn} onPress={handleDeleteProject}>
					<Text style={styles.btnText}>Delete Project</Text>
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
