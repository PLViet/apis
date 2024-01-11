const { join } = require('path')
const fs = require('fs')
var axios = require("axios");
var datas = {
  'authority': 'www.facebook.com',
  'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/109.0.0.0 Safari/537.36',
  'accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
  'accept-language': 'vi,fr-FR;q=0.9,fr;q=0.8,en-US;q=0.7,en;q=0.6',
  'sec-ch-ua': '"Not?A_Brand";v="8", "Chromium";v="108", "Google Chrome";v="108"',
  'cache-control': 'max-age=0',
  'accept-encoding': 'gzip, deflate, br',
  'sec-ch-ua-mobile': '?0',
  'sec-ch-ua-platform': "Windows",
  'sec-fetch-dest': 'document',
  'sec-fetch-mode': 'navigate',
  'sec-fetch-site': 'same-origin',
  'sec-fetch-user': '?1',
  'upgrade-insecure-requests': '1',
  'Cookie': 'sb=NLUhY4A_BWx6Me6QPqwXOIXo;m_pixel_ratio=1;x-referer=eyJyIjoiLyIsImgiOiIvIiwicyI6Im0ifQ%3D%3D;c_user=523169144;datr=TtXIZMwtxZoBOIFEQPaqQtjh;locale=vi_VN;fbl_cs=AhBkBOuhZQ1VLtr%2F4Qx3UDnDGEZHM0FUSEUxY0lCTHBEQTFzL0I3NVg3Sw;fbl_ci=1779557455806135;fbl_st=101434738%3BT%3A28194602;wl_cbv=v2%3Bclient_version%3A2303%3Btimestamp%3A1691676212;m_page_voice=523169144;wd=1322x661;dpr=1;usida=eyJ2ZXIiOjEsImlkIjoiQXJ6OWhocGd4MmF2eiIsInRpbWUiOjE2OTE4MTU5MjB9;xs=44%3A8zLlSlDB3WJOCA%3A2%3A1690883402%3A-1%3A6276%3A%3AAcUO6Jo-74LTso3sZbbp4uweck-Htk8ygqS_wZQolw;fr=0VrTJGThTFCkYabvT.AWXCmo8MwgatT46kx9uK5P4tq-Q.Bk2_Yd.2m.AAA.0.0.Bk2_Yd.AWVNIsRRD0A;presence=C%7B%22t3%22%3A%5B%5D%2C%22utc3%22%3A1692136924432%2C%22v%22%3A1%7D;',

};

var cookie = "sb=aGjpYw7xokoIDgWExf9eje9r;dpr=2.75;locale=vi_VN;datr=yeocZLJFMSRq6sts6Pb5p9Mi;wd=980x1953;c_user=100086063221253;xs=15%3AGQmU80H-wocakw%3A2%3A1679616852%3A-1%3A8520;fr=0F2ZxKyjsomSeI9Jp.AWUulu-evgFRH6UtI_rqgCJki40.BkHFuu.Hl.AAA.0.0.BkHOuk.AWV_wlmTQQg;"
const facebookStoryDL = async function(url) {
  var wrap = function getValue(callbackId) {
    return JSON.parse('{"text": "' + callbackId + '"}').text;
  };
  return new Promise(async (resolve, reject) => {
    axios.get(url, {
      headers: datas
    }).then(async function(rawResponse) {
      const dataList_video = [];
      var data = rawResponse.data;
      var data_new = data.split(`"result":{"data":{"bucket":`)[1].split(`,"initialBucket":{"__typename"`)[0]
      // resolve(data_news)
      //console.log('1')
      var data_news = JSON.parse(data_new)

      var data_user = data_news.story_bucket_owner
      const list_video = data_news.unified_stories.edges
      //resolve(list_video[0].node.attachments[0].media)
      for (const dataV of list_video) {
        var cmt_count = dataV.node.feedback != null ? dataV.node.feedback.story_comment_count : 'comment off'
        var hd = dataV.node.attachments[0].media.playable_url_quality_hd
        if (dataV.node.attachments[0].media.playable_url_quality_hd === null) {
          hd = dataV.node.attachments[0].media.playable_url
        }
        dataList_video.push({

          videoId: dataV.node.attachments[0].media.videoId,
          preferred_thumbnail: dataV.node.attachments[0].media.preferred_thumbnail ? dataV.node.attachments[0].media.preferred_thumbnail.image : dataV.node.attachments[0].media.image,
          reaction: dataV.node.story_card_info.feedback_summary,
          story_comment_count: cmt_count,
          videos: {
            sd: dataV.node.attachments[0].media.playable_url,
            hd: hd,
          }
        })
        //console.log(dataList_video)
      }
      // resolve(dataList_video)
      //var hehehe = JSON.parse(list_video)

      //  const count_reaction = data.match(/"total_reaction_count":(.*?)}/)[1] || 'Không có!';
      // const reaction = data.match(/"feedback_summary":{"reaction_summary":(.*?),"total_reaction_count"/)[1]
      //  var reactions = reaction != '[]' ? JSON.parse(reaction) : 'Không có'
      // var user = data.split(`"story_bucket_owner":`)[5]//.split(`,"unified_stories"`)[0]

      //var data_user = JSON.parse(user)

      const permalink = data.match(/"permalink_url":"(.*?)"/);
      var nodes = data.match(/"playable_url":"(.*?)"/);
      var match = data.match(/"playable_url_quality_hd":"(.*?)"/);
      var object = data.match(/"preferred_thumbnail":{"image":{"uri":"(.*?)"/);

      if (nodes && nodes[1]) {
        var result = {
          user: {
            id: data_user.id,
            name: data_user.name,
            short_name: data_user.short_name,
            is_viewer_friend: data_user.data_user,
            is_verified: data_user.is_verified,
            gender: data_user.gender,
            profile_picture: data_user.profile_picture,
            url: data_user.url
          },
          data: dataList_video,
          author: "https://www.facebook.com/Developed.PLXT"
        };

        resolve(result)
      }
    }).catch(err => {
      reject(err)
    })
  })

}
const facebookDL = async function(url) {
  var wrap = function getValue(callbackId) {
    return JSON.parse('{"text": "' + callbackId + '"}').text;
  };
  return new Promise(async (resolve, reject) => {
    axios.get(url, {
      headers: datas
    }).then(async function(rawResponse) {

      var data = rawResponse.data;
      var dataNew = data.split(`,"data":{"tahoe_sidepane_renderer":`)[1].split(`},"if_viewer_can_see_woodhenge_sidepane"`)[0]
      const datas = JSON.parse(dataNew + '}')
      // resolve(datas)
      var title = datas.video.creation_story.comet_sections.message.story.message.text

      const reactions = datas.video.feedback.cannot_see_top_custom_reactions.top_reactions.edges
      var comment_count = datas.video.feedback.total_comment_count
      var reaction_count = datas.video.feedback.reaction_count.count
      var share_count = datas.video.feedback.share_count.count
      var view_count = datas.video.feedback.video_view_count
      console.log({
        title,
        comment_count,
        reaction_count,
        comment_count,
        share_count,
        view_count
      })
      const articleBody = data.match(/"articleBody":"(.*?)"/) || 'Không có';
      const permalink = data.match(/"permalink_url":"(.*?)"/);
      const duration = data.match(/"playable_duration_in_ms":(.*?),/);
      var nodes = data.match(/"playable_url":"(.*?)"/);
      var match = data.match(/"playable_url_quality_hd":"(.*?)"/);
      var object = data.match(/"preferred_thumbnail":{"image":{"uri":"(.*?)"/);

      if (nodes && nodes[1]) {
        var result = {
          data: {
            url: url,
            // link: permalink[1].replace(/\\/g, ''),
            thumbnail: object && object[1] ? wrap(object[1]) : "",
            reaction_count: reaction_count,
            comment_count,
            share_count,
            view_count,
            reaction: reactions,
            videos: {
              title: title,
              sd: wrap(nodes[1]),
              hd: match == null ? null : match[0] && match[1] ? wrap(match[1]) : ""
            }
          },
          author: "https://www.facebook.com/Developed.PLXT"
        };
        resolve(result)
      }
    }).catch(err => {
      reject(err)
      console.log(err)
    })
  })
}
const facebookGrupDL = async function(url) {
  var wrap = function getValue(callbackId) {
    return JSON.parse('{"text": "' + callbackId + '"}').text;
  };
  return new Promise(async (resolve, reject) => {
    axios.get(url, {
      headers: datas
    }).then(async function(rawResponse) {

      var data = rawResponse.data;

      const title = data.match(/"message":{"text":"(.*?)"/) || 'không có';

      const reaction = data.split(`"top_reactions":{"edges":[`)[7].split(`]},`)[0]

      const cmt_count = data.match(/"i18n_comment_count":"(.*?)"/);
      const share_count = data.match(/"i18n_share_count":"(.*?)"/);

      let reactions = JSON.parse('[' + reaction + ']')

      var reaction_count = `${reactions.reduce((a, b) => a + b.reaction_count, 0)}`
      var audio_video = data.split(`"audio":[`)[1].split(`]}],"all_video_dash_prefetch_representations"`)[0];
      var audio = audio_video.match(/"url":"(.*?)"/);

      const permalink = data.match(/"permalink_url":"(.*?)"/);
      var nodes = data.match(/"playable_url":"(.*?)"/);
      var match = data.match(/"playable_url_quality_hd":"(.*?)"/);
      var object = data.match(/"preferred_thumbnail":{"image":{"uri":"(.*?)"/);

      var hd = ''
      if (match == null) {
        hd = wrap(nodes[1])
      } else {
        hd = match[0] && match[1] ? wrap(match[1]) : ""
      }

      if (nodes && nodes[1]) {
        var result = {
          data: {
            url: url,
            thumbnail: object && object[1] ? wrap(object[1]) : "",
            reaction_count,
            reaction: reactions,
            comment_count: cmt_count[1],
            share_count: share_count[1],
            audio: wrap(audio[1]),
            videos: {
              title: wrap(title[1]) ? wrap(title[1]) : title[1],
              sd: wrap(nodes[1]),
              hd: hd
            }
          },
          author: 'https://www.facebook.com/Developed.PLXT'
        };
        resolve(result)
      }
    }).catch(err => {
      reject(err)
    })
  })

}

const facebookWatchDL = async function(url) {
  var wrap = function getValue(callbackId) {
    return JSON.parse('{"text": "' + callbackId + '"}').text;
  };
  return new Promise(async (resolve, reject) => {
    axios.get(url, {
      headers: datas
    }).then(async function(rawResponse) {

      var data = rawResponse.data;
      var id = url.split(`?v=`)[1] || url.split(`&v=`)[1]
      var data1 = data.split(`"data":{"attachments":[{"media":{"__typename":`)[1].split(`]},"extensions":{"prefetch_uris_v2":[{`)[0]
      // resolve(data1)
      var data2 = data.split(`,"data":{"id":"` + id + `","title":`)[1].split(`,"extensions":{"prefetch_uris_v2"`)[0]

      var datas = JSON.parse(`{"media":{"__typename":` + data1)
      var datass = JSON.parse(`{"id":"` + id + `","title":` + data2)
      console.log('1')
      var title = datas.media.creation_story.comet_sections.message.story.message.text
      //resolve(title)
      console.log('2')
      var cmt_count = datass.feedback.total_comment_count
      var view_count = datass.feedback.video_view_count_renderer.feedback.video_view_count
      console.log('3')
      var audio_video = data.split(`"audio":[`)[1] ? data.split(`"audio":[`)[1].split(`]}],"all_video_dash_prefetch_representations"`)[0] : 'no data'
      var audio = audio_video.match(/"url":"(.*?)"/) != null ? audio_video.match(/"url":"(.*?)"/) : 'no data';

      const reactions = datass.feedback.cannot_see_top_custom_reactions.top_reactions.edges

      var reaction_count = datass.feedback.reaction_count.count
      const permalink = data.match(/"permalink_url":"(.*?)"/);
      var nodes = data.match(/"playable_url":"(.*?)"/);
      var match = data.match(/"playable_url_quality_hd":"(.*?)"/);
      var object = data.match(/"preferred_thumbnail":{"image":{"uri":"(.*?)"/);

      var hd = ''
      if (match == null) {
        hd = wrap(nodes[1])
      } else {
        hd = match[0] && match[1] ? wrap(match[1]) : ""
      }
      if (nodes && nodes[1]) {
        var result = {
          data: {
            url: url,
            thumbnail: object && object[1] ? wrap(object[1]) : "",
            reaction_count,
            reaction: reactions,
            comment_count: cmt_count,
            view_count: view_count,
            audio: wrap(audio[1]),
            videos: {
              title: title,
              sd: wrap(nodes[1]),
              hd: hd
            }
          },
          author: 'https://www.facebook.com/Developed.PLXT'
        };
        resolve(result)
      }
    }).catch(err => {
      reject(err)
    })
  })

}
const facebookReelDL = async function(url) {
  var wrap = function getValue(callbackId) {
    return JSON.parse('{"text": "' + callbackId + '"}').text;
  };
  return new Promise(async (resolve, reject) => {
    axios.get(url, {
      headers: datas
    }).then(async function(rawResponse) {
      var data = rawResponse.data;

      var id = url.split(`/`)[4].split(`?`)[0]
      const data_s = data.split(`"result":{"data":{"video":`)[1]//.split(find)[0]
      var find = data_s.match(`"id":"${id}"},"viewer":{"actor":{`) != null ? `,"viewer":{"actor":{` : `,"video_home_www_matcha_entities"`
      const data_new = data_s.split(find)[0]
      // resolve(data)
      const data_new2 = data.split(`"short_form_video_context":{"video_owner_type":"FACEBOOK_USER","video":{"id":"` +
        id + `"},"shareable_url":`)[1] ? data.split(`"short_form_video_context":{"video_owner_type":"FACEBOOK_USER","video":{"id":"` + id + `"},"shareable_url":`)[1].split(`,"extensions":{"prefetch_uris_v2":`)[0] : data.split(`,"data":{"id":"${id}","title":`)[1].split(`,"extensions":{"prefetch_uris_v2":[{`)[0]

      var data_new2s = data_new2.replace(/115940658764963/g, "😂").replace(/1635855486666999/g, "👍").replace(/908563459236466/g, "😥").replace(/478547315650144/g, "😮").replace(/613557422527858/g, "🥰").replace(/1678524932434102/g, "❤").replace(/444813342392137/g, "😡")
      const data_news = JSON.parse(data_new)
      var texte = data.match("shareable_url") != null ? '{"data":{"shareable_url":' : `{"title":`
      const data_news2 = JSON.parse(texte + data_new2s)
      // resolve(data_news2)
      var checktt = data.match(`"id":"${id}"},"message":{"text":"`)

      var title = data_news.creation_story.message != null ? data_news.creation_story.message.text : checktt != null ? wrap(data.split(`"id":"${id}"},"message":{"text":"`)[1].split(`","delight_ranges":`)[0]) : 'Not title'
      const reaction_count = data_news2.feedback.ufi_action_renderers ? data_news2.feedback.ufi_action_renderers[0].feedback.reactors.count : data_news2.feedback.reactors ? data_news2.feedback.reactors.count : data_news2.feedback.likers.count
      const reaction = data_news2.feedback.cannot_see_top_custom_reactions ? data_news2.feedback.cannot_see_top_custom_reactions.top_reactions.edges : data_news2.feedback.top_reactions ? data_news2.feedback.top_reactions.edges : 'no data'

      var cmt_count = data.match(/"comment_count":{"total_count":(.*?)},"toplevel_comment_count"/)[1]
      var share_count = data_news2.feedback.share_count_reduced ? data_news2.feedback.share_count_reduced : 'Not data'
      // var audio_video = data.split(`"audio":[`)[1].split(`]}],"all_video_dash_prefetch_representations"`)[0];
      // var audio = audio_video.match(/"url":"(.*?)"/);
      const permalink = data.match(/"permalink_url":"(.*?)"/);
      var nodes = data.match(/"playable_url":"(.*?)"/);
      var match = data.match(/"playable_url_quality_hd":"(.*?)"/);
      var object = data.match(/"preferred_thumbnail":{"image":{"uri":"(.*?)"/);
      var hd = ''
      if (match == null) {
        hd = wrap(nodes[1])
      } else {
        hd = match[0] && match[1] ? wrap(match[1]) : ""
      }
      if (nodes && nodes[1]) {
        var result = {
          user: data_news.creation_story ? data_news.creation_story.short_form_video_context.fb_shorts_reshare_context.reshare_creator : 'không có',
          url: url,
          thumbnail: object && object[1] ? wrap(object[1]) : "",
          reaction_count: reaction_count,
          reaction,
          comment_count: cmt_count,
          share_count,
          //  share_count: share[1],
          //  audio: wrap(audio[1]),
          videos: {
            title: title,
            sd: wrap(nodes[1]),
            hd: hd
          },
          author: 'https://www.facebook.com/Developed.PLXT'
        };
        resolve(result)
      }
    }).catch(err => {
      reject(err)
    })
  })

}
const infoPhoto = async function(url) {
  var wrap = function getValue(callbackId) {
    return JSON.parse('{"text": "' + callbackId + '"}').text;
  };
  return new Promise(async (resolve, reject) => {
    axios.get(url, {
      headers: datas
    }).then(async function(rawResponse) {


      var data = rawResponse.data;
      var data1 = data.split(`"comet_ufi_summary_and_actions_renderer":`)[1].split(`},"extensions":{"prefetch_uris_v2"`)[0]
      var data2 = data.split(`"debug_info":null,"comet_sections":`)[1].split(`,"is_playable":false,"id":`)[0]
      const data_new = JSON.parse(data1)
      const data_news = JSON.parse('{"comet_sections":' + data2)
      //resolve(data_news)
      const user = data_news.actors[0]
      const data_title = data.match(/"message_preferred_body":{(.*?)},/) ? data.match(/"message_preferred_body":{(.*?)},/)[1] : 'not title'
      const title = data_title.match(/"text":"(.*?)"/) ? data_title.match(/"text":"(.*?)"/)[1] : 'not title'
      //   resolve(data_new)
      const split_Image = data.split(`"result":{"data":{"currMedia":`)[1].split(`},"extensions"`)[0]
      var dataa = split_Image.replace(/115940658764963/g, "😂").replace(/1635855486666999/g, "👍").replace(/908563459236466/g, "😥").replace(/478547315650144/g, "😮").replace(/613557422527858/g, "🥰").replace(/1678524932434102/g, "❤").replace(/444813342392137/g, "😡")

      const comment_count = data_new.feedback.total_comment_count
      const share_count = data_new.feedback.share_count.count

      const data_Image = JSON.parse(dataa)
      //  resolve(data_Image)
      var result = {
        user,
        id: data_Image.id,
        title: title ? wrap(title) : "",
        created_time: data_Image.created_time,
        reaction: data_Image.feedback.top_reactions.edges,
        reaction_count: data_Image.feedback.reactors.count,
        comment_count,
        share_count,
        image: data_Image.image,
        accessibility_caption: data_Image.accessibility_caption,
        photo_product_tags: data_Image.photo_product_tags,
        tags: data_Image.tags,
        author: 'https://www.facebook.com/Developed.PLXT'
      };
      resolve(result)

    }).catch(err => {
      reject(err)
    })
  })

}
const fbStory = async function(url) {
  var wrap = function getValue(callbackId) {
    return JSON.parse('{"text": "' + callbackId + '"}').text;
  };
  return new Promise(async (resolve, reject) => {
    axios.get(url, {
      headers: datas
    }).then(async function(rawResponse) {
      //  resolve(rawResponse.data)
      var data = rawResponse.data;
      if (url.includes("&post_id=") || url.includes("&substory_index=")) {
        console.log('1')
        var datas = data.split(`"result":{"data":{"node":`)[1].split(`},"extensions":{"prefetch_uris_v2"`)[0]
        const data1 = JSON.parse(datas)
        //resolve(data1)
        const user = data1.comet_sections.content.story.actors[0]
        const reaction_count = data1.comet_sections.feedback.story.feedback_context.feedback_target_with_context.ufi_renderer.feedback.comet_ufi_summary_and_actions_renderer.feedback.reaction_count.count;
        const reaction = data1.comet_sections.feedback.story.feedback_context.feedback_target_with_context.ufi_renderer.feedback.comet_ufi_summary_and_actions_renderer.feedback.cannot_see_top_custom_reactions.top_reactions.edges;
        const share_count = data1.comet_sections.feedback.story.feedback_context.feedback_target_with_context.ufi_renderer.feedback.comet_ufi_summary_and_actions_renderer.feedback.share_count.count;
        const comment_count = data1.comet_sections.feedback.story.feedback_context.feedback_target_with_context.ufi_renderer.feedback.comet_ufi_summary_and_actions_renderer.feedback.total_comment_count;

        var attachments = data1.comet_sections.content.story.attachments[0].styles.attachment.media
        if (!data1.comet_sections.content.story.attachments[0].styles.attachment.media) {
          attachments = data1.comet_sections.content.story.attachments[0].styles.attachment.all_subattachments
        }

        message = data1.comet_sections.content.story.comet_sections.context_layout.story.comet_sections.title.story.title.text ? data1.comet_sections.content.story.comet_sections.context_layout.story.comet_sections.title.story.title.text : data1.comet_sections.content.story.comet_sections.message != null ? data1.comet_sections.content.story.comet_sections.message.story : 'not title'
        var data_api = {
          user,
          post_id: data1.post_id,
          title: message,
          comment_count,
          share_count,
          reaction_count,
          reaction,
          attachments

        }
        return resolve(data_api)
      } else if (data.includes(`,"result":{"data":{"node":`)) {
        console.log('2')
        var data2 = data.split(`,"result":{"data":{"node":`)[1].split(`},"extensions":{"prefetch_uris_v2"`)[0]
        var data2_new = JSON.parse(data2)
        //resolve(data2_new)
        const user = data2_new.comet_sections.content.story.actors[0]
        const title = data2_new.comet_sections.content.story.comet_sections.message_container.story.message ? data2_new.comet_sections.content.story.comet_sections.message_container.story.message.text : data2_new.comet_sections.content.story.comet_sections.message_container.story.translation.message.text
        //resolve(data2_new.comet_sections.content.story.attachments[0])
        const attachments = data2_new.comet_sections.content.story.attachments[0].styles.attachment.all_subattachments ? data2_new.comet_sections.content.story.attachments[0].styles.attachment.all_subattachments : data2_new.comet_sections.content.story.attachments[0].styles.attachment.five_photos_subattachments ? data2_new.comet_sections.content.story.attachments[0].styles.attachment.five_photos_subattachments : data2_new.comet_sections.content.story.attachments[0].styles.attachment.media ? data2_new.comet_sections.content.story.attachments[0].styles.attachment.media.cropped_image : data2_new.comet_sections.content.story.attachments[0].styles.attachment.footer_photos_subattachments ? data2_new.comet_sections.content.story.attachments[0].styles.attachment.footer_photos_subattachments : data2_new.comet_sections.content.story.attachments[0].throwbackStyles.attachment_target_renderer.attachment.target.attachments[0].styles.attachment.five_photos_subattachments

        const dataAll = data2_new.comet_sections.feedback.story.feedback_context.feedback_target_with_context.ufi_renderer.feedback.comet_ufi_summary_and_actions_renderer
        const reaction = dataAll.feedback.cannot_see_top_custom_reactions.top_reactions.edges
        const reaction_count = dataAll.feedback.reaction_count.count
        const comment_count = dataAll.feedback.total_comment_count
        const share_count = dataAll.feedback.share_count.count
        var data_api2 = {
          user,
          title,
          reaction_count,
          comment_count,
          share_count,
          reaction,
          attachments

        }
        return resolve(data_api2)
      }
      else if (data.includes("playable_url_quality_hd")) {
        console.log('3')
        var dt_video = data.split(`,"ufi_renderer":`)[1].split(`}},"id"`)[0]
        var data_video = JSON.parse(dt_video + '}}')
        // console.log(data_video)
        var data_url = data.split(`"multi_share_media_card_renderer":`)[1].split(`},{"target"`)[0]

        //resolve(title)
        var video = JSON.parse(data_url)
        //
        var result = {
          data: {
            comment_count: data_video.feedback.comet_ufi_summary_and_actions_renderer.feedback.comments_count_summary_renderer.feedback,
            reaction_count: data_video.feedback.comet_ufi_summary_and_actions_renderer.feedback.reaction_count.count,
            share_count: data_video.feedback.comet_ufi_summary_and_actions_renderer.feedback.share_count.count,
            reaction: data_video.feedback.comet_ufi_summary_and_actions_renderer.feedback.cannot_see_top_custom_reactions.top_reactions.edges,
            thumbnail: video.attachment.media.preferred_thumbnail.image
          },
          videos: {
            sd: video.attachment.media.playable_url,
            hd: video.attachment.media.playable_url_quality_hd
          },
          author: 'https://www.facebook.com/Developed.PLXT'
        };
        resolve(result)
      }
    }).catch(err => {
      reject(err)
    })
  })

}
const infoPost = async function(url) {
  var wrap = function getValue(callbackId) {
    return JSON.parse('{"text": "' + callbackId + '"}').text;
  };
  return new Promise(async (resolve, reject) => {
    // console.log(url)
    axios.get(url, {
      headers: datas
    }).then(async function(rawResponse) {
      var res = rawResponse.data;

      var datas = res.split(`,"result":{"data":{"node":`)[1] ? res.split(`,"result":{"data":{"node":`)[1].split(`},"extensions":{"prefetch_uris_v2"`)[0] : res.split(`,"result":{"data":{"nodes":[`)[1].split(`]},"extensions":{"prefetch_uris_v2"`)[0]

      var data2 = JSON.parse(datas)
      // resolve(data2)
      var user = data2.comet_sections.content.story.comet_sections.context_layout.story.comet_sections.actor_photo.story.actors
      console.log('1')
      var text_Post = data2.comet_sections.content.story.comet_sections.message.story

      console.log('2')
      var reaction_count = data2.comet_sections.feedback.story.feedback_context.feedback_target_with_context.ufi_renderer.feedback.comet_ufi_summary_and_actions_renderer.feedback.reaction_count.count
      console.log('3')
      var reaction = data2.comet_sections.feedback.story.feedback_context.feedback_target_with_context.ufi_renderer.feedback.comet_ufi_summary_and_actions_renderer.feedback.cannot_see_top_custom_reactions.top_reactions.edges
      console.log('4')
      var share_count = data2.comet_sections.feedback.story.feedback_context.feedback_target_with_context.ufi_renderer.feedback.comet_ufi_summary_and_actions_renderer.feedback.share_count.count
      console.log('5')
      var comment_count = data2.comet_sections.feedback.story.feedback_context.feedback_target_with_context.ufi_renderer.feedback.comet_ufi_summary_and_actions_renderer.feedback.total_comment_count
      var attachments = 'no data'

      if (text_Post.is_text_only_story === false) {
        attachments = data2.comet_sections.content.story.attachments[0].styles.attachment.media ? data2.comet_sections.content.story.attachments[0].styles.attachment : data2.comet_sections.content.story.attachments[0].styles.attachment.all_subattachments ? data2.comet_sections.content.story.attachments[0].styles.attachment.all_subattachments : data2.comet_sections.content.story.attachments[0].styles.attachment.five_photos_subattachments
        // resolve(attachments)
      }
      if (url.includes("/permalink.php?") || url.includes("post/")) {
        //console.log(text_Post)
        attachments = data2.comet_sections.content.story.attachments[0].styles.attachment.all_subattachments ? data2.comet_sections.content.story.attachments[0].styles.attachment.all_subattachments : data2.comet_sections.content.story.attachments[0].styles.attachment.five_photos_subattachments ? data2.comet_sections.content.story.attachments[0].styles.attachment.five_photos_subattachments : 'Không có hình ảnh or video'
      }

      var result = {
        user: user[0],
        text_Post,
        reaction_count,
        reaction,
        share_count,
        comment_count,
        attachments,
        author: 'https://www.facebook.com/Developed.PLXT'
      };
      resolve(result)

    }).catch(err => {
      reject(err)
    })
  })

}
module.exports = {
  facebookDL,
  facebookStoryDL,
  facebookGrupDL,
  facebookWatchDL,
  facebookReelDL,
  infoPhoto,
  fbStory,
  infoPost
}