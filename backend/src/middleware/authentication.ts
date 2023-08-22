// import admin from "firebase-admin";
import { Request, Response } from "express";
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
import admin from "../config/firebaseAdminConfig";
=======
import admin from "../config/firebaseConfig";
>>>>>>> 8a0c1b9 (Added authentication verification to the backend)
=======
import admin from "../config/firebaseAdminConfig";
>>>>>>> 7428574 (Code refactor and project feature)
=======
import admin from "../config/firebaseAdminConfig";
>>>>>>> main

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

<<<<<<< HEAD
<<<<<<< HEAD
      if (!decodedValue) return response.sendStatus(401);
=======
=======
>>>>>>> 7428574 (Code refactor and project feature)
			if (!decodedValue) return response.sendStatus(401);
>>>>>>> 8a0c1b9 (Added authentication verification to the backend)
=======
      if (!decodedValue) return response.sendStatus(401);
>>>>>>> main

			// @ts-ignore
			request.user = decodedValue;
			return next();
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
		} catch {
=======
		} catch (error) {
>>>>>>> 8a0c1b9 (Added authentication verification to the backend)
=======
		} catch {
>>>>>>> 7428574 (Code refactor and project feature)
=======
		} catch {
>>>>>>> main
			return response.sendStatus(500);
		}
	}
}

export default new Authentication();
