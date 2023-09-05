import { View, Text, ActivityIndicator } from "react-native";
import React from "react";
import Container from "../container";

type Prop = {
	title?: string;
};

export default function Loading({ title }: Prop) {
	return (
		<Container title={title ? title : ""}>
			<ActivityIndicator />
		</Container>
	);
}
