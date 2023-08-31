import { StyleSheet, Text, View } from "react-native";
import { Task } from "../../types/task";

type Props = {
	task: Task;
};

export default function TaskList({ task }: Props) {
	return (
		<View style={styles.container}>
			<Text style={styles.title}>{task.title}</Text>
		</View>
	);
}

const styles = StyleSheet.create({
	title: {
		fontSize: 18,
	},
	container: { borderColor: "black", borderWidth: 1 },
});
