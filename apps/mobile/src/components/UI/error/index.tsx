import { View, Text } from "react-native";
import React from "react";
import Container from "../container";

type Prop = {
	title?: string;
	error: any;
};

export default function Error({ error, title }: Prop) {
	const isError = (error: any) => error instanceof Error;
	return (
		<Container title={title}>
			<Text>{isError(error) ? error.message : "an error occured"}</Text>
		</Container>
	);
}
