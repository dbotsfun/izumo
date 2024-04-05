import { bots } from '@database/tables';
import generateCursor from 'drizzle-cursor';

export const botsCursor = generateCursor({
	primaryCursor: { order: 'DESC', key: 'id', schema: bots.id }
});
