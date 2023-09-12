import { View, Text, StyleSheet, FlatList } from "react-native";
import React from "react";
import { Project } from "../../types/project";
import ProjectCard from "./Card";

type Props = {
	projects: Project[];
};

/**
 * A react component to render a list of projects to the user
 * @component
 * @example
 * const projects = [{name: "Project 1", description: "some description"}, {name: "Project 2", description: "some description"}]
 * return <ProjectList projects={projects} />
 */
export default function ProjectList({ projects }: Props) {
	return (
		<View style={styles.container}>
			<Text style={styles.subtitle}>Projects</Text>

			{projects.length == 0 && (
				<Text style={styles.noProjectText}>
					No projects yet, start by adding a new project
				</Text>
			)}
			{projects.length !== 0 && (
				<>
					<FlatList
						style={styles.projectList}
						data={projects}
						renderItem={({ item }) => <ProjectCard project={item} />}
					/>
				</>
			)}
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		maxHeight: "50%",
	},
	noProjectText: { paddingLeft: 20 },
	subtitle: {
		fontWeight: "500",
		fontSize: 25,
		paddingLeft: 20,
	},
	projectList: {
		alignSelf: "center",
	},
});
