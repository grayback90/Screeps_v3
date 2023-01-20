/**********************************************
*
* file: prototype.tower.js
* date: 20.01.2023
* version: 0.1
*
* funtions: logic for all towers to find
*           and attack enemies
*
**********************************************/

// create a new function for StructureTower
StructureTower.prototype.defend =
    function () {

        // find any hostile creep
        target = creep.pos.findClosestByRange(FIND_HOSTILE_CREEPS);

        // find Healer
        targetHeal = creep.pos.findClosestByRange(FIND_HOSTILE_CREEPS, {
            filter: function(object) {
                return object.getActiveBodyparts(HEAL) > 0;
            }
        });

        // if one is found...
        if (targetHeal != undefined) {
            // ...FIRE!
            this.attack(targetHeal);
        }
        else {
          // ...FIRE!
          this.attack(target);
        }
};