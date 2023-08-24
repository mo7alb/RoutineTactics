import { signInWithCustomToken } from "firebase/auth";
import { Auth } from "../config/firebaseConfig";
import admin from "../config/firebaseAdminConfig";

async function signInToken(userId: string): Promise<string> {
	const customSignInToken = await signInWithCustomToken(
		Auth,
		await admin.auth().createCustomToken(userId)
	);
	const token = await customSignInToken.user.getIdToken();

	return token;
}

export { signInToken };
