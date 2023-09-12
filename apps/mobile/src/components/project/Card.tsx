import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { Project } from "../../types/project";
import { Link } from "expo-router";
import { AntDesign } from "@expo/vector-icons";

type Prop = {
	project: Project;
};

/**
 * A react component that displays a single project. Usually used within a ProjectList component
 * @component
 * @example
 * const project = {name: "project name"}
 * return <ProjectCard project={project} />
 */
export default function ProjectCard({ project }: Prop) {
	const projectDueDate =
		project.dueDate != null ? new Date(project.dueDate) : null;

	return (
		<Link
			href={{
				pathname: `/projects/details`,
				params: { id: project.id as string },
			}}
			asChild
		>
			<Pressable style={styles.container}>
				{/* View for project details */}
				<View style={styles.details}>
					<Text style={styles.name}>{project.name}</Text>
					{projectDueDate != null && (
						<Text style={styles.date}>
							{projectDueDate.toDateString()}
						</Text>
					)}
				</View>

				{/* exclamation for projects which has its due date passed or is today */}
				{projectDueDate != undefined && projectDueDate < new Date() && (
					<AntDesign name="exclamationcircle" size={24} color="#DC143C" />
				)}
				{/* View for naviagation */}
				<AntDesign name="right" size={24} color="black" />
			</Pressable>
		</Link>
	);
}

const styles = StyleSheet.create({
	container: {
		width: "95%",
		borderColor: "black",
		borderBottomWidth: 1,
		padding: 5,
		margin: 3,
		display: "flex",
		flexDirection: "row",
		justifyContent: "space-evenly",
		alignItems: "center",
	},
	details: {
		flex: 1,
		width: "90%",
		display: "flex",
		flexDirection: "row",
		justifyContent: "space-between",
	},
	navigation: {
		width: "5%",
		justifyContent: "center",
	},
	name: {
		fontWeight: "bold",
		fontSize: 20,
		textAlign: "left",
	},
	date: {
		paddingRight: 25,
		fontWeight: "bold",
		color: "#A9A9A9",
	},
});
