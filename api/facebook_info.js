let axios = require('axios')
let cheerio = require('cheerio')

const facebook = async function(uid, tokens) {
  return new Promise(async (resolve, reject) => {

    axios({
      method: "get",
      url: `https://graph.facebook.com/v1.0/${uid}?fields=name,is_verified,cover,first_name,email,about,birthday,gender,website,hometown,link,location,quotes,relationship_status,significant_other,username,subscribers.limite(0)&access_token=${tokens}`,
      // headers: headers
    }).then(async body => {
      var name = body.data.name || "...",
        very = body.data.is_verified,
        first_name = body.data.first_name || "...",
        username = body.data.username || "...",
        uid = body.data.id || "...",
        about = body.data.about || "...",
        follow = body.data.subscribers.summary.total_count || "private",
        birthday = body.data.birthday || "private",
        gender = body.data.gender,
        hometown = body.data.hometown,
        // hometown_id = body.data.hometown.id || null,
        link = body.data.link || "...",
        location = body.data.location,
        // location_id = body.data.location.id,
        relationship = body.data.relationship_status || "...",
        love = body.data.significant_other,
        // id_love = body.data.significant_other.id,
        quotes = body.data.quotes || "...",
        website = body.data.website || "...",
        avatar = `https://graph.facebook.com/${uid}/picture?height=1500&width=1500&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`;
      location_id = null == location ? '...' : location.id, location = null == location ? '...' : location.name, hometown_id = null == hometown ? '...' : hometown.id, hometown = null == hometown ? '...' : hometown.name, id_love = null == love ? 'private' : love.id, love = null == love ? 'private' : love.name, gender = "male" == gender ? "Nam" : "female" == gender ? "Nữ" : "private";
      very = true == very ? 'đã xác minh' : 'chưa xác minh';
      resolve({
        status: 200,
        result: {
          uid: uid,
          name: name,
          very: very,
          first_name: first_name,
          username: username,
          about: about,
          follow: follow,
          birthday: birthday,
          gender: gender,
          hometown: {
            name: hometown,
            id: hometown_id
          },
          link: link,
          location: {
            name: location,
            id: location_id
          },
          relationship: relationship,
          love: {
            name: love,
            id: id_love
          },
          quotes: quotes,
          website: website,
          avatar: avatar
        },
        author: "https://www.facebook.com/PLXT.developer"
      })
    }).catch(err => {
      reject(err)
    })
  })

}

module.exports = {
  facebook
}