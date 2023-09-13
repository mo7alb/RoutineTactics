import React from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";
import { useAuthContext } from "../../context/authContext";
import { TaskComment } from "../../types/comment";
import EditableComment from "./EditableComment";
import NewComment from "./NewComment";
import Comment from "./Comment";

type Props = {
	comments: TaskComment[];
	taskId: string;
};

/**
 * A react component that renders all comments on a task and allows users to make comments
 * @component
 */
export default function Comments({ comments, taskId }: Props) {
	const user = useAuthContext();
	if (!user) return null;

	return (
		<View style={styles.container}>
			<Text style={styles.title}>Comments</Text>
			{comments.length === 0 && (
				<View>
					<Text>No comments yet</Text>
				</View>
			)}
			{comments.length !== 0 && (
				<View style={styles.wrapper}>
					<FlatList
						data={comments}
						renderItem={({ item: comment }) =>
							user.uid === comment.userId ? (
								<EditableComment comment={comment} />
							) : (
								<Comment
									comment={comment}
									commentStyles={styles.commentLeft}
								/>
							)
						}
					/>
				</View>
			)}
			<NewComment taskId={taskId} />
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		marginTop: 15,
		padding: 5,
	},
	title: {
		fontSize: 18,
		textAlign: "center",
		marginBottom: 15,
	},
	wrapper: {
		maxHeight: "60%",
	},
	commentLeft: {
		backgroundColor: "#008169",
		textAlign: "left",
	},
});
