var axios = require("axios");

var options = {
  method: 'GET',
  url: 'https://fb.watch/hodn_31iZB/',
  headers: {
    accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
    'accept-language': 'vi-VN,vi;q=0.9,fr-FR;q=0.8,fr;q=0.7,en-US;q=0.6,en;q=0.5',
    'cache-control': 'max-age=0',
    dpr: '1.1041666269302368',
    'sec-ch-prefers-color-scheme': 'light',
    'sec-ch-ua': '"Chromium";v="122", "Not(A:Brand";v="24", "Google Chrome";v="122"',
    'sec-ch-ua-full-version-list': '"Chromium";v="122.0.6261.69", "Not(A:Brand";v="24.0.0.0", "Google Chrome";v="122.0.6261.69"',
    'sec-ch-ua-mobile': '?0',
    'sec-ch-ua-model': '""',
    'sec-ch-ua-platform': '"Windows"',
    'sec-ch-ua-platform-version': '"15.0.0"',
    'sec-fetch-dest': 'document',
    'sec-fetch-mode': 'navigate',
    'sec-fetch-site': 'same-origin',
    'sec-fetch-user': '?1',
    'upgrade-insecure-requests': '1',
    'viewport-width': '1238',
    cookie: 'ps_n=0; sb=kpDTZdFudkyio-GdobDu3de-; datr=kpDTZe009BxJd-9MiU1hDITT; c_user=100078830621307; dpr=1.1041666269302368; xs=38%3AyWKfAKEqx5Ov2A%3A2%3A1708363970%3A-1%3A6746%3A%3AAcWLcLog9VjmQsNSDD6MabOZ7n6IkgxEJQCaBP4nBEE; fr=1emSiaYMV9NSsZTFm.AWU_M5jpf7lnXgtJeCUEDBWvf8E.Bl30Vt.yZ.AAA.0.0.Bl30Vt.AWUH9VoUBMg; presence=C%7B%22t3%22%3A%5B%5D%2C%22utc3%22%3A1709131660168%2C%22v%22%3A1%7D; wd=1238x953'
  }
};

axios(options).then(function (response) {
    response.data = ''
  console.log(response.request.res.responseUrl);
}).catch(function (error) {
  console.error(error);
});