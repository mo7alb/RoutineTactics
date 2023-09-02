import { StyleSheet, Text, View } from "react-native";
import { Task } from "../../types/task";
import { Link } from "expo-router";
import { AntDesign } from "@expo/vector-icons";

type Props = {
	task: Task;
};

export default function TaskList({ task }: Props) {
	return (
		<View style={styles.container}>
			<Text style={styles.title}>{task.title}</Text>
			<Text>{task.completed ? "completed" : "not completed"}</Text>
			<Link
				href={{
					pathname: `/app/tasks/details`,
					params: { id: task.id },
				}}
			>
				<AntDesign name="right" size={24} color="black" />
			</Link>
		</View>
	);
}

const styles = StyleSheet.create({
	title: {
		fontSize: 18,
	},
	container: {
		borderColor: "black",
		borderWidth: 1,
		display: "flex",
		flexDirection: "row",
		justifyContent: "space-around",
		padding: 5,
		marginVertical: 10,
	},
});
