import { User } from "firebase/auth";

async function fetchProjects(user: User) {
	try {
		const token = await user.getIdToken();
		const response = await fetch("http://localhost:3000/api/projects", {
			method: "GET",
			headers: {
				Authorization: `Bearer ${token}`,
			},
		});
		const data = await response.json();
		console.log(JSON.stringify(data));

		return data;
	} catch (error) {
		alert("Something went wrong");
	}
}

export { fetchProjects };
