import { User } from "firebase/auth";
import { Project } from "./project";

enum InvitationsState {
	"PENDING",
	"ACCEPTED",
	"REJECTED",
}

type Invitation = {
	id: string;
	sender: User;
	senderId: string;
	user: User;
	userId: string;
	status: InvitationsState;
	projectId: string;
	project: Project;
};

export { Invitation };
