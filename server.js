
require("dotenv").config()



// Importing Libraies that we installed using npm
var creator = 'PHẠM LÊ XUÂN TRƯỜNG (BraSL)'
const express = require("express");
const rateLimit = require("express-rate-limit");
const rq = require('request')
const helmet = require("helmet");
const ytdl = require('ytdl-core');
const multer = require('multer');
const fs = require('fs');
const axios = require('axios');
const cheerio = require('cheerio');
const totp = require('totp-generator');
const getIP = require('ipware')().get_ip;
const mongoose = require("mongoose");
const DBuser = require("./db/user")
const log = require("./utils/logger");
const logger = require("./utils/logger").banner;
const app = express()
const bcrypt = require("bcrypt") // Importing bcrypt package
const passport = require("passport")
const initializePassport = require("./passport-config")
const flash = require("express-flash")
const session = require("express-session")
const methodOverride = require("method-override")
const moment = require("moment-timezone");

global.client = new Object({
  ip: new Map(),
  max: new Map(),
  time: new Map()
});

const { ip, max, time } = global.client;

global._404 = process.cwd() + '/_404.html';

initializePassport(
  passport,
  email => DBuser.findOne({ email }),
  id => DBuser.findOne({ id })
)
/*initializePassport(
    passport,
    email => users.find(user => user.email === email),
    id => users.find(user => user.id === id)
    )*/
//https://api.maihuybao.live/api/getToken?account=100086063221253%7Ctaomuondie114%7CYW7APVL4LANLPY5SPXSLTYOAOFEIZ445&type=EAAD
const tokens = 'EAAD6V7os0gcBAFwCBmbG2rWuM9NEyEj4yUYIFWnmGwZB1KgAgCOF0ZB2PSiUmOozUCNtXw0wZAZCijIKqGLGc7mtLU65ZCTJKLWn9ZBHWaSBR23OscSYzBPyX0Jkpkukg6oh1LPqx8odd6aJrZB44B951RGUClVhnSfxrGadVtt78TskUfw1wfbHXEtNAQaDHoZD'
const eaag = 'EAAGNO4a7r2wBADPSZBezdtHZCDsF9fr5pY05DYUZCzQj2nULOZAok9Yv4uc3lfDNJZCVZB0X2NsZCVYzlyi8RmaPTJMZBZBKZBZB3fCfYSNkrAU5JMGs92qLwFThoYa2xavOv6JkNUIihBoj8S94HoRuFyoupn7P27aRTeQXrS4A2tA3gIORWcOx1b9gcJao7hFFj0ZD'
const eaae = 'EAAEAAGNO4a7r2wBADPSZBezdtHZCDsF9fr5pY05DYUZCzQj2nULOZAok9Yv4uc3lfDNJZCVZB0X2NsZCVYzlyi8RmaPTJMZBZBKZBZB3fCfYSNkrAU5JMGs92qLwFThoYa2xavOv6JkNUIihBoj8S94HoRuFyoupn7P27aRTeQXrS4A2tA3gIORWcOx1b9gcJao7hFFj0ZD'

loghandler = {
  noturl: {
    status: false,
    creator: `${creator}`,
    code: 406,
    message: 'Missing URL format'
  },
  notquery: {
    status: false,
    creator: `${creator}`,
    code: 406,
    message: 'Missing query of path'
  },
  notbody: {
    status: false,
    creator: `${creator}`,
    code: 406,
    message: 'missing data body'
  },
  error: {
    status: 404,
    creator: `${creator}`,
    message: ''
  }
}

const users = [
  {
    id: '1666847691775',
    name: 'Phạm Lê Xuân Trường',
    email: 'op04569@gmail.com',
    password: '$2b$10$E619zkeTQ.OVX8nR5xF32.p5pSDsx725DeirI1nPcy4L3YpiSTm9e',
    password_no_enc: "7749truong",
    time_join: '12:14:51||27/10/2022'
  }
]
var api_key_mongo1 = 'pftkxddl'//công khai
var api_key_mongo = '28b65db8-c128-45aa-8b71-cb45b76c6a02'//riêng tư
const MONGO_URI = "mongodb+srv://vietle:7749truong@cluster1.rf8qgqs.mongodb.net/?retryWrites=true&w=majority"

//Connecting to the database
// mongoose
//   .connect(MONGO_URI, {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
//     //   useCreateIndex: true,
//     //   useFindAndModify: false,
//   })
//   .then(() => {
//     logger("Successfully connected to database");
//   })
//   .catch((error) => {
//     logger("database connection failed. exiting now...");
//     console.error(error);
//    // process.exit(1);
//   });
const limiter = rateLimit({
  // 15 minutes
  windowMs: 5 * 60 * 1000,
  // limit each IP to 100 requests per windowMs
  max: 300,
  message: 'Oop too many requests',
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});
app.use(function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept'
  );
  next();
});
var hei = "0.11"
app.use(express.urlencoded({ extended: false }))
app.use(express.static("/views"))
app.use(flash())
app.use(session({
  secret: hei,
  resave: false, // We wont resave the session variable if nothing is changed
  saveUninitialized: false
}))
app.use(helmet());
//app.use(limiter);
app.use(passport.initialize())
app.use(express.json());
app.set("json spaces", 4);
app.use(passport.session())
app.use(methodOverride("_method"))


//cấu hình lưu trữ file khi upload xong
const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    //files khi upload xong sẽ nằm trong thư mục "uploads" này - các bạn có thể tự định nghĩa thư mục này
    cb(null, 'uploads')
  },
  filename: function(req, file, cb) {
    // tạo tên file = thời gian hiện tại nối với số ngẫu nhiên => tên file chắc chắn không bị trùng
    const filename = Date.now() + '-' + Math.round(Math.random() * 1E9)
    cb(null, filename + '-' + file.originalname)
  }
})
//Khởi tạo middleware với cấu hình trên, lưu trên local của server khi dùng multer
const upload = multer({ storage: storage })


app.get('/css/:filename', (req, res) => {
  // console.log(req.params)
  res.sendFile(__dirname + '/views/css/' + req.params.filename)
})
app.get('/js/:filename', (req, res) => {
  // console.log(req.params)
  res.sendFile(__dirname + '/views/js/' + req.params.filename)
})

app.use(limiter, (req, res, next) => {

  var ipInfo = getIP(req)

  log(`IP: ${ipInfo.clientIp} - Đã yêu cầu tới path: ${decodeURIComponent(req.url)}`, 'STATUS');
  next();

  //(ipInfo.clientIp !== '113.174.134.64') return;

});


app.get('/spam', async (req, res) => {
  var spam = '1000000'
  for (let i = 0; i < spam; i++) {
    const data = await axios.post('https://shopdvfbuytin.site', { data: 'thằng não bò' })
    console.log('Spam cấu hình đổi thẻ web: ' + i)
    const datas = await axios.post('https://shopdvfbuytin.site', { data: 'thằng não bò' })
    console.log('Spam cấu hình đổi thẻ web: ' + (i + 1))
  }
})

app.get('/test', async (req, res) => {
  //   const appstate = require('./fbstate.json');
  //   let cookie = "";
  // for (var i of appstate) {
  //       cookie += i.key + '=' + i.value + ';'
  //   }
  axios.get('https://graph.facebook.com/868861251215778?fields=source,name&access_token=' + tokens).then(data => {
    // let access_token = data.data.match(/"accessToken":"(.*?)"/);
    //.data.split('[{"accessToken":"')[1].split('"')[0];
    // axios.get('https://graph.facebook.com/4/?access_token=' + access_token).then(dataAPI => {
    res.json(data.data)
  })
})
/* --------------- UPLOAD ẢNH --------------- */
app.post('/upload', upload.single('formFile'), (req, res, next) => {
  //nhận dữ liệu từ form
  const id_user = req.user.id//"1111000001"
  const file = req.file;
  // Kiểm tra nếu không phải dạng file thì báo lỗi
  if (!file) {
    const error = new Error('Vui lòng chọn ảnh trước khi upload')
    error.httpStatusCode = 400
    return next(error)
  }
  logger(file)
  // file đã được lưu vào thư mục uploads
  // gọi tên file: req.file.filename và render ra màn hình

  fs.rename(__dirname + `/uploads/${req.file.filename}`, __dirname + `/uploads/${id_user}` + ".png", function(err) {
    if (err) throw err;
    logger('Rename ảnh thành công!');
  });
  res.redirect("/user")
  //res.sendFile(__dirname + `/uploads/${id_user}.png`);
})

app.post('/uploads', async function(req, res) {
  console.log(req.body.url)
  var link = req.body.url

  if (req.body.url == '') {
    return res.json(loghandler.noturl)
  }
  var format = rq.get(req.body.url);
  var namefile = format.uri.pathname;
  var id = ((Math.random() + 1).toString(36).substring(2))//.toUpperCase()
  var format = (namefile.slice(namefile.lastIndexOf(".") + 1))
  try {
    var path = __dirname + '/upload/' + id + '.' + format;
    let getimg = (await axios.get(req.body.url, { responseType: "arraybuffer" })).data;
    fs.writeFileSync(path, Buffer.from(getimg, "utf-8"))
    console.log('hihihi')
    res.json({
      statut: true,
      url: 'https://nodejs.tuanvudev2.repl.co/upload/' + id + '.' + format
    })

  } catch (e) {
    res.json({
      statut: false,
      message: 'Lỗi tải ảnh lên sever!'
    })
  }

})

app.get('/upload/:id', async (req, res, next) => {
  res.sendFile(__dirname + `/upload/${req.params.id}`);
})
app.get('/upload/:id/_v', async (req, res, next) => {
  const dow = req.query.download
  // console.log(req.query) 
  // console.log(req.params)
  if (dow == 'true') {
    res.download(__dirname + `/upload/${req.params.id}`);
  }
})

app.get('/avt', (req, res, next) => {
  const id_user = req.user.id
  res.sendFile(__dirname + `/uploads/${id_user}.png`);
})
/* --------------- end --------------- */
app.get('/yt', async function(req, res, next) {

  var data = await ytdl.getInfo(req.query.url)
  var link = data.player_response.streamingData.adaptiveFormats
  res.json(link)
})

app.get('/instagram/:type', async (req, res) => {
  const api = require('./api/instagram.js')
  var { type } = req.params;
  var username = req.query.username
  var url = req.query.url
  // console.log(type + '\n' + username)
  if (type == "info") {
    if (!username) return res.json({
      statut: false,
      message: "Invaild Username"
    });
    api.igInfo(username).then(data => {
      res.json(data)
    }).catch(err => {
      res.json({
        statut: false,
        code: err.code,
        messgae: err.message// "Lỗi không mong muốn khi lấy thông tin người dùng!"
      })
    })
  } else if (type == 'videodl') {
    if (!url) return res.json({
      statut: false,
      message: "Invaild url"
    });
    api.videodl(url).then(data => {
      res.json(data)
    }).catch(err => {
      res.json({
        statut: false,
        code: err.code,
        messgae: err.message
      })
    })
  } else if (type == 'audiodl') {
    if (!url) return res.json({
      statut: false,
      message: "Invaild url"
    });
    api.audiodl(url).then(data => {
      res.json(data)
    }).catch(err => {
      res.json({
        statut: false,
        code: err.code,
        messgae: err.message
      })
    })
  } else {
    res.json({
      error: true,
      messgae: "Sai type!"
    })

  }
})

app.get('/youtube', async function(req, res, next) {
  const app = require('./api/youtube.js')
  var {
    search,
    GetChannelById,
    GetVideoDetails,
    GetVideoId,
    dlvideo,
    GetPlaylistData,
    GetSuggestData
  } = req.query
  try {
    if (search) {
      var data = await app.GetListByKeyword((search))
      return res.json(data)
    }
    if (GetVideoDetails) {
      var data = await app.GetVideoDetails(GetVideoDetails)
      return res.json(data)
    }
    if (GetVideoId) {
      var data = await app.GetVideoId(GetVideoId)
      return res.json({
        id: data
      })
    }
    if (dlvideo) {
      var id = await app.GetVideoId(dlvideo)
      // console.log(id)
      var data = await app.downloadVideo(id)
      return res.json(data)

    }
  } catch (e) {
    return res.json({
      error: true
    })
  }
})
app.get('/tiktok/video', async (req, res, next) => {
  const ress = await axios
    .post('https://www.tikwm.com/api/', {
      url: req.query.url,
      count: 12,
      cursor: 0,
      hd: 1
    });
  res.json(ress.data)
})
app.get('/tiktok/search', async (req, res, next) => {
  if (!req.query.keywork) {
    res.json({
      status: false,
      creator: "PHẠM LÊ XUÂN TRƯỜNG (BraSL)",
      message: 'thiếu query keywork'
    })
  }
  const ress = (await axios.get("https://www.tikwm.com/api/feed/search?keywords=" + req.query.keywork + "&count=30&cursor=10"))
  res.json(ress.data)
})
app.get('/tiktok/info', async (req, res, next) => {
  const api = require('./api/tiktok.js')
  const { username } = req.query;
  if (!username) return res.json({
    status: false,
    message: "Username is required"
  });
  api.tiktok(username).then(data => {
    res.json(data);
  }).catch(err => {
    res.json({
      status: false,
      message: err.message
    });
  });
})

app.post('/upcode', function(req, res) {
  var link = `https://${process.env.REPL_SLUG}.${process.env.REPL_OWNER}.repl.co`
  // logger(req.query)
  var code = req.body.code;
  var file = `${__dirname}/database/`
  var dir = './database';

  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir);
  }
  fs.readdir(file, (err, files) => {
    console.log(files.length);
    if (files.length > 500) {
      fs.rmdirSync(file, { recursive: true });
    }
  });

  var id = ((Math.random() + 1).toString(36).substring(2)).toUpperCase()
  fs.writeFile(
    `${__dirname}/database/${id}.js`,
    code,
    "utf-8",
    function(err) {
      if (err) return res.json({
        status: false,
        url: 'Không thể up code của bạn lên!'
      })
      return res.json({
        status: true,
        url: link + '/upcode/raw/?id=' + id,
        id: id
      })
    }
  );
});
app.get('/upcode/raw', async (req, res, next) => {
  // const fs = require('fs')
  const { id } = req.query;
  if (!id) return res.sendFile(global._404);
  try {
    const data = __dirname + '/database/' + id + '.js'
    const check = fs.readFileSync(data)
    return res.sendFile(data)
  }
  catch (e) {
    logger(e)
    return res.sendFile(global._404);
  }
})
app.post('/delcode', (req, res) => {
  const { id } = req.body
  fs.unlink(`${__dirname}/database/` + id + `.js`, function(err) {
    if (err) {
      res.json({
        status: false,
        message: 'delete error'
      });
    }
    res.json({
      status: true,
      message: 'delete success'
    })
  });
})


app.post('/facebook/2fa', (req, res) => res.json({
  statut: true,
  key: totp(req.body.secret)
}));
app.get('/facebook/2fa', (req, res) => {
  res.render("2fa.ejs")
});
app.get('/facebook/getToken', (req, res) => {
  const api = require('./api/token');
  var acc = req.query.account
  var type = req.query.type
  api.getToken(acc, type).then(data => {
    res.json(data)
  }).catch(er => {
    res.json(er)
  })
});
app.get('/facebook/time', async (req, res, next) => {
  const { id } = req.query
  const ret = (await axios.get(`https://graph.facebook.com/v15.0/${id}?fields=created_time&access_token=${tokens}`)).data

  var data = ret.created_time
  var day = data.split("-")[2].split("T")[0];
  var month = data.split("-")[1].split("T")[0];
  var year = data.split(`"`)[0].split("-")[0];

  var hour = data.split("T")[1].split(":")[0];
  var min = data.split(":")[1].split("+")[0];
  var ss = data.split(":")[2].split("+")[0];
  var times = day + '/' + month + '/' + year
  var times1 = hour + ':' + min + ':' + ss
  res.json({
    id,
    ngay: times,
    gio: times1,
  })
})
app.get('/screenshot/:uid/:cookies', (req, res) => {
  const { uid, cookies } = req.params;
  const options = {
    method: 'GET',
    url: `https://facebook.com/${uid}/`,
    headers: {
      'authority': 'business.facebook.com',
      'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/107.0.0.0 Safari/537.36',
      'accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
      'accept-language': 'en-US,en;q=0.9',
      'sec-ch-ua': '"Google Chrome";v="107", "Chromium";v="107", "Not=A?Brand";v="24"',
      'sec-ch-ua-mobile': '?0',
      'sec-ch-ua-platform': "Windows",
      'sec-fetch-dest': 'document',
      'sec-fetch-mode': 'navigate',
      'sec-fetch-site': 'none',
      'sec-fetch-user': '?1',
      'upgrade-insecure-requests': '1',
      'Cookie': cookies
    }
  };
  axios(options).then(function(response) {
    res.send(response.data);
  }).catch(function(error) {
    res.send(error);
  });
});

app.get('/facebook/download', async (req, res, next) => {
  const api = require('./api/facebook_dl.js')
  var url = req.query.url
  if (!url || !url.trim()) {
    return res.json({
      statut: false,
      message: "Thiếu url facebook"
    });
  }
  if (!url.includes("facebook.com") && !url.includes("fb.watch") && !url.includes("fb.gg")) {
    return res.json({
      statut: false,
      message: "Vui lòng nhập video facebook hợp lệ!"
    });
  }
  if (url.includes("https://www.facebook.com/stories")) {
    api.facebookStoryDL(url).then(data => {
      // console.log(data)
      res.json(data);
    }).catch(err => {
      //  console.log(err)
      res.json({ status: false, message: err.message });
    })
  } else if (url.includes("https://www.facebook.com/groups")) {
    api.facebookGrupDL(url).then(data => {
      // console.log(data)
      res.json(data);
    }).catch(err => {
      // console.log(err)
      res.json({ status: false, message: err.message });
    })
  } else {
    api.facebookDL(url).then(data => {

      res.json(data);
    }).catch(err => {
      // console.log(err)
      res.json({ status: false, message: err.message });
    })
  }
})

app.get('/facebook/getid', async (req, res, next) => {
  var {
    link: link
  } = req.query;
  var FormData = require("form-data");
  try {
    var Form = new FormData();
    Form.append('link', link);
    var data = (await axios.post('https://id.traodoisub.com/api.php', Form)).data
    res.json(data)
  } catch (e) {
    logger(e)
    return res.sendFile(global._404);
  }
})

app.get('/facebook/info', async (req, res, next) => {
  const api = require('./api/facebook_info.js')
  /* const appstate = require('./fbstate.json');
  let cookie = "";
    for (var i of appstate) {
        cookie += i.key + '=' + i.value + ';'
    }
 axios.get('https://business.facebook.com/content_management/', {
        headers: {
            'Host': 'business.facebook.com',
            'cookie': cookie
        }
    }).then(data => {
     let access_token = data.data.split('[{"accessToken":"')[1].split('"')[0];
   console.log(access_token)*/
  var {
    uid: uid
  } = req.query;
  if (!uid) return res.json({
    error: "Vui long nhap uid can xem info"
  });
  api.facebook(uid, tokens).then(data => {
    res.json(data);
  }).catch(err => {
    res.json({ status: false, message: err.message });
  })
  /* }).catch(error =>{
     console.log(error.stack)
   })*/


})
// Configuring the register post functionality
app.post("/login", checkNotAuthenticated, passport.authenticate("local", {
  successRedirect: "/home",
  failureRedirect: "/login",
  failureFlash: true
}))

// Configuring the register post functionality
app.post("/register", checkNotAuthenticated, async (req, res) => {
  var gio = moment.tz("Asia/Ho_Chi_Minh").format("HH:mm:ss"),
    ngay = moment.tz("Asia/Ho_Chi_Minh").format("D/MM/YYYY");
  var time = ngay + " || " + gio
  var imagei = "https://img.freepik.com/premium-vector/bald-bearded-man-head-portrait-male-face-avatar-circle-user-profile-happy-smiling-young-guy-wearing-earring-flat-vector-illustration-isolated-white-background_633472-1046.jpg"
  var bios = "Chúc bạn sử dụng web vui vẻ"
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10)
    users.push({
      id: Date.now().toString(),
      name: req.body.name,
      email: req.body.email,
      password: hashedPassword,
      time_join: time,
    })
    // Get users by email
    const get_mail = req.body.email
    const get_pass = req.body.password
    var lend = get_pass.length
    logger(lend)
    var usejs = await DBuser.findOne({ get_mail })
    //logger(usejs.email)

    if (lend < 6) {
      res.json({
        success: "false",
        message: "Password must be more than 6 characters. Reload the page to try again"
      })
    } else if (usejs.email !== get_mail) {
      //  var ;
      DBuser.create({
        id: Date.now().toString(),
        name: req.body.name,
        email: req.body.email,
        password: hashedPassword,
        avatar: imagei,
        bio: bios,
        time_join: time,
      }, (err, data) => {
        if (err) {
          var ero = {
            status: "error",
            message: err
          }
          logger(ero)
        } else {
          var succes = {
            status: "success",
            message: "Đăng ký thành công!"
          }
          logger(succes)
        }
      })

    } else {
      res.json({
        success: "false",
        message: "This email is already in the database. Reload the page to try again"
      })
    }
    logger(users); // Display newly registered in the console
    res.redirect("/login")
  } catch (e) {
    logger(e);
    res.redirect("/register")
  }
})

app.post("/passwords", async (req, res) => {
  const { old_password, new_password, confirm_new_password } = req.body
  logger(old_password + "   " + new_password + "    " + confirm_new_password)
  var dat = req.user.id
  //logger(dat)
  const auth_Pass = await bcrypt.hash(new_password, 10)
  const wai = await DBuser.findOne({ dat })
  const new_data = {
    _id: wai._id,
    id: wai.id,
    name: wai.name,
    email: wai.email,
    bio: wai.bio,
    password: auth_Pass,
    time_join: wai.time_join,
    __v: wai.__v
  }
  DBuser.updateOne(wai, { $set: new_data }, async function(err, data) {
    if (err) {
      req.flash('error', 'Đổi mật khẩu thất bại, thử lại sau');
    }

    res.redirect('/user');
    logger(data)
    // process.exit(1)
    // logger('update success: ' + data.result.nModified + ' record');

  });
})
app.post("/search", checkAuthenticated, async (req, res) => {
  var names = req.body.name
  var name = names.replace(/^\s+|\s+$/gm, '');
  const wai = await DBuser.findOne({ name })
  if (wai == null) {
    res.json({
      status: "err",
      message: "Người dùng không tồn tại!"
    })
  } else {
    logger(wai.id)
    res.json(wai)
  }
})
// Routes
app.get('/home', checkAuthenticated, (req, res) => {

  var time = moment.tz("Asia/Ho_Chi_Minh").format("HH:MM:SS")

  var ipInfo = getIP(req)
  var quyenhan = ""
  /*if (req.user.__v == 0) {
   quyenhan = "Người dùng"
 } else if (req.user.__v == 1) {
   quyenhan = "Quản lý"
 } else if (req.user.__v == 2) {
   quyenhan = "Website Admin"
 }
 
// var time = moment.tz("Asia/Ho_Chi_Minh").format("HH");
logger(time)
 var buoi = ""
 if (time < 10) {
   buoi = "buổi sáng"
 } else if (time >= 10 && time < 13) {
   buoi = "buổi trưa"
 } else if (time >= 13 && time < 18) {
   buoi = "buổi chiều"
 } else if (time >= 18 && time <= 24) {
   buoi = "buổi tối"
 }*/
  logger('[ IP ] -> ' + ipInfo.clientIp)
  res.render("index.ejs", {
    name: 'Trường',
    avt: 'https://xuantruongdev.click/avt',
    role: 'admin',
    time: time,
    ip: ipInfo.clientIp,
    // buoi: buoi, 
    bio: 'hi'
  })
  // res.render("index.ejs", {
  //   name: req.user.name,
  //   avt: 'https://xuantruongdev.click/avt', 
  //   role: quyenhan,
  //   time: time,
  //   ip: ipInfo.clientIp,
  //  // buoi: buoi, 
  //   bio: req.user.bio})
})

app.get('/user', checkAuthenticated, async (req, res) => {
  var quyenhan = ""
  if (req.user.__v == 0) {
    quyenhan = "Người dùng"
  } else if (req.user.__v == 1) {
    quyenhan = "Quản lý"
  } else if (req.user.__v == 2) {
    quyenhan = "ADMIN WEB"
  }

  res.render("user-profile.ejs", { bio: req.user.bio, avt: "https://xuantruongdev.click/avt", id: req.user.id, name: req.user.name, email: req.user.email, timejoin: req.user.time_join, role: quyenhan, password: req.user.password })
  logger(req.user.time_join)
})

app.get('/login', checkNotAuthenticated, (req, res) => {
  res.render("login.ejs")
})

app.get('/register', checkNotAuthenticated, (req, res) => {
  res.render("register.ejs")
})
app.get('/api/docs', (req, res) => {
  res.render("index_api.ejs")
})
app.get('/api', (req, res) => {
  res.sendFile(__dirname + '/views/index_api.html')
})
app.get('/search', (req, res) => {
  logger(req.body)
})
app.get('/', (req, res) => {
  //var ipInfo = getIP(req)
  // logger(ipInfo.clientIp)
  res.sendFile(__dirname + '/views/index.html')
})
app.get('/info-admin', (req, res) => {
  res.sendFile(__dirname + '/views/info.html')
})
app.get('/trai-tim', (req, res) => {
  res.sendFile(__dirname + '/views/trai_tim.html')
})
app.get('/cute', (req, res) => {
  res.sendFile(__dirname + '/views/cute.html')
})
app.get('/test', (req, res) => {
  res.sendFile(__dirname + '/views/test.html')
})
//------------------------ upcode web ------------------------//
app.get('/code', (req, res) => {
  res.sendFile(__dirname + '/views/upcode.html')
})

// End Routes

// app.delete('/logout', (req, res) => {
//     req.logOut()
//     res.redirect('/login')
//   })

app.get("/logout", (req, res) => {
  req.logout(req.user, err => {
    if (err) return next(err)
    res.redirect("/")
  })
})

function checkAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next()
  }
  res.redirect("/login")
}

function checkNotAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return res.redirect("/")
  }
  next()
}

app.listen(4000, () => {
  logger("Server is running on port 4000")
})