batchRunner.customSettings = function (settingsObj, enums) {
    settingsObj.position = 1;

    // init default values
    settingsObj.stars.push(2);
    settingsObj.stars.push(3);
    settingsObj.stars.push(4);
    settingsObj.stars.push(5);
    settingsObj.stars.push(6);
    // 54 = M4A1. This doll is no longer with G&K.
    settingsObj.excludeDollIds.push(54);

    settingsObj.equips[0].push(enums.equipId.vfl);
    settingsObj.equips[0].push(enums.equipId.iti);
    settingsObj.equips[0].push(enums.equipId.eot);
    settingsObj.equips[1].push(-1);
    settingsObj.equips[2].push(enums.equipId.chip);

    for (k = 0; k <= 60; k = k + 10) {
        settingsObj.simSettings.enemyEva.push(k);
	  }
    settingsObj.simSettings.enemyArmor = [0];
    settingsObj.runCount = 100;
}
batchRunner.initSettings();
batchRunner.execute();
