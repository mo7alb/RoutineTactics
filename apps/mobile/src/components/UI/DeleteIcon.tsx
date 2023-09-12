import React from "react";
import { AntDesign } from "@expo/vector-icons";
import { Link } from "expo-router";

type Props = {
	path:
		| string
		| {
				pathname: string;
				params: { id: string };
		  };
};

/**
 * A react component to render a delete icon
 * when pressed it takes to another modal / screen in order to confirm the deletion
 * @component
 */
export default function DeleteIcon({ path }: Props) {
	return (
		// @ts-ignore
		<Link href={path} style={{ padding: 2 }}>
			<AntDesign
				name="delete"
				size={24}
				color="black"
				// style={styles.delete}
			/>
		</Link>
	);
}
