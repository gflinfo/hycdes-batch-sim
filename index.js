var batchRunner = {
    enums : {
        equipId : {
            default : -1,

            silencer : 11,
            vfl : 12,
            iti : 13,
            eot : 14,
            rmr : 15,
            peq : 41,

            hp : 21,
            hv : 22,
            ap : 23,
            buckshot : 24,
            slug : 25,
            m1022 : 26,
            slap : 27,
            birdshot : 28,

            xexo : 31,
            texo : 32,
            armorplate : 33,
            cape : 34,
            ammobox : 35,
            chip : 36,
        }
    },
    settings : {
        stars : [],
        excludeDollIds : [], // dolls to exclude. specified in dropdown values.
        equips: [ // one for each acc slot.
            [],
            [],
            [],
        ],
        position: 7, // note we use CN notation here.
        simSettings:{
            enemyEva: [],
            enemyArmor: [],
        },
        runCount: 100,
    },
    initSettings : function () {

        // clear all settings
        this.settings.stars.length = 0;
        this.settings.excludeDollIds.length = 0;
        this.settings.equips.length = 3;
        this.settings.equips.forEach(a => a.length = 0);
        this.settings.position = 7;
        this.settings.simSettings.enemyEva.length = 0;
        this.settings.simSettings.enemyArmor.length = 0;

        this.customSettings(this.settings, this.enums);
        console.debug(this.settings);
    },
    // overwrite to provide your own settings.
    // defaults to a quick run.
    customSettings : function (settingsObj, enums) {
        // init default values
        this.settings.stars.push(2);

        this.settings.equips[0].push(this.enums.equipId.vfl);
        this.settings.equips[1].push(-1);
        this.settings.equips[2].push(this.enums.equipId.chip);
        settingsObj.simSettings.enemyArmor = [0];
        settingsObj.simSettings.enemyEva = [0];
        settingsObj.runCount = 5;
    },

    setPosition : function (position) {

        // if true, this means it's already selected.
        if (num_pickblock === position) return;

        pickBlock(position)
    },

    // slot = 1 or 2 or 3.
    // return true on success. false on equipId not found.
    setEquip : function (slot, equipId) {
        if (equipId === -1) return true;

        document.getElementById('icon-equip' + slot).click();
        var equipIndex = Array.from(document.getElementById('select_equip').options)
            .find(a => a.value == equipId);

        if (equipIndex) { // undefined === not found
            document.getElementById('select_equip').selectedIndex = equipIndex;
        } else {
            return false;
        }
        changePreview()
        return true;
    },
    setGunType : function () {
        pickGunType(2);
    },
    setDollIndex : function (dollIndex, accId, ammoId, bodyId) {

        console.debug("Equips set to: " + accId + ", " + ammoId + ", " + bodyId);

        document.getElementById('select_tdoll').selectedIndex = dollIndex					// select current tdoll
        changePreview(1)																	// update UI from previous line

        // select scope
        if (!this.setEquip(1, accId)) {
            console.debug("Setting slot 1 to id " + accId + " failed.");
            return false;
        }
        if (!this.setEquip(2, ammoId)) {
            console.debug("Setting slot 2 to id " + ammoId + " failed.");
            return false;
        }
        if (!this.setEquip(3, bodyId)) {
            console.debug("Setting slot 3 to id " + bodyId + " failed.");
            return false;
        }

        addTdoll();
        var dollName = document.getElementById('select_tdoll').options[dollIndex].text;
        console.debug("Doll adding success. Name: " + dollName);
        return true;
    },
    execute : function () {
        this.setPosition(this.settings.position);
        this.setGunType();
        dataSet = []

        // hmm this is not ideal, but i'll leave settings combinations for next time.
        this.settings.simSettings.enemyEva.forEach(eva => {
            console.debug(`Enemy evasion has been set to ${eva}`)
            document.getElementById("enemy_eva").value = eva

            this.settings.simSettings.enemyArmor.forEach(arm => {
                console.debug(`Enemy armor has been set to ${arm}`)
                document.getElementById("enemy_arm").value = eva
    
                // Loop stars
                this.settings.stars.forEach(star => {
                    changeStar(star);

                    // Loop through every available doll.
                    for (i = 0; i < document.getElementById('select_tdoll').options.length; i++) {
                        console.debug("Adding doll at index " + i);
        
                        this.settings.equips[0].forEach(accId => {
                            this.settings.equips[1].forEach(ammoId => {
                                this.settings.equips[2].forEach(bodyId => {
                                    this.setDollIndex(i, accId, ammoId, bodyId)

                                    // record result
                                    getResult(this.settings.runCount,'damage')

                                    var dollTestOutput = {
                                        name : document.getElementById('select_tdoll').options[i].text,	// tdoll name
                                        damage : totaldamage_buffer,											// overall damage
                                        equips : set_equip,														// equips in an array
                                        fairy : fairy_no,														// the fairy
                                        fairyskill : document.getElementById('fairyskill_active').checked,		// fairy skill on?
                                        talent : talent_no,														// fairy talent
                                        eva : enemy_eva,														// enemy evasion
                                    };

                                    var previousTime = 0.0
                                    Set_Data.get(0).forEach(d => {
                                        var currentTime = parseFloat(d[0])
                                        if (previousTime < 6 && currentTime >= 6) {												// 6  second variable
                                            dollTestOutput.t6 = d[1]
                                        } else if (previousTime < 10 && currentTime >= 10) {									// 10 second variable
                                            dollTestOutput.t10 = d[1]
                                        } else if (previousTime < 16 && currentTime >= 16) {									// 15 second variable
                                            dollTestOutput.t15 = d[1]
                                        }
                                        previousTime = currentTime
                                    })

                                    dataSet.push(dollTestOutput)
                                });
                            });
                        });
                    }
                })
            });
        });

        console.log(dataSet.map(d => [d.name, d.equips[0], d.equips[1], d.equips[2], d.fairy, d.eva, d.t6, d.t10, d.t15, d.damage].join("	")).join("\n"))
    },
};
