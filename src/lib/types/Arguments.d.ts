import type { JwtPayload } from '@modules/auth/interfaces/payload.interface';

declare global {
	namespace Express {
		/**
		 * The user object attached to the Express request.
		 * This object is created by the JwtStrategy and is used to validate the JWT token.
		 */
		export interface User extends JwtPayload {}
	}
}
