import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";
import { Text, View } from "react-native";
import { Task } from "../../types/task";
import Loading from "../UI/Loading";
import FetchError from "../UI/FetchError";
import { getMembers } from "../../api/members";
import { useAuthContext } from "../../context/authContext";
import Dropdown from "../UI/DropDown";
import { User } from "firebase/auth";
import { editTask } from "../../api/tasks";

type Props = {
	task: Task;
};

/**
 * A react component that allows members of a project to assign tasks to one another
 * @component
 */
export default function AssignTask({ task }: Props) {
	const [selectedEmail, setSelectedEmail] = useState("");
	const queryClient = useQueryClient();

	const user = useAuthContext();

	const mutation = useMutation({
		mutationFn: (updatedTask: Task) =>
			editTask(user!, task.id as string, updatedTask),
		onSuccess: () => queryClient.invalidateQueries(["task", task.id]),
	});

	useEffect(() => {
		if (selectedEmail !== "") {
			mutation.mutate({
				...task,
				assignedToId: data.users.find(
					(user: User) => user.email === selectedEmail
				).uid,
			});
		}
	}, [selectedEmail]);

	const { data, isLoading, isError, error } = useQuery({
		queryKey: ["members"],
		queryFn: () => getMembers(user!, task.projectId),
	});

	useEffect(() => {
		if (data == undefined) return;
		if (task.assignedToId != null) {
			setSelectedEmail(
				data.users.find((user: User) => user.uid === task.assignedToId)
					.email
			);
		}
	}, [data]);

	if (!user) return null;
	if (isLoading) return <Loading title="Task Details" />;
	if (isError) return <FetchError title="Task Details" error={error} />;

	return (
		<>
			<Dropdown
				options={data.users.map((user: User) => user.email)}
				label="Assign member"
				selected={selectedEmail}
				setSelected={setSelectedEmail}
			/>
		</>
	);
}
