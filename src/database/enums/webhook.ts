export enum WebhookEvent {
	NEW_VOTE = 'NEW_VOTE',
	NEW_REVIEW = 'NEW_REVIEW',
	STATUS_CHANGE = 'STATUS_CHANGE',
	ALL_EVENTS = 'ALL_EVENTS'
}

export enum WebhookPayloadField {
	BOT = 'botId',
	USER = 'userId',
	QUERY = 'query'
}
