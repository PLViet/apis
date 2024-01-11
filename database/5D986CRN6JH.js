
const config = {
    name: "ghichu",
    aliases: ["gc"],
    version: "1.1.2",
    description: "",
    usage: "",
    cooldown: 1,
    permissions: [2],
    credits: "BraSL",
    isAbsolute: true
}
import axios from 'axios';
import { statSync, mkdirSync, writeFileSync, readdirSync, readFileSync ,existsSync} from "fs";
import { join } from "path";
const PATH = join(global.pluginsPath, "commands")

async function onCall({ message, args, data }) {
  const { API } = global.config;
  const { threadID, senderID, mentions, messageReply, participantIDs,reply,type } = message;
  
  const folderCM = readdirSync(PATH)

  var name = args[0];
  var name1 = args[1]
    if (type == "message_reply") {
        var text = messageReply.body;
    }
    if(!text && !name) return reply('Vui lòng reply link muốn áp dụng code hoặc ghi tên file để up code lên api!');

    if(!text && name) {
      for (let i=0; i< folderCM.length; i++){
        const folder = readdirSync(PATH+ '/' +folderCM[i])
        //console.log(hhhh[i])
  if(folder.includes(args[0]+ '.js')){
    var code = readFileSync(
          `${PATH}/${folderCM[i]}/${args[0]}.js`,
          "utf-8");
     const data = (await axios.post(API + 'upcode', {
       code: code,
       token: 'hihihi'
     })).data
return reply(data.url) 
  }
        }
        return reply('Không tìm thấy mdl ' + args[0])
      
    }else if(text && name1) {
if (!existsSync(PATH+`/${args[0]}`)) {
    mkdirSync(PATH+`/${args[0]}`);
      }
const code = (await axios.get(text)).data
      writeFileSync(
        `${PATH}/${args[0]}/${name1}.js`,
        code,
        "utf-8");
      return reply(' Đã lưu code thành công mdl ' + name1 + ' về folder ' + args[0]) 
    }
}

export default {
    config,
    onCall
}
