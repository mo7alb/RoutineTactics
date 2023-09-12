import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { User } from "firebase/auth";
import { createTask, deleteTask, getTask } from "../api/tasks";
import { Task } from "../types/task";

/**
 * This hook abstracts querying tasks
 */
function useTasks(user: User) {
	const queryClient = useQueryClient();

	// create a new task
	const newTask = (projectId: string) => {
		const { mutate } = useMutation({
			mutationFn: (newTask: Task) =>
				createTask(
					user,
					{
						...newTask,
						dueDate: newTask.dueDate == "" ? undefined : newTask.dueDate,
					},
					projectId
				),
			onSuccess: () => {
				queryClient.invalidateQueries({ queryKey: ["tasks"] });
				queryClient.invalidateQueries({ queryKey: ["project", projectId] });
			},
		});

		return { mutate };
	};

	// get a task
	const task = (id: string) => {
		const {
			isLoading: loadingTask,
			isError: isTaskError,
			error: TaskError,
			data,
		} = useQuery({
			queryFn: () => getTask(user, id),
			queryKey: ["task", id],
		});

		return { loadingTask, isTaskError, TaskError, data };
	};

	// delete task
	const removeTask = (id: string, projectId: string) => {
		const { mutate } = useMutation({
			mutationFn: () => deleteTask(user, id),
			onSuccess: () => {
				queryClient.invalidateQueries({ queryKey: ["tasks"] });
				queryClient.invalidateQueries({ queryKey: ["project", projectId] });
			},
		});

		return { mutate };
	};

	return { removeTask, newTask, task };
}

export { useTasks };
