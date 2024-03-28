import type { Request, Response } from 'express';

/**
 * Represents the execution context for a GraphQL request.
 */
export type GQLExecutionContext = {
	req: Request;
	res: Response;
};
