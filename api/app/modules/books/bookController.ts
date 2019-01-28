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
import {BookRepository} from "./bookRepository";
import {Book} from "../../entities/books";
import { ResponseFormatter} from "../../helper/responseFormatter";
import {BookSparqlRepository} from "./bookSparqlRepository";

@Service()
@Controller()
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
        return  BookRepository.findBooksByAuthorId(authorId, pageNumber, resultsPerPage)
            .then(
                 (data) => {
                    if (data.length > 0) {
                        return Promise.resolve(ResponseFormatter.response(response, request, data, 200, 'books'));
                    }
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
                    return Promise.resolve(ResponseFormatter.response(response, request, data, 200, 'book'));
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
    ): Promise<Book[]> {
        return BookRepository.findAll(pageNumber, resultsPerPage)
            .then(
                (data) => {
                    return Promise.resolve(ResponseFormatter.response(response, request, data, 200, 'books'));
                })
            .catch((err) => {
                //console.log(util.inspect(err));
                throw {error: ErrorCodes.resourceNotFound};
                //return ErrorController.processError(ErrorCodes.resourceNotFound, request, response);
            });
    }

    @Authorized()
    @Post("/books")
    save(
        @Body() data: Book,
        @Res() response: any,
        @Req() request: any
    ): Promise<Book> {
        return BookRepository.save(data)
            .then(
                (dataReturned) => {
                    return Promise.resolve(ResponseFormatter.response(response, request, dataReturned,201, 'book'));
                })
            .catch((err) => {
                //console.log(util.inspect(err));
                throw {error: ErrorCodes.resourceNotValid};
                //return ErrorController.processError(ErrorCodes.resourceNotFound, request, response);
            });
    }

    @Authorized()
    @Put("/books/:bookId")
    update(
        @Param("bookId") bookId: number,
        @Body() data: Book,
        @Res() response: any,
        @Req() request: any
    ): Promise<Book> {
        data.id = bookId;
        return BookRepository.save(data)
            .then(
                (dataReturned) => {
                    return Promise.resolve(ResponseFormatter.response(response, request, dataReturned,201, 'book'));
                })
            .catch((err) => {
                //console.log(util.inspect(err));
                throw {error: ErrorCodes.resourceNotValid};
                //return ErrorController.processError(ErrorCodes.resourceNotFound, request, response);
            });
    }

    @Get("/books/:bookId/recomandations")
    async getBooksSameAuthor(
        @Param("bookId") bookId: number,
        @QueryParam("recommendCategoryBooksNo") recommendCategoryBooksNo: number,
        @Res() response: any,
        @Req() request: any
    ): Promise<any> {

        return await BookRepository.findOneById(bookId)
            .then(
                async (data) => {
                    await data;
                    let booksSameAuthor = await BookSparqlRepository.getBooksSameAuthor(data.author['@1'].id, bookId, recommendCategoryBooksNo);
                    let booksSameGenre = await BookSparqlRepository.getBooksSameGenre(data.genre['@1'].id, bookId, recommendCategoryBooksNo);
                    let booksSamePublisher = await BookSparqlRepository.getBooksSamePublisher(data.publisher['@1'].id, bookId, recommendCategoryBooksNo);
                    let booksSameLanguage = await BookSparqlRepository.getBooksSameLanguage(data.language['@1'].id, bookId, recommendCategoryBooksNo);
                    let books = {
                       "sameAuthor": booksSameAuthor,
                       "sameGenre": booksSameGenre,
                       "samePublisher": booksSamePublisher,
                       "sameLanguage": booksSameLanguage,
                    };
                    return Promise.resolve(ResponseFormatter.response(response, request, books,200, 'recomandations'));
                })
            .catch((err) => {
                throw {error: ErrorCodes.resourceNotFound};
            });


    }
}