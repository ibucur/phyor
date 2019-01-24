'use strict';
import {isObject, isUndefined} from "util";

require('dotenv').config();

async function awaitConfigurationChecking() {
    return new Promise((resolve, reject) => {
        if (!process.env.PROCESS_TYPE || !process.env.NODE_ENV || !process.env.CHILD_PROCESSES_NO || !process.env.LISTENING_PORT || !process.env.MYSQL_HOST || !process.env.MYSQL_USER || !process.env.MYSQL_PASSWORD || !process.env.MYSQL_DATABASE || !process.env.TOKEN_SECRET) {

            console.log("");
            console.log("CONFIGURATION ERROR! Please make sure the .env file is created having the proper configuration variables.");
            console.log("");
            console.log("CONFIGURATION FILE LOCATION: .env file location is project root folder.");
            console.log("");
            console.log("Configuration example:");
            console.log("PROCESS_TYPE=server");
            console.log("NODE_ENV=DEVELOPMENT");
            console.log("CHILD_PROCESSES_NO=2");
            console.log("LISTENING_PORT=4000");
            console.log("MYSQL_HOST=127.0.0.1");
            console.log("MYSQL_USER=phyor");
            console.log("MYSQL_PASSWORD=phyor");
            console.log("MYSQL_DATABASE=phyor");
            console.log("TOKEN_SECRET=anything_which_is_a_succession_of_characters_used_to_encode_the_tokens");
            console.log("");

            resolve(false);
        }
        else resolve(true);
    });

}
awaitConfigurationChecking()
    .then(async (configOk) => {
        if (!(await configOk)) {
            throw {error: "configuration file missing or incomplete"};
        }
        return configOk;
    })
    .then((configOk) => {

        function startMaster() {
            console.log(`Starting THREADS CONTROLLER process using Throng!`);
        }

        function startWorker(id: number) {
            require("./app/server");
        }

        //Not needed for testing purpose.
        //enable it only in production mode

        if (process.env.NODE_ENV == "PRODUCTION") {
            const throng = require('throng');
            const numCPUs = (!isUndefined(process.env.CHILD_PROCESSES_NO) && parseInt(process.env.CHILD_PROCESSES_NO) > 0?process.env.CHILD_PROCESSES_NO:require('os').cpus().length);
            if (configOk) {
                throng({
                    workers: numCPUs,
                    //workers: 8,
                    grace: 1000, //establish a grace period before the process is respawned.
                    lifetime: 100000, // ms to keep cluster alive (Infinity)
                    master: startMaster,
                    start: startWorker
                });
            }
        }
        else {
            startWorker(1);
        }

    })
    .catch((err) => {
        console.log(err);
        process.emit("SIGHUP");
        process.emit("SIGTERM");
    });




/**
 * Exports the throng module close server functionality to be used within all tests
 */
exports.closeServer = function(){
    //if (isObject(process)) process.send("SIGTERM");
    //throng.send("SIGTERM");
    //throng.forceKill();
};

process.on('SIGTERM', () => {
    console.log(`Worker exiting...`);
    process.exit();
});

process.on('SIGHUP', () => {
    console.log(`Exiting...`);
    process.exit();
});

process
    /*.on('exit', function(code) {
        return console.log(`About to exit with code ${code}`);
    })*/
    .on('unhandledRejection', (reason, p) => {
        console.error(reason, 'Unhandled Rejection at Promise', p);
    })
    .on('uncaughtException', err => {
        console.error((new Date).toUTCString() + ' uncaughtException:', err.message);
        console.error(err.stack);
        console.error(err, 'Uncaught Exception thrown');
        process.exit(1);
    });