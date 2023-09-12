import { useMutation, useQueryClient } from "@tanstack/react-query";
import { TaskComment } from "../types/comment";
import { createComment, updateComment, deleteComment } from "../api/comments";
import { User } from "firebase/auth";

/**
 * This hook abstracts querying comments
 */
function useComments(user: User) {
	const queryClient = useQueryClient();

	// create new comment
	const newComment = (taskId: string) => {
		const { mutate } = useMutation({
			mutationFn: (comment: string) => createComment(user, taskId, comment),
			onSuccess: () =>
				queryClient.invalidateQueries({ queryKey: ["task", taskId] }),
		});

		return { mutate };
	};

	// update exisiting comment
	const editComment = (comment: TaskComment) => {
		const { mutate } = useMutation({
			mutationFn: (updatedComment: string) =>
				updateComment(user, comment.id as string, updatedComment),
			onSuccess: () =>
				queryClient.invalidateQueries({
					queryKey: ["task", comment.taskId],
				}),
		});

		return { mutate };
	};

	// delete a comment
	const removeComment = (comment: TaskComment) => {
		const { mutate } = useMutation({
			mutationFn: () => deleteComment(user, comment.id as string),
			onSuccess: () =>
				queryClient.invalidateQueries({
					queryKey: ["task", comment.taskId],
				}),
		});

		return { mutate };
	};

	return { newComment, editComment, removeComment };
}

export { useComments };
