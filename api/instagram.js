const axios = require("axios");
const rq = require('request')
var data = 'bWlkPVk2cmNZUUFMQUFGZ3piSjFQdjB6azhJVXBYRUk7IGlnX2RpZD04RjhDNUE2Ny1ERDcyLTQxQzctQjgwQy01RThCMjk0RTNDMUM7IGlnX25yY2I9MTsgZGF0cj01dHlxWXpGZUVwVUdFbUktTllPY2pWekQ7IGZibV8xMjQwMjQ1NzQyODc0MTQ9YmFzZV9kb21haW49Lmluc3RhZ3JhbS5jb207IGRzX3VzZXJfaWQ9NTU2NTQ5MjY1MDc7IGNzcmZ0b2tlbj1SdE9TMUdBdmU3MGJLeWxDWFdPS1Z1MlRaS25QWHBWRzsgc2Vzc2lvbmlkPTU1NjU0OTI2NTA3JTNBdzRoeVBuS1ZsZk5GdnAlM0ExNiUzQUFZZVRNekg5U2E4dGk2RXduQUxRczBfMnROaWYzclBQTXB2Q2h3TDRLZzsgc2hiaWQ9IjQxMTZcMDU0NTU2NTQ5MjY1MDdcMDU0MTcxMjIyNzQ4OTowMWY3NjEyN2QwZTNmMzk3MTYwY2UzZmZlNGVjZjJjNTdjMDRhZjE5MTI2MmFmMGI0MTFhYjViNDZjNTA3NDdhNzFhNDk4NTgiOyBzaGJ0cz0iMTY4MDY5MTQ4OVwwNTQ1NTY1NDkyNjUwN1wwNTQxNzEyMjI3NDg5OjAxZjc5ZWNjNTFiM2RkYTI3YWUwZmE3MDFjNDU3MmY4Nzg5ZGRkNzZmMzEyZjNlNTJlM2NjODVjNjMzZjczOWI2MjQ4ZmFkYSI7IGZic3JfMTI0MDI0NTc0Mjg3NDE0PUt3a1Via29oNUtsY252RFFtUGttSnFtcVhYc0V3WUk4T1hsUDFOVndRVGsuZXlKMWMyVnlYMmxrSWpvaU1UQXdNRGN6TWpnd05qSTJOREUwSWl3aVkyOWtaU0k2SWtGUlFtZFFUMkpQYTFwMWVqUmpUbGRpZFhCV1ZGbEZhV2N6T1RSaVJWSjVNbW8wUVZaUk4xTXdaRWx4WWxwaGN6ZFNXVlpNYzB4MU9VYzVaWGhGVVZaMlEwUXpXa2t3YWtJeVZHZGFOekZ5VDFaT1dYQndlbm8yWkVwWVZsWlZXREIyWjBZeFMxSnJTVmd6UVVReVZqSlBVMHBxY1ROcmIwRnhUVmxVZDFsakxWTmlTMmR6YjNsYVIwcEZWVlp0U2kxWmVHaDZMVWR5WTI1QlZ6UldlR0ZmZW5Cd2EweE1WVTF6VGpodFNsbFFSalZMVkV0TVFXaGhabmR1YTBzM1ZURTFNbkV0UzFsaWFubHVaemN3Y200eVpqWlJVV3BPWlZwWmJXWXlYMms1VTJaQ1gyNVBieTFXT1VwRE1WUlNhalozY1ZnNFpraEplSEkyWW1oRVJIZE5abkJNT0RJMWFVZFdaSGd4U25GS2JWOVFaV2xCZFRnek56aHRkWGgwWld4MFdsSnhWMmxyVVVKdlNWUlBhVjlXV0dSNGNFUXhMVVYzY0dFelJVMURTRFZoTXpOSlFreEZRbkZFZVZWSmJYQlJkR3N0UlVORElpd2liMkYxZEdoZmRHOXJaVzRpT2lKRlFVRkNkM3BNYVhodWFsbENRVXhLWkRKWVRsUlJaSHBJWlhKVGFWaElPRXhIWkhBeU1rTktaRVZGT0U5dWNHRTNUVmxUZFUxU1pGVTJOMDFOWTNsbFpsWmhSRzFVTUdGU1RVZGFRbU14UW1WSVRYaG5WRlpETUU5TE4zUnpSM0ZsYm5JM1MycFZNVWxqZHpobVFXMVRUM3BOV2tGdFZFUnphWFJ2VWtWUU0zVmFRWEZhUWsxTVNXcG1PVzEwYjB4aWJuWmFRbU0xVURsSk5GbEhiRVZ0V2tGNmJuVkViV2RPTmxCUFZscERWalJqVUc1bWRYaFdPSGR5UlZVMloydDJWRGwzYjAxdWMyaDVkV1l5UVZwRVdrUWlMQ0poYkdkdmNtbDBhRzBpT2lKSVRVRkRMVk5JUVRJMU5pSXNJbWx6YzNWbFpGOWhkQ0k2TVRZNE1EWTVNek0wT1gwOyBmYnNyXzEyNDAyNDU3NDI4NzQxND1Ld2tVYmtvaDVLbGNudkRRbVBrbUpxbXFYWHNFd1lJOE9YbFAxTlZ3UVRrLmV5SjFjMlZ5WDJsa0lqb2lNVEF3TURjek1qZ3dOakkyTkRFMElpd2lZMjlrWlNJNklrRlJRbWRRVDJKUGExcDFlalJqVGxkaWRYQldWRmxGYVdjek9UUmlSVko1TW1vMFFWWlJOMU13WkVseFlscGhjemRTV1ZaTWMweDFPVWM1WlhoRlVWWjJRMFF6V2trd2FrSXlWR2RhTnpGeVQxWk9XWEJ3ZW5vMlpFcFlWbFpWV0RCMlowWXhTMUpyU1ZnelFVUXlWakpQVTBwcWNUTnJiMEZ4VFZsVWQxbGpMVk5pUzJkemIzbGFSMHBGVlZadFNpMVplR2g2TFVkeVkyNUJWelJXZUdGZmVuQndhMHhNVlUxelRqaHRTbGxRUmpWTFZFdE1RV2hoWm5kdWEwczNWVEUxTW5FdFMxbGlhbmx1Wnpjd2NtNHlaalpSVVdwT1pWcFpiV1l5WDJrNVUyWkNYMjVQYnkxV09VcERNVlJTYWpaM2NWZzRaa2hKZUhJMlltaEVSSGROWm5CTU9ESTFhVWRXWkhneFNuRktiVjlRWldsQmRUZ3pOemh0ZFhoMFpXeDBXbEp4VjJsclVVSnZTVlJQYVY5V1dHUjRjRVF4TFVWM2NHRXpSVTFEU0RWaE16TkpRa3hGUW5GRWVWVkpiWEJSZEdzdFJVTkRJaXdpYjJGMWRHaGZkRzlyWlc0aU9pSkZRVUZDZDNwTWFYaHVhbGxDUVV4S1pESllUbFJSWkhwSVpYSlRhVmhJT0V4SFpIQXlNa05LWkVWRk9FOXVjR0UzVFZsVGRVMVNaRlUyTjAxTlkzbGxabFpoUkcxVU1HRlNUVWRhUW1NeFFtVklUWGhuVkZaRE1FOUxOM1J6UjNGbGJuSTNTMnBWTVVsamR6aG1RVzFUVDNwTldrRnRWRVJ6YVhSdlVrVlFNM1ZhUVhGYVFrMU1TV3BtT1cxMGIweGliblphUW1NMVVEbEpORmxIYkVWdFdrRjZiblZFYldkT05sQlBWbHBEVmpSalVHNW1kWGhXT0hkeVJWVTJaMnQyVkRsM2IwMXVjMmg1ZFdZeVFWcEVXa1FpTENKaGJHZHZjbWwwYUcwaU9pSklUVUZETFZOSVFUSTFOaUlzSW1semMzVmxaRjloZENJNk1UWTRNRFk1TXpNME9YMDsgcnVyPSJFQUdcMDU0NTU2NTQ5MjY1MDdcMDU0MTcxMjIyOTM3MjowMWY3NTY2MWRiYWIwMmNhZTg5ZThmZmQ0NmY0YTk4OWZlZTljNGNiYzA3N2NkMjdkNWUzZWIyNjQ5Y2U0ZmFiY2FhMTUyYzUi';
const igInfo = async function(username) {
  return new Promise(async (resolve, reject) => {
    if (!username) return reject({
      message: "Invaild Username"
    });
    let buff = new Buffer.from(data, 'base64');
    let cookie = buff.toString('ascii');
    // var cookie = (await axios.get('https://pastebin.com/raw/Ypfg7H1b')).data
    const config = {
      method: 'get',
      url: `https://www.instagram.com/${username}/?__a=1&__d=dis`,
      headers: {
        cookie: cookie
      }
    };

    await axios(config).then(data => {

      var json = data.data.graphql.user
      // console.log(json)
      var resul = {
        data: {
          username: json.username,
          fullname: json.full_name,
          private: json.is_private ? "Yes" : "No",
          id: json.id,
          followers: json.edge_followed_by.count,
          following: json.edge_follow.count,
          post_cout: json.edge_owner_to_timeline_media.count,
          website: json.external_url ? json.external_url : "No",
          bio: json.biography,
          picture: json.profile_pic_url_hd
        },
        author: "Phạm Lê Xuân Trường"
      }

      resolve(resul)
    }).catch(err => {
      reject(err)
    })
  })
}
const videodl = async function(url) {
  return new Promise(async (resolve, reject) => {

    if (!url) return reject({
      statut: false,
      error: "Vui lòng nhập link video!"
    })
    let buff = new Buffer.from(data, 'base64');
    let cookie = buff.toString('ascii');
    let str = await searchID(url);
    //console.log(str)
    axios({
      method: "get",
      url: `https://www.instagram.com/p/` + str + "/?__a=1&__d=dis",
      headers: {
        cookie: cookie
      }
    }).then(body => {
      //  resolve(body.data)
      var json = body.data.items[0]
      var resul = {
        statut: true,
        author: "Phạm Lê Xuân Trường",
        user_id: json.caption.user_id,
        title: json.caption.text,
        name: json.user.full_name,
        video_duration: json.video_duration + 's',
        like: json.like_count,
        comment: json.comment_count,
        view_count: json.view_count,
        play_count: json.play_count,
        user: json.caption.user,
        video_versions: json.video_versions,
        thumbnail: json.image_versions2.candidates[0],
        caption: json.caption,
        is_verified: json.user.is_verified,
        is_private: json.user.is_private,
        has_anonymous_profile_picture: json.user.has_anonymous_profile_picture,
        account_badges: json.user.account_badges,
        fan_club_info: json.user.fan_club_info
      }

      resolve(resul)
    }).catch(err => {
      console.log(err)
      reject(err)
    })
  })
}
const audiodl = async function(url) {
  return new Promise(async (resolve, reject) => {

    if (!url) return reject({
      statut: false,
      error: "Vui lòng nhập link video!"
    })
    let buff = new Buffer.from(data, 'base64');
    let cookie = buff.toString('ascii');
    let str = await searchID(url);
    console.log(str)
    axios({
      method: "get",
      url: `https://www.instagram.com/p/` + str + "/?__a=1&__d=dis",
      headers: {
        ':authority': 'www.instagram.com',
        'accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
        'accept-encoding': 'gzip, deflate, br',
        'accept-language': 'vi,en-US;q=0.9,en;q=0.8',
        'cache-control': 'max-age=0',
        'sec-ch-ua': '"Not?A_Brand";v="8", "Chromium";v="108", "Google Chrome";v="108"',
'sec-ch-ua-mobile': '?0',
'sec-ch-ua-platform': '"Windows"',
'sec-fetch-dest': 'document',
'sec-fetch-mode': 'navigate',
'sec-fetch-site': 'same-origin',
'sec-fetch-user': '?1',
'upgrade-insecure-requests': '1',
'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36',
        cookie: cookie
      }
    }).then(body => {
      // resolve(body.data)
      var json = body.data.items[0]
      var resul = {
        statut: true,
        author: "Phạm Lê Xuân Trường",
        user_id: json.caption.user_id,
        title: json.caption.text,
        name: json.user.full_name,
        ig_artist: json.clips_metadata.music_info.music_consumption_info.ig_artist,
        audio: {
          id: json.clips_metadata.music_info.music_asset_info.audio_cluster_id,
          audio_duration: json.clips_metadata.music_info.music_asset_info.duration_in_ms + 'ms',
          url: json.clips_metadata.music_info.music_asset_info.progressive_download_url
        },
        thumbnail: json.image_versions2.candidates[0],
        caption: json.caption,
        is_verified: json.user.is_verified,
        is_private: json.user.is_private,
      }

      resolve(resul)
    }).catch(err => {
      reject(err)
    })
  })
}
const infoPost = async function(url) {
  return new Promise(async (resolve, reject) => {

    if (!url) return reject({
      statut: false,
      error: "Vui lòng nhập link!"
    })
    let buff = new Buffer(data, 'base64');
    let cookie = buff.toString('ascii');
    let str = await searchID(url);
    // console.log(str)
    axios({
      method: "get",
      url: `https://www.instagram.com/p/` + str + "/?__a=1&__d=dis",
      headers: {
        cookie: cookie
      }
    }).then(body => {
      //   resolve(body.data)
      var json = body.data.items[0]
      var data_thumbnail = []
      for (const datas of json.carousel_media) {
        data_thumbnail.push(datas.image_versions2.candidates[0])
      }
      var resul = {
        statut: true,
        author: "Phạm Lê Xuân Trường",
        user_id: json.caption.user_id,
        title: json.caption.text,
        name: json.user.full_name,
        user_name: json.user.username,
        carousel_media_count: json.carousel_media_count,
        like: json.like_count,
        comment: json.comment_count,
        thumbnail: data_thumbnail,
        is_verified: json.user.is_verified,
        is_private: json.user.is_private,
        has_anonymous_profile_picture: json.user.has_anonymous_profile_picture,
        account_badges: json.user.account_badges,
        fan_club_info: json.user.fan_club_info
      }

      resolve(resul)
    }).catch(err => {
      reject(err)
    })
  })
}
const search = async function(username) {
  return new Promise(async (resolve, reject) => {
    if (!username) return reject({
      message: "Invaild Username"
    });
    let buff = new Buffer(data, 'base64');
    let cookie = buff.toString('ascii');
    // var cookie = (await axios.get('https://pastebin.com/raw/Ypfg7H1b')).data
    const config = {
      method: 'get',
      url: `https://www.instagram.com/web/search/topsearch/?query=${username}`,
      headers: {
        cookie: cookie
      }
    };

    await axios(config).then(data => {
      var json = data.data

      resolve(json)
    }).catch(err => {
      reject(err)
    })
  })
}
const searchID = function(url) {
  const regex = /(?:https?:\/\/)?(?:www.)?instagram.com\/?([a-zA-Z0-9\.\_\-]+)?\/([p]+)?([reel]+)?([tv]+)?([stories]+)?\/([a-zA-Z0-9\-\_\.]+)\/?([0-9]+)?/gm;
  return regex.exec(url)[6]
}

module.exports = {
  igInfo,
  search,
  videodl,
  infoPost,
  audiodl,
  searchID
}

 // authority: "www.instagram.com",
 //        'user-agent': 'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/107.0.0.0 Mobile Safari/537.36',
 //        'accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
 //        'accept-language': 'vi,en;q=0.9',
 //        'sec-ch-ua': '"Google Chrome";v="107", "Chromium";v="107", "Not=A?Brand";v="24"',
 //        'sec-ch-ua-mobile': '?1',
 //        'sec-ch-ua-platform': "Android",
 //        'sec-fetch-dest': 'document',
 //        'sec-fetch-mode': 'navigate',
 //        'sec-fetch-site': 'same-origin',
 //        'sec-fetch-user': '?1',
 //        'upgrade-insecure-requests': '1',