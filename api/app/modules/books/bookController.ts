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
import {BookRepository} from "./bookRepository";
import {Book} from "../../entities/books";

@Service()
@JsonController()
export class BookController {

    constructor(private repo: BookRepository) {
    }

    @Get("/authors/:authorId/books")
    getBooksByAuthorId(
        @QueryParam("pageNumber") pageNumber: number,
        @QueryParam("resultsPerPage") resultsPerPage: number,
        @Param("authorId") authorId: number,
        @Res() response: any,
        @Req() request: any
    ): Promise<Book> {
        return BookRepository.findBooksByAuthorId(authorId, pageNumber, resultsPerPage)
            .then(
                (data) => {
                    if (data.length > 0)
                        return Promise.resolve(data);
                    else
                        return Promise.reject();
                })
            .catch((err) => {
                //console.log(util.inspect(err));
                throw {error: ErrorCodes.resourceNotFound};
                //return ErrorController.processError(ErrorCodes.resourceNotFound, request, response);
            });
    }

    @Get("/books/:bookId")
    getOneById(
        @Param("bookId") bookId: number,
        @Res() response: any,
        @Req() request: any
    ): Promise<Book> {
        return BookRepository.findOneById(bookId)
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

    @Get("/books")
    getAll(
        @QueryParam("pageNumber") pageNumber: number,
        @QueryParam("resultsPerPage") resultsPerPage: number,
        @Res() response: any,
        @Req() request: any
    ): Promise<Book> {
        return BookRepository.findAll(pageNumber, resultsPerPage)
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


    @Post("/books")
    save(
        @Body() data: Book,
        @Res() response: any,
        @Req() request: any
    ): Promise<Book> {
        return BookRepository.save(data)
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