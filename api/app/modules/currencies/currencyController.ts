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
import {CurrencyRepository} from "./currencyRepository";
import {Currency} from "../../entities/currencies";

@Service()
@JsonController()
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
                    return Promise.resolve(data);
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
                    return Promise.resolve(data);
                })
            .catch((err) => {
                //console.log(util.inspect(err));
                throw {error: ErrorCodes.resourceNotFound};
                //return ErrorController.processError(ErrorCodes.resourceNotFound, request, response);
            });
    }


    @Post("/currencies")
    save(
        @Body() currency: Currency,
        @Res() response: any,
        @Req() request: any
    ): Promise<Currency> {
        return CurrencyRepository.save(currency)
            .then(
                (data) => {
                    return Promise.resolve(data);
                })
            .catch((err) => {
                //console.log(util.inspect(err));
                throw {error: ErrorCodes.resourceNotValid};
                //return ErrorController.processError(ErrorCodes.resourceNotFound, request, response);
            });
    }
}