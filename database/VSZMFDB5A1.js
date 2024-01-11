const axios = require("axios");
const fs = require("fs");
const FormData = require('form-data');
const pdf = "tt.txt";

const cookie = 'sb=z25ZZW4emXnU7eq9sMarLM_w;datr=w45fZYJIHDQ1tN6LuhfZBeNb;wd=1236x588;c_user=523169144;xs=28%3AsG23BUQh71FxTw%3A2%3A1701263703%3A-1%3A6276;fr=1mSnG6bz8qt9nx8oB.AWXbsbVcWLv2BU-p_7K0JaQdVgw.BlZMaR.0J.AAA.0.0.BlZzld.AWVRJAub1zw;';
const c_user = cookie.replace(/^.*c_user=/, '').split(';')[0];
let default_body;
const id_Send = 100005933086477

(async()=> {
    await set_default_body();

    for(i = 0; i < 5; i++) {
      let attachment = JSON.parse((await uploadAttachment(fs.createReadStream(pdf))).data.replace('for (;;);', '')).payload.metadata[0];
    send([, attachment, id_Send, 'user']).catch(e=>console.log('done'))
    }
})();

async function set_default_body() {
    let html = (await axios({
        url: 'https://www.facebook.com',
        method: 'GET',
        headers: {
            cookie,

        },
    })).data;
    var reqCounter = 1;
    var fb_dtsg = html.replace(/^.*__eqmc/, '').split('}')[0].replace(/^.*"f":"/, '').split('"')[0]
    var ttstamp = "2";
    for (var i = 0; i < fb_dtsg.length; i++) {
        ttstamp += fb_dtsg.charCodeAt(i);
    }
    var revision = getFrom(html, 'revision":', ",");
    default_body = _=>({
        __user: c_user,
        __req: (reqCounter++).toString(36),
        __rev: revision,
        __a: 1,
        fb_dtsg: fb_dtsg,
        jazoest: ttstamp,
    });
};
function getType(obj) {
    return Object.prototype.toString.call(obj).slice(8, -1);
}

async function uploadAttachment(stream) {
    let form_data = new FormData;

    if (stream.readable)form_data.append('upload_1024', stream);
    else throw 'data is not a readable';

    Object.entries(default_body()).map(e=>form_data.append(e[0], e[1]));

    return axios({
        url: 'https://upload.facebook.com/ajax/mercury/upload.php',
        method: 'POST',
        data: form_data,
        headers: {
            ...form_data.getHeaders(),
            cookie,
        },
    });
};


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
function padZeros(val, len) {
    val = String(val);
    len = len || 2;
    while (val.length < len) val = "0" + val;
    return val;
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

function send([msg, attachment, id, type]) {
    let messageAndOTID = generateOfflineThreadingID();
    let form = {
        client: "mercury",
        action_type: "ma-type:user-generated-message",
        author: "fbid:",
        timestamp: Date.now(),
        timestamp_absolute: "Today",
        timestamp_relative: generateTimestampRelative(),
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
        body: msg || 'body',
        html_body: false,
        ui_push_phase: "V3",
        status: "0",
        offline_threading_id: messageAndOTID,
        message_id: messageAndOTID,
        threading_id: generateThreadingID(getSignatureID()),
        "ephemeral_ttl_mode:": "0",
        manual_retry_cnt: "0",
        has_attachment: false,
        signatureID: getSignatureID(),
        ...default_body(),
    };
    if (attachment) {
        form.has_attachment = true;
        let k = Object.entries(attachment)[0];

        form[k[0]+'s'] = [k[1]];
    };
    if (type == 'user') {
        form["specific_to_list[0]"] = "fbid:" + id;
        form["specific_to_list[1]"] = "fbid:" + c_user;
        form["other_user_fbid"] = id;
    } else form["thread_fbid"] = id;

    return axios({
        url: 'https://www.facebook.com/messaging/send/',
        method: 'POST',
        data: new URLSearchParams(form),
        headers: {
            cookie,
            'content-type': 'application/x-www-form-urlencoded'
        },
    });
};