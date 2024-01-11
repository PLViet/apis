const config = {
    name: "duyetbox",
    aliases: [],
    permissions: [2],
    description: "Duyệt box ",
    usage: "<id>",
    credits: "BraSL",
    isAbsolute: true
}
import { join } from 'path';
import fs from 'fs-extra'
 const dataPath = join(global.assetsPath, '..','..',"/handlers/cache/duyetbox.json")
function onCall({ message, args }) {
 
     const { Threads, Users } = global.controllers;
	const { threadID, messageID, senderID } = message;
	let data = JSON.parse(fs.readFileSync(dataPath));
	let msg = "";
    let idBox = (args[0]) ? args[0] : threadID;
    if (args[0] == "list") {
     msg = "DANH SÁCH CÁC BOX ĐÃ DUYỆT!";
    	let count = 0;
    	// for (e of data) {
       
     //   // let info = (await api.getThreadInfo(e)).name
    	// 	msg += `\n\n${count+=1} ○ => TID: ${e}`;
      
    	// }
    	message.reply(JSON.stringify(data, 'utf8', 4));
    }
    else if (args[0] == "del") {
    	idBox = (args[1]) ? args[1] : threadID;
    	if (isNaN(parseInt(idBox))) return message.reply("Không phải một con số");
    	if (!data.includes(idBox)) return message.reply("Box không được duyệt từ trước!");
      data.splice(data.indexOf(idBox), 1);
        console.log(data.includes('--------\n' + idBox))
    		fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));
    	message.reply("Box đã bị gỡ khỏi danh sách được phép dùng bot")
    }
    else if (isNaN(parseInt(idBox))) message.reply("ID bạn nhập không hợp lệ");
    else if (data.includes(idBox)) message.reply(`ID ${idBox} đã được phê duyệt từ trước!`);
   	else {
      data.push(idBox);
   			fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));
   			message.reply(`» Phê duyệt thành công box:\n${idBox}`);
       
     return message.reply("» BOX ĐÃ ĐC ADMIN BOT PHÊ DUYỆT!\n» sử dụng bot vui vẻ");
      
        
   		if (data.includes(idBox)) return message.reply("Đã có lỗi xảy ra, đảm bảo rằng id bạn nhập hợp lệ và bot đang ở trong box!");
   		
    }
}

export default {
    config,
    onCall
}
