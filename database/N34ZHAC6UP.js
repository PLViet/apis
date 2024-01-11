const getToken = async (uid, password, fa, tk) => {
  return new Promise(async (resolve, reject) => {
    if (!uid || !password) {
      return reject({
        success: 400,
        message: "Vui lòng nhập thông tin tài khoản",
        author: "Phạm Lê Xuân Trường",
      });
    }

    const object_token = {
      EAAClA: "181425161904154|95a15d22a0e735b2983ecb9759dbaf91",
      EAAAAU: "350685531728|62f8ce9f74b12f84c123cc23437a4a32",
      EAAAAAY: "6628568379|c1e620fa708a1d5696fb991c1bde5662",
      EAAVB: "1479723375646806|afb3e4a6d8b868314cc843c21eebc6ae",
      EAATK: "1348564698517390|007c0a9101b9e1c8ffab727666805038",
    };

    var form = {
      adid: adid.v4(),
      email: uid,
      password: password,
      format: "json",
      device_id: deviceID.v4(),
      cpl: "true",
      family_device_id: deviceID.v4(),
      locale: "en_US",
      client_country_code: "US",
      credentials_type: "device_based_login_password",
      generate_session_cookies: "1",
      generate_analytics_claim: "1",
      generate_machine_id: "1",
      currently_logged_in_userid: "0",
      try_num: "1",
      enroll_misauth: "false",
      meta_inf_fbmeta: "NO_FILE",
      source: "login",
      machine_id: randomString(24),
      meta_inf_fbmeta: "",
      fb_api_req_friendly_name: "authenticate",
      fb_api_caller_class:
        "com.facebook.account.login.protocol.Fb4aAuthHandler",
      api_key: "882a8490361da98702bf97a021ddc14d",
      access_token: object_token[tk],
    };

    form.sig = encodesig(sort(form));
    var options = {
      url: "https://b-graph.facebook.com/auth/login",
      method: "post",
      data: form,
      transformRequest: [
        (data, headers) => {
          return require("querystring").stringify(data);
        },
      ],
      headers: {
        "content-type": "application/x-www-form-urlencoded",
        "x-fb-friendly-name": form["fb_api_req_friendly_name"],
        "x-fb-http-engine": "Liger",
        "user-agent":
          "Mozilla/5.0 (Linux; Android 12; TECNO CH9 Build/SP1A.210812.016; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/109.0.5414.118 Mobile Safari/537.36[FBAN/EMA;FBLC/pt_BR;FBAV/339.0.0.10.100;]",
      },
    };
    axios(options)
      .then((i) => {
        //console.log(i.data)
        var sessionCookies = i.data.session_cookies;
        var cookies = sessionCookies.reduce((acc, cookie) => {
          acc += `${cookie.name}=${cookie.value};`;
          return acc;
        }, "");
        resolve({
          token: i.data.access_token || "lỗi",
          cookie: cookies || "lỗi",
        });
      })
      .catch(async (error) => {
        // resolve({
        //   token: 'nịt'
        // })
        var data = error.response.data.error.error_data;
        form.twofactor_code = totp(
          decodeURI(fa).replace(/\s+/g, "").toLowerCase()
        );
        form.encrypted_msisdn = "";
        form.userid = data.uid;
        form.machine_id = data.machine_id;
        form.first_factor = data.login_first_factor;
        form.credentials_type = "two_factor";
        await new Promise((resolve) => setTimeout(resolve, 2000));
        delete form.sig;
        form.sig = encodesig(sort(form));
        var option_2fa = {
          url: "https://b-graph.facebook.com/auth/login",
          method: "post",
          data: form,
          transformRequest: [
            (data, headers) => {
              return require("querystring").stringify(data);
            },
          ],
          headers: {
            "content-type": "application/x-www-form-urlencoded",
            "x-fb-http-engine": "Liger",
            "user-agent":
              "Mozilla/5.0 (Linux; Android 12; TECNO CH9 Build/SP1A.210812.016; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/109.0.5414.118 Mobile Safari/537.36[FBAN/EMA;FBLC/pt_BR;FBAV/339.0.0.10.100;]",
          },
        };
        axios(option_2fa)
          .then((i) => {
            //console.log(i.data)
            var sessionCookies = i.data.session_cookies;
            var cookies = sessionCookies.reduce((acc, cookie) => {
              acc += `${cookie.name}=${cookie.value};`;
              return acc;
            }, "");
            resolve({
              token: i.data.access_token || "lỗi",
              cookie: cookies || "lỗi",
            });
          })
          .catch(function (error) {
            reject({
              success: 400,
              message: error.message,
              author: "Phạm Lê Xuân Trường",
            });
          });
      });
  });
};