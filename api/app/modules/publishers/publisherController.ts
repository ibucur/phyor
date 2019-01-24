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
import {PublisherRepository} from "./publisherRepository";
import {Publisher} from "../../entities/publishers";

@Service()
@JsonController()
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
                    return Promise.resolve(data);
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
                    return Promise.resolve(data);
                })
            .catch((err) => {
                //console.log(util.inspect(err));
                throw {error: ErrorCodes.resourceNotFound};
                //return ErrorController.processError(ErrorCodes.resourceNotFound, request, response);
            });
    }


    @Post("/publishers")
    save(
        @Body() data: Publisher,
        @Res() response: any,
        @Req() request: any
    ): Promise<Publisher> {
        return PublisherRepository.save(data)
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