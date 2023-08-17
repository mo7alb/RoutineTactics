<<<<<<< HEAD
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const config = {
	apiKey: process.env.FIREBASE_API_KEY,
	authDomain: process.env.FIREBASE_AUTH_DOMAIN,
	projectId: process.env.FIREBASE_PROJECT_ID,
	storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
	messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
	appId: process.env.FIREBASE_APP_ID,
};

const app = initializeApp(config);
export const Auth = getAuth(app);
=======
import admin, { ServiceAccount } from "firebase-admin";
import serviceAccount from "../../firebaseConfig.json";

admin.initializeApp({
	credential: admin.credential.cert(serviceAccount as ServiceAccount),
});

export default admin;
>>>>>>> 8a0c1b9 (Added authentication verification to the backend)
