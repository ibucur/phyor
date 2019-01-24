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
import {LanguageRepository} from "./languageRepository";
import {Language} from "../../entities/languages";

@Service()
@JsonController()
export class LanguageController {

    constructor(private repo: LanguageRepository) {
    }

    @Get("/languages/:languageId")
    getOneById(
        @Param("languageId") languageId: number,
        @Res() response: any,
        @Req() request: any
    ): Promise<Language> {
        return LanguageRepository.findOneById(languageId)
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

    @Get("/languages")
    getAll(
        @QueryParam("pageNumber") pageNumber: number,
        @QueryParam("resultsPerPage") resultsPerPage: number,
        @Res() response: any,
        @Req() request: any
    ): Promise<Language> {
        return LanguageRepository.findAll(pageNumber, resultsPerPage)
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


    @Post("/languages")
    save(
        @Body() data: Language,
        @Res() response: any,
        @Req() request: any
    ): Promise<Language> {
        return LanguageRepository.save(data)
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