import chai, { expect } from "chai";
import chaiHttp from "chai-http";
import { signInWithEmailAndPassword, signOut } from "firebase/auth";
import { afterEach, beforeEach, describe, it } from "mocha";
import admin from "../../../config/firebaseAdminConfig";
import { Auth } from "../../../config/firebaseConfig";
import { prisma } from "../../../config/prisma";
import app from "../../../index";
import { signInToken } from "../../../lib/signInToken";

chai.use(chaiHttp);

describe("Delete /api/projects/:id", () => {
	let baseURL: string;

	const email1 = "test@example.com";
	const email2 = "test2@example.com";

	let token: string;
	let userId: string;

	before(async function () {
		this.timeout(10000);
		const creator = await admin.auth().createUser({
			email: email1,
			password: "secretPass",
		});
		userId = creator.uid;
		await admin.auth().createUser({
			email: email2,
			password: "secretPass",
		});
	});

	beforeEach(async () => {
		const project = await prisma.project.create({
			data: { name: "React", userId },
		});
		const member = await admin.auth().getUserByEmail(email2);
		const membership = await prisma.projectMember.create({
			data: { userId: member.uid, projectId: project.id },
		});
		baseURL = `/api/projects/members/${membership.id}`;
		token = await (
			await signInWithEmailAndPassword(Auth, email2, "secretPass")
		).user.getIdToken();
	});

	afterEach(async () => {
		await signOut(Auth);
		await prisma.project.deleteMany();
	});

	after(async function () {
		this.timeout(10000);

		const firstUser = await admin.auth().getUserByEmail(email1);
		const secondUser = await admin.auth().getUserByEmail(email2);
		await admin.auth().deleteUser(firstUser.uid);
		await admin.auth().deleteUser(secondUser.uid);
	});

	it("Should return a status of 204 upon successful membership deletion by project owner", async () => {
		await signOut(Auth);
		token = await (
			await signInWithEmailAndPassword(Auth, email2, "secretPass")
		).user.getIdToken();
		const response = await chai
			.request(app)
			.delete(baseURL)
			.set({ Authorization: `Bearer ${token}` });

		expect(response).to.have.status(204);
	});

	it("Should return a status of 204 upon successful membership deletion by member", done => {
		chai
			.request(app)
			.delete(baseURL)
			.set({ Authorization: `Bearer ${token}` })
			.end((error, response) => {
				expect(error).to.be.null;
				expect(response).to.have.status(204);
				done();
			});
	});

	it("Should return a status of 404 if membership does not exist", done => {
		chai
			.request(app)
			.delete(`${baseURL}abc123`)
			.set({ Authorization: `Bearer ${token}` })
			.end((error, response) => {
				expect(error).to.be.null;
				expect(response).to.have.status(404);
				done();
			});
	});

	it("Should return a status of 401 for unauthenticated users", done => {
		chai
			.request(app)
			.delete(baseURL)
			.end((error, response) => {
				expect(error).to.be.null;
				expect(response).to.have.status(401);
				done();
			});
	});

	it("Should return a status of 403 unauthorized", async () => {
		await signOut(Auth);
		token = await signInToken("123456");
		const response = await chai
			.request(app)
			.delete(baseURL)
			.set({ Authorization: `Bearer ${token}` });

		expect(response).to.have.status(403);
	});
});
