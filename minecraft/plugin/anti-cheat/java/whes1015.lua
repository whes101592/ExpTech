mc.listen("onServerStarted", load);
mc.listen("onJoin", onJoin);
mc.listen("onLeft", onLeft);
mc.listen("onRespawn", onRespawn);
mc.listen("onPlayerDie", onPlayerDie);
mc.listen("onUseItem", onUseItem);
mc.listen("onUseItemOn", onUseItemOn);
mc.listen("onTakeItem", onTakeItem);
mc.listen("onDropItem", onDropItem);
mc.listen("onDestroyBlock", onDestroyBlock);
mc.listen("onPlaceBlock", onPlaceBlock);
mc.listen("onContainerChangeSlot", onContainerChangeSlot);

function load() {
    logger.log('whes1015 成功加载！版本：1.0.0');
    file.writeLine("whes1015.txt", system.getTimeStr() + " ServerStarted!");
}

function onJoin(player) {
    file.writeLine("whes1015.txt", system.getTimeStr() + " onJoin " + player.realName + " OS " + player.getDevice().os);
}

function onLeft(player) {
    file.writeLine("whes1015.txt", system.getTimeStr() + " onLeft " + player.realName);
}

function onRespawn(player) {
    file.writeLine("whes1015.txt", system.getTimeStr() + " onRespawn " + player.realName);
}

function onPlayerDie(player) {
    file.writeLine("whes1015.txt", system.getTimeStr() + " onPlayerDie " + player.realName);
}

function onUseItem(player, item) {
    file.writeLine("whes1015.txt", system.getTimeStr() + " onUseItem " + player.realName + " Item " + item.name);
}

function onUseItemOn(player, item, block) {
    file.writeLine("whes1015.txt", system.getTimeStr() + " onUseItemOn " + player.realName + " Item " + item.name + " Block " + block.name);
}

function onTakeItem(player, entity) {
    file.writeLine("whes1015.txt", system.getTimeStr() + " onTakeItem " + player.realName + " Entity " + entity.name);
}

function onDropItem(player, item) {
    file.writeLine("whes1015.txt", system.getTimeStr() + " onDropItem " + player.realName + " Item " + item.name);
}

function onDestroyBlock(player, block) {
    file.writeLine("whes1015.txt", system.getTimeStr() + " onDestroyBlock " + player.realName + " Block " + block.name);
}

function onPlaceBlock(player, block) {
    file.writeLine("whes1015.txt", system.getTimeStr() + " onPlaceBlock " + player.realName + " Block " + block.name);
}

function onContainerChangeSlot(player, container, slotNum, isPutIn, item) {
    file.writeLine("whes1015.txt", system.getTimeStr() + " onContainerChangeSlot " + player.realName + " Container " + container.name + " SlotNum " + slotNum + " IsPutIn " + isPutIn + " Item " + item.name);
}