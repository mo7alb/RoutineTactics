import { View, Text, StyleSheet, Pressable } from "react-native";
import React from "react";
import ModalContainer from "../../../components/UI/ModalContainer";
import { router, useLocalSearchParams } from "expo-router";
import { useProjects } from "../../../hooks/useProjects";
import { useAuthContext } from "../../../context/authContext";

/**
 * A react native modal to display a warning about deleting a project
 * @component
 */
export default function DeleteProject() {
	const { id } = useLocalSearchParams();

	const user = useAuthContext();
	if (!user) return null;

	const { removeProject } = useProjects(user);
	const { mutate } = removeProject(id as string);

	const handleDeleteProject = () => {
		mutate();
		router.replace("/dashboard");
	};

	return (
		<ModalContainer title="Delete Project">
			<View style={styles.container}>
				<Text style={styles.warning}>
					Are you sure you want to delete this project?
				</Text>
				<Pressable style={styles.btn} onPress={handleDeleteProject}>
					<Text style={styles.btnText}>Delete Project</Text>
				</Pressable>
			</View>
		</ModalContainer>
	);
}

const styles = StyleSheet.create({
	container: {
		height: "100%",
		justifyContent: "center",
		alignItems: "center",
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
