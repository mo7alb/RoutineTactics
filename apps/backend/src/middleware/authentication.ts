// import admin from "firebase-admin";
import { Request, Response } from "express";
import admin from "../config/firebaseAdminConfig";

/**
 * This is a middleware class responsible for all Authentication related tasks
 */
class Authentication {
	/**
	 * Function to decode a bearer token, and get its corresponding user.
	 *
	 * Responds with a status code of 401 if no token is passed to the request
	 *
	 * @param request Express request object
	 * @param response Express response object
	 * @param next A function that continues once the middleware completes its job
	 * @returns Express response
	 */
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
