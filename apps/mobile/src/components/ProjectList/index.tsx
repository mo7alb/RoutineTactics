import React from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import ProjectCard from "./ProjectCard";
import { useQuery } from "@tanstack/react-query";
import { getProjects } from "../../api/project";
import { useAuthContext } from "../../context/AuthContext";

export default function ProjectList() {
	const user = useAuthContext();
	if (user == null) return;

	const { data, isError, error, isLoading } = useQuery({
		queryKey: ["projects"],
		queryFn: () => getProjects(user),
	});

	return (
		<View>
			<Text style={styles.subtitle}>Projects</Text>
			{isLoading && <ActivityIndicator />}
			{!isLoading && isError && error instanceof Error && (
				<Text>{error.message}</Text>
			)}
			{!isLoading && !isError && (
				<>
					{data.length == 0 && (
						<Text>No projects yet, start by adding a new project</Text>
					)}
					{data.length !== 0 && (
						<View style={{ alignItems: "center" }}>
							{data.map(project => (
								<ProjectCard key={project.id} project={project} />
							))}
						</View>
					)}
				</>
			)}
		</View>
	);
}

const styles = StyleSheet.create({
	subtitle: {
		fontWeight: "500",
		fontSize: 25,
		paddingLeft: 20,
	},
});
