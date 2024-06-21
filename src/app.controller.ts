import { Throttlers } from '@constants/throttler';
import { Controller, Get } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
	HealthCheck,
	HealthCheckService,
	HttpHealthIndicator
} from '@nestjs/terminus';
import { SkipThrottle } from '@nestjs/throttler';
import { DatabaseHealthIndicator } from '@utils/indicators/db-health.indicator';

@Controller()
export class AppController {
	public constructor(
		private health: HealthCheckService,
		private http: HttpHealthIndicator,
		private db: DatabaseHealthIndicator,
		public _configService: ConfigService
	) {}

	@SkipThrottle({
		[Throttlers.DEFAULT]: true,
		[Throttlers.RESOURCE]: true
	})
	@Get('/health')
	@HealthCheck()
	public check() {
		const yoizukiUrl =
			this._configService.getOrThrow<string>('MS_WEBHOOK_URL');
		const yoizukiAuth =
			this._configService.getOrThrow<string>('MS_WEBHOOK_AUTH');

		return this.health.check([
			() => this.http.pingCheck('Unzen', 'https://dbots.fun'),
			() =>
				this.http.pingCheck('Yoizuki', yoizukiUrl, {
					headers: {
						Authorization: `Bearer ${yoizukiAuth}`
					}
				}),
			() => this.db.isHealthy('database')
		]);
	}
}
