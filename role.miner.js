/**********************************************
*
* file: role.miner.js
* date: 20.01.2023
* version: 0.1
*
**********************************************/

// miner sits on container next to source and harvest the source directly
// into the container from with all other roles take the energy
module.exports = {
    // a function to run the logic for this role
        // a function to run the logic for this role
    /** @param {Creep} creep */
    run: function (creep) {
        // get source
        let source = Game.getObjectById(creep.memory.sourceId);
        // find container next to source
        let container = creep.pos.findClosestByPath(FIND_STRUCTURES, {
            filter: s => s.structureType == STRUCTURE_CONTAINER
        });

        // if creep is on top of the container
        if (creep.pos.isEqualTo(container.pos)) {
            // harvest source
            creep.harvest(source);
        }
        // if creep is not on top of the container
        else {
            // move towards it
            creep.moveTo(container);
        }
    }
};