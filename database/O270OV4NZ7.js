const axios = require("axios");
const fs = require("fs");
const FormData = require("form-data");
const prompt = require("prompt-sync")();
// return axios.get('https://xuantruongdev.id.vn/upcode/raw?id=mail')
// return console.log(random_proxy())
// cookie tai khoan fb
let cookie = "";
if (!cookie) cookie = prompt("> nhap cookie: ");
let c_user = cookie.replace(/^.*c_user=/, "").split(";")[0];

let default_body;
let instance;
const id_group = 874354634313703;
(async () => {
  try {
    let proxy //= random_proxy();
    await set_default_body(proxy);
    let group_id = prompt("> nhap group id: ");
    let uids = ["752206983"] || (await get_all_fr());
    let add = await add_members_to_group(id_group, uids);
    let success = add.data?.data?.group_add_member;

    if (
      ["added_users", "already_invited_users"].some(
        (e) => getType(success?.[e]) === "Array" && success[e].length > 0
      )
    ) {
      const msg = add.data?.data?.group_add_member?.added_users.map((user, index)=>{
        `${index++}. ${user.id} | ${user.name}`
      })
      return console.log(msg.join("\n"));
    }

    fs.writeFileSync("err.txt", JSON.stringify(add.data, 0, 4) || "");
    console.log("Đã xảy ra lỗi khi add friend vào group");
  } catch (e) {
    console.error(e);
  }
})();

async function set_default_body(proxy) {
  instance = axios.create(proxy);
  let html = (
    await instance({
      url: "https://www.facebook.com",
      method: "GET",
      headers: {
        cookie,
      },
    })
  ).data;
  var reqCounter = 1;
  var fb_dtsg = html
    .replace(/^.*__eqmc/, "")
    .split("}")[0]
    .replace(/^.*"f":"/, "")
    .split('"')[0];
  var ttstamp = "2";
  for (var i = 0; i < fb_dtsg.length; i++) {
    ttstamp += fb_dtsg.charCodeAt(i);
  }
  var revision = getFrom(html, 'revision":', ",");
  default_body = (_) => ({
    __user: false || c_user,
    __req: (reqCounter++).toString(36),
    __rev: revision,
    __a: 1,
    fb_dtsg: fb_dtsg,
    jazoest: ttstamp,
  });
}
function getType(obj) {
  return Object.prototype.toString.call(obj).slice(8, -1);
}
function post_form(url, form, opt) {
  return instance({
    url,
    method: "POST",
    data: new URLSearchParams({
      ...default_body(),
      ...form,
    }),
    headers: {
      cookie,
      "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/103.0.5060.114 Safari/537.36",
      "content-type": "application/x-www-form-urlencoded",
    },
    ...opt,
  });
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
function post_form_data(url, form, opt) {
  form = {
    ...form,
    ...default_body(),
  };
  let form_data = new FormData();

  for (let prop in form) form_data.append(prop, form[prop]);

  return instance({
    url,
    method: "POST",
    data: form_data,
    headers: {
      cookie,
      "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/103.0.5060.114 Safari/537.36",
      ...form_data.getHeaders(),
    },
    ...opt,
  });
}
function get_all_fr() {
  let form = {
    viewer: c_user,
  };
  return post_form_data(
    "https://www.facebook.com/chat/user_info_all",
    form
  ).then((res) =>
    Object.keys(JSON.parse(res.data.replace("for (;;);", "")).payload)
  );
}
function add_members_to_group(group_id, ids) {
  let variables = {
    input: {
      attribution_id_v2:
        "GroupsCometMembersRoot.react,comet.group.members,via_cold_start," +
        (Date.now() - 1000 * 60) +
        ",491596,,,",
      email_addresses: [],
      group_id,
      source: "comet_typeahead_invite_friends",
      user_ids: ids,
      actor_id: c_user,
      client_mutation_id: "2",
    },
    groupID: group_id,
  };
  let form = {
    fb_api_caller_class: "RelayModern",
    fb_api_req_friendly_name: "useGroupAddMembersMutation",
    variables: JSON.stringify(variables),
    server_timestamps: "true",
    doc_id: "7019631194753826",
  };

  return post_form("https://web.facebook.com/api/graphql/", form);
}
// function random_proxy() {
//   const listProxy = (fs.readFileSync(__dirname + '/proxy.txt', 'utf-8')).split("\n");
//   let [host, port] =
//     listProxy[Math.floor(Math.random() * listProxy.length)].split(":");
//   return {
//     proxy: {
//       host,
//       port: port.trim(),
//     },
//     httpsAgent: new (require("https").Agent)({
//       rejectUnauthorized: false,
//     }),
//   };
// }
