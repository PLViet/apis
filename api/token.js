
const axios = require("axios")
var deviceID = require('uuid')
var adid = require('uuid')
const totp = require('totp-generator');

const convert = async (token, access_token) => {
  return new Promise(async (resolve, reject) => {
    try {
        
        const token_obj = {
            'EAAD6V7': "275254692598279",
            'EAAAAU': '350685531728',
            'EAAD': '256002347743983',
            'EAAGO': '438142079694454',
            'EAAAAAY': '6628568379',
        }
        if (!token_obj["EAAD6V7"]) {
            return reject({
              statut: false,
              message:'Hiện tại ko hỗ trợ convert token này'
            })
        }
        const data2 = await axios.get(`https://api.facebook.com/method/auth.getSessionforApp?access_token=${access_token}&format=json&generate_session_cookies=1&new_app_id=${token}`/*1348564698517390`*/);
      console.log(data2.data.session_cookies)
      if(!data2.data.error_code){
        const cookie = data2.data.session_cookies.map(cookie => `${cookie.name}=${cookie.value}`).join('; ');
        resolve({
            status: 'success',
            token: data2.data.access_token || "lỗi Convert Token",
          cookie,
            author: 'Phạm Lê Xuân Trường'
        });
      }
    } catch (error) {
      console.log(error)
      reject({
                status: 'error',
                token: 'Chỉ áp dụng các dạng EAAAAU EAAAAAY',
                author: 'Phạm Lê Xuân Trường'
            });
    }
  })
};
const getToken = async (account) => {
  return new Promise(async (resolve, reject) => {
    if (!account) {
      return reject({
        success: '400',
        message: 'lỗi, định dạng https://www.xuantruong.dev/facebook/getToken?account=uid|pass|2fa',
        author: 'Phạm Lê Xuân Trường'
      });
    }
    var uid = account.split('|')[0]
    var password = account.split('|')[1]
    var fa = account.split('|')[2]
  
    var form = {
        adid: adid.v4(),
        email: uid,
        password: password,
        format: 'json',
        device_id: deviceID.v4(),
        cpl: 'true',
        family_device_id: deviceID.v4(),
        locale: 'en_US',
        client_country_code: 'US',
        credentials_type: 'device_based_login_password',
        generate_session_cookies: '1',
        generate_analytics_claim: '1',
        generate_machine_id: '1',
        currently_logged_in_userid: '0',
        try_num: "1",
        enroll_misauth: "false",
        meta_inf_fbmeta: "NO_FILE",
        source: 'login',
        machine_id: randomString(24),
        meta_inf_fbmeta: '',
        fb_api_req_friendly_name: 'authenticate',
        fb_api_caller_class: 'com.facebook.account.login.protocol.Fb4aAuthHandler',
        api_key: '882a8490361da98702bf97a021ddc14d',
        access_token: '275254692598279|585aec5b4c27376758abb7ffcb9db2af'
    }

    form.sig = encodesig(sort(form))
    var options = {
        url: 'https://b-graph.facebook.com/auth/login',
        method: 'post',
        data: form,
        transformRequest: [
            (data, headers) => {
                return require('querystring').stringify(data)
            },
        ],
        headers: {
            'content-type': 'application/x-www-form-urlencoded',
            "x-fb-friendly-name": form["fb_api_req_friendly_name"],
            'x-fb-http-engine': 'Liger',
            'user-agent': 'Mozilla/5.0 (Linux; Android 12; TECNO CH9 Build/SP1A.210812.016; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/109.0.5414.118 Mobile Safari/537.36[FBAN/EMA;FBLC/pt_BR;FBAV/339.0.0.10.100;]',
        }
    }
    axios(options).then(i => {
        //console.log(i.data)
      var sessionCookies = i.data.session_cookies;
        var cookies = sessionCookies.reduce((acc, cookie) => {
            acc += `${cookie.name}=${cookie.value};`
            return acc
        }, "");
            resolve({ 
               token: i.data.access_token || 'lỗi',
              cookie: sessionCookies || 'lỗi',
              message: 'Muốn đổi token dùng https://xuantruong.dev/facebook/convert?token=EAAD6V7&access_token='+i.data.access_token 
})
    }).catch(async function (error) {
        //console.log(error.response.data)

        var data = error.response.data.error.error_data;
        form.twofactor_code = totp(decodeURI(fa).replace(/\s+/g, '').toLowerCase())
        form.encrypted_msisdn = ""
        form.userid = data.uid
        form.machine_id = data.machine_id
        form.first_factor = data.login_first_factor
        form.credentials_type = "two_factor"
        await new Promise(resolve => setTimeout(resolve, 2000));
        delete form.sig
        form.sig = encodesig(sort(form))
        var option_2fa = {
            url: 'https://b-graph.facebook.com/auth/login',
            method: 'post',
            data: form,
            transformRequest: [
                (data, headers) => {
                    return require('querystring').stringify(data)
                },
            ],
            headers: {
                'content-type': 'application/x-www-form-urlencoded',
                'x-fb-http-engine': 'Liger',
                'user-agent': 'Mozilla/5.0 (Linux; Android 12; TECNO CH9 Build/SP1A.210812.016; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/109.0.5414.118 Mobile Safari/537.36[FBAN/EMA;FBLC/pt_BR;FBAV/339.0.0.10.100;]',
            }
        }
        axios(option_2fa).then(i => {
            //console.log(i.data)
          var sessionCookies = i.data.session_cookies;
        var cookies = sessionCookies.reduce((acc, cookie) => {
            acc += `${cookie.name}=${cookie.value};`
            return acc
        }, "");
            resolve({ 
               token: i.data.access_token || 'lỗi',
              cookie: sessionCookies || 'lỗi'
})

        }).catch(function (error) {
            reject(error.response.data)

        })
    });
  })
};
const cookie = async (access_token) => {
    return new Promise(async (resolve, reject) => {
    try {
        const data = await axios.get(`https://graph.facebook.com/app?access_token=${access_token}`);
        const data2 = await axios.get(`https://api.facebook.com/method/auth.getSessionforApp?access_token=${access_token}&format=json&generate_session_cookies=1&new_app_id=${data.data.id}`);
        const sessionCookies = data2.data.session_cookies;
        const cookies = sessionCookies.reduce((acc, cookie) => {
            acc += `${cookie.name}=${cookie.value};`
            return acc
        }, "");

        resolve({
            cookies: cookies || "lỗi"
        });
    } catch (error) {
        console.log(error.response.status);
        reject({
                status: 'error',
                error: 'lỗi convert cookie',
                author: 'Phạm Lê Xuân Trường',
                link: 'https://www.facebook.com/PLXT.developer'
            });
    }
    })
};

function randomString(length) {
    length = length || 10
    var char = 'abcdefghijklmnopqrstuvwxyz'
    char = char.charAt(
        Math.floor(Math.random() * char.length)
    )
    for (var i = 0; i < length - 1; i++) {
        char += 'abcdefghijklmnopqrstuvwxyz0123456789'.charAt(
            Math.floor(36 * Math.random())
        )
    }
    return char
}

function encodesig(string) {
    var data = ''
    Object.keys(string).forEach(function (info) {
        data += info + '=' + string[info]
    })
    data = md5(data + '62f8ce9f74b12f84c123cc23437a4a32')
    return data
}

function md5(string) {
    return require('crypto').createHash('md5').update(string).digest('hex')
}

function sort(string) {
    var sor = Object.keys(string).sort(),
        data = {},
        i
    for (i in sor)
        data[sor[i]] = string[sor[i]]
    return data
}

module.exports = {
  convert,
  getToken,
cookie
}