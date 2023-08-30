import { Text, SafeAreaView, StyleSheet } from "react-native";
import React from "react";
import NewProjectForm from "../../../../components/NewProject/Form";
import CloseModal from "../../../../components/UI/modal/CloseModal";

export default function NewProject() {
	return (
		<SafeAreaView style={styles.container}>
			<CloseModal />
			<Text style={styles.title}>New project</Text>
			<NewProjectForm />
		</SafeAreaView>
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
		right: 15,
		top: 60,
	},
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
