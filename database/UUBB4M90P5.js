const fs = require("fs");
const FormData = require("form-data");
const got = require("got");
const prompt = require("prompt-sync")();

let cookie = "datr=ehhGZVx4uMFWL65X8Xw32Edu;sb=ehhGZUmUYSRRcbadFwxN4xQV;vpd=v1%3B767x393x2.75;locale=vi_VN;wl_cbv=v2%3Bclient_version%3A2375%3Btimestamp%3A1702217047;wd=1236x588;c_user=100085130240990;m_ls=%7B%22c%22%3A%7B%221%22%3A%22HCwAABaSuYoFFq6NtQYTBRa8j5Wq3MEtAA%22%2C%222%22%3A%22GSwVQBxMAAAWAhawu77XDBYAABV-HEwAABYAFrC7vtcMFgAAFigA%22%2C%2295%22%3A%22HCwAABboBxbkhYnFCBMFFryPlarcwS0A%22%7D%2C%22d%22%3A%22bfeca6da-2968-4c8b-a11b-01b69529c7d4%22%2C%22s%22%3A%221%22%2C%22u%22%3A%22v9efxm%22%7D;presence=C%7B%22lm3%22%3A%22g.6433064276806563%22%2C%22t3%22%3A%5B%7B%22o%22%3A0%2C%22i%22%3A%22g.6465798140163713%22%7D%2C%7B%22o%22%3A0%2C%22i%22%3A%22g.9194392737253399%22%7D%2C%7B%22o%22%3A0%2C%22i%22%3A%22g.6625459097507069%22%7D%2C%7B%22o%22%3A0%2C%22i%22%3A%22g.7847777948573421%22%7D%2C%7B%22o%22%3A0%2C%22i%22%3A%22g.6336702966406733%22%7D%2C%7B%22o%22%3A0%2C%22i%22%3A%22g.24008226332124588%22%7D%2C%7B%22o%22%3A0%2C%22i%22%3A%22g.6326347894117284%22%7D%2C%7B%22o%22%3A0%2C%22i%22%3A%22g.5556442971082682%22%7D%2C%7B%22o%22%3A0%2C%22i%22%3A%22g.4216524055084248%22%7D%2C%7B%22o%22%3A0%2C%22i%22%3A%22g.5885468938142520%22%7D%2C%7B%22o%22%3A0%2C%22i%22%3A%22g.5908610055913421%22%7D%5D%2C%22utc3%22%3A1702466615069%2C%22v%22%3A1%7D;xs=9%3AhZQKhaL5dn05LA%3A2%3A1702462705%3A-1%3A6298%3A%3AAcWN3CcirLZTFpny-B0ga2i3LE06c3RCHPkPfNPtNA;fr=1ooQwYDn2PATQ8Xaa.AWWqdsttvCnlvhiiLsSiVEm5eBA.BleaEk.17.AAA.0.0.BleatZ.AWWjfZuEmJs;";
if (!cookie) {
    cookie = prompt("> Nhập cookie: ");
}
let c_user = cookie.replace(/^.*c_user=/, "").split(";")[0];

let default_body;
let instance;

async function main() {
    try {
        let proxy = random_proxy();
        await set_default_body(proxy);
        let group_id = 874354634313703 || prompt("> Nhập group id: ");
        let uids = await get_all_fr();
        var uid = uids.slice(0, 500)
        let add = await add_members_to_group(group_id, uid);
        let success = JSON.parse(add.body)?.data?.group_add_member;

        if (["added_users", "already_invited_users"].some(e => getType(success?.[e]) === "Array" && success[e].length > 0)) {
      const data = success?.added_users.length > 0 ? success?.added_users : success?.already_invited_users
            const msg = data.map(
                (user, index) => `${index++}. ${user?.name ? `${user.id} | ${user.name}` : `${user.id}`}`
            );
            console.log(msg.join("\n"));
      return console.log(`Đã thêm thành công ${msg.length} người`)
        }

        fs.writeFileSync("log.txt", add.body || "");
        console.log(success?.user_facing_alert ? success.user_facing_alert : "Lỗi khi thêm thành viên vào nhóm");
    } catch (error) {
        console.error(error);
    }
}

async function set_default_body(proxy) {
    instance = got.extend({
        agent: {
            https: new (require("https").Agent)({ ...proxy.agent.https }),
        },
    });

    let html = (await instance.get("https://www.facebook.com", { headers: { cookie } })).body;
    var reqCounter = 1;
    var fb_dtsg = html.replace(/^.*__eqmc/, "").split("}")[0].replace(/^.*"f":"/, "").split('"')[0];
    var ttstamp = "2";
    for (var i = 0; i < fb_dtsg.length; i++) {
        ttstamp += fb_dtsg.charCodeAt(i);
    }
    var revision = getFrom(html, 'revision":', ",");
    default_body = () => ({
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

// Hàm xử lý POST form
function post_form(url, form, opt) {
    return instance.post(url, {
        body: new URLSearchParams({
            ...default_body(),
            ...form,
        }).toString(),
        headers: {
            cookie,
            "content-type": "application/x-www-form-urlencoded",
        },
        ...opt,
    });
}

// Hàm lấy thông tin từ chuỗi
function getFrom(str, startToken, endToken) {
    var start = str.indexOf(startToken) + startToken.length;
    if (start < startToken.length) return "";

    var lastHalf = str.substring(start);
    var end = lastHalf.indexOf(endToken);
    if (end === -1) {
        throw Error("Could not find endTime `" + endToken + "` in the given string.");
    }
    return lastHalf.substring(0, end);
}

// Hàm xử lý POST form data
function post_form_data(url, form, opt) {
    form = {
        ...form,
        ...default_body(),
    };
    let form_data = new FormData();

    for (let prop in form) form_data.append(prop, form[prop]);

    return instance.post(url, {
        body: form_data,
        headers: {
            cookie,
            ...form_data.getHeaders(),
        },
        ...opt,
    });
}

// Hàm lấy danh sách bạn bè
function get_all_fr() {
    let form = {
        viewer: c_user,
    };
    return post_form_data("https://www.facebook.com/chat/user_info_all", form)
        .then((res) => Object.keys(JSON.parse(res.body.replace("for (;;);", "")).payload));
}

// Hàm thêm thành viên vào nhóm
function add_members_to_group(group_id, ids) {
    let variables = {
        input: {
            attribution_id_v2: "GroupsCometMembersRoot.react,comet.group.members,via_cold_start," +
                (Date.now() - 1000 * 60) + ",491596,,,",
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

// Hàm lấy thông tin proxy ngẫu nhiên
function random_proxy() {
    let list = fs.readFileSync("proxies.txt", "utf8").split("\n");
    let [, username, password, host, port] = list[Math.floor(Math.random() * list.length)]
        .trim().match(/(.*):(.*?)@(.*?):(.*?)$/);

    return {
        responseType: "json",
        agent: {
            https: new require("https").Agent({
                proxy: {
                    host,
                    port,
                    auth: `${username}:${password}`,
                },
                rejectUnauthorized: true,
            }),
        },
    };
}

main();