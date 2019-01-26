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
import {LanguageRepository} from "./languageRepository";
import {Language} from "../../entities/languages";
import {ResponseFormatter} from "../../helper/responseFormatter";

@Service()
@Controller()
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
                    return Promise.resolve(ResponseFormatter.response(response, request, data, 200, 'language'));
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
                    return Promise.resolve(ResponseFormatter.response(response, request, data, 200, 'languages'));
                })
            .catch((err) => {
                //console.log(util.inspect(err));
                throw {error: ErrorCodes.resourceNotFound};
                //return ErrorController.processError(ErrorCodes.resourceNotFound, request, response);
            });
    }

    @Authorized()
    @Post("/languages")
    save(
        @Body() data: Language,
        @Res() response: any,
        @Req() request: any
    ): Promise<Language> {
        return LanguageRepository.save(data)
            .then(
                (dataReturned) => {
                    return Promise.resolve(ResponseFormatter.response(response, request, dataReturned,201, 'language'));
                })
            .catch((err) => {
                //console.log(util.inspect(err));
                throw {error: ErrorCodes.resourceNotValid};
                //return ErrorController.processError(ErrorCodes.resourceNotFound, request, response);
            });
    }

    @Authorized()
    @Put("/languages/:languageId")
    update(
        @Param("languageId") languageId: number,
        @Body() data: Language,
        @Res() response: any,
        @Req() request: any
    ): Promise<Language> {
        data.id = languageId;
        return LanguageRepository.save(data)
            .then(
                (dataReturned) => {
                    return Promise.resolve(ResponseFormatter.response(response, request, dataReturned,201, 'language'));
                })
            .catch((err) => {
                //console.log(util.inspect(err));
                throw {error: ErrorCodes.resourceNotValid};
                //return ErrorController.processError(ErrorCodes.resourceNotFound, request, response);
            });
    }
}