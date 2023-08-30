import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { Project } from "../../types/project";
import { Link } from "expo-router";
import { AntDesign } from "@expo/vector-icons";

type Prop = {
	project: Project;
};

export default function ProjectCard({ project }: Prop) {
	return (
		<View style={styles.container}>
			{/* View for project details */}
			<View style={styles.details}>
				<Text>{project.name}</Text>
				{project.description && <Text>{project.description}</Text>}
			</View>
			{/* View for naviagation */}
			<View style={styles.navigation}>
				<Link
					href={{
						pathname: `/app/projects/details`,
						params: { id: project.id },
					}}
				>
					<AntDesign name="right" size={24} color="black" />
				</Link>
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		width: "90%",
		borderColor: "black",
		borderWidth: 1,
		padding: 5,
		margin: 3,
		display: "flex",
		flexDirection: "row",
	},
	details: {
		width: "90%",
	},
	navigation: {
		width: "5%",
		justifyContent: "center",
	},
});
