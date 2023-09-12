import React from "react";
import { Link } from "expo-router";
import { Feather } from "@expo/vector-icons";

type Props = {
	path:
		| string
		| {
				pathname: string;
				params: {
					id: string;
				};
		  };
};

/**
 * A react component that renders edit icon
 * @component
 */
export default function EditIcon({ path }: Props) {
	return (
		// @ts-ignore
		<Link href={path} style={{ padding: 2 }}>
			<Feather name="edit" size={24} color="black" />
		</Link>
	);
}
