import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { User } from "firebase/auth";
import {
	createProject,
	deleteProject,
	editProject,
	getProject,
} from "../api/project";
import { Project } from "../types/project";

/**
 * This hook abstracts querying projects
 */
function useProjects(user: User) {
	const queryClient = useQueryClient();

	// create a new project
	const newProject = () => {
		const { mutate } = useMutation({
			mutationFn: (newProject: Project) =>
				createProject(user, {
					...newProject,
					dueDate: newProject.dueDate == "" ? null : newProject.dueDate,
				}),
			onSuccess: () =>
				queryClient.invalidateQueries({ queryKey: ["projects"] }),
		});

		return { mutate };
	};

	// Query for a single project
	const project = (id: string) => {
		const {
			isLoading: loadingProject,
			isError: isProjectError,
			error: projectError,
			data,
		} = useQuery({
			queryFn: () => getProject(user, id),
			queryKey: ["project", id],
		});

		return { loadingProject, isProjectError, projectError, data };
	};

	// update an exisiting project
	const updateProject = (id: string) => {
		const { mutate } = useMutation({
			mutationFn: (changedProject: Project) =>
				editProject(user, id, {
					...changedProject,
					dueDate:
						changedProject.dueDate == "" ? null : changedProject.dueDate,
				}),
			onSuccess: () => {
				queryClient.invalidateQueries({ queryKey: ["projects"] });
				queryClient.invalidateQueries({ queryKey: ["project", id] });
			},
		});

		return { mutate };
	};

	// Delete an exisiting project
	const removeProject = (id: string) => {
		const { mutate } = useMutation({
			mutationFn: () => deleteProject(user, id),
			onSuccess: () => {
				queryClient.invalidateQueries({ queryKey: ["projects"] });
			},
		});

		return { mutate };
	};

	return { newProject, project, updateProject, removeProject };
}

export { useProjects };
