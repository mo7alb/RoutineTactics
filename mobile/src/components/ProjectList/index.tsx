import React from "react";
import { StyleSheet, Text, View } from "react-native";
import ProjectCard from "./ProjectCard";

export default function ProjectList() {
	return (
		<View>
			<Text>ProjectList</Text>
			<ProjectCard />
			<ProjectCard />
			<ProjectCard />
			<ProjectCard />
		</View>
	);
}

const styles = StyleSheet.create({});
