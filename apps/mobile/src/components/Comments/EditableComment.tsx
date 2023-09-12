import { StyleSheet, View } from "react-native";
import { Swipeable } from "react-native-gesture-handler";
import { TaskComment } from "../../types/comment";
import DeleteIcon from "../UI/DeleteIcon";
import EditIcon from "../UI/EditIcon";
import Comment from "./Comment";

type Props = {
	comment: TaskComment;
};

/**
 * A react component that renders a comment posted by the current user
 * @component
 */
export default function EditableComment({ comment }: Props) {
	return (
		<Swipeable
			renderRightActions={() => (
				<View style={styles.iconContainer}>
					<EditIcon
						path={{
							pathname: "/(protected)/comments/edit",
							params: { id: comment.id! },
						}}
					/>
					<DeleteIcon
						path={{
							pathname: "/(protected)/comments/delete",
							params: { id: comment.id! },
						}}
					/>
				</View>
			)}
		>
			<Comment comment={comment} commentStyles={styles.commentRight} />
		</Swipeable>
	);
}

const styles = StyleSheet.create({
	iconContainer: {
		display: "flex",
		flexDirection: "row",
		alignItems: "center",
	},
	commentRight: {
		color: "white",
		backgroundColor: "#345A4D",
		textAlign: "right",
	},
});
