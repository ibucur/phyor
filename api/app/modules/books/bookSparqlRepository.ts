import {Service} from "typedi";
import * as util from "util";
import {Book} from "../../entities/books";
import {isNullOrUndefined} from "util";
import {Currency} from "../../entities/currencies";
import {CurrencyRepository} from "../currencies/currencyRepository";
import {BookRepository} from "./bookRepository";
import {Autor} from "../../entities/autors";
import {Genre} from "../../entities/genres";
import {Publisher} from "../../entities/publishers";
import {Language} from "../../entities/languages";


@Service()
export class BookSparqlRepository {
    public constructor() {}

    public static transformSparqlJsonToBooks(json: any) : Promise<Book[]> {
        //console.log("Returned Results: "+json.results.bindings.length);
        let books: Book[] = [];
        if (!isNullOrUndefined(json.results) && json.results.bindings.length > 0) {
            for (let i = 0; i < json.results.bindings.length; i++) {
                //console.log("-- Process result: "+i);
                let book = new Book();
                let rsp = json.results.bindings[i];
                book.id = parseInt(rsp.bookId.value);
                book.title = rsp.title.value;
                book.isbn = rsp.isbn.value;
                book.imageUri = rsp.imageUri.value;
                book.plot = rsp.plot.value;
                book.pagesNo = parseInt(rsp.pagesNo.value);
                book.price = rsp.price.value;

                book.currency = new Currency();
                book.currency.id = parseInt(rsp.currencyId.value);
                book.currency.name = rsp.currencyName.value;
                book.currency.shortcut = rsp.currencyShortcut.value;
                book.currency.wikidataUri = rsp.currencyWikidataUri.value;

                book.author = new Autor();
                book.author.id = parseInt(rsp.authorId.value);
                book.author.name = rsp.authorName.value;
                book.author.wikidataUri = rsp.authorWikidataUri.value;

                book.genre = new Genre();
                book.genre.id = parseInt(rsp.genreId.value);
                book.genre.name = rsp.genreName.value;
                book.genre.wikidataUri = rsp.genreWikidataUri.value;

                book.publisher = new Publisher();
                book.publisher.id = parseInt(rsp.publisherId.value);
                book.publisher.name = rsp.publisherName.value;
                book.publisher.wikidataUri = rsp.publisherWikidataUri.value;

                book.language = new Language();
                book.language.id = parseInt(rsp.languageId.value);
                book.language.name = rsp.languageName.value;
                book.language.wikidataUri = rsp.languageWikidataUri.value;

                book = BookRepository.fillOneResourceURI(book);

                books.push(book);
            }
        }

        //console.log("Return result: " + books.length);
        return Promise.resolve(books);
    }

    public static getBooksSameAuthor(authorId: number, ignoredBookId: number = 0): Promise<Book[]> {
        const sparql = require('sparql');
        let client = new sparql.Client('https://ibucur.zego.ro/d2r/sparql');
        let query = "PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>\n" +
            "PREFIX owl: <http://www.w3.org/2002/07/owl#>\n" +
            "PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>\n" +
            "PREFIX vocab: <https://ibucur.zego.ro/d2r/resource/vocab/>\n" +
            "PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>\n" +
            "PREFIX map: <https://ibucur.zego.ro/d2r/resource/#>\n" +
            "PREFIX db: <https://ibucur.zego.ro/d2r/resource/>" +
            "SELECT DISTINCT *\n" +
            "WHERE { \n" +
            " ?books a vocab:books .\n" +
            " ?books vocab:books_id ?bookId .\n" +
            " ?books vocab:books_title ?title .\n" +
            " ?books vocab:books_plot ?plot .\n" +
            " ?books vocab:books_isbn ?isbn .\n" +
            " ?books vocab:books_imageUri ?imageUri .\n" +
            " ?books vocab:books_pagesNo ?pagesNo .\n" +
            " ?books vocab:books_publisherId ?publisher .\n" +
            "?publisher vocab:publishers_name ?publisherName .\n" +
            "?publisher vocab:publishers_id ?publisherId .\n" +
            "?publisher vocab:publishers_sameAs ?publisherWikidataUri .\n" +
            "\n" +
            " ?books vocab:books_price ?price .\n" +
            " ?books vocab:books_currencyId ?currency .\n" +
            "?currency vocab:currencies_name ?currencyName .\n" +
            "?currency vocab:currencies_shortcut ?currencyShortcut .\n" +
            "?currency vocab:currencies_id ?currencyId .\n" +
            "?currency vocab:currencies_sameAs ?currencyWikidataUri .\n" +
            "\n" +
            "\n" +
            " ?books vocab:books_autorId ?author .\n" +
            "?author vocab:autors_name ?authorName .\n" +
            "?author vocab:autors_id ?authorId .\n" +
            "?author vocab:autors_sameAs ?authorWikidataUri .\n" +
            "\n" +
            " ?books vocab:books_genreId ?genre .\n" +
            "?genre vocab:genres_name ?genreName .\n" +
            "?genre vocab:genres_id ?genreId .\n" +
            "?genre vocab:genres_sameAs ?genreWikidataUri .\n" +
            "\n" +
            " ?books vocab:books_languageId ?language .\n" +
            "?language vocab:languages_name ?languageName .\n" +
            "?language vocab:languages_id ?languageId .\n" +
            "?language vocab:languages_sameAs ?languageWikidataUri .\n" +
            "\n" +
            "filter (?authorId = "+authorId+"  && ?bookId != "+ignoredBookId+")\n" +
            "} limit 3";

        return new Promise((resolve, reject) => {
            client.query(query, (err, res) => {
                if (!isNullOrUndefined(err)) {
                    reject();
                }
                else {
                    let books = BookSparqlRepository.transformSparqlJsonToBooks(res);
                    resolve(books);
                }
            });
        });
    }

    public static getBooksSameGenre(genreId: number, ignoredBookId: number = 0): Promise<Book[]> {
        const sparql = require('sparql');
        let client = new sparql.Client('https://ibucur.zego.ro/d2r/sparql');
        let query = "PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>\n" +
            "PREFIX owl: <http://www.w3.org/2002/07/owl#>\n" +
            "PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>\n" +
            "PREFIX vocab: <https://ibucur.zego.ro/d2r/resource/vocab/>\n" +
            "PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>\n" +
            "PREFIX map: <https://ibucur.zego.ro/d2r/resource/#>\n" +
            "PREFIX db: <https://ibucur.zego.ro/d2r/resource/>" +
            "SELECT DISTINCT *\n" +
            "WHERE { \n" +
            " ?books a vocab:books .\n" +
            " ?books vocab:books_id ?bookId .\n" +
            " ?books vocab:books_title ?title .\n" +
            " ?books vocab:books_plot ?plot .\n" +
            " ?books vocab:books_isbn ?isbn .\n" +
            " ?books vocab:books_imageUri ?imageUri .\n" +
            " ?books vocab:books_pagesNo ?pagesNo .\n" +
            " ?books vocab:books_publisherId ?publisher .\n" +
            "?publisher vocab:publishers_name ?publisherName .\n" +
            "?publisher vocab:publishers_id ?publisherId .\n" +
            "?publisher vocab:publishers_sameAs ?publisherWikidataUri .\n" +
            "\n" +
            " ?books vocab:books_price ?price .\n" +
            " ?books vocab:books_currencyId ?currency .\n" +
            "?currency vocab:currencies_name ?currencyName .\n" +
            "?currency vocab:currencies_shortcut ?currencyShortcut .\n" +
            "?currency vocab:currencies_id ?currencyId .\n" +
            "?currency vocab:currencies_sameAs ?currencyWikidataUri .\n" +
            "\n" +
            "\n" +
            " ?books vocab:books_autorId ?author .\n" +
            "?author vocab:autors_name ?authorName .\n" +
            "?author vocab:autors_id ?authorId .\n" +
            "?author vocab:autors_sameAs ?authorWikidataUri .\n" +
            "\n" +
            " ?books vocab:books_genreId ?genre .\n" +
            "?genre vocab:genres_name ?genreName .\n" +
            "?genre vocab:genres_id ?genreId .\n" +
            "?genre vocab:genres_sameAs ?genreWikidataUri .\n" +
            "\n" +
            " ?books vocab:books_languageId ?language .\n" +
            "?language vocab:languages_name ?languageName .\n" +
            "?language vocab:languages_id ?languageId .\n" +
            "?language vocab:languages_sameAs ?languageWikidataUri .\n" +
            "\n" +
            "filter (?genreId = "+genreId+"  && ?bookId != "+ignoredBookId+")\n" +
            "} limit 3";

        return new Promise((resolve, reject) => {
            client.query(query, (err, res) => {
                if (!isNullOrUndefined(err)) {
                    reject();
                }
                else {
                    let books = BookSparqlRepository.transformSparqlJsonToBooks(res);
                    resolve(books);
                }
            });
        });
    }

    public static getBooksSamePublisher(publisherId: number, ignoredBookId: number = 0): Promise<Book[]> {
        const sparql = require('sparql');
        let client = new sparql.Client('https://ibucur.zego.ro/d2r/sparql');
        let query = "PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>\n" +
            "PREFIX owl: <http://www.w3.org/2002/07/owl#>\n" +
            "PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>\n" +
            "PREFIX vocab: <https://ibucur.zego.ro/d2r/resource/vocab/>\n" +
            "PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>\n" +
            "PREFIX map: <https://ibucur.zego.ro/d2r/resource/#>\n" +
            "PREFIX db: <https://ibucur.zego.ro/d2r/resource/>" +
            "SELECT DISTINCT *\n" +
            "WHERE { \n" +
            " ?books a vocab:books .\n" +
            " ?books vocab:books_id ?bookId .\n" +
            " ?books vocab:books_title ?title .\n" +
            " ?books vocab:books_plot ?plot .\n" +
            " ?books vocab:books_isbn ?isbn .\n" +
            " ?books vocab:books_imageUri ?imageUri .\n" +
            " ?books vocab:books_pagesNo ?pagesNo .\n" +
            " ?books vocab:books_publisherId ?publisher .\n" +
            "?publisher vocab:publishers_name ?publisherName .\n" +
            "?publisher vocab:publishers_id ?publisherId .\n" +
            "?publisher vocab:publishers_sameAs ?publisherWikidataUri .\n" +
            "\n" +
            " ?books vocab:books_price ?price .\n" +
            " ?books vocab:books_currencyId ?currency .\n" +
            "?currency vocab:currencies_name ?currencyName .\n" +
            "?currency vocab:currencies_shortcut ?currencyShortcut .\n" +
            "?currency vocab:currencies_id ?currencyId .\n" +
            "?currency vocab:currencies_sameAs ?currencyWikidataUri .\n" +
            "\n" +
            "\n" +
            " ?books vocab:books_autorId ?author .\n" +
            "?author vocab:autors_name ?authorName .\n" +
            "?author vocab:autors_id ?authorId .\n" +
            "?author vocab:autors_sameAs ?authorWikidataUri .\n" +
            "\n" +
            " ?books vocab:books_genreId ?genre .\n" +
            "?genre vocab:genres_name ?genreName .\n" +
            "?genre vocab:genres_id ?genreId .\n" +
            "?genre vocab:genres_sameAs ?genreWikidataUri .\n" +
            "\n" +
            " ?books vocab:books_languageId ?language .\n" +
            "?language vocab:languages_name ?languageName .\n" +
            "?language vocab:languages_id ?languageId .\n" +
            "?language vocab:languages_sameAs ?languageWikidataUri .\n" +
            "\n" +
            "filter (?publisherId = "+publisherId+"  && ?bookId != "+ignoredBookId+")\n" +
            "} limit 3";

        return new Promise((resolve, reject) => {
            client.query(query, (err, res) => {
                if (!isNullOrUndefined(err)) {
                    reject();
                }
                else {
                    let books = BookSparqlRepository.transformSparqlJsonToBooks(res);
                    resolve(books);
                }
            });
        });
    }

    public static getBooksSameLanguage(languageId: number, ignoredBookId: number = 0): Promise<Book[]> {
        const sparql = require('sparql');
        let client = new sparql.Client('https://ibucur.zego.ro/d2r/sparql');
        let query = "PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>\n" +
            "PREFIX owl: <http://www.w3.org/2002/07/owl#>\n" +
            "PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>\n" +
            "PREFIX vocab: <https://ibucur.zego.ro/d2r/resource/vocab/>\n" +
            "PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>\n" +
            "PREFIX map: <https://ibucur.zego.ro/d2r/resource/#>\n" +
            "PREFIX db: <https://ibucur.zego.ro/d2r/resource/>" +
            "SELECT DISTINCT *\n" +
            "WHERE { \n" +
            " ?books a vocab:books .\n" +
            " ?books vocab:books_id ?bookId .\n" +
            " ?books vocab:books_title ?title .\n" +
            " ?books vocab:books_plot ?plot .\n" +
            " ?books vocab:books_isbn ?isbn .\n" +
            " ?books vocab:books_imageUri ?imageUri .\n" +
            " ?books vocab:books_pagesNo ?pagesNo .\n" +
            " ?books vocab:books_publisherId ?publisher .\n" +
            "?publisher vocab:publishers_name ?publisherName .\n" +
            "?publisher vocab:publishers_id ?publisherId .\n" +
            "?publisher vocab:publishers_sameAs ?publisherWikidataUri .\n" +
            "\n" +
            " ?books vocab:books_price ?price .\n" +
            " ?books vocab:books_currencyId ?currency .\n" +
            "?currency vocab:currencies_name ?currencyName .\n" +
            "?currency vocab:currencies_shortcut ?currencyShortcut .\n" +
            "?currency vocab:currencies_id ?currencyId .\n" +
            "?currency vocab:currencies_sameAs ?currencyWikidataUri .\n" +
            "\n" +
            "\n" +
            " ?books vocab:books_autorId ?author .\n" +
            "?author vocab:autors_name ?authorName .\n" +
            "?author vocab:autors_id ?authorId .\n" +
            "?author vocab:autors_sameAs ?authorWikidataUri .\n" +
            "\n" +
            " ?books vocab:books_genreId ?genre .\n" +
            "?genre vocab:genres_name ?genreName .\n" +
            "?genre vocab:genres_id ?genreId .\n" +
            "?genre vocab:genres_sameAs ?genreWikidataUri .\n" +
            "\n" +
            " ?books vocab:books_languageId ?language .\n" +
            "?language vocab:languages_name ?languageName .\n" +
            "?language vocab:languages_id ?languageId .\n" +
            "?language vocab:languages_sameAs ?languageWikidataUri .\n" +
            "\n" +
            "filter (?languageId = "+languageId+"  && ?bookId != "+ignoredBookId+")\n" +
            "} limit 3";

        return new Promise((resolve, reject) => {
            client.query(query, (err, res) => {
                if (!isNullOrUndefined(err)) {
                    reject();
                }
                else {
                    let books = BookSparqlRepository.transformSparqlJsonToBooks(res);
                    resolve(books);
                }
            });
        });
    }


}