import { useQuery } from "@tanstack/react-query";
import { getProject } from "../api/project";
import { User } from "firebase/auth";

function useGetProjectQuery(user: User, id: string) {
	const {
		data: project,
		isError,
		error,
		isLoading,
	} = useQuery({
		queryKey: ["project", id],
		queryFn: () => getProject(user, id as string),
	});

	return { project, isError, error, isLoading };
}

export { useGetProjectQuery };
