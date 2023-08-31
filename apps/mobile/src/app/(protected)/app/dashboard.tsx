import React from "react";
import ProjectList from "../../../components/ProjectList";
import Container from "../../../components/UI/container";
import OpenModal from "../../../components/UI/modal/OpenModal";

export default function Dashboard() {
	return (
		<Container title="Dashboard">
			<OpenModal path="/app/projects/new" />
			<ProjectList />
		</Container>
	);
}
