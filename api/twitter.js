const axios = require('axios')

const getInfo = async function (username){
  return new Promise(async (resolve, reject) => {
  const url = 'https://api.twitter.com/1.1/users/show.json'//, + username
  const response = await axios.get(url, { screen_name: username },
                                   {
                                     headers: {
                                       'Accept': 'application/json',
                                       authorization: 'Bearer AAAAAAAAAAAAAAAAAAAAANRILgAAAAAAnNwIzUejRCOuH5E6I8xnZz4puTs%3D1Zv7ttfk8LF81IUq16cHjhLTvJu4FA33AGWWjCpTnA',
                                       'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/107.0.0.0 Safari/537.36',
'x-csrf-token': '200a62f93ca6cac33a2e4ad86ad8c7ef058f395715019694d75131681de493118cae5f2a7e9d8aec059e44ac8c64ff58576f89d045e3fd94db2256c73a94ad42e1daa0008139649046de6fe6b63036de',
                                       'x-twitter-active-user': 'yes',
'x-twitter-auth-type': 'OAuth2Session',
                                       cookies: 'guest_id_marketing=v1%3A167239703580743970; guest_id_ads=v1%3A167239703580743970; personalization_id="v1_HprDLMhROxVGVVvkO+NRhQ=="; guest_id=v1%3A167239703580743970; gt=1608775973985742851; _gid=GA1.2.650354726.1672385109; att=1-S160JBszzRCRVnym5CmcYXaNdkeKfVR4d5q1IgUu; at_check=true; mbox=session#cec991704bdf457bb0bfe22f3ea4495c#1672387031|PC#cec991704bdf457bb0bfe22f3ea4495c.38_0#1735629971; _ga_BYKEBDM7DS=GS1.1.1672385176.1.0.1672385176.0.0.0; _twitter_sess=BAh7CSIKZmxhc2hJQzonQWN0aW9uQ29udHJvbGxlcjo6Rmxhc2g6OkZsYXNo%250ASGFzaHsABjoKQHVzZWR7ADoPY3JlYXRlZF9hdGwrCGwdo2KFAToMY3NyZl9p%250AZCIlZTFjODdlYWRmMzVmY2Q2MzBjZDBmZmVlYzhkZjYyNWY6B2lkIiVkODFi%250AZjI0N2IxMGY5ZmFiOTA1YWFhYTJhZTgyNGQ0Nw%253D%253D--69e24bfde6df1782df403fdb1e0b6b7f8b4a2e43; kdt=KeLTjsb219782FN3Y6na5ehMzjOUaNrMhFqWH5W6; auth_token=d8915f6faa249cdaa41f5d4fb4364d6e0d5e71a0; ct0=200a62f93ca6cac33a2e4ad86ad8c7ef058f395715019694d75131681de493118cae5f2a7e9d8aec059e44ac8c64ff58576f89d045e3fd94db2256c73a94ad42e1daa0008139649046de6fe6b63036de; twid=u%3D1608778137663602693; lang=en; external_referer=padhuUp37zjqe56gIzs8p1FIggMMB8OA|0|8e8t2xd8A2w%3D; _ga=GA1.2.825894667.1672385109'
                                     }
                                   })
   resolve(response.data)
  })
}
module.exports = {
  getInfo
}