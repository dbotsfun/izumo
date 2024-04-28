import * as badges from './badges';
import * as badgesRelations from './badges-relations';
import * as badgesTousers from './badges-tousers';
import * as badgesTousersRelations from './badges-tousers-relations';
import * as bots from './bots';
import * as botsRelations from './bots-relations';
import * as botsTotags from './bots-totags';
import * as botsTotagsRelations from './bots-totags-relations';
import * as botsTousers from './bots-tousers';
import * as botsTousersRelations from './bots-tousers-relations';
import * as reviews from './reviews';
import * as reviewsRelations from './reviews-relations';
import * as sessions from './sessions';
import * as sessionsRelations from './sessions-relations';
import * as tags from './tags';
import * as tagsRelations from './tags-relations';
import * as users from './users';
import * as usersRelations from './users-relations';
import * as vanities from './vanities';
import * as votes from './votes';
import * as votesRelations from './votes-relations';
import * as webhooks from './webhooks';
import * as webhooksRelations from './webhooks-relations';

export const schema = {
	...bots,
	...badges,
	...reviews,
	...users,
	...sessions,
	...tags,
	...vanities,
	...votes,
	...webhooks,
	...botsRelations,
	...badgesRelations,
	...reviewsRelations,
	...usersRelations,
	...sessionsRelations,
	...tagsRelations,
	...votesRelations,
	...webhooksRelations,
	...botsTotags,
	...botsTousers,
	...badgesTousers,
	...botsTotagsRelations,
	...botsTousersRelations,
	...badgesTousersRelations
};
