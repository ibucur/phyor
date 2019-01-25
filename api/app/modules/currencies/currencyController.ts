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
import {CurrencyRepository} from "./currencyRepository";
import {Currency} from "../../entities/currencies";
import {ResponseFormatter} from "../../helper/responseFormatter";

@Service()
@Controller()
export class CurrencyController {

    constructor(private repo: CurrencyRepository) {
    }

    @Get("/currencies/:currencyId")
    getOneById(
        @Param("currencyId") currencyId: number,
        @Res() response: any,
        @Req() request: any
    ): Promise<Currency> {
        return CurrencyRepository.findOneById(currencyId)
            .then(
                (data) => {
                    return Promise.resolve(ResponseFormatter.response(response, request, data, 200, 'currency'));
                })
            .catch((err) => {
                //console.log(util.inspect(err));
                throw {error: ErrorCodes.resourceNotFound};
                //return ErrorController.processError(ErrorCodes.resourceNotFound, request, response);
            });
    }

    @Get("/currencies")
    getAll(
        @Res() response: any,
        @Req() request: any
    ): Promise<Currency> {
        return CurrencyRepository.findAll()
            .then(
                (data) => {
                    return Promise.resolve(ResponseFormatter.response(response, request, data, 200, 'currencies'));
                })
            .catch((err) => {
                //console.log(util.inspect(err));
                throw {error: ErrorCodes.resourceNotFound};
                //return ErrorController.processError(ErrorCodes.resourceNotFound, request, response);
            });
    }

    @Authorized()
    @Post("/currencies")
    save(
        @Body() currency: Currency,
        @Res() response: any,
        @Req() request: any
    ): Promise<Currency> {
        return CurrencyRepository.save(currency)
            .then(
                (data) => {
                    return Promise.resolve(ResponseFormatter.response(response, request, data,201, 'currency'));
                })
            .catch((err) => {
                //console.log(util.inspect(err));
                throw {error: ErrorCodes.resourceNotValid};
                //return ErrorController.processError(ErrorCodes.resourceNotFound, request, response);
            });
    }
}