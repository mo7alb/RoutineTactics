import { StyleSheet, Text, View } from "react-native";
import { TaskComment } from "../../types/comment";

type Props = {
	comment: TaskComment;
	commentStyles: Record<string, any>;
};

/**
 * A react component that renders a comment posted by another user
 * @component
 */
export default function Comment({ comment, commentStyles }: Props) {
	return (
		<View style={styles.commentContainer}>
			<Text style={[styles.comment, commentStyles]}>{comment.comment}</Text>
		</View>
	);
}

const styles = StyleSheet.create({
	commentContainer: {
		marginHorizontal: 4,
		marginVertical: 5,
	},
	comment: {
		paddingVertical: 15,
		paddingHorizontal: 15,
		color: "white",
	},
});
