import "reflect-metadata";
import {
    JsonController, Get, Post, Param, Body, Req, Res, QueryParam, Authorized, Put, Controller
} from "routing-controllers";
import {Request, Response} from "express";
const bodyParser = require('body-parser');
import {Service} from "typedi";

import * as util from "util";

import {ErrorCodes} from "../../constants/errorCodes";

import {isNullOrUndefined} from "util";
import {AuthorRepository} from "./authorRepository";
import {Autor} from "../../entities/autors";
import {ResponseFormatter} from "../../helper/responseFormatter";


@Service()
@Controller()
export class AuthorController {

    constructor(private repo: AuthorRepository) {
    }

    /**
     * @apiDefine AuthorRecord
     * @apiSuccess {Object[]} author.  List of author objects.
     * @apiSuccess {Number} author.id The unique id of an author.
     * @apiSuccess {String} author.name Specifies the author name.
     * @apiSuccess {Number} author.wikidataUri Specifies the wikidata author uri.
     */

    /**
     * @api {get} /api/authors/:authorId Get an Author
     * @apiDescription Gets the author from a specified code.
     * @apiGroup General
     * @apiUse AuthorRecord
     *
     * @apiSuccessExample {json} Success-Response:
     *     HTTP/1.1 200 OK
     *
     *      {
     *          "id": 1,
     *          "name": "Mihai Eminescu",
     *          "wikidataUri": "https://www.wikidata.org/wiki/Q184935"
     *      }
     *
     *
     */
    @Get("/authors/:authorId")
    getOneById(
        @Param("authorId") authorId: number,
        @Res() response: any,
        @Req() request: any
    ): Promise<Autor> {
        return AuthorRepository.findOneById(authorId)
            .then(
                (data) => {
                    return Promise.resolve(ResponseFormatter.response(response, request, data, 200, 'author'));
                })
            .catch((err) => {
                //console.log(util.inspect(err));
                throw {error: ErrorCodes.resourceNotFound};
                //return ErrorController.processError(ErrorCodes.resourceNotFound, request, response);
            });
    }

    @Get("/authors")
    getAll(
        @QueryParam("pageNumber") pageNumber: number,
        @QueryParam("resultsPerPage") resultsPerPage: number,
        @Res() response: any,
        @Req() request: any
    ): Promise<Autor> {
        return AuthorRepository.findAll(pageNumber, resultsPerPage)
            .then(
                (data) => {
                    return Promise.resolve(ResponseFormatter.response(response, request, data, 200, 'authors'));
                })
            .catch((err) => {
                //console.log(util.inspect(err));
                throw {error: ErrorCodes.resourceNotFound};
                //return ErrorController.processError(ErrorCodes.resourceNotFound, request, response);
            });
    }

    @Authorized()
    @Post("/authors")
    save(
        @Body() autor: Autor,
        @Res() response: any,
        @Req() request: any
    ): Promise<Autor> {
        return AuthorRepository.save(autor)
            .then(
                (data) => {
                    return Promise.resolve(ResponseFormatter.response(response, request, data, 201, 'author'));
                })
            .catch((err) => {
                //console.log(util.inspect(err));
                throw {error: ErrorCodes.resourceNotValid};
                //return ErrorController.processError(ErrorCodes.resourceNotFound, request, response);
            });
    }

    @Authorized()
    @Put("/authors/:authorId")
    update(
        @Param("authorId") authorId: number,
        @Body() autor: Autor,
        @Res() response: any,
        @Req() request: any
    ): Promise<Autor> {
        autor.id = authorId;
        return AuthorRepository.save(autor)
            .then(
                (data) => {
                    return Promise.resolve(ResponseFormatter.response(response, request, data, 202, 'author'));
                })
            .catch((err) => {
                //console.log(util.inspect(err));
                throw {error: ErrorCodes.resourceNotValid};
                //return ErrorController.processError(ErrorCodes.resourceNotFound, request, response);
            });
    }

}