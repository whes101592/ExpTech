var ver = "1.1.0"
/*
cht ***
部分地區可能無法使用黑名單功能
黑名單數據來自 nukkit powernukkit 類型的服務器
目前BDS版本不會向資料庫發送數據(因為BDS給的數據太少了，而且JavaScript又是單線程，不好做出外掛檢測)
原理:
透過在其他服務器檢測各類外掛，回報數據到資料庫
當玩家加入時會向服務器請求最新的一份黑名單
如果在內則踢出
封禁詳情:
所有封禁事件都會透過 Webhook 傳送到 Discord
https://discord.gg/BAWM9dfcBH

en ***
The blacklist function may not be available in some regions
Blacklist data comes from nukkit powernukkit type server
The current BDS version does not send data to the database (because BDS gives too little data, and JavaScript is single-threaded, it is not easy to make plug-in detection)
principle:
By detecting various plug-ins on other servers, report data to the database
When a player joins, the latest blacklist will be requested from the server
Kick out if inside
Ban details:
All banned events will be sent to Discord via Webhook
https://discord.gg/BAWM9dfcBH
*/
var code = "cht";
var cache;
var list=0;

mc.listen("onServerStarted", load);
mc.listen("onJoin", onJoin);

function load() {
    colorLog("yellow", 'Anti-cheat-whes1015 成功加载！版本 ：' + ver);
}

function onJoin(player) {
    if(list==0){
        list=1
    cache = player
    network.httpPost("http://220.134.162.44:11000/register", player.xuid, "application/x-www-form-urlencoded", http)
    setTimeout(list=0,5000)
    }else{
        if (code == "en") {
            colorLog("yellow", 'The anti-cheat system is reviewing the data of the previous player, please queue to enter the game! Version：' + ver);
            mc.broadcast("§b"+player.realName + " Kicked out by the anti-cheat system Reason: The anti-cheat system is reviewing the data of the previous player, please queue to enter the game", 0)
            player.kick("§bThe anti-cheat system is reviewing the data of the previous player, please queue to enter the game");
        } else if (code == "cht") {
            colorLog("yellow", '反作弊系統正在審核上一個玩家的數據 請排隊進入遊戲！ 版本 ：' + ver);
            mc.broadcast("§b"+player.realName + " 被反作弊系統踢出 原因：反作弊系統正在審核上一個玩家的數據 請排隊進入遊戲", 0)
            player.kick("§b反作弊系統正在審核上一個玩家的數據 請排隊進入遊戲");
        }  
    }
}

function http(status, result) {
    var jsoncache = JSON.parse(result);
    if (jsoncache["data"] != "null") {
        if (code == "en") {
            colorLog("yellow", 'Blacklisted players detected! Version：' + ver);
            mc.broadcast("§c"+cache.realName + " Kicked out by the anti-cheat system Reason: Cloud blacklist", 0)
            cache.kick("§cYou have been included in the cloud blacklist");
        } else if (code == "cht") {
            colorLog("yellow", '檢測到黑名單玩家 ！版本 ：' + ver);
            mc.broadcast("§c"+cache.realName + " 被反作弊系統踢出 原因：雲端黑名單", 0)
            cache.kick("§c您已被列入雲端黑名單");
        }
    }
}