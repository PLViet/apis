const axios = require("axios");
const fs = require("fs-extra");
const path = __dirname + "/test.pdf";

const cookie = ""
const headers = {
  "Host": "mbasic.facebook.com",
  "user-agent": "Mozilla/5.0 (Linux; Android 11; M2101K7BG Build/RP1A.200720.011;) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/97.0.4692.98 Mobile Safari/537.36",
  "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
  "sec-fetch-site": "same-origin","sec-fetch-mode": "navigate",
  "sec-fetch-user": "?1",
  "sec-fetch-dest": "document",
  "referer": "https://mbasic.facebook.com/?refsrc=deprecated&_rdr",
  "accept-encoding": "gzip, deflate",
  "accept-language": "vi-VN,vi;q=0.9,en-US;q=0.8,en;q=0.7",
  "Cookie": cookie
};

function getType(obj) {
  return Object.prototype.toString.call(obj).slice(8, -1);
}

function isReadableStream(obj) {
  return (
    obj instanceof stream.Stream &&
    (getType(obj._read) === "Function" ||
      getType(obj._read) === "AsyncFunction") &&
    getType(obj._readableState) === "Object"
  );
}

async function uploadAttachment(attachment) {
 // const attachment = fs.createReadStream(path);
  if (!(await isReadableStream(attachment))) throw { error: "Attachment should be a readable stream and not " + await getType(attachment) + "." };
  const uploads = [];

  const formData = new FormData();
  
  const html = (await axios.get("https://www.facebook.com", {
    headers
  })).data;

  var reqCounter = 1;
  var fb_dtsg = await getFrom(html, 'name="fb_dtsg" value="', '"');
  var ttstamp = "2";
  for (var i = 0; i < fb_dtsg.length; i++) {
    ttstamp += fb_dtsg.charCodeAt(i);
  }
  var revision = getFrom(html, 'revision":', ",");

  formData.append("__user", userID);
  formData.append("__req", (reqCounter++).toString(36));
  formData.append("__rev", revision);
  formData.append("__a", 1);
  formData.append("fb_dtsg", fb_dtsg);
  formData.append("jazoest", ttstamp);
  formData.append("revision", revision);
  formData.append("upload_1024", attachment);
  formData.append("voice_clip", "true");

  try {
    const res = await axios({
      method: "POST",
      url: "https://upload.facebook.com/ajax/mercury/upload.php",
      data: formData,
      headers
    });

    uploads.push(res.data.payload.metadata[0]);
  } catch (error) {
    throw new Error(error);
  }

  return uploads;
}


// ==== send message

function binaryToDecimal(data) {
  var ret = "";
  while (data !== "0") {
    var end = 0;
    var fullName = "";
    var i = 0;
    for (; i < data.length; i++) {
      end = 2 * end + parseInt(data[i], 10);
      if (end >= 10) {
        fullName += "1";
        end -= 10;
      } else {
        fullName += "0";
      }
    }
    ret = end.toString() + ret;
    data = fullName.slice(fullName.indexOf("1"));
  }
  return ret;
}

function generateOfflineThreadingID() {
  var ret = Date.now();
  var value = Math.floor(Math.random() * 4294967295);
  var str = ("0000000000000000000000" + value.toString(2)).slice(-22);
  var msgs = ret.toString(2) + str;
  return binaryToDecimal(msgs);
}

function generateThreadingID(clientID) {
  var k = Date.now();
  var l = Math.floor(Math.random() * 4294967295);
  var m = clientID;
  return "<" + k + ":" + l + "-" + m + "@mail.projektitan.com>";
}

function generateTimestampRelative() {
  var d = new Date();
  return d.getHours() + ":" + padZeros(d.getMinutes());
}

function getSignatureID() {
  return Math.floor(Math.random() * 2147483648).toString(16);
}

function getFrom(str, startToken, endToken) {
  var start = str.indexOf(startToken) + startToken.length;
  if (start < startToken.length) return "";

  var lastHalf = str.substring(start);
  var end = lastHalf.indexOf(endToken);
  if (end === -1) {
    throw Error(
      "Could not find endTime `" + endToken + "` in the given string."
    );
  }
  return lastHalf.substring(0, end);
}

async function handleAttachment(msg, form) {
  try {
  if (msg.attachment) {
    form["image_ids"] = [];
    form["gif_ids"] = [];
    form["file_ids"] = [];
    form["video_ids"] = [];
    form["audio_ids"] = [];

    const data = await uploadAttachment(msg.attachment);
    data.forEach(function (file) {
      var key = Object.keys(file);
      var type = key[0]; // image_id, file_id, etc
      form["" + type + "s"].push(file[type]); // push the id
    });
    return form
  }
}catch(e) {
  console.log(e)
}
}

async function send(type ,threadID, userID) {
  const html = (await axios.get("https://www.facebook.com", {
    headers
  })).data;

  var reqCounter = 1;
  var fb_dtsg = await getFrom(html, 'name="fb_dtsg" value="', '"');
  var ttstamp = "2";
  for (var i = 0; i < fb_dtsg.length; i++) {
    ttstamp += fb_dtsg.charCodeAt(i);
  }
  var revision = getFrom(html, 'revision":', ",");

  var msg = {
    body: "nội dung cần send",
    attachment: path
  }

  const messageAndOTID = await generateOfflineThreadingID()
  var form = {
    __user: userID,
    __req: (reqCounter++).toString(36),
    __rev: revision,
    __a: 1,
    fb_dtsg,
    jazoest,
    client: "mercury",
    action_type: "ma-type:user-generated-message",
    author: "fbid:" + ctx.userID,
    timestamp: Date.now(),
    timestamp_absolute: "Today",
    timestamp_relative: await generateTimestampRelative(),
    timestamp_time_passed: "0",
    is_unread: false,
    is_cleared: false,
    is_forward: false,
    is_filtered_content: false,
    is_filtered_content_bh: false,
    is_filtered_content_account: false,
    is_filtered_content_quasar: false,
    is_filtered_content_invalid_app: false,
    is_spoof_warning: false,
    source: "source:chat:web",
    "source_tags[0]": "source:chat",
    body: msg.body,
    html_body: false,
    ui_push_phase: "V3",
    status: "0",
    offline_threading_id: messageAndOTID,
    message_id: messageAndOTID,
    threading_id: await generateThreadingID(ctx.clientID),
    "ephemeral_ttl_mode:": "0",
    manual_retry_cnt: "0",
    has_attachment: !!(msg.attachment || msg.url || msg.sticker),
    signatureID: await getSignatureID(),
    replied_to_message_id: undefined
  };
  
  form = handleAttachment(msg, form)

  if (type === "group") sendContent(form, threadID, threadID.length === 15, userID, (err)=> {console.log(err)});
  else {
      console.log(form)
      sendContent(form, threadID, false, userID, (err)=> {console.log(err)});
  }
}
function sendContent(form, threadID, isSingleUser, userID, callback) {
 
    if (isSingleUser) {
      form['specific_to_list[0]'] = `fbid:${threadID}`;
      form['specific_to_list[1]'] = `fbid:${userID}`;
      form['other_user_fbid'] = threadID;
    } else {
      form['thread_fbid'] = threadID;
    }

  if (ctx.globalOptions.pageID) {
    form['author'] = `fbid:${ctx.globalOptions.pageID}`;
    form['specific_to_list[1]'] = `fbid:${ctx.globalOptions.pageID}`;
    form['creator_info[creatorID]'] = userID;
    form['creator_info[creatorType]'] = 'direct_admin';
    form['creator_info[labelType]'] = 'sent_message';
    form['creator_info[pageID]'] = ctx.globalOptions.pageID;
    form['request_user_id'] = ctx.globalOptions.pageID;
    form['creator_info[profileURI]'] = `https://www.facebook.com/profile.php?id=${userID}`;
  }

  function objectToFormData(obj) {
    const formData = new FormData();
  
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        const value = obj[key];
        formData.append(key, value);
      }
    }
  
    return formData;
  }
  
  const formData = objectToFormData(form);

  axios({
    method: "POST",
    url: 'https://www.facebook.com/messaging/send/',
    data: formData,
    headers
  })
    .then(response => {
      const resData = response.data;
      if (!resData) return callback({ error: 'Send message failed.' });
      if (resData.error) {
        if (resData.error === 1545012) console.log('sendMessage', `Got error 1545012. This might mean that you're not part of the conversation ${threadID}`);
        return callback(resData);
      }

      const messageInfo = resData.payload.actions.reduce((p, v) => (
        {
          threadID: v.thread_fbid,
          messageID: v.message_id,
          timestamp: v.timestamp
        } || p
      ), null);

      return callback(null, messageInfo);
    })
    .catch(err => {
      console.error('sendMessage', err);
      if (utils.getType(err) === 'Object' && err.error === 'Not logged in.') ctx.loggedIn = false;
      return callback(err);
    });
}


send("user","4")