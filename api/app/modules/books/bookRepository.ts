import {Service} from "typedi";
import {getRepository} from "typeorm";
import {Book} from "../../entities/books";
import {PublisherRepository} from "../publishers/publisherRepository";
import * as util from "util";
import {AuthorRepository} from "../autors/authorRepository";
import {CurrencyRepository} from "../currencies/currencyRepository";
import {GenreRepository} from "../genres/genreRepository";
import {LanguageRepository} from "../languages/languageRepository";

@Service()
export class BookRepository {
    public constructor() {}

    public static save(data: Book) {
        return getRepository(Book).save(data);
    }

    private static fillOneResourceURI(data: Book|any):Book|any {
        data["resourceUri"] = process.env.HOST + '/api/books/'+data["id"];
        data["="] = "book";
        data["@1"] = {
            "id": data.id
        };
        delete data.id;
        data.publisher = PublisherRepository.fillOneResourceURI(data.publisher);
        data.currency = CurrencyRepository.fillOneResourceURI(data.currency);
        data.genre = GenreRepository.fillOneResourceURI(data.genre);
        data.language = LanguageRepository.fillOneResourceURI(data.language);
        data.author = AuthorRepository.fillOneAuthorURI(data.author);
        return data;
    }

    private static fillResourceURI(data: Book[] | any): Book[] | any {
        for (let i = 0; i < data.length; i++) {
            data[i] = this.fillOneResourceURI(data[i]);

        }
        return data;
    }

    public static findAll(pageNumber: number = 0, resultsPerPage: number = 20): Promise<Book> | Promise<never> | any {

        resultsPerPage = (resultsPerPage <= 0?20:resultsPerPage);
        pageNumber = (pageNumber<0?0:pageNumber) * resultsPerPage;

        return getRepository(Book).find({
            skip: pageNumber,
            take: resultsPerPage
        })
            .then((data) => {
                return Promise.resolve(this.fillResourceURI(data));
            })
            .catch((err) => {
                return Promise.reject(err);
            })
    }

    public static findBooksByAuthorId(authorId: number, pageNumber: number = 0, resultsPerPage: number = 20): Promise<Book> | Promise<never> | any {

        resultsPerPage = (resultsPerPage <= 0?20:resultsPerPage);
        pageNumber = (pageNumber<0?0:pageNumber) * resultsPerPage;

        return getRepository(Book).find({
            where: {author: authorId},
            skip: pageNumber,
            take: resultsPerPage
        })
            .then((data) => {
                if (data.length >= 0) {
                    return Promise.resolve(this.fillResourceURI(data));
                }
                else Promise.reject();
            })
            .catch((err) => {
                return Promise.reject(err);
            })
    }

    /*public static findAllWithNameFilter(countryId: number, cityPartialName: string, pageNumber: number = 0, resultsPerPage: number = 20): Promise<Autor> | Promise<never> | any {

        resultsPerPage = (resultsPerPage <= 0?20:resultsPerPage);
        pageNumber = (pageNumber<0?0:pageNumber) * resultsPerPage;

        console.log("got filter "+ cityPartialName);

        return getRepository(Autor).createQueryBuilder("city")
            .select(["city.id", "city.name", "city.geoLat", "city.geoLng", "state.id as stateId", "state.name as stateName"])
            .leftJoinAndSelect('city.state', 'state')
            .where("city.countryId = :countryId", { countryId: countryId })
            .andWhere("city.name like :cityLike", { cityLike: cityPartialName+"%" })

            .limit(resultsPerPage)
            .offset(pageNumber)
            .getMany();
    }*/

    public static findOneById(id: number): Promise<Book> | Promise<never> | any {

        return getRepository(Book).findOneById(id)
            .then((data) => {
                return Promise.resolve(this.fillOneResourceURI(data));
            })
            .catch((err) => {
                return Promise.reject(err);
            })
    }
}