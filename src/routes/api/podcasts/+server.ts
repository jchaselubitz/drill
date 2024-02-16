import type { RequestHandler } from '@sveltejs/kit';
import { XMLParser } from 'fast-xml-parser';

interface PodcastEpisode {
	title: string;
	description: string;
	imageURL: string;
	audioURL: string;
}

interface Podcast {
	title: string;
	description: string;
	imageURL?: string;
	episodes: PodcastEpisode[];
}

export const GET: RequestHandler = async ({ url }) => {
	const rssFeedUrl = url.searchParams.get('url') || '';

	async function fetchAndParseRSSFeed(): Promise<Podcast | null> {
		const parser = new XMLParser();
		try {
			const response = await fetch(rssFeedUrl);
			if (!response.ok) {
				throw new Error(`HTTP error! status: ${response.status}`);
			}
			const rssText = await response.text();

			if (parser.parse(rssText)) {
				const jsonObj = parser.parse(rssText);
				// Check if 'rss' and 'channel' keys exist
				if (!jsonObj.rss || !jsonObj.rss.channel) {
					throw new Error('Invalid RSS feed format.');
				}

				const channel = jsonObj.rss.channel;
				const podcastInfo: Podcast = {
					title: channel.title,
					description: channel.description,
					imageURL: channel.image.url,
					episodes: []
				};
				// Normalize to array if only one item exists
				const items = Array.isArray(channel.item) ? channel.item : [channel.item];

				// console.log('items:', items);

				items.forEach((item: any) => {
					const episodeImage = item['itunes:image']?.href;
					const episode: PodcastEpisode = {
						title: item.title,
						description: item.description || item['itunes:summary'],
						imageURL: episodeImage ?? podcastInfo.imageURL,
						audioURL: item.guid,
						date: item.pubDate
					};
					podcastInfo.episodes.push(episode);
				});

				return podcastInfo;
			}
		} catch (error) {
			console.error('Error fetching or parsing RSS feed:', error);
		}

		return null;
	}
	const result = await fetchAndParseRSSFeed();
	// console.log('result:', result);
	return new Response(JSON.stringify(result), {
		headers: {
			'Content-Type': 'application/json'
		}
	});
};
