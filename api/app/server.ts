import {Book} from "./entities/books";

require('dotenv').config();

import "reflect-metadata"; // this shim is required
import {createExpressServer, useContainer, Action, Req, Res, useExpressServer} from "routing-controllers";

import {createConnection} from "typeorm";

const bodyParser = require('body-parser');

import {Container} from "typedi";

import * as util from "util";
import {Request, Response} from "express";

const serveStatic = require('serve-static');

import {ErrorCodes} from "./constants/errorCodes";
import {CustomErrorHandler} from "./helper/errorController";

import * as fs from "fs";
import {Autor} from "./entities/autors";
import {AuthorController} from "./modules/autors/authorController";
import {Currency} from "./entities/currencies";
import {Genre} from "./entities/genres";
import {Language} from "./entities/languages";
import {Publisher} from "./entities/publishers";
import {CurrencyController} from "./modules/currencies/currencyController";
import {GenreController} from "./modules/genres/genreController";
import {LanguageController} from "./modules/languages/languageController";
import {PublisherController} from "./modules/publishers/publisherController";
import {BookController} from "./modules/books/bookController";

/**
 * Setup routing-controllers to use typedi container.
 */
useContainer(Container);

createConnection({
    type: "mysql",
    host: process.env.MYSQL_HOST,
    port: 3306,
    username: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
    entities: [
        Autor, Book, Currency, Genre, Language, Publisher
    ],
    synchronize: false,
    dropSchema: false,
    logging: ["query", "error"],
    //logging: ["error"],
}).catch(error => {
    console.error('Error on connecting to the database!' + util.inspect(error));
    process.exit();
});

console.log(`Worker has been started`);

let helmet = require('helmet');

const app = createExpressServer();
app.use(helmet());

app.use(bodyParser.json({limit: '20mb'}));
app.use(bodyParser.urlencoded({limit: '20mb', extended: true}));
useExpressServer( app,
    {
        authorizationChecker: (action: Action, role: any) => {
            return Promise.resolve(true);
        },

        routePrefix: "/api",
        defaultErrorHandler: false,
        controllers: [
            AuthorController, CurrencyController, GenreController, LanguageController, PublisherController, BookController
            //UserController, PartnerTypeController, SupplierPartnerAccessController, LanguageController, CountryController, StateController, CityController, PartnerCustomerController, DrivingLicenceController, IdentityDocumentController
        ], // we specify controllers we want to use
        middlewares:
            [
                CustomErrorHandler
            ]

    });


app

    .get('/', function(req, res){
        res.send('Hello World');
    })

    .get('/test', function(req, res){
        res.send('Test Address is working.. again');
    })

    .listen(process.env.LISTENING_PORT, 'localhost');


module.exports = app;