import { View, Text, Pressable, StyleSheet } from "react-native";
import React from "react";
import ModalContainer from "../../../components/UI/ModalContainer";
import { useAuthContext } from "../../../context/authContext";
import { router, useLocalSearchParams } from "expo-router";
import { useTasks } from "../../../hooks/useTasks";

export default function DeleteTask() {
	const { id } = useLocalSearchParams();

	const user = useAuthContext();
	if (!user) return null;

	const { removeTask, task } = useTasks(user);
	const { data } = task(id as string);

	if (!data) return null;

	const { mutate } = removeTask(id as string, data.projectId);

	const handleDeleteTask = () => {
		mutate();
		router.replace({
			pathname: "/(protected)/projects/details",
			params: { id: data.projectId },
		});
	};

	return (
		<ModalContainer title="Delete Task">
			<View style={styles.container}>
				<Text style={styles.warning}>
					Are you sure you want to delete this Task?
				</Text>
				<Pressable style={styles.btn} onPress={handleDeleteTask}>
					<Text style={styles.btnText}>Delete Task</Text>
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
