import { logger } from "../infra/logger"

(async () => {
	const queueName = process.argv[2]
	if (!queueName) {
		throw new Error('Queue name not provided.')
	}

	switch (queueName) {
		case 'processing-relations':
				logger.info('Starting processing-relations consumer')
				require('../application/chat-gpt/consumers/processing-relations')
			break
		case 'news-created':
				logger.info('Starting news-created consumer')
				require('../application/news/consumers/news-created')
			break
		case 'profile-category-changed':
				logger.info('Starting profile-category-changed consumer')
				require('../application/profiles/consumers/profile-category-changed')
			break
		default:
			throw new Error(`Queue "${queueName}" not found.`)
	}
})()