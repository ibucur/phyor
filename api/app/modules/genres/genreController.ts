import "reflect-metadata";
import {
    JsonController, Get, Post, Param, Body, Req, Res, QueryParam, Authorized, Put
} from "routing-controllers";
import {Request, Response} from "express";
const bodyParser = require('body-parser');
import {Service} from "typedi";

import * as util from "util";

import {ErrorCodes} from "../../constants/errorCodes";

import {isNullOrUndefined} from "util";
import {GenreRepository} from "./genreRepository";
import {Genre} from "../../entities/genres";

@Service()
@JsonController()
export class GenreController {

    constructor(private repo: GenreRepository) {
    }

    @Get("/genres/:genreId")
    getOneById(
        @Param("genreId") genreId: number,
        @Res() response: any,
        @Req() request: any
    ): Promise<Genre> {
        return GenreRepository.findOneById(genreId)
            .then(
                (data) => {
                    return Promise.resolve(data);
                })
            .catch((err) => {
                //console.log(util.inspect(err));
                throw {error: ErrorCodes.resourceNotFound};
                //return ErrorController.processError(ErrorCodes.resourceNotFound, request, response);
            });
    }

    @Get("/genres")
    getAll(
        @Res() response: any,
        @Req() request: any
    ): Promise<Genre> {
        return GenreRepository.findAll()
            .then(
                (data) => {
                    return Promise.resolve(data);
                })
            .catch((err) => {
                //console.log(util.inspect(err));
                throw {error: ErrorCodes.resourceNotFound};
                //return ErrorController.processError(ErrorCodes.resourceNotFound, request, response);
            });
    }


    @Post("/genres")
    save(
        @Body() data: Genre,
        @Res() response: any,
        @Req() request: any
    ): Promise<Genre> {
        return GenreRepository.save(data)
            .then(
                (dataReturned) => {
                    return Promise.resolve(dataReturned);
                })
            .catch((err) => {
                //console.log(util.inspect(err));
                throw {error: ErrorCodes.resourceNotValid};
                //return ErrorController.processError(ErrorCodes.resourceNotFound, request, response);
            });
    }
}