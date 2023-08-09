import { Request, Response } from "express";
import { prisma } from "../config/prisma";

/**
 * Things to do
 * ------------
 *
 * 1. After adding user authentication, change the file to fetch projects of the user in the user token
 *
 * @param request An Incoming request
 * @param response An outgoing response
 * @returns the Response object
 */

async function getProjects(request: Request, response: Response) {
	const projects = await prisma.project.findMany();
	return response.json(projects).status(200);
}

/**
 *
 * @param request An Incoming request
 * @param response An outgoing response
 * @returns The response object
 */
async function getProject(request: Request, response: Response) {
	// const projectId = request.params.id;
	return response.json({}).status(200);
}

async function updateProject(request: Request, response: Response) {}

async function deleteProject(request: Request, response: Response) {}

export { getProjects, getProject, updateProject, deleteProject };
