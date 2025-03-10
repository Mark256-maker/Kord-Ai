const yts = require("yt-search");

module.exports = {
  usage: ["yts", "yt-search"],
  description: "get the youtube info for given query",
  commandType: "Search",
  emoji: "📽️",
  
  execute: async (sock, m, args, kord) => {
    try {
      if (!args[0]) return kord.reply("_Provide A Query!_");
      
      var q = args.join(" ");
      var res = await yts(q);
      const sendResult = async (index) => {
        if (index >= res.videos.length) {
          return kord.reply("No more results available.");
        }
        
        const video = res.videos[index];
        const videoTitle = video.title.replace(/[<>:"/\\|?*\x00-\x1F]/g, '');
        const randomCode = Math.floor(Math.random() * 90) + 10;
        
        let resultText;
        
        if (index === 0) {
          resultText = `╭━━━ᆫ YTS SEARCHᄀ━━
┃ ⎆  _*Query:*_ ${q}
┃ ⎆  _*Title:*_ ${videoTitle}
┃ ⎆  _*YT Url:*_ ${video.url}
┃ ⎆  _*Description:*_ ${video.description}
┃ ⎆  _*Author:*_ ${video.author.name}
┃ ⎆  _*Duration:*_ ${video.duration.timestamp}
┃ ⎆  _*Date Posted:*_ ${video.ago}
╰━━━━━━━━━━━━━━━━ 
_*REPLY ${randomCode} or "next" to get the next result*_`;
        } else {
          resultText = `╭━━━ᆫ RESULT ${index+1}ᄀ━━
┃ ⎆  _*Title:*_ ${videoTitle}
┃ ⎆  _*YT Url:*_ ${video.url}
┃ ⎆  _*Description:*_ ${video.description}
┃ ⎆  _*Author:*_ ${video.author.name}
┃ ⎆  _*Duration:*_ ${video.duration.timestamp}
┃ ⎆  _*Date Posted:*_ ${video.ago}
╰━━━━━━━━━━━━━━━━ 
_*REPLY ${randomCode} or "next" to get the next result*_`;
        }
        
        var sent = await kord.sendImage(video.thumbnail, resultText);
        try {
          var response = await kord.getResponseText(sent, 10000);
          var rres = response.response
          if (response.response === randomCode.toString() || rres.toLowerCase() === "next") {
            await sendResult(index + 1);
          }
        } catch(e) {
          console.error(e);
        }
      };
      await sendResult(0);
    } catch (e) {
      console.error(e);
      kord.send(`${e}`);
    }
  }
};