// import admin from "firebase-admin";
import { Request, Response } from "express";
import admin from "../config/firebaseAdminConfig";

class Authentication {
	async decodeToken(request: Request, response: Response, next: Function) {
		let token = request.header("Authorization");
		if (!token) {
			return response.sendStatus(401);
		}

		token = token.split(" ")[1];
		try {
			const decodedValue = await admin.auth().verifyIdToken(token);

      if (!decodedValue) return response.sendStatus(401);

			// @ts-ignore
			request.user = decodedValue;
			return next();
		} catch {
			return response.sendStatus(500);
		}
	}
}

export default new Authentication();
