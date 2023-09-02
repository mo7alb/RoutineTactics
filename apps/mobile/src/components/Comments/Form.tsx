import { useQueryClient, useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { Alert, View, Button } from "react-native";
import { createComment } from "../../api/comment";
import { useAuthContext } from "../../context/AuthContext";
import Input from "../UI/input";

const defaultValues = { comment: "" };
export default function CommentForm({ taskId }: { taskId: string }) {
	const user = useAuthContext();
	if (!user) return null;

	const queryClient = useQueryClient();

	const mutation = useMutation({
		mutationFn: (newComment: typeof defaultValues) => {
			return createComment(user, taskId, newComment.comment);
		},
		onSuccess: () => queryClient.invalidateQueries(["task", taskId]),
		onError: error =>
			Alert.alert(
				"Error",
				error instanceof Error
					? error.message
					: "An unknown error occured, try again later"
			),
	});

	const {
		setValue,
		control,
		handleSubmit,
		formState: { errors },
	} = useForm({ defaultValues });

	const handleCreateComment = handleSubmit(data => {
		mutation.mutate(data);
		setValue("comment", "");
	});

	return (
		<View>
			<Input
				control={control}
				name="comment"
				rules={{
					required: "Comment is required",
					minLength: {
						value: 5,
						message: "Comment should be at least 5 characters",
					},
					maxLenght: {
						value: 100,
						message: "Comment should be less than 100 characters",
					},
				}}
				placeholder="Enter Comment"
				error={errors.comment != null}
			/>
			<Button title="Comment" onPress={handleCreateComment} />
		</View>
	);
}
