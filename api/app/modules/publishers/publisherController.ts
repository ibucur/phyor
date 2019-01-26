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
import {PublisherRepository} from "./publisherRepository";
import {Publisher} from "../../entities/publishers";
import {ResponseFormatter} from "../../helper/responseFormatter";

@Service()
@Controller()
export class PublisherController {

    constructor(private repo: PublisherRepository) {
    }

    @Get("/publishers/:publisherId")
    getOneById(
        @Param("publisherId") publisherId: number,
        @Res() response: any,
        @Req() request: any
    ): Promise<Publisher> {
        return PublisherRepository.findOneById(publisherId)
            .then(
                (data) => {
                    return Promise.resolve(ResponseFormatter.response(response, request, data, 200, 'publisher'));
                })
            .catch((err) => {
                //console.log(util.inspect(err));
                throw {error: ErrorCodes.resourceNotFound};
                //return ErrorController.processError(ErrorCodes.resourceNotFound, request, response);
            });
    }

    @Get("/publishers")
    getAll(
        @QueryParam("pageNumber") pageNumber: number,
        @QueryParam("resultsPerPage") resultsPerPage: number,
        @Res() response: any,
        @Req() request: any
    ): Promise<Publisher> {
        return PublisherRepository.findAll(pageNumber, resultsPerPage)
            .then(
                (data) => {
                    return Promise.resolve(ResponseFormatter.response(response, request, data, 200, 'publishers'));
                })
            .catch((err) => {
                //console.log(util.inspect(err));
                throw {error: ErrorCodes.resourceNotFound};
                //return ErrorController.processError(ErrorCodes.resourceNotFound, request, response);
            });
    }

    @Authorized()
    @Post("/publishers")
    save(
        @Body() data: Publisher,
        @Res() response: any,
        @Req() request: any
    ): Promise<Publisher> {
        return PublisherRepository.save(data)
            .then(
                (dataReturned) => {
                    return Promise.resolve(ResponseFormatter.response(response, request, dataReturned,201, 'publisher'));
                })
            .catch((err) => {
                //console.log(util.inspect(err));
                throw {error: ErrorCodes.resourceNotValid};
                //return ErrorController.processError(ErrorCodes.resourceNotFound, request, response);
            });
    }

    @Authorized()
    @Put("/publishers/:publisherId")
    update(
        @Param("publisherId") publisherId: number,
        @Body() data: Publisher,
        @Res() response: any,
        @Req() request: any
    ): Promise<Publisher> {
        data.id = publisherId;
        return PublisherRepository.save(data)
            .then(
                (dataReturned) => {
                    return Promise.resolve(ResponseFormatter.response(response, request, dataReturned,201, 'publisher'));
                })
            .catch((err) => {
                //console.log(util.inspect(err));
                throw {error: ErrorCodes.resourceNotValid};
                //return ErrorController.processError(ErrorCodes.resourceNotFound, request, response);
            });
    }
}