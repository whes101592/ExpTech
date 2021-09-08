var ver = "21w34b"
var err = ""
var help = ""
//此程式依靠Bug運作，請勿隨意修改

//#region 依賴項
const Discord = require('discord.js');
require('discord-reply');
const client = new Discord.Client();
const { Authflow, Titles } = require('prismarine-auth')
const fetch = require("node-fetch");
//#endregion

//#region 變數宣告
var fs = require('fs');
var token = "";
var json;//重要參數
var configpath = '/home/pi/discordbot/config.txt'
var xboxcodepath = '/home/pi/discordbot/xbox-code.txt'
var cachepath = '/home/pi/discordbot/xbox-code.txt'
var xboxcodepath = '/home/pi/discordbot/xbox-code.txt'
//#endregion

//#region 取 token
fs.readFile(configpath, function (error, data) {
    json = JSON.parse(data.toString());
    token = json["token"];
    err = json["err"];
    help = json["help"];
    client.login(token);
})
//#endregion

//#region 初始化
client.once('ready', () => {
    console.log('Ready!');
});
//#endregion

// Message Event
client.on('message', m => {
    try {
        if (m.channel.type == "dm") {
            try {
                if (m.content.includes("現在") && m.content.includes("時間")) {
                    //#region HTTP 時間 GET
                    fetch("http://quan.suning.com/getSysTime.do", { method: 'GET' })
                        .then(res => {
                            return res.text();
                        }).then(result => {
                            var jsoncache = JSON.parse(result);
                            sendR(jsoncache["sysTime2"]);
                        });
                    //#endregion
                } else if (m.content.startsWith("$ver")) {
                    //#region 版本
                    sendR("版本: " + ver + " 配置文件版本: " + configver)
                    //#endregion
                } else if (m.content.startsWith("$err")) {
                    //#region 錯誤代碼列表
                    sendR("錯誤代碼列表" + err)
                    //#endregion
                } else if (m.content.startsWith("$ping")) {
                    sendR(`🏓 延遲 "+prefix+"{Date.now() - m.createdTimestamp} ms - API 調用延遲 "+prefix+"{Math.round(client.ws.ping)} ms`);
                } else if (m.content.startsWith("$help")) {
                    sendR("```" + help + "```")
                }
            } catch (error) {
                sendR("[Error:0003] 輸入 $err 查看詳情" + error)
            }
        } else {
            try {
                if (m.content == "" || m.content.startsWith("@") == true || m.content.startsWith("#") == true || m.author.bot == true) return
                if (m.content.includes("現在") && m.content.includes("時間")) {
                    //#region HTTP 時間 GET
                    fetch("http://quan.suning.com/getSysTime.do", { method: 'GET' })
                        .then(res => {
                            return res.text();
                        }).then(result => {
                            var jsoncache = JSON.parse(result);
                            sendR(jsoncache["sysTime2"]);
                        });
                    //#endregion
                } else if (m.content.startsWith("$ver")) {
                    //#region 版本
                    sendR("版本: " + ver + " 配置文件版本: " + configver)
                    //#endregion
                } else if (m.content.startsWith("$err")) {
                    //#region 錯誤代碼列表
                    sendR("錯誤代碼列表" + err)
                    //#endregion
                } else if (m.content.startsWith("$ping")) {
                    //#region 延遲
                    sendR(`🏓 延遲 "+prefix+"{Date.now() - m.createdTimestamp} ms - API 調用延遲 "+prefix+"{Math.round(client.ws.ping)} ms`);
                    //#endregion
                } else if (m.content.startsWith("$認證")) {
                    //#region 認證
                    // const flow = new Authflow('whes1015', './caches/' + m.author.id, { authTitle: Titles.ExpTech, relyingParty: 'http://xboxlive.com' })
                    //  flow.getXboxToken().then(console.log)

                    var urlxuid = "https://xbl-api.prouser123.me/xuid/" + m.content.replace("$認證", "").replace(" ", "")
                    fetch(urlxuid, { method: 'GET' })
                        .then(res => {
                            return res.text();
                        }).then(result => {
                            var jsoncache2 = JSON.parse(result);
                            if (result.includes("404")) {
                                sendR("請輸入正確 Xbox 玩家代號 :warning:")
                            } else {
                                if (jsoncache2["xuid"] == null) {
                                    sendR("請輸入正確 Xbox 玩家代號 :warning:")
                                } else {
                                    try {
                                        const user = client.users.cache.get(m.author.id);
                                        user.send("隱私聲明 :arrow_down:\n歡迎使用 ExpTech 認證服務 :white_check_mark: \n本服務之所有數據均來自 Microsoft 官方 :o: \n#註 Xbox 為 Microsoft 旗下服務\n合法途徑取得\n絕不存在任何盜號風險 :closed_lock_with_key: \n如有任何問題歡迎詢問\n或上 Microsoft API 2.0 官網查詢\n向 Microsoft 申請取用的玩家數據如下：\n1.玩家代號\n2.玩家 XUID\n數據提供 Microsoft REST API\n2021.8.17\n.");
                                        const doAuth = async () => {
                                            const flow = await new Authflow('whes1015', './caches/' + m.author.id + jsoncache2["xuid"], { authTitle: Titles.ExpTech, relyingParty: 'http://xboxlive.com' })
                                            setTimeout(function () {
                                                fs.readFile(xboxcodepath, function (error, data) {                                          
                                                        sendR("請使用驗證碼 " + data.toString().replace(" to authenticate.", "").replace("To sign in, use a web browser to open the page https://www.microsoft.com/link and enter the code ", "") + "\n在 https://www.microsoft.com/link 登入\n完成驗證")                                           
                                                })
                                            }, 3000);
                                            var x = await flow.getXboxToken()
                                            doAuth()
                                            if (x["userXUID"] == jsoncache2["xuid"]) {

                                                /* if (JSON.parse(data)[jsoncache2["xuid"] + "-data"] != null) {
                                                     sendR("認證失敗 :no_entry:\n帳號匹配成功 :white_check_mark:\n安全檢查不通過 :no_entry:\n原因:[" + JSON.parse(data)[jsoncache2["xuid"] + "-type"] + "]")
                                                 } else {*/
                                                sendR("認證成功 :white_check_mark:\n帳號匹配成功 :white_check_mark:\n安全檢查通過 :white_check_mark:\nXUID >> " + jsoncache2["xuid"])
                                                /* json2[m.author.id] = jsoncache2["xuid"]
                                                 fs.writeFile('C:/Users/whes1015/Desktop/discordbot/cache.txt', JSON.stringify(json2), function () {
                                                 })*/
                                                try {
                                                    if (json1["setname" + m.guild.id] == "false") return
                                                    m.member.setNickname(m.content.replace("$認證 ", "").replace("$認證", ""));
                                                } catch (error) {
                                                    send("[Error:0006] 輸入 " + "$err 查看詳情" + error)
                                                }
                                                // }
                                            } else {
                                                sendR("認證失敗 安全檢查不通過 :no_entry:\n原因:登入帳號名稱和輸入名稱不匹配")
                                            }
                                        }
                                    } catch (error) {
                                        send("[Error:0005] 輸入 " + "$err 查看詳情")
                                    }
                                }
                            }
                        }).catch(function (err) {
                            send("[Error:0004] 輸入 " + "$err 查看詳情")
                        });
                    //#endregion
                }
            } catch (error) {
                sendR("[Error:0002] 輸入 $err 查看詳情" + error)
            }
        }

    } catch (error) {
        m.channel.sendR("[Error:0001] 輸入 $err 查看詳情" + error)
    }

    //#region 訊息發送 回覆
    function sendR(e) {
        m.lineReply(e);
    }
    //#endregion
});


