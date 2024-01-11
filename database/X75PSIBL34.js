const fs = require("fs-extra");
const { utils } = global;

module.exports = {
  config: {
    name: "prefix",
    version: "1.3",
    author: "NTKhang",
    countDown: 5,
    role: 1,
    shortDescription: "Thay đổi prefix của bot",
    longDescription:
      "Thay đổi dấu lệnh của bot trong box chat của bạn hoặc cả hệ thống bot (chỉ admin bot)",
    category: "config",
    guide: {
      vi:
        "   {pn} <new prefix>: thay đổi prefix mới trong box chat của bạn" +
        "\n   Ví dụ:" +
        "\n    {pn} #" +
        "\n\n   {pn} <new prefix> -g: thay đổi prefix mới trong hệ thống bot (chỉ admin bot)" +
        "\n   Ví dụ:" +
        "\n    {pn} # -g" +
        "\n\n   {pn} reset: thay đổi prefix trong box chat của bạn về mặc định",
      en:
        "   {pn} <new prefix>: change new prefix in your box chat" +
        "\n   Example:" +
        "\n    {pn} #" +
        "\n\n   {pn} <new prefix> -g: change new prefix in system bot (only admin bot)" +
        "\n   Example:" +
        "\n    {pn} # -g" +
        "\n\n   {pn} reset: change prefix in your box chat to default",
    },
  },

  langs: {
    vi: {
      reset: "Đã reset prefix của bạn về mặc định: %1",
      onlyAdmin: "Chỉ admin mới có thể thay đổi prefix hệ thống bot",
      confirmGlobal:
        "Vui lòng thả cảm xúc bất kỳ vào tin nhắn này để xác nhận thay đổi prefix của toàn bộ hệ thống bot",
      confirmThisThread:
        "Vui lòng thả cảm xúc bất kỳ vào tin nhắn này để xác nhận thay đổi prefix trong nhóm chat của bạn",
      successGlobal: "Đã thay đổi prefix hệ thống bot thành: %1",
      successThisThread: "Đã thay đổi prefix trong nhóm chat của bạn thành: %1",
      myPrefix:
        "hey dawg my name is STAR\n ⚙️  System prefix is %1\n ⚙️  Your box chat prefix: %2",
    },
    en: {
      reset: "Your prefix has been reset to default: %1",
      onlyAdmin: "Only admin can change prefix of system bot",
      confirmGlobal:
        "Please react to this message to confirm change prefix of system bot",
      confirmThisThread:
        "Please react to this message to confirm change prefix in your box chat",
      successGlobal: "Changed prefix of system bot to: %1",
      successThisThread: "Changed prefix in your box chat to: %1",
      myPrefix:
        "hey dawg my name is STAR\n ⚙️  System prefix is %1\n ⚙️  Your box chat prefix: %2",
    },
  },

  onStart: async function ({
    message,
    role,
    args,
    commandName,
    event,
    threadsData,
    getLang,
    api,
  }) {
    if (!args[0]) return message.SyntaxError();

    if (args[0] == "reset") {
      // Reset the prefix in the data
      await threadsData.set(event.threadID, null, "data.prefix");

      // Use the default nickname when resetting the prefix
      const defaultNickname = "[ / ] • STAR"; // Change this to the desired default nickname

      // Log the user ID for debugging
      console.log("User ID:", event.senderID);

      // Change the nickname immediately for the user who triggered the command
      api.changeNickname(defaultNickname, event.threadID, event.senderID);

      // Send the reset message
      return message.reply(getLang("reset", global.GoatBot.config.prefix));
    }

    const newPrefix = args[0];
    const formSet = {
      commandName,
      author: event.senderID,
      newPrefix,
    };

    const confirmationMessage =
      args[1] === "-g"
        ? getLang("confirmGlobal")
        : getLang("confirmThisThread");

    const confirmationMes = await message.reply(
      confirmationMessage,
      (err, info) => {
        formSet.messageID = info.messageID;
        global.GoatBot.onReaction.set(info.messageID, formSet);
      }
    );

    // Unsend the confirmation message after 1 second
    setTimeout(async () => {
      await api.unsendMessage(confirmationMes.messageID);
    }, 1000);
  },

  onReaction: async function ({
    message,
    threadsData,
    event,
    Reaction,
    getLang,
    api,
  }) {
    const { author, newPrefix, setGlobal } = Reaction;
    if (event.userID !== author) return;

    const config = global.config || {};
    const nickNameBot = config.nickNameBot || "STAR"; // Default value if nickNameBot is not defined in config

    const newNickname = [ ${newPrefix} ] • ${nickNameBot};

    try {
      if (setGlobal) {
        global.GoatBot.config.prefix = newPrefix;
        fs.writeFileSync(
          global.client.dirConfig,
          JSON.stringify(global.GoatBot.config, null, 2)
        );
        // Change nickname after changing prefix
        api.changeNickname(
          newNickname,
          event.threadID,
          global.GoatBot.config.userID
        );
        const successMessage = getLang("successGlobal", newPrefix);

        // Send success message
        const successMes = await message.reply(successMessage);

        // Unsend the success message after 1 second
        setTimeout(async () => {
          api.unsendMessage(successMes.messageID);
        }, 1000);

        // Unsend the confirmation message after 1 second
        setTimeout(async () => {
          await api.unsendMessage(Reaction.messageID);
        }, 1000);

        return;
      } else {
        const threadInfo =
          (await threadsData.get(event.threadID, "userInfo")) || {}; // Default to an empty object if userInfo is undefined
        await threadsData.set(event.threadID, newPrefix, "data.prefix");

        // Use the default value "unknown" if the user's name is not available
        const participantName = threadInfo.userInfo
          ? threadInfo.userInfo.name
          : "unknown";

        // Change nickname after changing prefix
        api.changeNickname(newNickname, event.threadID, api.getCurrentUserID());

        const successMessage = getLang(
          "successThisThread",
          newPrefix,
          participantName
        );

        // Send success message
        const successMes = await message.reply(successMessage);

        // Unsend the success message after 1 second

        // Unsend the confirmation message after 1 second
        setTimeout(async () => {
          await api.unsendMessage(Reaction.messageID);
        });

        return;
      }
    } catch (error) {
      console.error("An error occurred:", error);
      return message.reply("An error occurred while processing your request.");
    }
  },

  onChat: async function ({ event, message, getLang }) {
    if (event.body && event.body.toLowerCase() === "prefix")
      return () => {
        return message.reply(
          getLang(
            "myPrefix",
            global.GoatBot.config.prefix,
            utils.getPrefix(event.threadID)
          )
        );
      };
  },
};