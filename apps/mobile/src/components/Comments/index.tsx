import React from "react";
import { View, Text, StyleSheet, Dimensions, FlatList } from "react-native";
import { TaskComment } from "../../types/comment";
import CommentForm from "./Form";
import { useAuthContext } from "../../context/AuthContext";

type Props = {
	comments: TaskComment[];
	taskId: string;
};

export default function Comments({ comments, taskId }: Props) {
	const user = useAuthContext();
	if (user == null) return null;

	return (
		<View>
			<Text>Comments</Text>
			<View style={styles.container}>
				{comments.length === 0 && (
					<View>
						<Text>No comments yet</Text>
					</View>
				)}
				{comments.length !== 0 && (
					<FlatList
						data={comments}
						renderItem={({ item: comment }) => {
							return (
								<View style={styles.commentContainer}>
									<Text
										adjustsFontSizeToFit
										style={[
											styles.comment,
											user.uid === comment.userId
												? styles.commentRight
												: styles.commentLeft,
										]}
									>
										{comment.comment}
									</Text>
								</View>
							);
						}}
					></FlatList>
				)}
			</View>
			<CommentForm taskId={taskId} />
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		height: Dimensions.get("window").height * 0.62,
	},
	commentContainer: {
		marginHorizontal: 4,
		marginVertical: 5,
	},
	comment: {
		paddingVertical: 5,
		paddingHorizontal: 15,
	},
	commentLeft: {
		backgroundColor: "#008169",
		textAlign: "left",
	},
	commentRight: {
		color: "white",
		backgroundColor: "#345A4D",
		textAlign: "right",
	},
});
