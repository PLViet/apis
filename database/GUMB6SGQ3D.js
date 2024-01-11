const fs = require("fs-extra");
const axios = require("axios");
const ytdl = require("ytdl-core");
const Youtube = require("youtube-search-api");
const convertHMS = (value) =>
	new Date(value * 1000).toISOString().slice(11, 19);
const { getStreamFromURL, downloadFile } = global.utils;
async function getStreamAndSize(url, path = "") {
	const response = await axios({
		method: "GET",
		url,
		responseType: "stream",
		headers: {
			Range: "bytes=0-",
		},
	});
	if (path) response.data.path = path;
	const totalLength = response.headers["content-length"];
	return {
		stream: response.data,
		size: totalLength,
	};
}
const downloadMusicFromYoutube = async (link, path, itag = 249) => {
	try {
		const timestart = Date.now();
		const data = await ytdl.getInfo(link);
		const result = {
			id: data.videoDetails.videoId,
			title: data.videoDetails.title,
			dur: Number(data.videoDetails.lengthSeconds),
			viewCount: addCommas(data.videoDetails.viewCount),
			likes: data.videoDetails.likes,
			author: data.videoDetails.author.name,
			timestart: timestart,
			publishDate: data.videoDetails.publishDate,
		};
		return new Promise((resolve, reject) => {
			ytdl(link, {
				filter: (format) => format.itag == itag,
			})
				.pipe(fs.createWriteStream(path))
				.on("finish", () => {
					resolve({
						data: path,
						info: result,
					});
				});
		});
	} catch (e) {
		return console.log(e);
	}
};

const langs = {
	vi: {
		info: "=======「 ? 」=======\n\n                       ?\n%1\n⭐ | Channel: %2\n? | Subscriber: %3\n⌛ | Length %4\n? | Views: %5\n? | Likes: %6\n⌚ | Upload: %7\n? | ID: %8\n? | Link: %9",
	},
	en: {
		info: "=======「 ? 」=======\n\n                       ?\n%1\n⭐ | Channel: %2\n? | Subscriber: %3\n⌛ | Length %4\n? | Views: %5\n? | Likes: %6\n⌚ | Upload: %7\n? | ID: %8\n? | Link: %9",
	},
};

const onReply = async ({ api, event, Reply, message, getLang }) => {
	try {
		const { type } = Reply;
		let path = `${__dirname}/cache/1.mp3`;
		if (type === "video") {
			path = `${__dirname}/cache/1.mp4`;
			const { data, info } = await downloadMusicFromYoutube(
				"https://www.youtube.com/watch?v=" + Reply.link[event.body - 1],
				path,
				18
			);

			if (fs.statSync(data).size > 262144000)
				return message.reply(
					"Không thể gửi file vì dung lượng lớn hơn 25MB.",
					() => fs.unlinkSync(path)
				);
			api.unsendMessage(Reply.messageID);
			const messages = {
				body: `=======「 ? 」=======\n\n                       ?\n${
					info.title
				}\n⭐ | Channel: ${info.author}\n⌚ | Upload: ${
					info.publishDate
				}\n⌛ | Length: ${convertHMS(info.dur)}\n? | Views: ${
					info.viewCount
				}\n? | Delay: ${Math.floor(
					(Date.now() - info.timestart) / 1000
				)}ms\n? | Download: youtubepp.com/watch?v=${
					Reply.link[event.body - 1]
				}\n\n  ⇆ㅤㅤㅤ◁ㅤㅤ❚❚ㅤㅤ▷ㅤㅤㅤ↻`,
				attachment: fs.createReadStream(data),
			};
			return message.reply(messages, async () => {
				fs.unlinkSync(path);
			});
		} else if (type === "info") {
			const data = await ytdl.getInfo(
				"https://www.youtube.com/watch?v=" + Reply.link[event.body - 1]
			);
			let getChapters;
			try {
				getChapters =
					data.response.playerOverlays.playerOverlayRenderer.decoratedPlayerBarRenderer.decoratedPlayerBarRenderer.playerBar.multiMarkersPlayerBarRenderer.markersMap.find(
						(x) => x.key == "DESCRIPTION_CHAPTERS" && x.value.chapters
					).value.chapters;
			} catch (e) {
				getChapters = [];
			}
			const owner =
				data.response.contents.twoColumnWatchNextResults.results.results.contents.find(
					(x) => x.videoSecondaryInfoRenderer
				).videoSecondaryInfoRenderer.owner;
			const result = {
				videoId: data.player_response.videoDetails.videoId,
				title: data.player_response.videoDetails.title,
				video_url: `https://youtu.be/${data.player_response.videoDetails.videoId}`,
				lengthSeconds:
					data.player_response.microformat.playerMicroformatRenderer
						.lengthSeconds,
				viewCount: addCommas(
					data.player_response.microformat.playerMicroformatRenderer.viewCount
				),
				uploadDate:
					data.player_response.microformat.playerMicroformatRenderer.uploadDate,
				// likes:
				// 	data.response.contents.twoColumnWatchNextResults.results.results.contents
				// 		.find((x) => x.videoPrimaryInfoRenderer)
				// 		.videoPrimaryInfoRenderer.videoActions.menuRenderer.topLevelButtons.find(
				// 			(x) => x.segmentedLikeDislikeButtonRenderer
				// 		)
				// 		.segmentedLikeDislikeButtonRenderer.likeButton.toggleButtonRenderer.defaultText.accessibility?.accessibilityData.label.replace(
				// 			/\.|,/g,
				// 			""
				// 		)
				// 		.match(/\d+/)?.[0] || 0,
				chapters: getChapters.map((x, i) => {
					const start_time = x.chapterRenderer.timeRangeStartMillis;
					const end_time =
						getChapters[i + 1]?.chapterRenderer?.timeRangeStartMillis ||
						lengthSeconds.match(/\d+/)[0] * 1000;

					return {
						title: x.chapterRenderer.title.simpleText,
						start_time_ms: start_time,
						start_time: start_time / 1000,
						end_time_ms: end_time - start_time + start_time,
						end_time: (end_time - start_time + start_time) / 1000,
					};
				}),
				thumbnails: data.player_response.videoDetails.thumbnail.thumbnails,
				author: data.player_response.videoDetails.author,
				channel: {
					id: owner.videoOwnerRenderer.navigationEndpoint.browseEndpoint
						.browseId,
					username:
						owner.videoOwnerRenderer.navigationEndpoint.browseEndpoint
							.canonicalBaseUrl,
					name: owner.videoOwnerRenderer.title.runs[0].text,
					thumbnails: owner.videoOwnerRenderer.thumbnail.thumbnails,
					subscriberCount: parseAbbreviatedNumber(
						owner.videoOwnerRenderer.subscriberCountText.simpleText
					),
				},
			};
			const {
				title,
				lengthSeconds,
				viewCount,
				videoId,
				uploadDate,
				likes,
				channel,
				chapters,
			} = result;
			const hours = Math.floor(lengthSeconds / 3600);
			const minutes = Math.floor((lengthSeconds % 3600) / 60);
			const seconds = Math.floor((lengthSeconds % 3600) % 60);
			const msg = getLang(
				"info",
				title,
				channel.name,
				channel.subscriberCount || 0,
				`${hours}:${minutes}:${seconds}`,
				viewCount,
			"",//	likes,
				uploadDate,
				videoId,
				`https://youtu.be/${videoId}`
			);
			return message.reply({
				body: msg,
				attachment: await Promise.all([
					getStreamFromURL(result.thumbnails[result.thumbnails.length - 1].url),
					getStreamFromURL(
						result.channel.thumbnails[result.channel.thumbnails.length - 1].url
					),
				]),
			});
		} else {
			const { data, info } = await downloadMusicFromYoutube(
				"https://www.youtube.com/watch?v=" + Reply.link[event.body - 1],
				path,
				18
			);

			if (fs.statSync(data).size > 26214400)
				return message.reply(
					"Không thể gửi file vì dung lượng lớn hơn 25MB.",
					() => fs.unlinkSync(path)
				);
			api.unsendMessage(Reply.messageID);
			const messages = {
				body: `=======「 ? 」=======\n\n                       ?\n ${
					info.title
				}\n⭐ | Channel: ${info.author}\n⌚ | Upload: ${
					info.publishDate
				}\n⌛ | Length: ${convertHMS(info.dur)}\n? | Views: ${
					info.viewCount
				}\n? | Delay: ${Math.floor(
					(Date.now() - info.timestart) / 1000
				)}ms\n? | Download: youtubepp.com/watch?v=${
					Reply.link[event.body - 1]
				}\n\n  ⇆ㅤㅤㅤ◁ㅤㅤ❚❚ㅤㅤ▷ㅤㅤㅤ↻`,
				attachment: fs.createReadStream(data),
			};
			return message.reply(messages, async () => {
				fs.unlinkSync(path);
			});
		}
	} catch (error) {
		console.log(error);
	}
};

const onStart = async function ({ api, event, args, message, commandName }) {
	if (!args?.length) {
		const imagePath = "./scripts/cmds/assets/image/music.png";
		const imageStream = fs.createReadStream(imagePath);
		return message.reply({
			body: "=======「 ? 」=======\nSTAR Music / Audio panel\n\n- music [info/-i] <search term | url> | Check song infomation\n- music [video/-v] <search term | url> | Send song through video\n- music [audio/-a] <search term | url> | Send song through audio",
			attachment: imageStream,
		});
	}

	let keywordSearch = args.join(" ");
	const path = `${__dirname}/cache/1.mp3`;

	if (args[0]?.startsWith("https://")) {
		try {
			const { data, info } = await downloadMusicFromYoutube(args[0], path);
			const body = `=======「 ? 」=======\n\n                       ?\n ${
				info.title
			}\n⭐ | Channel: ${info.author}\n⌚ | Upload: ${
				info.publishDate
			}\n⌛ | Length: ${convertHMS(info.dur)}\n? | Views: ${addCommas(
				info.viewCount
			)}\n? | Delay: ${Math.floor(
				(Date.now() - info.timestart) / 1000
			)}ms\n? | Download: youtubepp.com/watch?v=${
				handleReply.link[event.body - 1]
			}\n\n  ⇆ㅤㅤㅤ◁ㅤㅤ❚❚ㅤㅤ▷ㅤㅤㅤ↻`;

			if (fs.statSync(data).size > 26214400) {
				return message.reply(
					"Không thể gửi file vì dung lượng lớn hơn 25MB.",
					() => fs.unlinkSync(data)
				);
			}

			return message.reply(
				{ body, attachment: fs.createReadStream(data) },
				() => fs.unlinkSync(data)
			);
		} catch (e) {
			return console.log(e);
		}
	} else {
		try {
			let type;
			switch (args[0]) {
				case "-v":
					keywordSearch = keywordSearch.split("-v")[1];
					type = "video";
					break;
				case "-i":
					keywordSearch = keywordSearch.split("-i")[1];
					type = "info";
					break;
				default:
					type = "";
			}
			if (keywordSearch == "") {
				const imagePath = "./scripts/cmds/assets/image/music.png";
				const imageStream = fs.createReadStream(imagePath);
				return message.reply({
					body: "Phần tìm kiếm không được để trống!",
					attachment: imageStream,
				});
			}
			const attachment = [];
			const data =
				(await Youtube.GetListByKeyword(keywordSearch, false, 9))?.items ?? [];
			for (const i of data) {
				const thumbnail = i.thumbnail.thumbnails[0].url;
				attachment.push(await global.utils.getStreamFromURL(thumbnail));
			}
			const link = data.map((value) => value?.id);
			const body = `Có ${
				link.length
			} kết quả trùng với từ khoá tìm kiếm của bạn:${data
				.map(
					(value, index) =>
						`\n${index + 1} - ${value?.title}\n[ ? ] →: ${
							value?.channelTitle
						}\n[ ⏰ ] →: ${
							value?.length?.simpleText
						}\n[ ? ] →: https://youtu.be/${value?.id}\n✦ ━━━━━ ★ ━━━━━ ✦`
				)
				.join("")}\n→ Hãy reply (phản hồi) chọn một trong những tìm kiếm trên`;

			return message.reply(
				{
					body,
					attachment,
				},
				(error, info) =>
					global.GoatBot.onReply.set(info.messageID, {
						type,
						commandName,
						messageID: info.messageID,
						author: event.senderID,
						link,
					})
			);
		} catch (e) {
			return message.reply(
				`Đã xảy ra lỗi, vui lòng thử lại trong giây lát!!\n${e}`
			);
		}
	}
};

function parseAbbreviatedNumber(string) {
	const match = string
		.replace(",", ".")
		.replace(" ", "")
		.match(/([\d,.]+)([MK]?)/);
	if (match) {
		let [, num, multi] = match;
		num = parseFloat(num);
		return Math.round(
			multi === "M" ? num * 1000000 : multi === "K" ? num * 1000 : num
		);
	}
	return null;
}

const config = {
	name: "music",
	aliases: ["sing"],
	version: "2.3",
	author: "D4XG", // convert to Goat by Quat & Truong
	countDown: 0,
	role: 0,
	shortDescription: "YouTube",
	longDescription: {
		vi: "Tải video, audio hoặc xem thông tin video trên YouTube",
		en: "Download video, audio or view video information on YouTube",
	},
	category: "media",
	guide: {
		vi:
			"   {pn} [video|-v] [<tên video>|&lt;link video&gt;]: dùng để tải video từ youtube." +
			"\n   {pn} [audio|-a] [<tên video>|&lt;link video&gt;]: dùng để tải audio từ youtube" +
			"\n   {pn} [info|-i] [<tên video>|&lt;link video&gt;]: dùng để xem thông tin video từ youtube" +
			"\n   Ví dụ:" +
			"\n    {pn} -v Fallen Kingdom" +
			"\n    {pn} -a Fallen Kingdom" +
			"\n    {pn} -i Fallen Kingdom",
		en:
			"   {pn} [video|-v] [&lt;video name&gt;|&lt;video link&gt;]: use to download video from youtube." +
			"\n   {pn} [audio|-a] [&lt;video name&gt;|&lt;video link&gt;]: use to download audio from youtube" +
			"\n   {pn} [info|-i] [&lt;video name&gt;|&lt;video link&gt;]: use to view video information from youtube" +
			"\n   Example:" +
			"\n    {pn} -v Fallen Kingdom" +
			"\n    {pn} -a Fallen Kingdom" +
			"\n    {pn} -i Fallen Kingdom",
	},
};
function addCommas(number) {
	return number.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}
module.exports = { config, onStart, onReply, langs };
