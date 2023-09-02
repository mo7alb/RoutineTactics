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

export default function DeleteIcon({ path }: Props) {
	return (
		<Link href={path}>
			<AntDesign
				name="delete"
				size={24}
				color="black"
				// style={styles.delete}
			/>
		</Link>
	);
}
