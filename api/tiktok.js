let axios = require('axios')
let cheerio = require('cheerio')
var cookie = '_ttp=2AqKVxdRYXaJSgO9XaStmnpDwQf; tt_csrf_token=a7jPzx28-flDAObM6giWjbutmyOLx6VpMnRE; csrf_session_id=a766caf814c19b2fa4e91826f93b6503; passport_csrf_token=c6cac43721ba79af3a9b6a79bae9e7f1; passport_csrf_token_default=c6cac43721ba79af3a9b6a79bae9e7f1; s_v_web_id=verify_l8jw4ltv_VrOrRERd_KOQc_4GWi_AUtc_IGcPJPHt71MB; cmpl_token=AgQQAPPdF-RO0o5PEtn1NR04-KVTiH2Tv4AOYMSmeg; uid_tt=56d6457a7b1e86c26d5cd7a1f12d6eb18cdc21880a76987993aa257ab85d7dd6; uid_tt_ss=56d6457a7b1e86c26d5cd7a1f12d6eb18cdc21880a76987993aa257ab85d7dd6; sid_tt=211474191012cb06523a0546e8fb8db0; sessionid=211474191012cb06523a0546e8fb8db0; sessionid_ss=211474191012cb06523a0546e8fb8db0; store-idc=useast2a; store-country-code=vn; store-country-code-src=uid; tt-target-idc=alisg; passport_fe_beating_status=true; _gcl_au=1.1.1778288291.1664375342; tiktok_webapp_theme=dark; _abck=FAE89E232A6AA21BCD5572F972DB304B~-1~YAAQHwurcYYUczuEAQAAG4JXeggg8xm7KKLDc9AT/OI/yknbefkbro3KCLXTotovowPkST8EoYUgGMW/smIipFNcEx/wyNkiw3BCosq+/r/BqYgJLj6SlT1eGgUkYFVm0/xzIyVskU9NPi34Z+L5Ee47/LDYEbHxSScmCsKsfd48fheYw902xn3aCnHmMf4Y42YrCkMzUDCpi5SsNsawZHjJ9fxUByu/x20IbxFS72EM2rN41gr4IokRjL9QFzvC8NoJEk3LRgtEkM2osd/U1eqsV3Aw9P0sv8tUrWi8MQwjQueX56AliFDIDZoUlCq+UzqZKwzN50IzCrp1owKD6cTcYOOmcheibQZe3lB2hZJvNQ==~-1~-1~-1; __tea_cache_tokens_1988={%22_type_%22:%22default%22%2C%22user_unique_id%22:%227117036219183957506%22%2C%22timestamp%22:1664264427556}; sid_guard=211474191012cb06523a0546e8fb8db0%7C1669241569%7C5184000%7CSun%2C+22-Jan-2023+22%3A12%3A49+GMT; sid_ucp_v1=1.0.0-KGViM2NlYjc1NTM3YmU2ZTYyMTkzMzhiMDI4OTNiNmFkN2FmNjU5NWEKHwiBiJ_o54__uF4Q4bX6mwYYswsgDDCb-sfzBTgIQAoQARoDc2cxIiAyMTE0NzQxOTEwMTJjYjA2NTIzYTA1NDZlOGZiOGRiMA; ssid_ucp_v1=1.0.0-KGViM2NlYjc1NTM3YmU2ZTYyMTkzMzhiMDI4OTNiNmFkN2FmNjU5NWEKHwiBiJ_o54__uF4Q4bX6mwYYswsgDDCb-sfzBTgIQAoQARoDc2cxIiAyMTE0NzQxOTEwMTJjYjA2NTIzYTA1NDZlOGZiOGRiMA; tt_chain_token=52t9ePzyKb0/9sI/7dXuHA==; ttwid=1%7CnzxjWkF_bPsckKYq41NqGloWGazSjrBGxTflIOgNapI%7C1669276490%7C9e8604e08258bb2826083c78b2bb42bcb5675368aae20c6953804ea8783dde8b; msToken=rADht3iYLOY32hmn_cHAmowTd2H1vxt2CVox8BKY46SoWgwv0Dz1H8knGf0fd1GXuvGgoudYc8Md1Fpy77FGgvoBzxVyQ7fjk3b7UFSJFGaL1qdH-AMLWlNlDgVHQGJz3GvN2HA=; odin_tt=c1f7c2d4f730f6f16507dbd1dc22a8d737af0413a5cbc9228660b1b5cf8a386022ae4c48647ed4753e63ffe9ab205ce57cfa2ceae8b55a92c54904b44a501ce7fdeca0a48e1c133bbf8dd784cd3e2b55; msToken=AAqODHPmt26U3QEGb4x24JFjUCUgGUI49rUHqkvd4NpYj7FrB92yDRETLjk4NGovAwrqsuKwAzw_0SyqvlM8ipn4e2fTA354wvnFCYxZhYGAfMGOmuS6M2ttmItxzTp4kfbnhd4='

const tiktok = async function(username) {
  return new Promise(async (resolve, reject) => {
    axios.get(`https://www.tiktok.com/@${username}`, {
      headers: {
        'user-agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 13_2_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0.3 Mobile/15E148 Safari/604.1',
        'cookie': cookie
      }
    }).then(res => {
      const $ = cheerio.load(res.data);
      const MobileUserModule = $('script[id="SIGI_STATE"]').text();
      var json = JSON.parse(MobileUserModule);
      var users = json.MobileUserModule.users[`${username}`];
      var users1 = json.MobileUserModule.stats[`${username}`];
      var item = [];
      for (const [key, value] of Object.entries(json.MobileItemModule)) {
        item.push(value);
      }
      resolve({
        user: users,
        userStats: users1,
        item: item,
        author: "https://www.facebook.com/Developed.PLXT"
      })
    }).catch(err => {
      reject(err)
    })
  })

}
/*const tiktokVideo = async function(link, id) {
  return new Promise(async (resolve, reject) => {
    axios.get(link, {
      headers: {
        'user-agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 13_2_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0.3 Mobile/15E148 Safari/604.1',
        'cookie': cookie
      }
    }).then(async function (res) {
      const $ = cheerio.load(res.data);
      const MobileUserModule = $('script[id="SIGI_STATE"]').text();
      var json = JSON.parse(MobileUserModule);
      var video = json.MobileItemModule[`${id}`]

      resolve({
        data: video,
        author: "https://www.facebook.com/Developed.PLXT"
      })
    }).catch(err => {
      reject(err)
    })
  })

}*/
const tiktokPost = async function(username) {
  return new Promise(async (resolve, reject) => {
    axios.get(`https://www.tiktok.com/@${username}`, {
      headers: {
        'user-agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 13_2_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0.3 Mobile/15E148 Safari/604.1',
        'cookie': cookie
      }
    }).then(res => {
      
      const $ = cheerio.load(res.data);
      const MobileUserModule = $('script[id="SIGI_STATE"]').text();
      var json = JSON.parse(MobileUserModule);
      var users = json.MobileItemModule;
      //var users1 = json.MobileUserModule.stats[`${username}`];
      resolve(users)
      resolve({
        post: users,
        author: "https://www.facebook.com/Developed.PLXT"
      })
    }).catch(err => {
      reject(err)
    })
  })

}

/*const tiktokVd = async function(link) {
  return new Promise(async (resolve, reject) => {
    axios.get(link, {
      headers: {
        'user-agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 13_2_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0.3 Mobile/15E148 Safari/604.1',
        'cookie': cookie
      }
    }).then(async function (res) {
     const $ = cheerio.load(res.data);
      const MobileUserModule = $('script[id="SIGI_STATE"]').text();
      var json = JSON.parse(MobileUserModule);
      var video = json.SharingVideoModule.videoData.itemInfo.itemStruct;

      resolve({
        data: video,
        author: "https://www.facebook.com/Developed.PLXT"
      })
    }).catch(err => {
      reject(err)
    })
  })

}*/
const tiktokVideo = async function(link) {
  return new Promise(async (resolve, reject) => {
   if (!link) return reject({ 
     statut: false,
    message: "Missing Url!" 
});
    const headers = {
      Accept: "*/*",
      "User-Agent": "Thunder Client (https://www.thunderclient.com)"
    };
    try {
      const res = await axios.get(link, {
        headers: headers
      });
      var url = res.request.res.responseUrl
      var videoID = getVideoID(url);
      if (!videoID) {
        return reject({ 
          statut: false,
          message: "Invalid Url!"
 });
      }
      else {
        axios.get(`https://api2.musical.ly/aweme/v1/feed/?aweme_id=${videoID}`, {
          headers: headers
        }).then(({ data }) => {
          //resolve(data.aweme_list[0])
          var img = data.aweme_list[0].image_post_info ? data.aweme_list[0].image_post_info : false
          if(img !== false){
            var listImage = [];
            for(const datas of data.aweme_list[0].image_post_info.images){
              listImage.push(datas.display_image.url_list[0])
            }
            var data_music = data.aweme_list[0].music ? data.aweme_list[0].music : false
           return resolve({
             code: 0,
             msg: 'success',
            channel: {
              uid: data.aweme_list[0].author.uid,
              username: data.aweme_list[0].author.unique_id,
              nickname: data.aweme_list[0].author.nickname,
              signature: data.aweme_list[0].author.signature,
              birthday: data.aweme_list[0].author.birthday,
              follower_count: data.aweme_list[0].author.following_count,
              following_count: data.aweme_list[0].author.following_count,
              avatar_thumb: data.aweme_list[0].author.avatar_thumb
            },
            video: {
              title: data.aweme_list[0].desc,
              image_post_info: listImage,
              statistics: data.aweme_list[0].statistics
            },
            music: {
              id: data_music ? data_music?.id : null,
              author: data_music ? data_music?.author : null,
              title: data_music ? data_music?.title : null,
              cover_hd: data_music ? data_music?.cover_hd?.url_list : null,
              mp3: data_music ? data_music?.play_url : null,
              duration: data_music ? data_music.duration : null
            }
          })
          }
          resolve({
            code: 0,
             msg: 'success',
            channel: {
              uid: data.aweme_list[0].author.uid,
              username: data.aweme_list[0].author.unique_id,
              nickname: data.aweme_list[0].author.nickname,
              signature: data.aweme_list[0].author.signature,
              birthday: data.aweme_list[0].author.birthday,
              follower_count: data.aweme_list[0].author.following_count,
              following_count: data.aweme_list[0].author.following_count,
              avatar_thumb: data.aweme_list[0].author.avatar_thumb
            },
            video: {
              title: data.aweme_list[0].desc,
              thumbnail_src: data.aweme_list[0].video.cover.url_list[0],
              no_watermark: data.aweme_list[0].video.play_addr.url_list[0],
              watermark: data.aweme_list[0].video.download_addr.url_list[0],
              statistics: data.aweme_list[0].statistics
              
            },
            music: {
              id: data.aweme_list[0].music.id,
              author: data.aweme_list[0].music.author,
              title: data.aweme_list[0].music.title,
              cover_hd: (data.aweme_list[0].music.cover_hd ? data.aweme_list[0].music.cover_hd.url_list : ''),
              mp3: data.aweme_list[0].music.play_url,
              duration: data.aweme_list[0].music.duration
            }
          })
        })
      }
    } catch (e) {
      return reject({ 
        statut: false, 
        message: "Invalid Url!" });
    }
  })
}

const tiktokdl = async function(link) {
  return new Promise(async (resolve, reject) => {
   if (!link) return reject({ 
     statut: false,
    message: "Missing Url!" 
});
    const headers = {
      Accept: "*/*",
      "User-Agent": "Thunder Client (https://www.thunderclient.com)"
    };
    try {
      const res = await axios.get(link, {
        headers: headers
      });
      var url = res.request.res.responseUrl
      var videoID = getVideoID(url);
      if (!videoID) {
        return reject({ 
          statut: false,
          message: "Invalid Url!"
 });
      }
      else {
        axios.get(`https://tikwm.com/api/?url=${videoID}`, {
          headers: headers
        }).then(data => {
          
          resolve(data.data)
        })
      }
    } catch (e) {
      return reject({ 
        statut: false, 
        message: "Invalid Url!" });
    }
  })
}

function getVideoID(url) {
  const regex = /(@[a-zA-z0-9]*|.*)(\/.*\/|trending.?shareId=)([\d]*)/gm;
  const match = regex.exec(url);
  if (match) {
    return match[3];
  }
  return null;
}
module.exports = {
  tiktok,
  tiktokPost,
  tiktokVideo,
  tiktokdl
 // tiktokVd
}