/**********************************************
*
* file: prototype.spawn.js
* date: 19.01.2023
* version: 0.2
*
* funtions: logic for spawning normal and
*           special creeps and storing
*           all roles
*
**********************************************/

const { max } = require("lodash");

var listOfRoles = ['harvester', 'upgrader', 'builder', 'repairer', 'wallrepairer'];

// create a new function for StructureSpawn
StructureSpawn.prototype.spawnCreepsIfNecessary =
    function () {
        /** @type {Room} */
        let room = this.room;
        // find all creeps in room
        /** @type {Array.<Creep>} */
        let creepsInRoom = room.find(FIND_MY_CREEPS);
        // get current RCL (RoomControlLevel)
        // Game.spawns.Spawn1.room.controller.level
        let rcl = room.controller.level;

        // count the number of creeps alive for each role in this room
        // _.sum will count the number of properties in Game.creeps filtered by the
        //  arrow function, which checks for the creep being a specific role
        /** @type {Object.<string, number>} */
        let numberOfCreeps = {};
        for (let role of listOfRoles) {
            numberOfCreeps[role] = _.sum(creepsInRoom, (c) => c.memory.role == role);
        }
        let max_ = {};
        max_['harvester'] = 2;
        max_['upgrader'] = 1;
        max_['builder'] = 1;
        max_['repairer'] = 2;
        max_['wallrepairer'] = 1;
        //max_['miner'] = 1;
        //max_['lorry'] = 1;

        let maxEnergy = room.energyCapacityAvailable;
        let name = undefined;

        // if no harvesters are left AND either no miners or no lorries are left
        //  create a backup creep
        if (numberOfCreeps['harvester'] == 0) {
            // create a harvester because it can work on its own
            name = this.createCustomCreep(room.energyAvailable, 'harvester');
        }

        // if none of the above caused a spawn command check for other roles
        if (name == undefined) {
            for (let role of listOfRoles) {
                if (numberOfCreeps[role] < max_[role]) {
    	    	    name = this.createCustomCreep(maxEnergy, role);
                    break;
                }
            }
        }

        // print name to console if spawning was a success
        if (name != undefined && _.isString(name)) {
            console.log(this.name + " spawned new creep: " + name + " (" + Game.creeps[name].memory.role + ")");
            for (let role of listOfRoles) {
                console.log(role + ": " + numberOfCreeps[role] + "/" + max_[role]);
            }
        }
    };

// create a new function for StructureSpawn to create a custom creep
StructureSpawn.prototype.createCustomCreep =
    function (energy, roleName) {
        // create a balanced body as big as possible with the given energy
        var numberOfParts = Math.floor(energy / 200);
        // make sure the creep is not too big (more than 50 parts)
        numberOfParts = Math.min(numberOfParts, Math.floor(50 / 3));
        var body = [];
        for (let i = 0; i < numberOfParts; i++) {
            body.push(WORK);
        }
        for (let i = 0; i < numberOfParts; i++) {
            body.push(CARRY);
        }
        for (let i = 0; i < numberOfParts; i++) {
            body.push(MOVE);
        }

        // create creep with the created body and the given role
        return this.createCreep(body, undefined, { role: roleName, working: false });
    };