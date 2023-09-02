import { useQuery } from "@tanstack/react-query";
import { getTask } from "../api/task";
import { User } from "firebase/auth";

function useGetTaskQuery(id: string, user: User) {
	const {
		data: task,
		isError,
		error,
		isLoading,
	} = useQuery({
		queryKey: ["task", id],
		queryFn: () => getTask(user, id as string),
	});

	return { task, isError, error, isLoading };
}

export { useGetTaskQuery };
