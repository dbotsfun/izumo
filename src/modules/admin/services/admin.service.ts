import { DATABASE } from '@constants/tokens';
import type { DrizzleService } from '@lib/types';
import { Inject, Injectable } from '@nestjs/common';

@Injectable()
export class AdminService {
	public constructor(
		@Inject(DATABASE) private _drizzleService: DrizzleService
	) {}

	
}
