const axios = require("axios");
const vm = require('vm');
const querystring = require('querystring')
const youtubeEndpoint = `https://www.youtube.com`;

const functions = [
    `var CF={xR:function(a,b){var c=a[0];a[0]=a[b%a.length];a[b%a.length]=c},uX:function(a){a.reverse()},HP:function(a,b){a.splice(0,b)}};var Uta=function(a){a=a.split("");CF.xR(a,19);CF.xR(a,16);CF.uX(a,19);CF.HP(a,1);CF.uX(a,56);CF.HP(a,2);CF.uX(a,52);return a.join("")};Uta(sig);`
  ]

const GetYoutubeInitData = async (url) => {
    var initdata = await {};
    var apiToken = await null;
    var context = await null;
    try {
        const page = await axios.get(encodeURI(url));
        const ytInitData = await page.data.split("var ytInitialData =");
        if (ytInitData && ytInitData.length > 1) {
            const data = await ytInitData[1].split("</script>")[0].slice(0, -1);

            if (page.data.split("innertubeApiKey").length > 0) {
                apiToken = await page.data
                    .split("innertubeApiKey")[1]
                    .trim()
                    .split(",")[0]
                    .split('"')[2];
            }

            if (page.data.split("INNERTUBE_CONTEXT").length > 0) {
                context = await JSON.parse(
                    page.data.split("INNERTUBE_CONTEXT")[1].trim().slice(2, -2)
                );
            }

            initdata = await JSON.parse(data);
            return await Promise.resolve({
                initdata,
                apiToken,
                context
            });
        } else {
            console.error("cannot_get_init_data");
            return await Promise.reject("cannot_get_init_data");
        }
    } catch (ex) {
        await console.error(ex);
        return await Promise.reject(ex);
    }
};

const GetData = async (keyword, withPlaylist = false, limit = 0) => {
    const endpoint = await `${youtubeEndpoint}/results?search_query=${keyword}`;
 
    try {
        const page = await GetYoutubeInitData(endpoint);
      var dat = JSON.stringify(page)
      var publishedTime = dat.match(/"simpleText":"(.*?)"/)
//publishedTimeText
        const sectionListRenderer = await page.initdata.contents
            .twoColumnSearchResultsRenderer.primaryContents.sectionListRenderer;

        let contToken = await {};

        let items = await [];

        await sectionListRenderer.contents.forEach((content) => {
            if (content.continuationItemRenderer) {
                contToken =
                    content.continuationItemRenderer.continuationEndpoint
                    .continuationCommand.token;
            } else if (content.itemSectionRenderer) {
                content.itemSectionRenderer.contents.forEach((item) => {
                    if (item.channelRenderer) {
                        let channelRenderer = item.channelRenderer;
                        items.push({
                            id: channelRenderer.channelId,
                            type: "channel",
                            thumbnail: channelRenderer.thumbnail,
                            title: channelRenderer.title.simpleText,
                        });
                    } else {
                        let videoRender = item.videoRenderer;
                        let playListRender = item.playlistRenderer;

                        if (videoRender && videoRender.videoId) {
                            items.push(VideoRender(item));
                        }
                        if (withPlaylist) {
                            if (playListRender && playListRender.playlistId) {
                                items.push({
                                    id: playListRender.playlistId,
                                    type: "playlist",
                                    thumbnail: playListRender.thumbnails,
                                    title: playListRender.title.simpleText,
                                    length: playListRender.videoCount,
                                    time_create: publishedTime,
                                    videoCount: playListRender.videoCount,
                                    isLive: false,
                                });
                            }
                        }
                    }
                });
            }
        });
        const apiToken = await page.apiToken;
        const context = await page.context;
        const nextPageContext = await {
            context: context,
            continuation: contToken
        };
        const itemsResult = limit != 0 ? items.slice(0, limit) : items;
        return await Promise.resolve({
            statut: true,
            author: "https://www.facebook.com/Developed.PLXT",
            items: itemsResult,
            nextPage: {
                nextPageToken: apiToken,
                nextPageContext: nextPageContext
            }
        });
    } catch (ex) {
        await console.error(ex);
        return await Promise.reject(ex);
    }
};

const nextPage = async (nextPage, withPlaylist = false, limit = 0) => {
    const endpoint =
        await `${youtubeEndpoint}/youtubei/v1/search?key=${nextPage.nextPageToken}`;
    try {
        const page = await axios.post(
            encodeURI(endpoint),
            nextPage.nextPageContext
        );
        const item1 =
            page.data.onResponseReceivedCommands[0].appendContinuationItemsAction;
        let items = [];
        item1.continuationItems.forEach((conitem) => {
            if (conitem.itemSectionRenderer) {
                conitem.itemSectionRenderer.contents.forEach((item, index) => {
                    let videoRender = item.videoRenderer;
                    let playListRender = item.playlistRenderer;
                    if (videoRender && videoRender.videoId) {
                        items.push(VideoRender(item));
                    }
                    if (withPlaylist) {
                        if (playListRender && playListRender.playlistId) {
                            items.push({
                                id: playListRender.playlistId,
                                type: "playlist",
                                thumbnail: playListRender.thumbnails,
                                title: playListRender.title.simpleText,
                                length: playListRender.videoCount,
                                videos: GetPlaylistData(playListRender.playlistId),
                            });
                        }
                    }
                });
            } else if (conitem.continuationItemRenderer) {
                nextPage.nextPageContext.continuation =
                    conitem.continuationItemRenderer.continuationEndpoint.continuationCommand.token;
            }
        });
        const itemsResult = limit != 0 ? items.slice(0, limit) : items;
        return await Promise.resolve({
            items: itemsResult,
            nextPage: nextPage
        });
    } catch (ex) {
        await console.error(ex);
        return await Promise.reject(ex);
    }
};

const GetPlaylistData = async (playlistId, limit = 0) => {
    const endpoint = await `${youtubeEndpoint}/playlist?list=${playlistId}`;
    try {
        const initData = await GetYoutubeInitData(endpoint);
        const sectionListRenderer = await initData.initdata;
        const metadata = await sectionListRenderer.metadata;
        if (sectionListRenderer && sectionListRenderer.contents) {
            const videoItems = await sectionListRenderer.contents
                .twoColumnBrowseResultsRenderer.tabs[0].tabRenderer.content
                .sectionListRenderer.contents[0].itemSectionRenderer.contents[0]
                .playlistVideoListRenderer.contents;
            let items = await [];
            await videoItems.forEach((item) => {
                let videoRender = item.playlistVideoRenderer;
                if (videoRender && videoRender.videoId) {
                    items.push(VideoRender(item));
                }
            });
            const itemsResult = limit != 0 ? items.slice(0, limit) : items;
            return await Promise.resolve({
                items: itemsResult,
                metadata: metadata
            });
        } else {
            return await Promise.reject("invalid_playlist");
        }
    } catch (ex) {
        await console.error(ex);
        return await Promise.reject(ex);
    }
};

const GetSuggestData = async (limit = 0) => {
    const endpoint = await `${youtubeEndpoint}`;
    try {
        const page = await GetYoutubeInitData(endpoint);
        const sectionListRenderer = await page.initdata.contents
            .twoColumnBrowseResultsRenderer.tabs[0].tabRenderer.content
            .richGridRenderer.contents;
        let items = await [];
        let otherItems = await [];
        await sectionListRenderer.forEach((item) => {
            if (item.richItemRenderer && item.richItemRenderer.content) {
                let videoRender = item.richItemRenderer.content.videoRenderer;
                if (videoRender && videoRender.videoId) {
                    items.push(VideoRender(item.richItemRenderer.content));
                } else {
                    otherItems.push(videoRender);
                }
            }
        });
        const itemsResult = limit != 0 ? items.slice(0, limit) : items;
        return await Promise.resolve({
            items: itemsResult
        });
    } catch (ex) {
        await console.error(ex);
        return await Promise.reject(ex);
    }
};

const GetChannelById = async (channelId) => {
    const endpoint = await `${youtubeEndpoint}/channel/${channelId}`;
    try {
        const page = await GetYoutubeInitData(endpoint);
        const tabs = page.initdata.contents.twoColumnBrowseResultsRenderer.tabs;
        const items = tabs
            .map((json) => {
                if (json && json.tabRenderer) {
                    const tabRenderer = json.tabRenderer;
                    const title = tabRenderer.title;
                    const content = tabRenderer.content;
                    return {
                        title,
                        content
                    };
                }
            })
            .filter((y) => typeof y != "undefined");
        return await Promise.resolve(items);
    } catch (ex) {
        return await Promise.reject(ex);
    }
};

const GetVideoDetails = async (videoId) => {
    const endpoint = await `${youtubeEndpoint}/watch?v=${videoId}`;
    try {
        const page = await GetYoutubeInitData(endpoint);
        const result = await page.initdata.contents.twoColumnWatchNextResults;
        const firstContent = await result.results.results.contents[0]
            .videoPrimaryInfoRenderer;
        const secondContent = await result.results.results.contents[1]
            .videoSecondaryInfoRenderer;
        const res = await {
            title: firstContent.title.runs[0].text,
            isLive: firstContent.viewCount.videoViewCountRenderer.hasOwnProperty(
                    "isLive"
                ) ?
                firstContent.viewCount.videoViewCountRenderer.isLive :
                false,
            channel: secondContent.owner.videoOwnerRenderer.title.runs[0].text,
            description: secondContent.description.runs
                .map((x) => x.text)
                .join()
                .toString(),
            suggestion: result.secondaryResults.secondaryResults.results
                .filter((y) => y.hasOwnProperty("compactVideoRenderer"))
                .map((x) => compactVideoRenderer(x)),
        };

        return await Promise.resolve(res);
    } catch (ex) {
        return await Promise.reject(ex);
    }
};

const VideoRender = (json) => {
    try {
        if (json && (json.videoRenderer || json.playlistVideoRenderer)) {
            let videoRenderer = null;
            if (json.videoRenderer) {
                videoRenderer = json.videoRenderer;
            } else if (json.playlistVideoRenderer) {
                videoRenderer = json.playlistVideoRenderer;
            }
            var isLive = false;
            if (
                videoRenderer.badges &&
                videoRenderer.badges.length > 0 &&
                videoRenderer.badges[0].metadataBadgeRenderer &&
                videoRenderer.badges[0].metadataBadgeRenderer.style ==
                "BADGE_STYLE_TYPE_LIVE_NOW"
            ) {
                isLive = true;
            }
            if (videoRenderer.thumbnailOverlays) {
                videoRenderer.thumbnailOverlays.forEach((item) => {
                    if (
                        item.thumbnailOverlayTimeStatusRenderer &&
                        item.thumbnailOverlayTimeStatusRenderer.style &&
                        item.thumbnailOverlayTimeStatusRenderer.style == "LIVE"
                    ) {
                        isLive = true;
                    }
                });
            }
            const id = videoRenderer.videoId;
            const thumbnail = videoRenderer.thumbnail;
            const title = videoRenderer.title.runs[0].text;
            const shortBylineText = videoRenderer.shortBylineText ?
                videoRenderer.shortBylineText :
                "";
            const lengthText = videoRenderer.lengthText ?
                videoRenderer.lengthText :
                "";
            const channelTitle =
                videoRenderer.ownerText && videoRenderer.ownerText.runs ?
                videoRenderer.ownerText.runs[0].text :
                "";
            return {
                id,
                type: "video",
                thumbnail,
                title,
                channelTitle,
                shortBylineText,
                length: lengthText,
                isLive,
            };
        } else {
            return {};
        }
    } catch (ex) {
        throw ex;
    }
};

const compactVideoRenderer = (json) => {
    const compactVideoRendererJson = json.compactVideoRenderer;

    var isLive = false;
    if (
        compactVideoRendererJson.badges &&
        compactVideoRendererJson.badges.length > 0 &&
        compactVideoRendererJson.badges[0].metadataBadgeRenderer &&
        compactVideoRendererJson.badges[0].metadataBadgeRenderer.style ==
        "BADGE_STYLE_TYPE_LIVE_NOW"
    ) {
        isLive = true;
    }
    const result = {
        id: compactVideoRendererJson.videoId,
        type: "video",
        thumbnail: compactVideoRendererJson.thumbnail.thumbnails,
        title: compactVideoRendererJson.title.simpleText,
        channelTitle: compactVideoRendererJson.shortBylineText.runs[0].text,
        shortBylineText: compactVideoRendererJson.shortBylineText.runs[0].text,
        length: compactVideoRendererJson.lengthText,
        isLive,
    };
    return result;
};
const GetVideoId = (url) => {
    let opts = { fuzzy: true };

    if (/youtu\.?be/.test(url)) {

        // Look first for known patterns
        let i;
        let patterns = [
            /youtu\.be\/([^#\&\?]{11})/, // youtu.be/<id>
            /\?v=([^#\&\?]{11})/, // ?v=<id>
            /\&v=([^#\&\?]{11})/, // &v=<id>
            /embed\/([^#\&\?]{11})/, // embed/<id>
            /\/v\/([^#\&\?]{11})/ // /v/<id>
        ];

        // If any pattern matches, return the ID
        for (i = 0; i < patterns.length; ++i) {
            if (patterns[i].test(url)) {
                return patterns[i].exec(url)[1];
            }
        }

        if (opts.fuzzy) {
            // If that fails, break it apart by certain characters and look
            // for the 11 character key
            let tokens = url.split(/[\/\&\?=#\.\s]/g);
            for (i = 0; i < tokens.length; ++i) {
                if (/^[^#\&\?]{11}$/.test(tokens[i])) {
                    return tokens[i];
                }
            }
        }
    }

    return null;
};
async function setDownloadURL(format, decipherScript, nTransformScript) {
  const decipher = url => {
    
    const args = querystring.parse(url);
    //console.log(format)
    if (!args.s || !decipherScript) return args.url;
    const components = new URL(decodeURIComponent(args.url));
    components.searchParams.set(args.sp ? args.sp : 'signature',
      decipherScript.runInNewContext({ sig: decodeURIComponent(args.s) }));
   // listurl.push(components.toString())
    return components.toString();
  };
  const ncode = url => {
   // console.log(url)
    const components = new URL(decodeURIComponent(url));
    const n = components.searchParams.get('n');
    if (!n || !nTransformScript) return url;
    components.searchParams.set('n', nTransformScript.runInNewContext({ ncode: n }));
    return components.toString();
  };
  const cipher = !format.url;
  const url = format.url || format.signatureCipher || format.cipher;
  format.url = cipher ? ncode(decipher(url)) : ncode(url);
  delete format.signatureCipher;
  delete format.cipher;
};
const downloadVideo = (VideoId) =>{
// console.log( VideoId)
    var resolveFunc = function () {};
    var rejectFunc = function () {};
    var returnPromise = new Promise(function (resolve, reject) {
        resolveFunc = resolve;
        rejectFunc = reject;
    });
    axios.get('https://www.youtube.com/watch?v=' + VideoId).then(i => {
        var jsLink = i.data.match(/"jsUrl":"(.*?)"/)[1]
        var matchData = i.data.match(/ytInitialPlayerResponse = (.*)}}};/)
        var response = matchData ? matchData[1] + '}}}' : ''
        var dataJson = JSON.parse(response)
    // resolveFunc(dataJson)
        var videoDetails = {
            videoId: dataJson.videoDetails.videoId,
            title: dataJson.videoDetails.title,
            author: dataJson.videoDetails.author,
            viewCount: dataJson.videoDetails.viewCount,
            lengthSeconds: dataJson.videoDetails.lengthSeconds,
            channelId: dataJson.videoDetails.channelId,
            publishDate: dataJson.microformat.playerMicroformatRenderer.publishDate,
            shortDescription: dataJson.videoDetails.shortDescription,
            thumbnail: dataJson.videoDetails.thumbnail
        }
        if (dataJson.streamingData.adaptiveFormats[0].signatureCipher) {
            axios.get('https://www.youtube.com' + jsLink).then(async (i2) => {
                 //var funcOne = i2.data.match(/cta=(.*?)  }/)
                // var funcTwo = i2.data.match(/var bxa=(.*?)\n(.*?)\n(.*?)}}/)
//                var decodeSignature = eval(funcOne[0]);
               //  eval(funcTwo[0]);
              //console.log(decodeSignature)
             var decipheredFormats = [];
  const decipherScript = functions.length ? new vm.Script(functions[0]) : null;
                var dataDownload = dataJson.streamingData.adaptiveFormats
                dataDownload.push(dataJson.streamingData.formats[0])
             // resolveFunc(dataDownload)
             dataDownload.forEach(format => {
    setDownloadURL(format, decipherScript)//, nTransformScript);
               var isVideo = format.mimeType.match("video/")
    decipheredFormats.push({
      mimeType: format.mimeType,
      quality: format.quality,
      hasvideo: isVideo != null ? true : false,//format.qualityLabel ? true : false,
      audio: format.audioQuality ? true : false,
      approxDurationMs: format.approxDurationMs,
      url: format.url
    })
  });
              const video = [];
              const audio = [];
              for(const formatData of decipheredFormats){
                if(formatData.hasvideo){
                  video.push(formatData)
                } else if(formatData.audio){
                audio.push(formatData)
                }
              }
              //   var format = dataDownload.map(i => {
              //    var urls = decodeURIComponent(i.signatureCipher).split('&sp=sig&url=')
              //       var sig = urls[0].split('s=')
              // //    console.log(sig + '\n' + decodeSignature(sig[1]))
              //       delete i.signatureCipher
              //       i.hasVideo = i.qualityLabel ? true : false
              //       i.audio = i.audioQuality ? true : false
              //     //  i.url = decodeURIComponent(url[1] + '&sig=' + decodeSignature(sig[1]));
              //       return i
              //   })
                return resolveFunc({
                    statut: true,
                    author: "https://www.facebook.com/Developed.PLXT",
                    videoDetails,
                    video,
                    audio,
                   // dataDownload: link //
                  format: decipheredFormats
                })
            })
        } else {
          const decipheredFormats = [];
          const decipherScript = functions.length ? new vm.Script(functions[0]) : null;
          dataJson.streamingData.adaptiveFormats.push(dataJson.streamingData.formats[0])
            var format = dataJson.streamingData.adaptiveFormats.forEach(format => {
    setDownloadURL(format, decipherScript)//, nTransformScript);
              
    decipheredFormats.push({
      mimeType: format.mimeType,
      quality: format.quality,
      hasvideo: format.qualityLabel ? true : false,
      audio: format.audioQuality ? true : false,
      approxDurationMs: format.approxDurationMs,
      url: format.url
    })
  });
            return resolveFunc({
                
                videoDetails,
                 format: decipheredFormats
            })
        }
    })
    return returnPromise
}
module.exports = {
    GetListByKeyword: GetData,
    NextPage: nextPage,
    GetPlaylistData,
    GetSuggestData,
    GetChannelById,
    GetVideoDetails,
    GetVideoId,
    downloadVideo
}