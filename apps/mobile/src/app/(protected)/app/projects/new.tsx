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
