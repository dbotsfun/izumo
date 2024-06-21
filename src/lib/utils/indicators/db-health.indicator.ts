import { DATABASE } from '@constants/tokens';
import { DrizzleService } from '@lib/types';
import { Inject, Injectable } from '@nestjs/common';
import {
	HealthCheckError,
	HealthIndicator,
	HealthIndicatorResult
} from '@nestjs/terminus';
import { sql } from 'drizzle-orm';

@Injectable()
export class DatabaseHealthIndicator extends HealthIndicator {
	public constructor(@Inject(DATABASE) private db: DrizzleService) {
		super();
	}

	async isHealthy(key: string): Promise<HealthIndicatorResult> {
		const startTime = Date.now();
		const ping = await this.db.execute(sql`SELECT 1`);
		const endTime = Date.now();

		const isHealthy = Boolean(ping.length);

		const result = this.getStatus(key, isHealthy, {
			ping: endTime - startTime
		});

		if (isHealthy) {
			return result;
		}

		throw new HealthCheckError('DatabaseCheck failed', result);
	}
}
