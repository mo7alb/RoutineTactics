import React, { useEffect, useState } from "react";
import ProjectList from "../../../components/ProjectList";
import Container from "../../../components/UI/container";
import OpenModal from "../../../components/UI/modal/OpenModal";
import { useMutation, useQuery } from "@tanstack/react-query";
import { router } from "expo-router";
import { updateUser, getInvitations } from "../../../api/user";
import Loading from "../../../components/UI/loading";
import Error from "../../../components/UI/error";
import { registerPushNotifications } from "../../../config/pushNotification";
import { useAuthContext } from "../../../context/AuthContext";

export default function Dashboard() {
	// update notification token for user
	// const [notificationToken, setNotificationToken] = useState("");
	// const user = useAuthContext();
	// if (user == null) return;
	// const { mutate } = useMutation({
	// 	mutationFn: (notificationToken: string) =>
	// 		updateUser(user, notificationToken),
	// });

	// useEffect(() => {
	// 	registerPushNotifications().then(token => setNotificationToken(token));
	// 	mutate(notificationToken);
	// }, []);

	// // check for invitations
	// const { isLoading, isError, error, data } = useQuery({
	// 	queryKey: ["invitations"],
	// 	queryFn: () => getInvitations(user),
	// });

	// if (isLoading) return <Loading title="Invitations" />;
	// if (isError) return <Error title="Invitations" error={error} />;

	// if (data != null && data.length !== 0)
	// 	router.replace({
	// 		pathname: "/app/invitations/index",
	// 		params: { invitations: data },
	// 	});

	return (
		<Container title="Dashboard">
			<OpenModal path="/app/projects/new" />
			<ProjectList />
		</Container>
	);
}
