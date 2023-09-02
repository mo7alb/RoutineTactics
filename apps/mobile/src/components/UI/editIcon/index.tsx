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

export default function EditIcon({ path }: Props) {
	return (
		<Link href={path}>
			<Feather name="edit" size={24} color="black" />
		</Link>
	);
}
