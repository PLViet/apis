require("dotenv").config();
var domain = "https://xuantruongdev.id.vn";
var creator = "PHẠM LÊ XUÂN TRƯỜNG (BraSL)";
const express = require("express");
const rateLimit = require("express-rate-limit");
const { loadImage, createCanvas, registerFont } = require("canvas");
const { join, resolve } = require("path");
const Canvas = require("canvas");
const cookieParser = require("cookie-parser");
const vm = require("vm");
const rq = require("request");
const helmet = require("helmet");
const ytdl = require("ytdl-core");
const multer = require("multer");
const fs = require("fs-extra");
const path = require("path");
const axios = require("axios");
const cheerio = require("cheerio");
const totp = require("totp-generator");
const getIP = require("ipware")().get_ip;
const mongoose = require("mongoose");
const DBuser = require("./db/user");
const log = require("./utils/logger");
const logger = require("./utils/logger").banner;
const app = express();
const bcrypt = require("bcrypt"); // Importing bcrypt package
const passport = require("passport");
const initializePassport = require("./passport-config");
const flash = require("express-flash");
const session = require("express-session");
const methodOverride = require("method-override");
const moment = require("moment-timezone");

const userModel = require("./db/user");
const randToken = require("rand-token");
const authMethod = require("./db/auth.methods");
const jwtVariable = require("./db/variables/jwt");
const authMiddleware = require("./db/auth.middlewares");
const isAuth = authMiddleware.isAuth;
const checkIsAuth = authMiddleware.checkIsAuth;

global._404 = process.cwd() + "/_404.html";

initializePassport(
  passport,
  (email) => DBuser.findOne({ email }),
  (id) => DBuser.findOne({ id })
);
/*initializePassport(
    passport,
    email => users.find(user => user.email === email),
    id => users.find(user => user.id === id)
    )*/

const cook =
  "ps_n=0;sb=kpDTZdFudkyio-GdobDu3de-;datr=kpDTZe009BxJd-9MiU1hDITT;c_user=100078830621307;dpr=1.1041666269302368;xs=38%3AyWKfAKEqx5Ov2A%3A2%3A1708363970%3A-1%3A6746%3A%3AAcWLcLog9VjmQsNSDD6MabOZ7n6IkgxEJQCaBP4nBEE;fr=1emSiaYMV9NSsZTFm.AWU_M5jpf7lnXgtJeCUEDBWvf8E.Bl30Vt.yZ.AAA.0.0.Bl30Vt.AWUH9VoUBMg;wd=1238x953;presence=C%7B%22t3%22%3A%5B%5D%2C%22utc3%22%3A1709133108898%2C%22v%22%3A1%7D;";
loghandler = {
  noturl: {
    status: false,
    creator: `${creator}`,
    code: 406,
    message: "Missing URL format",
  },
  notquery: {
    status: false,
    creator: `${creator}`,
    code: 406,
    message: "Missing query of path",
  },
  notbody: {
    status: false,
    creator: `${creator}`,
    code: 406,
    message: "missing data body",
  },
  error: {
    status: 404,
    creator: `${creator}`,
    message: "",
  },
};

const MONGO_URI =
  "mongodb+srv://vietle:7749truong@cluster1.rf8qgqs.mongodb.net/?retryWrites=true&w=majority";

var hei = "0.11";
app.use(express.urlencoded({ limit: "10mb", extended: true }));
app.use(express.static(__dirname + "/chess"));
app.use(express.static("/views"));
//app.use(flash())
app.use(
  session({
    secret: hei,
    resave: false, // We wont resave the session variable if nothing is changed
    saveUninitialized: false,
  })
);
//app.use(helmet());
//app.use(limiter);
//app.use(passport.initialize())
app.use(express.json({ limit: "10mb" }));
app.set("json spaces", 4);
app.use(cookieParser("BraSL"));
//app.use(passport.session())
app.use(methodOverride("_method"));

//cấu hình lưu trữ file khi upload xong
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads");
  },
  filename: function (req, file, cb) {
    const filename = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, filename + "-" + file.originalname);
  },
});
const upload = multer({ storage: storage });

app.get("/css/:filename", (req, res) => {
  res.sendFile(__dirname + "/views/css/" + req.params.filename);
});
app.get("/js/:filename", (req, res) => {
  res.sendFile(__dirname + "/views/js/" + req.params.filename);
});
app.get("/image/:filename", (req, res) => {
  res.sendFile(__dirname + "/views/img/" + req.params.filename);
});
app.get("/assets/:filename", (req, res) => {
  res.sendFile(__dirname + "/tiktok/public/assets/" + req.params.filename);
});
app.get("/favicon/:filename", (req, res) => {
  res.sendFile(__dirname + "/tiktok/public/favicon/" + req.params.filename);
});
var ips = [];
var s = 500;
var reque = 50;
var timeout = null;

function timeStart(ip) {
  setInterval(function () {
    var API = ips.find((i) => i.ip == ip);
    if (API.time <= 0) {
      API.request = reque;
      API.time = s;
    }
    API.time--;
  }, 1000);
}
const idADMIN = [
  "137.184.95.45",
  "35.238.160.116",
  "34.132.30.80",
  "14.174.200.254",
];
app.use((req, res, next) => {
  var ipInfo = getIP(req);
  var ip = ipInfo.clientIp;

  // var listID = JSON.stringify(ips, "utf-8", 4);

  // var API = ips.find((i) => i.ip == ip);
  // if(!idADMIN.includes(ip)){
  // res.redirect("https://www.chinhphu.vn")
  // }
  //  res.json(API)
  // if (!listID.includes(ip)) {
  //   ips.push({
  //     ip: ip,
  //     request: reque,
  //     time: s,
  //   });
  //   timeStart(ip);
  //   next();
  //   // res.redirect("/")
  // } else {
  //   if (API.request <= 0) {
  //     res.json({
  //       status: false,
  //       message: 'Bạn đã dùng hết lượt request vui lòng quay lại sau.'
  //     })
  //   }
  //   API.request = API.request - 1;
  //   if (API.time >= s) {
  //     //console.log(API.time)
  //     API.request = reque;
  //   }

  log(
    `IP: ${ipInfo.clientIp} - path: ${decodeURIComponent(
      req.url
    )}`,
    req.method
  );

  next();
  //(ipInfo.clientIp !== '113.174.134.64') return;
  //}
});

// GAME CHESS ====================//
const { Chess } = require("chess.js");

const pathG = __dirname + "/game_state.json";
const pathKey = __dirname + "/data_key.json"

const chess = new Chess();
const canvasWidth = 700;
const canvasHeight = 700;
const squareSize = canvasWidth / 8;

registerFont(__dirname + "/font/Montserrat-Bold.ttf", { family: "font" });

const pieces = {
  wk: "white-king.png",
  wq: "white-queen.png",
  wr: "white-rook.png",
  wb: "white-bishop.png",
  wn: "white-knight.png",
  wp: "white-pawn.png",
  bk: "black-king.png",
  bq: "black-queen.png",
  br: "black-rook.png",
  bb: "black-bishop.png",
  bn: "black-knight.png",
  bp: "black-pawn.png",
};

const lightColor = "#edeed1";
const darkColor = "#779952";
const specialLetters = ["a", "c", "e", "g"];

// Vẽ bàn cờ từ trạng thái FEN
async function drawChessBoard(fen) {
  const chesss = new Chess(fen);
  const canvas = createCanvas(canvasWidth, canvasHeight);
  const ctx = canvas.getContext("2d");

  // Vẽ các ô trên bàn cờ
  const board = chesss.board();
  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
      const x = col * squareSize;
      const y = row * squareSize;

      const color = (row + col) % 2 === 0 ? lightColor : darkColor;
      ctx.fillStyle = color;
      ctx.fillRect(x, y, squareSize, squareSize);

      // Vẽ số ở cột đầu tiên bên trái
      if (col === 0) {
        ctx.font = "18px font";
        ctx.fillStyle = color === lightColor ? darkColor : lightColor;

        const number = 8 - row;
        const numberX = x + 2;
        const numberY = y + 15;
        ctx.fillText(number.toString(), numberX, numberY);
      }

      // Vẽ chữ cái ở hàng cuối cùng
      if (row === 7) {
        ctx.font = "18px font";
        const letter = String.fromCharCode(97 + col);
        const textColorToUse = specialLetters.includes(letter)
          ? lightColor
          : darkColor;
        ctx.fillStyle = textColorToUse;

        const letterX = x + squareSize - 13;
        const letterY = canvasHeight - 3;
        ctx.fillText(letter, letterX, letterY);
      }

      const piece = board[row][col];
      if (piece !== null) {
        const pieceImg = await loadImage(
          __dirname + `/image/${pieces[piece.color + piece.type]}`
        );
        ctx.drawImage(pieceImg, x, y, squareSize, squareSize);
      }
    }
  }
  return canvas;
}

async function drawChessBoardBlack(fen) {
  const chess = new Chess(fen);
  const canvas = createCanvas(canvasWidth, canvasHeight);
  const ctx = canvas.getContext("2d");

  const board = chess.board();
  for (let row = 7; row >= 0; row--) {
    for (let col = 7; col >= 0; col--) {
      const x = (7 - col) * squareSize; // Đảo ngược vị trí cột
      const y = (7 - row) * squareSize; // Đảo ngược vị trí hàng

      const color = (row + col) % 2 === 0 ? lightColor : darkColor;
      ctx.fillStyle = color;
      ctx.fillRect(x, y, squareSize, squareSize);

      if (col === 7) {
        ctx.font = "18px font";
        ctx.fillStyle = color === lightColor ? darkColor : lightColor;

        const number = 8 - row;
        const numberX = x + 2;
        const numberY = y + 15;
        ctx.fillText(9 - number.toString(), numberX, numberY);
      }

      if (row === 0) {
        ctx.font = "18px font";
        const letter = String.fromCharCode(97 + (7 - col));
        const textColorToUse = specialLetters.includes(letter)
          ? lightColor
          : darkColor;
        ctx.fillStyle = textColorToUse;

        const letterX = x + squareSize - 12;
        const letterY = y + squareSize - 3;
        ctx.fillText(letter, letterX, letterY);
      }

      const piece = board[row][col];
      if (piece !== null) {
        const pieceImg = await loadImage(
          __dirname + `/image/${pieces[piece.color + piece.type]}`
        );
        ctx.drawImage(pieceImg, x, y, squareSize, squareSize);
      }
    }
  }
  return canvas;
}

// Kiểm tra và thực hiện phong tốt nếu cần
// Hàm kiểm tra vị trí đích của tốt
function isPawnPromotionSquare(from, to, ches) {
  if (ches.get(from).type === "P" && to[1] === "8") {
    return true;
  }

  if (ches.get(from).type === "p" && to[1] === "1") {
    return true;
  }

  if (ches.get(from).type === "p" && to[1] === "8") {
    return true;
  }

  if (ches.get(from).type === "P" && to[1] === "1") {
    return true;
  }
  return false;
}

async function handlePlayerMove(id, from, to, promotion, res) {
  const data = JSON.parse(fs.readFileSync(pathG, "utf8"));
  const foundIndex = data.findIndex((item) => item.id === id);
  const imagePath = __dirname + `/chess/${id}.png`;
  const fen = data[foundIndex].fen;

  const chess = new Chess(fen);

  const canvas = createCanvas(canvasWidth, canvasHeight);
  const ctx = canvas.getContext("2d");

  if (chess.turn() === "w" && chess.get(from).color === "b")
    return res
      .status(200)
      .json({ status: false, message: "Lượt này bên trắng đi!" });
  if (chess.turn() === "b" && chess.get(from).color === "w")
    return res
      .status(200)
      .json({ status: false, message: "Lượt này bên đen đi!" });
  if (chess.isGameOver()) {
    return res.status(200).json({
      status: false,
      game: "end",
      win: chess.turn(),
      message: chess.isCheckmate() ? "Chiếu hậu!" : "Hòa!",
    });
  }

  const form = { from: from, to: to };
  if (isPawnPromotionSquare(from, to, chess)) {
    if (!promotion)
      return res
        .status(200)
        .json({
          status: false,
          message: `Vui lòng phong tốt để được đi tiếp\n\n"q": Hậu (Queen) \n"r": Xe (Rook) \n"n": Ngựa (Knight) \n"b": Tượng (Bishop)\n\nVí dụ: a7 a8 q (phong hậu cho tốt)`,
        });
    form.promotion = promotion;
  }

  const moveResult = chess.move(form);

  if (moveResult !== null) {
    const fen_new = chess.fen();
    const board = chess.board();

    if (chess.turn() === "b") {
      for (let row = 7; row >= 0; row--) {
        for (let col = 7; col >= 0; col--) {
          const x = (7 - col) * squareSize;
          const y = (7 - row) * squareSize;

          const color = (row + col) % 2 === 0 ? lightColor : darkColor;
          ctx.fillStyle = color;
          ctx.fillRect(x, y, squareSize, squareSize);

          if (col === 7) {
            ctx.font = "18px font";
            ctx.fillStyle = color === lightColor ? darkColor : lightColor;

            const number = 8 - row;
            const numberX = x + 2;
            const numberY = y + 15;
            ctx.fillText(9 - number.toString(), numberX, numberY);
          }

          if (row === 0) {
            ctx.font = "18px font";
            const letter = String.fromCharCode(97 + (7 - col));
            const textColorToUse = specialLetters.includes(letter)
              ? lightColor
              : darkColor;
            ctx.fillStyle = textColorToUse;

            const letterX = x + squareSize - 12;
            const letterY = y + squareSize - 3;
            ctx.fillText(letter, letterX, letterY);
          }

          const piece = board[row][col];
          if (piece !== null) {
            const pieceImg = await loadImage(
              __dirname + `/image/${pieces[piece.color + piece.type]}`
            );
            ctx.drawImage(pieceImg, x, y, squareSize, squareSize);
          }
        }
      }
    } else if (chess.turn() === "w") {
      for (let row = 0; row < 8; row++) {
        for (let col = 0; col < 8; col++) {
          const x = col * squareSize;
          const y = row * squareSize;

          const color = (row + col) % 2 === 0 ? lightColor : darkColor;
          ctx.fillStyle = color;
          ctx.fillRect(x, y, squareSize, squareSize);

          if (col === 0) {
            ctx.font = "18px font";
            ctx.fillStyle = color === lightColor ? darkColor : lightColor;

            const number = 8 - row;
            const numberX = x + 2;
            const numberY = y + 15;
            ctx.fillText(number.toString(), numberX, numberY);
          }

          if (row === 7) {
            ctx.font = "18px font";
            const letter = String.fromCharCode(97 + col);
            const textColorToUse = specialLetters.includes(letter)
              ? lightColor
              : darkColor;
            ctx.fillStyle = textColorToUse;

            const letterX = x + squareSize - 13;
            const letterY = canvasHeight - 3;
            ctx.fillText(letter, letterX, letterY);
          }

          const piece = board[row][col];
          if (piece !== null) {
            const pieceImg = await loadImage(
              __dirname + `/image/${pieces[piece.color + piece.type]}`
            );
            ctx.drawImage(pieceImg, x, y, squareSize, squareSize);
          }
        }
      }
    }
    const out = fs.createWriteStream(imagePath);
    const stream = canvas.createPNGStream();
    stream.pipe(out);
    out.on("finish", async () => {
      await saveGameState(id, fen_new);
      res.json({
        status: true,
        play: chess.turn(),
        url: domain + `/${id}.png`,
      });
    });
  } else {
    return res.status(200).json({
      status: false,
      message: "Nước đi không hợp lệ! Vui lòng thử lại.",
    });
  }
}

function saveGameState(id, fen) {
  const gameState = { id, fen };
  const data = JSON.parse(fs.readFileSync(pathG, "utf8"));
  const foundIndex = data.findIndex((item) => item.id === id);

  if (foundIndex !== -1) {
    data[foundIndex].fen = fen;
  } else {
    data.push(gameState);
  }
  fs.writeFileSync(pathG, JSON.stringify(data, null, 4));
}

const checkKey = async function (req, res, next) {
  const { key } = req.query;
  const { pro } = req.body;
  // const bufferData = Buffer.from(pro, 'base64');

  // const jsonString = bufferData.toString('utf8');

  // const jsonData = JSON.parse(jsonString);
  const data = JSON.parse(fs.readFileSync(pathKey, "utf8"));
  const foundItem = data.find((item) => item.key === key);
  if (foundItem) {
    var checkName = foundItem.name === pro.REPL_OWNER.toUpperCase();
    console.log(checkName);
    if (!checkName) {
      return res.json({
        status: false,
        message: "Bạn đang sử dụng api bất hợp pháp!",
      });
    }
    next();
  } else {
    return res.json({
      status: false,
      message: "Key của bạn không hợp lệ!",
    });
  }
};

function createKey(length) {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let randomKey = "";
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    randomKey += characters.charAt(randomIndex);
  }
  return randomKey;
}

function randomColor() {
  return Math.random() < 0.5 ? "white" : "black";
}

app.get("/chess", (req, res) => {
  return res.sendFile(__dirname + "/views/index_chess.html");
});

app.get("/chess/docs", (req, res) => {
  return res.sendFile(__dirname + "/views/docs_chess.html");
});

app.post("/api/key/:type", checkKey, (req, res) => {
  const { type } = req.params;
  const { name, key } = req.query;
  const data = JSON.parse(fs.readFileSync(pathKey, "utf8"));
  if (type === "create") {
    var new_Key = {
      key: createKey(6),
      name: name.toUpperCase(),
    };
    data.push(new_Key);
    res.json({
      status: true,
      message: "Tạo Key Thành Công!",
    });
  } else if (type === "remove") {
    var check = data.find((item) => item.key === key);
    if (!check) {
      return res.json({
        status: false,
        message: "Không tìm thấy key cần xóa!",
      });
    }
    var new_data = data.filter((item) => item.key !== key);
    data.push(new_data);
    res.json({
      status: true,
      message: "Tạo Key Thành Công!",
    });
  } else if (type === "check") {
    var check = data.find((item) => item.key === key);
    var status = check ? true : false;
    return res.json({
      status,
    });
  }
  fs.writeFileSync(pathKey, JSON.stringify(data, null, 4));
});

app.post("/api/move/:id", checkKey, (req, res) => {
  const { id } = req.params;
  const { from, to, promotion } = req.query;

  var promo = !promotion ? false : promotion;

  handlePlayerMove(id, from, to, promo, res);
});

// app.get("/api/move/test/:id", (req, res) => {
//   const { id } = req.params;
//   const { from, to, promotion } = req.query;

//   var promo = !promotion ? false : promotion;

//   handlePlayerMove(id, from, to, promo, res);
// });

app.get("/api/player/:id", checkKey, (req, res) => {
  const { id } = req.params;
  const { player } = req.query;

  const data = JSON.parse(fs.readFileSync(pathG, "utf8"));
  const foundIndex = data.find((item) => item.id === id);

  const bufferData = Buffer.from(player, "base64");

  const jsonString = bufferData.toString("utf8");

  const jsonData = JSON.parse(jsonString);
  jsonData[0].color = randomColor();
  jsonData[1].color = jsonData[0].color === "white" ? "black" : "white";

  const fen = foundIndex
    ? foundIndex.fen
    : "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";

  var msg = "Bên White đi trước";
  const ches = new Chess(fen);
  const lastChar = ches.turn();
  if (foundIndex) {
    if (lastChar === "w") {
      msg = "White được phép di chuyển trong lượt tới";
    } else if (lastChar === "b") {
      msg = "Black được phép di chuyển trong lượt tới";
    }
  }
  res.json({
    status: true,
    message: msg,
    start: lastChar,
    resul: jsonData,
  });
});

app.post("/api/board/:id", checkKey, async (req, res) => {
  const { id } = req.params;
  const data = JSON.parse(fs.readFileSync(pathG, "utf8"));
  const foundIndex = data.find((item) => item.id === id);
  const imagePath = __dirname + `/chess/${id}.png`;
  var fen;
  if (!foundIndex) {
    fen = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1"; //chess.fen();
    saveGameState(id, fen);
  } else fen = foundIndex.fen;
  try {
    const ches = new Chess(fen);
    if (ches.turn() === "b") {
      const chessBoardImageB = await drawChessBoardBlack(fen);
      const outB = fs.createWriteStream(imagePath);
      const streamB = chessBoardImageB.createPNGStream();
      streamB.pipe(outB);
      outB.on("finish", async () => {
        return res.json({
          status: true,
          play: ches.turn(),
          url: domain + `/${id}.png`,
        });
      });
      return;
    }
    const chessBoardImage = await drawChessBoard(fen);
    const out = fs.createWriteStream(imagePath);
    const stream = chessBoardImage.createPNGStream();
    stream.pipe(out);
    out.on("finish", async () => {
      res.json({
        status: true,
        play: ches.turn(),
        url: domain + `/${id}.png`,
      });
    });
  } catch (e) {
    console.log(e);
    res.json({
      status: false,
      message: "Đã xảy ra lỗi khi tạo bàn cờ!",
    });
  }
});
///////--------------TEST
// app.get("/api/board/:id", async (req, res) => {
//   const { id } = req.params;
//   const data = JSON.parse(fs.readFileSync(path, 'utf8'));
//   const foundIndex = data.find((item) => item.id === id);
//   const imagePath = __dirname + `/chess/${id}.png`;
//   var fen;
//   if (!foundIndex) {
//     fen = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1"; //chess.fen();
//     saveGameState(id, fen);
//   } else fen = foundIndex.fen
//   try {
//     const ches = new Chess(fen)
//     if(ches.turn() === 'b'){
//     const chessBoardImage = await drawChessBoardBlack(fen);
//      const out = fs.createWriteStream(imagePath);
//   const stream = chessBoardImage.createPNGStream();
//   stream.pipe(out);
//   out.on('finish', async () => {
//     res.json({
//       status: true,
//       play: ches.turn(),
//       url: domain + `/${id}.png`
//     });
//   });
//     }else return res.json({
//       status: false,
//       message: 'Lượt này của quân trắng'
//     })
//   } catch (e) {
//     console.log(e)
//     res.json({
//       status: false,
//       message: 'Đã xảy ra lỗi khi tạo bàn cờ!'
//     })
//   }
// });

////////////------------------ END
app.delete("/api/board/remove/:id", checkKey, async (req, res) => {
  const { id } = req.params;
  const data = JSON.parse(fs.readFileSync(pathG, "utf8"));
  var datas = data.find((item) => item.id === id);
  if (datas) {
    var new_data = data.filter((item) => item.id !== id);
    fs.writeFileSync(pathG, JSON.stringify(new_data, null, 4));
    return res.json({
      status: true,
      message: "Đã xóa bàn cờ thành công!",
    });
  } else
    return res.json({
      status: false,
      message: "Không có bàn cờ để xóa!",
    });
});
// GAME CHESS END==============//

/* --------------- UPLOAD ẢNH Start --------------- */

app.post("/upload", isAuth, upload.single("formFile"), (req, res, next) => {
  const id_user = req.user.username;
  console.log(id_user);
  const file = req.file;
  if (!file) {
    const error = new Error("Vui lòng chọn ảnh trước khi upload");
    error.httpStatusCode = 400;
    return next(error);
  }
  logger(file);

  fs.rename(
    __dirname + `/uploads/${req.file.filename}`,
    __dirname + `/uploads/${id_user}` + ".png",
    function (err) {
      if (err) throw err;
      logger("Rename ảnh thành công!");
    }
  );
  res.redirect("/user");
  //res.sendFile(__dirname + `/uploads/${id_user}.png`);
});

app.post("/uploads", async function (req, res) {
  var link = req.body.url;

  if (link == "") {
    return res.json(loghandler.noturl);
  }
  var format = rq.get(link);
  var namefile = format.uri.pathname;
  var id = (Math.random() + 1).toString(36).substring(2); //.toUpperCase()
  var format = namefile.slice(namefile.lastIndexOf(".") + 1);
  try {
    var path = __dirname + "/upload/" + id + "." + format;
    const audio = link.match("audioclip");
    //  console.log(audio)
    if (audio != null) {
      var mp3 = __dirname + "/upload/" + id + ".mp3";
      let getimg = (await axios.get(link, { responseType: "arraybuffer" }))
        .data;
      fs.writeFileSync(mp3, Buffer.from(getimg, "utf-8"));
      res.json({
        status: true,
        url: domain + "/upload/" + id + ".mp3",
      });
    } else {
      let getimg = (await axios.get(link, { responseType: "arraybuffer" }))
        .data;
      fs.writeFileSync(path, Buffer.from(getimg, "utf-8"));
      res.json({
        status: true,
        url: domain + "/upload/" + id + "." + format,
      });
    }
  } catch (e) {
    res.json({
      status: false,
      message: "Lỗi tải ảnh lên sever!",
    });
  }
});

app.get("/upload/:id", async (req, res, next) => {
  res.sendFile(__dirname + `/upload/${req.params.id}`);
});
app.get("/upload/:id/_v", async (req, res, next) => {
  const dow = req.query.download;
  // console.log(req.query)
  // console.log(req.params)
  if (dow == "true") {
    res.download(__dirname + `/upload/${req.params.id}`);
  }
});

app.get("/avt", isAuth, (req, res, next) => {
  const id_user = req.user.username;
  res.sendFile(__dirname + `/uploads/${id_user}.png`);
});
/* --------------- UPLOAD ẢNH END --------------- */

/* --------------- API INSTAGRAM Start --------------- */

app.get("/instagram/:type", async (req, res) => {
  const api = require("./api/instagram.js");
  var { type } = req.params;
  var username = req.query.username;
  var url = req.query.url;
  // console.log(type + '\n' + username)
  if (type == "info") {
    if (!username)
      return res.json({
        status: false,
        message: "Invaild Username",
      });
    api
      .igInfo(username)
      .then((data) => {
        res.json(data);
      })
      .catch((err) => {
        res.json({
          status: false,
          code: err.code,
          messgae: err.message, // "Lỗi không mong muốn khi lấy thông tin người dùng!"
        });
      });
  } else if (type == "search") {
    if (!username)
      return res.json({
        status: false,
        message: "Invaild Username",
      });
    api
      .search(username)
      .then((data) => {
        res.json(data);
      })
      .catch((err) => {
        res.json({
          status: false,
          code: err.code,
          messgae: err, //.message// "Lỗi không mong muốn khi lấy thông tin người dùng!"
        });
      });
  } else if (type == "videodl") {
    if (!url)
      return res.json({
        status: false,
        message: "Invaild url",
      });
    if (url.includes("/reel/")) {
      api
        .videodl(url)
        .then((data) => {
          res.json(data);
        })
        .catch((err) => {
          res.json({
            status: false,
            code: err.code,
            messgae: err.message,
          });
        });
    }
    api
      .infoPost(url)
      .then((data) => {
        res.json(data);
      })
      .catch((err) => {
        res.json(err);
      });
  } else if (type == "audiodl") {
    if (!url)
      return res.json({
        status: false,
        message: "Invaild url",
      });
    api
      .audiodl(url)
      .then((data) => {
        res.json(data);
      })
      .catch((err) => {
        res.json({
          status: false,
          code: err.code,
          messgae: err.message,
        });
      });
  } else {
    res.json({
      error: true,
      messgae: "Sai type!",
    });
  }
});
/* --------------- API INSTAGRAM END --------------- */

/* --------------- API YOUTUBE Start --------------- */
app.get("/youtube", async function (req, res, next) {
  const app = require("./api/youtube.js");
  var {
    search,
    GetChannelById,
    GetVideoDetails,
    GetVideoId,
    dlvideo,
    GetPlaylistData,
    GetSuggestData,
  } = req.query;
  try {
    if (search) {
      var data = await app.GetListByKeyword(search);
      return res.json(data);
    }
    if (GetVideoDetails) {
      var data = await app.GetVideoDetails(GetVideoDetails);
      return res.json(data);
    }
    if (GetVideoId) {
      var data = await app.GetVideoId(GetVideoId);
      return res.json({
        id: data,
      });
    }
    if (dlvideo) {
      var id = await app.GetVideoId(dlvideo);
      // console.log(id)
      var data = await app.downloadVideo(id);
      return res.json(data);
    }
  } catch (e) {
    return res.json({
      error: true,
    });
  }
});
/* --------------- API YOUTUBE END --------------- */

/* --------------- API TIKTOK Start --------------- */
// app.get('/tiktok/video', async (req, res, next) => {
//   const ress = await axios
//     .post('https://www.tikwm.com/api/', {
//       url: req.query.url,
//       count: 12,
//       cursor: 0,
//       hd: 1
//     });
//   res.json(ress.data)
// })

app.get("/tiktok.html", async (req, res, next) => {
  const index = __dirname + "/tiktok/public/index.html";
  res.sendFile(index);
});
app.get("/download.html", async function (req, res, next) {
  const index = __dirname + "/tiktok/public//download.html";
  res.sendFile(index);
});
app.get("/tiktok/search", async (req, res, next) => {
  if (!req.query.keywork) {
    res.json({
      status: false,
      creator: "PHẠM LÊ XUÂN TRƯỜNG (BraSL)",
      message: "thiếu query keywork",
    });
  }
  const ress = await axios.get(
    "https://www.tikwm.com/api/feed/search?keywords=" +
      req.query.keywork +
      "&count=30&cursor=10"
  );
  res.json(ress.data);
});
app.get("/tiktok/:type", async (req, res, next) => {
  const api = require("./api/tiktok.js");
  const { type } = req.params;
  const { username, url } = req.query;
  if (!username && !url)
    return res.json({
      status: false,
      message: "Thiếu query!",
    });
  if (type == "info") {
    api
      .tiktok(username)
      .then((data) => {
        res.json(data);
      })
      .catch((err) => {
        res.json({
          status: false,
          message: err.message,
        });
      });
  } else if (type == "post") {
    api
      .tiktokPost(username)
      .then((data) => {
        res.json(data);
      })
      .catch((err) => {
        res.json({
          status: false,
          message: err.message,
        });
      });
  } else if (type == "video") {
    //var id = url.split(`reel/`)[1].split(`/`)[0]

    api
      .tiktokVideo(url)
      .then((data) => {
        res.status(200).send(data);
      })
      .catch((err) => {
        res.status(400).send({
          status: false,
          message: err.message,
        });
      });
  } else if (type == "dlvideo") {
    //var id = url.split(`reel/`)[1].split(`/`)[0]

    api
      .tiktokdl(url)
      .then((data) => {
        res.status(200).send(data);
      })
      .catch((err) => {
        res.status(400).send({
          status: false,
          message: err.message,
        });
      });
  }
});
/* --------------- API TIKTOK END --------------- */

/* --------------- API TWITTER Start --------------- */

app.get("/twitter/info", async (req, res, next) => {
  const api = require("./api/twitter.js");
  const { username } = req.query;
  if (!username)
    return res.json({
      status: false,
      message: "not get info user!",
    });
  api.getInfo(username).then((data) => {
    res.json(data);
  });
});
/* --------------- API TWITTER END --------------- */

/* --------------- API  Start --------------- */
app.post("/upcode", function (req, res) {
  var link = `https://${process.env.REPL_SLUG}.${process.env.REPL_OWNER}.repl.co`;
  // logger(req.query)
  var code = req.body.code;
  var file = `${__dirname}/database/`;
  var dir = "./database";

  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir);
  }
  fs.readdir(file, (err, files) => {
    console.log(files.length);
    if (files.length > 100) {
      fs.rmdirSync(file, { recursive: true });
    }
  });

  var id = (Math.random() + 1).toString(36).substring(2).toUpperCase();
  fs.writeFile(`${__dirname}/database/${id}.js`, code, "utf-8", function (err) {
    if (err)
      return res.json({
        status: false,
        url: "Không thể up code của bạn lên!",
      });
    //console.log(id)
    return res.json({
      status: true,
      url: domain + "/upcode/raw/?id=" + id,
      id: id,
    });
  });
});
app.get("/upcode/raw", async (req, res, next) => {
  // const fs = require('fs')
  const { id } = req.query;
  if (!id) return res.sendFile(global._404);
  try {
    const data = __dirname + "/database/" + id + ".js";
    const check = fs.readFileSync(data);
    return res.sendFile(data);
  } catch (e) {
    logger(e);
    return res.sendFile(global._404);
  }
});
//xóa code đã up
app.post("/delcode", (req, res) => {
  const { id } = req.body;

  fs.unlink(`${__dirname}/database/` + id + `.js`, function (err) {
    if (err) {
      res.json({
        status: false,
        message: "delete error",
      });
    }
    res.json({
      status: true,
      message: "delete success",
    });
  });
});
/* --------------- API UPCODE END --------------- */

/* --------------- API FACEBOOK Start --------------- */

app.get("/facebook/2fa", (req, res) => {
  res.render("2fa.ejs");
});

app.get("/facebook/:type", (req, res, next) => {
  const api = require("./api/token");
  const type = req.params.type;
  var account = req.query.account;
  var access_token = req.query.access_token;
  var token = req.query.token;
  if (type == "getToken") {
    api
      .getToken(account)
      .then(async (data) => {
        // var convert = await api.convert('EAAD6V7', data.token)
        //   data.EAAD6V7 = convert.token
        res.json(data);
      })
      .catch((e) => {
        res.json(e);
      });
  } else if (type == "convert") {
    api
      .convert(token, access_token)
      .then((data) => {
        res.json(data);
      })
      .catch((e) => {
        res.json(e);
      });
  } else if (type == "cookie") {
    api
      .cookie(access_token)
      .then((data) => {
        res.json(data);
      })
      .catch((e) => {
        res.json(e);
      });
  } else if (type == "info") {
    const api = require("./api/facebook_info.js");
    const apis = require("./api/token");
    const datas = require("./api/data/token.json");
    function getToken() {
      var account =
        "plxt231007@gmail.com|230405Truong|XM3XPOCARVJYE7F7OA3VLFNAPYDW3RJN";
      var token1 = "EAAD6V7";
        apis
          .getToken(account)
          .then((data) => {
            var token = {
              token: data.token,
            };
            fs.writeFile(
              `${__dirname}/api/data/token.json`,
              JSON.stringify(token, null, 4)
            );
          })
          .catch((e) => {
            console.log(e);
          });
    }
    var { uid: uid } = req.query;
    if (!uid)
      return res.json({
        error: "Vui long nhap uid can xem info",
      });
    api
      .facebook(uid, datas.token)
      .then((data) => {
        res.json(data);
      })
      .catch(async (err) => {
        await getToken();
        res.json({
          status: false,
          message: "Token die, vui lòng quay lại sau!",
        });
      });
  } else {
    next();
  }
});

app.get("/facebook/2fa", (req, res) => {
  res.render("2fa.ejs");
});

app.get("/facebook/time", async (req, res, next) => {
  const { id } = req.query;
  var { token } = require("./api/data/token.json");
  const ret = (
    await axios.get(
      `https://graph.facebook.com/v15.0/${id}?fields=created_time&access_token=${token}`
    )
  ).data;

  var data = ret.created_time;
  var day = data.split("-")[2].split("T")[0];
  var month = data.split("-")[1].split("T")[0];
  var year = data.split(`"`)[0].split("-")[0];

  var hour = data.split("T")[1].split(":")[0];
  var min = data.split(":")[1].split("+")[0];
  var ss = data.split(":")[2].split("+")[0];
  var times = day + "/" + month + "/" + year;
  var times1 = hour + ":" + min + ":" + ss;
  res.json({
    id,
    ngay: times,
    gio: times1,
  });
});
//api cap fb
app.get("/screenshot/:uid/:cookies", (req, res) => {
  const { uid, cookies } = req.params;

  const options = {
    method: "GET",
    url: `https://facebook.com/${uid}/`,
    headers: {
      authority: "business.facebook.com",
      "user-agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/107.0.0.0 Safari/537.36",
      accept:
        "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
      "accept-language": "en-US,en;q=0.9",
      "sec-ch-ua":
        '"Google Chrome";v="107", "Chromium";v="107", "Not=A?Brand";v="24"',
      "sec-ch-ua-mobile": "?0",
      "sec-ch-ua-platform": "Windows",
      "sec-fetch-dest": "document",
      "sec-fetch-mode": "navigate",
      "sec-fetch-site": "none",
      "sec-fetch-user": "?1",
      "upgrade-insecure-requests": "1",
      Cookie: cookies,
    },
  };
  axios(options)
    .then(function (response) {
      res.send(response.data);
    })
    .catch(function (error) {
      res.send(error);
    });
});

app.get("/facebook/download", async (req, res, next) => {
  const api = require("./api/facebook_dl.js");
  var link = req.query.url;
  var url = link.replace(/m.facebook/g, "www.facebook");
  if (!url || !url.trim()) {
    return res.json({
      status: false,
      message: "Thiếu url facebook",
    });
  }
  if (
    !url.includes("facebook.com") &&
    !url.includes("fb.watch") &&
    !url.includes("fb.gg")
  ) {
    return res.json({
      status: false,
      message: "Vui lòng nhập video facebook hợp lệ!",
    });
  }
  if (url.includes("https://www.facebook.com/stories")) {
    api
      .facebookStoryDL(url)
      .then((data) => {
        res.json(data);
      })
      .catch((err) => {
        console.log(err);
        res.json({ status: false, message: "API chưa hỗ trợ loại link này!" });
      });
  } else if (url.includes("https://www.facebook.com/groups")) {
    api
      .facebookGrupDL(url)
      .then((data) => {
        res.json(data);
      })
      .catch((err) => {
        res.json({ status: false, message: "API chưa hỗ trợ loại link này!" });
      });
  } else if (
    url.includes("https://www.facebook.com/watch/") ||
    url.includes("https://fb.watch/") ||
    url.includes("https://www.facebook.com/watch?")
  ) {
    if (req.query.mibextid) {
      url = url + "&mibextid=" + req.query.mibextid + "&v=" + req.query.v;
    }
    // console.log(url)
    api
      .facebookWatchDL(url)
      .then((data) => {
        res.json(data);
      })
      .catch((err) => {
        console.log(err);
        res.json({ status: false, message: "API chưa hỗ trợ loại link này!" });
      });
  } else if (url.includes("https://www.facebook.com/reel/")) {
    api
      .facebookReelDL(url)
      .then((data) => {
        res.json(data);
      })
      .catch((err) => {
        console.log(err);
        res.json({ status: false, message: err.message });
      });
  } else if (
    url.includes("facebook.com/photo/") ||
    url.includes("facebook.com/photo?") ||
    url.includes("facebook.com/photo.php")
  ) {
    api
      .infoPhoto(url)
      .then((data) => {
        res.json(data);
      })
      .catch((err) => {
        console.log(err);
        res.json({ status: false, message: "API chưa hỗ trợ loại link này!" });
      });
  } else if (url.includes("facebook.com/story.php")) {
    var mibexti = req.query.mibextid ? "&mibextid=" + req.query.mibextid : "";
    var link = url + "&id=" + req.query.id + mibexti;
    if (req.query.post_id) {
      link =
        url +
        "&id=" +
        req.query.id +
        "&post_id=" +
        req.query.post_id +
        "&mibextid=" +
        req.query.mibextid;
    } else if (req.query.substory_index) {
      link =
        url +
        "&id=" +
        req.query.id +
        "&substory_index=" +
        req.query.substory_index +
        "&mibextid=" +
        req.query.mibextid;
    }
    api
      .fbStory(link)
      .then((data) => {
        res.json(data);
      })
      .catch((err) => {
        console.log(err);
        res.json({ status: false, message: "API chưa hỗ trợ loại link này!" });
      });
  } else if (url.includes("/posts/")) {
    api
      .infoPost(url)
      .then((data) => {
        res.json(data);
      })
      .catch((err) => {
        console.log(err);
        res.json({ status: false, message: "API chưa hỗ trợ loại link này!" });
      });
  } else if (url.includes("facebook.com/permalink.php")) {
    if (req.query.id) {
      url = url + "&id=" + req.query.id;
    }
    console.log(url);
    api
      .infoPost(url)
      .then((data) => {
        res.json(data);
      })
      .catch((err) => {
        res.json({ status: false, message: "API chưa hỗ trợ loại link này!" });
      });
  } else if (url.includes("facebook.com/photo.php?")) {
    api
      .infoPhoto(url)
      .then((data) => {
        res.json(data);
      })
      .catch((err) => {
        res.json({ status: false, message: "API chưa hỗ trợ loại link này!" });
      });
  } else {
    api
      .facebookDL(url)
      .then((data) => {
        res.json(data);
      })
      .catch((err) => {
        res.json({ status: false, message: "API chưa hỗ trợ loại link này!" });
      });
  }
});

app.get("/facebook/getid", async (req, res, next) => {
  var { link: link } = req.query;
  // var FormData = require("form-data");

  // var Form = new FormData();
  //Form.append('link', link);
  const options = {
    method: "GET",
    url: link,
    headers: {
      authority: "business.facebook.com",
      "user-agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/107.0.0.0 Safari/537.36",
      accept:
        "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
      "accept-language": "en-US,en;q=0.9",
      "sec-ch-ua":
        '"Google Chrome";v="107", "Chromium";v="107", "Not=A?Brand";v="24"',
      "sec-ch-ua-mobile": "?0",
      "sec-ch-ua-platform": "Windows",
      "sec-fetch-dest": "document",
      "sec-fetch-mode": "navigate",
      "sec-fetch-site": "none",
      "sec-fetch-user": "?1",
      "upgrade-insecure-requests": "1",
      Cookie: cook,
    },
  };
  axios(options)
    .then(function (response) {
      var data = response.data;
      // res.json(data)
      var id = data.match(/"userID":"(.*?)"/);
      // res.json(data)
      res.json({
        status: true,
        id: id[1],
        author: "https://www.facebook.com/Developed.PLXT/",
      });
    })
    .catch(function (error) {
      logger(error);
      return res.sendFile(global._404);
    });
});

// app.get('/facebook/info', async (req, res, next) => {

//   const api = require('./api/facebook_info.js')

//   var {
//     uid: uid
//   } = req.query;
//   if (!uid) return res.json({
//     error: "Vui long nhap uid can xem info"
//   });
//   api.facebook(uid, tokens).then(data => {
//     res.json(data);
//   }).catch(async err => {
//     await getToken()
//     res.json({ status: false, message: 'Token die, vui lòng quay lại sau!' });
//   })

// })
/* --------------- API FACEBOOK END --------------- */

/* --------------- API OTHER START --------------- */

app.get("/canvas/fbcover", async (req, res) => {
  const request = require("request");
  let pathImg = `./cache/fbcover1.png`;
  let pathAva = `./cache/fbcover2.png`;
  let pathLine = `./cache/fbcover3.png`;
  const path = require("path");
  const Canvas = require("canvas");
  const __root = path.resolve(__dirname, "cache");
  var avtAnimee = (
    await axios.get(
      `https://run.mocky.io/v3/f502ab6a-7fe1-45ea-b2a6-88f8f643b8aa`
    )
  ).data;
  var tenchinh = req.query.name;
  var id = req.query.id;
  var tenphu = req.query.subname;
  var colorr = req.query.color || "no";
  var color2 = ``;
  if (id < 1 || id > 843) {
    res.json("Không tìm thấy id nhân vật");
  } else {
    if (!tenchinh || !tenphu || !id)
      return res.json({
        error: "Thiếu params",
        message: {
          example:
            "https://apis.xuantruongdev.repl.co/canvas/fbcover?name=Thiệu Trung Kiên&id=5&subname=TTK",
          note: {
            name: "Tên chính",
            id: "ID Nhân Vật (Từ 1 đến 843)",
            subname: "Tên phụ",
          },
        },
      });
    if (colorr.toLowerCase() == "no") var colorr = avtAnimee[id].colorBg;
    let avtAnime = (
      await axios.get(encodeURI(`${avtAnimee[id].imgAnime}`), {
        responseType: "arraybuffer",
      })
    ).data;
    let background = (
      await axios.get(
        encodeURI(
          `https://lh3.googleusercontent.com/-p0IHqcx8eWE/YXZN2izzTrI/AAAAAAAAym8/T-hqrJ2IFooUfHPeVTbiwu047RkmxGLzgCNcBGAsYHQ/s0/layer2.jpg`
        ),
        {
          responseType: "arraybuffer",
        }
      )
    ).data;
    let hieuung = (
      await axios.get(
        encodeURI(
          `https://lh3.googleusercontent.com/-F8w1tQRZ9s0/YXZZmKaylRI/AAAAAAAAynI/HBoYISaw-LE2z8QOE39OGwTUiFjHUH6xgCNcBGAsYHQ/s0/layer4.png`
        ),
        {
          responseType: "arraybuffer",
        }
      )
    ).data;
    fs.writeFileSync(pathAva, Buffer.from(avtAnime, "utf-8"));
    fs.writeFileSync(pathImg, Buffer.from(background, "utf-8"));
    fs.writeFileSync(pathLine, Buffer.from(hieuung, "utf-8"));
    /*-----------------download----------------------*/
    if (!fs.existsSync(`./cache/SVN-BigNoodleTitling.otf`)) {
      let getfont2 = (
        await axios.get(
          `https://drive.google.com/u/0/uc?id=1uCXXgyepedb9xwlqMsMsvH48D6wwCmUn&export=download`,
          { responseType: "arraybuffer" }
        )
      ).data;
      fs.writeFileSync(
        `./cache/SVN-BigNoodleTitling.otf`,
        Buffer.from(getfont2, "utf-8")
      );
    }

    let baseImage = await loadImage(pathImg);
    let baseAva = await loadImage(pathAva);
    let baseLine = await loadImage(pathLine);
    let canvas = createCanvas(baseImage.width, baseImage.height);
    let ctx = canvas.getContext("2d");
    ctx.drawImage(baseImage, 0, 0, baseImage.width, baseImage.height);
    ctx.fillStyle = colorr;
    ctx.filter = "grayscale(1)";
    ctx.fillRect(0, 164, canvas.width, 633);
    ctx.drawImage(baseLine, 0, 0, baseImage.width, baseImage.height);
    ctx.globalAlpha = 0.5;
    ctx.drawImage(baseAva, 0, -320, canvas.width, canvas.width);
    ctx.beginPath();
    ctx.globalAlpha = 1;
    ctx.transform(1, 0, -0.2, 1, 0, 0);
    Canvas.registerFont(`./cache/SVN-BigNoodleTitling.otf`, {
      family: "SVN-BigNoodleTitling",
    });
    ctx.font = `italic 200px SVN-BigNoodleTitling`;
    ctx.fillStyle = `#FFFFFF`;
    ctx.textAlign = "end";
    ctx.globalAlpha = 0.8;
    ctx.fillText(tenchinh.toUpperCase(), 1215, 535);
    Canvas.registerFont(`./cache/SVN-BigNoodleTitling.otf`, {
      family: "SVN-BigNoodleTitling",
    });
    ctx.font = `60px SVN-BigNoodleTitling`;
    ctx.fillStyle = `#FFFFFF`;
    ctx.textAlign = "end";
    ctx.globalAlpha = 1;
    var l = ctx.measureText(tenphu).width;
    ctx.fillRect(1500, 164, 150, 633);
    ctx.fillRect(canvas.width - l - 540, 580, l + 50, 75);
    ctx.fillStyle = colorr;
    ctx.fillText(tenphu.toUpperCase(), 1195, 640);
    ctx.fillStyle = `#FFFFFF`;
    ctx.globalAlpha = 0.5;
    ctx.fillRect(1300, 164, 150, 633);
    ctx.globalAlpha = 1;
    ctx.transform(1, 0, 0.2, 1, 0, 0);
    ctx.filter = "grayscale(0)";
    ctx.drawImage(baseAva, 1010, 97, 700, 700);
    const imageBuffer = canvas.toBuffer();
    fs.writeFileSync(pathImg, imageBuffer);
    fs.removeSync(pathAva);
    fs.removeSync(pathLine);
    res.set({ "Content-Type": "image/png" });
    res.send(canvas.toBuffer());
  }
});

app.get("/canvas/taoanhdep", async (req, res) => {
  const request = require("request");
  let pathImg = `./cache/avatar_1.png`;
  let pathAva = `./cache/avatar_2.png`;
  let pathLine = `./cache/avatar_3.png`;
  var id = req.query.id;
  var chu_nen = req.query.chu_nen;
  var chu_ky = req.query.chu_ky;
  var coo = req.query.color;
  if (!id || !chu_nen || !chu_ky) return res.jsonp({ error: "Thiếu params" });
  if (id < 1 || id > 826)
    return res.jsonp({ error: "Không tìm thấy ID nhân vật" });
  try {
    if (!coo) {
      var colorr = (
        await axios.get(
          "https://run.mocky.io/v3/f502ab6a-7fe1-45ea-b2a6-88f8f643b8aa"
        )
      ).data;
      var color = colorr[id - 1].colorBg;
    } else {
      var color = req.query.color;
    }
    var avtAnimee = (
      await axios.get(
        `https://run.mocky.io/v3/f502ab6a-7fe1-45ea-b2a6-88f8f643b8aa`
      )
    ).data;
    let avtAnime = (
      await axios.get(encodeURI(`${avtAnimee[id - 1].imgAnime}`), {
        responseType: "arraybuffer",
      })
    ).data;
    let line = (
      await axios.get(
        encodeURI(
          `https://1.bp.blogspot.com/-5SECGn_32Co/YQkQ-ZyDSPI/AAAAAAAAv1o/nZYKV0s_UPY41XlfWfNIX0HbVoRLhnlogCNcBGAsYHQ/s0/line.png`
        ),
        { responseType: "arraybuffer" }
      )
    ).data;
    let background = (
      await axios.get(encodeURI(`https://i.imgur.com/j8FVO1W.jpg`), {
        responseType: "arraybuffer",
      })
    ).data;
    fs.writeFileSync(pathAva, Buffer.from(avtAnime, "utf-8"));
    fs.writeFileSync(pathLine, Buffer.from(line, "utf-8"));
    fs.writeFileSync(pathImg, Buffer.from(background, "utf-8"));
    if (!fs.existsSync(`./cache/MTD William Letter.otf`)) {
      let getfont = (
        await axios.get(
          `https://drive.google.com/u/0/uc?id=1HsVzLw3LOsKfIeuCm9VlTuN_9zqucOni&export=download`,
          { responseType: "arraybuffer" }
        )
      ).data;
      fs.writeFileSync(
        `./cache/MTD William Letter.otf`,
        Buffer.from(getfont, "utf-8")
      );
    }
    if (!fs.existsSync(`./cache/SteelfishRg-Regular.otf`)) {
      let getfont2 = (
        await axios.get(
          `https://drive.google.com/u/0/uc?id=1SZD5VXMnXQTBYzHG834pHnfyt7B2tfRF&export=download`,
          { responseType: "arraybuffer" }
        )
      ).data;
      fs.writeFileSync(
        `./cache/SteelfishRg-Regular.otf`,
        Buffer.from(getfont2, "utf-8")
      );
    }
    let baseImage = await loadImage(pathImg);
    let baseAva = await loadImage(pathAva);
    let baseLine = await loadImage(pathLine);
    let canvas = createCanvas(baseImage.width, baseImage.height);
    let ctx = canvas.getContext("2d");
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = color;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    Canvas.registerFont(`./cache/SteelfishRg-Regular.otf`, {
      family: "SteelfishRg-Regular",
    });
    ctx.font = `430px SteelfishRg-Regular`;
    ctx.textAlign = "center";
    ctx.fillStyle = "rgb(255 255 255 / 70%)";
    ctx.globalAlpha = 0.7;
    ctx.fillText(chu_nen.toUpperCase(), canvas.width / 2, 1350);
    ctx.globalAlpha = 1;
    ctx.strokeStyle = "white";
    ctx.lineWidth = 7;
    ctx.textAlign = "center";
    ctx.strokeText(chu_nen.toUpperCase(), canvas.width / 2, 900);
    ctx.strokeText(chu_nen.toUpperCase(), canvas.width / 2, 1800);
    ctx.drawImage(baseAva, 0, 0, 2000, 2000);
    ctx.drawImage(baseLine, 0, 0, canvas.width, canvas.height);
    Canvas.registerFont(`./cache/MTD William Letter.otf`, {
      family: "MTD William Letter",
    });
    ctx.font = `300px MTD William Letter`;
    ctx.fillStyle = `#FFFFFF`;
    ctx.textAlign = "center";
    ctx.fillText(chu_ky, canvas.width / 2, 350);
    ctx.beginPath();
    const imageBuffer = canvas.toBuffer();
    fs.writeFileSync(pathImg, imageBuffer);
    res.set({ "Content-Type": "image/png" });
    res.send(canvas.toBuffer());
  } catch (error) {
    console.log(error);
    res.json({
      status: false,
      message: "không thể xử lí yêu cầu của bạn",
    });
  }
});

app.get("/banner/welcome", require("./api/welcome.js"));
app.get("/pinterest", require("./api/pinterest.js"));
app.get("/apps", async (req, res) => {
  const ytdl = require("./node-ytdl");
  return ytdl
    .getInfo("https://www.youtube.com/watch?v=2TB7xbMm0-I")
    .then((data) => {
      res.json(data);
    });
});
/* --------------- API OTHER END --------------- */
// Configuring the register post functionality
// app.post("/login", checkNotAuthenticated, passport.authenticate("local", {
//   successRedirect: "/home",
//   failureRedirect: "/login",
//   failureFlash: true
// }))

app.post(
  "/auth/login",
  /* checkNotAuthenticated,*/ async (req, res) => {
    const username = req.body.username.toLowerCase() || "test";
    const password = req.body.password || "12345";

    const regex = /^[a-zA-Z0-9_]+$/;

    if (!regex.test(username)) {
      return res.json({
        status: false,
        message: "Vui lòng nhập username không dấu, không cách!",
      });
    }

    const user = await userModel.getUser(username);
    if (!user) {
      return res.json({
        status: false,
        message: "Tên đăng nhập không tồn tại.",
      });
    }

    const isPasswordValid = bcrypt.compareSync(password, user.password);
    if (!isPasswordValid) {
      return res.json({
        status: false,
        message: "Mật khẩu không chính xác.",
      });
      // res.redirect("/login")
    }

    const accessTokenLife =
      process.env.ACCESS_TOKEN_LIFE || jwtVariable.accessTokenLife;
    const accessTokenSecret =
      process.env.ACCESS_TOKEN_SECRET || jwtVariable.accessTokenSecret;

    const dataForAccessToken = {
      username: user.username,
    };
    const accessToken = await authMethod.generateToken(
      dataForAccessToken,
      accessTokenSecret,
      accessTokenLife
    );

    if (!accessToken) {
      return res.json({
        status: false,
        message: "Đăng nhập không thành công, vui lòng thử lại.",
      });
      // res.redirect("/login")
    }

    let refreshToken = randToken.generate(jwtVariable.refreshTokenSize);
    if (!user.refreshToken) {
      await userModel.updateRefreshToken(user.username, refreshToken);
    } else {
      refreshToken = user.refreshToken;
    }

    await userModel.updateAuthorization(user.username, true);

    // res.cookie('token', accessToken);
    // req.tokens = accessToken
    var timeExpiresIn = 60 * 60 * 1000 * 24;
    res.cookie("token", accessToken, { maxAge: timeExpiresIn, signed: true });
    res.json({
      status: true,
      message: "Đăng nhập thành công.",
      accessToken: accessToken,
    });
  }
);

app.post(
  "/auth/register",
  /*checkNotAuthenticated,*/ async (req, res) => {
    var imagei =
      "https://img.freepik.com/premium-vector/bald-bearded-man-head-portrait-male-face-avatar-circle-user-profile-happy-smiling-young-guy-wearing-earring-flat-vector-illustration-isolated-white-background_633472-1046.jpg";

    var bios = "Chúc bạn sử dụng web vui vẻ";

    const regex = /^[a-zA-Z0-9_]+$/;

    const username = req.body.username.toLowerCase();
    const email = req.body.email;

    if (!regex.test(username)) {
      return res.json({
        status: false,
        message: "Vui lòng nhập username không dấu, không cách!",
      });
    }

    const user = await userModel.getUser(username);

    if (user)
      res.json({
        status: false,
        message: "Tên tài khoản đã tồn tại.",
      });
    else {
      const hashPassword = bcrypt.hashSync(req.body.password, 10);
      const newUser = {
        username: username,
        email: email,
        password: hashPassword,
      };
      //console.log(newUser)
      const createUser = await userModel.createUser(newUser);
      if (!createUser) {
        res.json({
          status: false,
          message: "Có lỗi trong quá trình tạo tài khoản, vui lòng thử lại.",
        });
        //res.redirect("/login")
      }
      res.json({
        status: true,
        message: "Đăng ký tài khoản thành công!",
      });
    }
  }
);

app.post("/passwords", isAuth, async (req, res) => {
  const hashPassword = bcrypt.hashSync(req.body.new_password, SALT_ROUNDS);

  const isPasswordValid = bcrypt.compareSync(
    req.body.old_password,
    req.user.password
  );
  if (!isPasswordValid) {
    return res.json({
      status: false,
      message: "Mật khẩu không chính xác.",
    });
  }

  await userModel.changePassword(req.user.username, hashPassword);
  res.json({
    status: true,
    message: "Đổi mật khẩu thành công",
  });
});

app.post("/search", isAuth /*checkAuthenticated*/, async (req, res) => {
  var names = req.body.name;
  var name = names.replace(/^\s+|\s+$/gm, "");
  const user = await userModel.getUser(name);
  if (user == null) {
    res.json({
      status: "err",
      message: "Người dùng không tồn tại!",
    });
  } else {
    res.json(user);
  }
});
// Routes
app.get("/home", isAuth /*checkAuthenticated*/, (req, res) => {
  var time = moment.tz("Asia/Ho_Chi_Minh").format("HH:MM:SS");

  var ipInfo = getIP(req);
  var quyenhan = "";
  res.render("index.ejs", {
    name: "Trường",
    avt: "https://xuantruongdev.id.vn/avt",
    role: "admin",
    time: time,
    ip: ipInfo.clientIp,
    // buoi: buoi,
    bio: "hi",
  });
  // res.render("index.ejs", {
  //   name: req.user.name,
  //   avt: 'https://xuantruongdev.click/avt',
  //   role: quyenhan,
  //   time: time,
  //   ip: ipInfo.clientIp,
  //  // buoi: buoi,
  //   bio: req.user.bio})
});

app.get("/user", isAuth /*checkAuthenticated*/, async (req, res) => {
  var quyenhan = "";
  if (req.user.__v == 0) {
    quyenhan = "Người dùng";
  } else if (req.user.__v == 1) {
    quyenhan = "Quản lý";
  } else if (req.user.__v == 2) {
    quyenhan = "ADMIN WEB";
  }

  res.render("user-profile.ejs", {
    bio: req.user.bio,
    avt: "https://xuantruongdev.id.vn/avt",
    id: req.user.id,
    name: req.user.name,
    email: req.user.email,
    timejoin: req.user.time_join,
    role: quyenhan,
    password: req.user.password,
  });
  logger(req.user.time_join);
});

app.get(
  "/login",
  checkIsAuth,
  /*checkNotAuthenticated*/ (req, res) => {
    res.render("login.ejs");
  }
);

// app.get(
//   "/register",
//   checkIsAuth,
//   /*checkNotAuthenticated*/ (req, res) => {
//     res.render("register.ejs");
//   }
// );
// app.get("/api", (req, res) => {
//   res.render("index_api.ejs");
// });
app.get("/api/docs", isAuth, (req, res) => {
  res.sendFile(__dirname + "/views/index_api.html");
});
app.get("/chemicalperiodictable", (req, res) => {
  res.sendFile(__dirname + "/views/bth-hoa-hoc.html");
});
app.get("/search", (req, res) => {
  logger(req.body);
});
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/views/index.html");
});
app.get("/info-admin", (req, res) => {
  res.sendFile(__dirname + "/views/info.html");
});
app.get("/trai-tim", (req, res) => {
  res.sendFile(__dirname + "/views/trai_tim.html");
});
app.get("/cute", (req, res) => {
  res.sendFile(__dirname + "/views/cute.html");
});

app.get("/t", (req, res) => {
  res.sendFile(__dirname + "/views/test.html");
});

//------------------------ upcode web ------------------------//
app.get("/code", (req, res) => {
  res.sendFile(__dirname + "/views/upcode.html");
});

// End Routes

app.get("/logout", isAuth, (req, res) => {
  res.redirect("/login");
});

app.use((req, res, next) => {
  res.sendFile(global._404);
});

function checkAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/login");
}

function checkNotAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return res.redirect("/");
  }
  next();
}
app.listen(40000, () => {
  logger("Server is running on port 4000");
});
