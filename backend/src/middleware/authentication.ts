// import admin from "firebase-admin";
import { Request, Response } from "express";
<<<<<<< HEAD
import admin from "../config/firebaseAdminConfig";
=======
import admin from "../config/firebaseConfig";
>>>>>>> 8a0c1b9 (Added authentication verification to the backend)

class Authentication {
	async decodeToken(request: Request, response: Response, next: Function) {
		let token = request.header("Authorization");
		if (!token) {
			return response.sendStatus(401);
		}

		token = token.split(" ")[1];
		try {
			const decodedValue = await admin.auth().verifyIdToken(token);

<<<<<<< HEAD
      if (!decodedValue) return response.sendStatus(401);
=======
			if (!decodedValue) return response.sendStatus(401);
>>>>>>> 8a0c1b9 (Added authentication verification to the backend)

			// @ts-ignore
			request.user = decodedValue;
			return next();
<<<<<<< HEAD
		} catch {
=======
		} catch (error) {
>>>>>>> 8a0c1b9 (Added authentication verification to the backend)
			return response.sendStatus(500);
		}
	}
}

export default new Authentication();
