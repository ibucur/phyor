import {Service} from "typedi";
import {getRepository} from "typeorm";
import {Autor} from "../../entities/autors";

@Service()
export class AuthorRepository {
    public constructor() {}

    public static save(data: Autor) {
        return getRepository(Autor).save(data);
    }

    public static fillOneAuthorURI(data: Autor|any):Autor|any {
        data["resourceUri"] = process.env.HOST + '/api/authors/'+data["id"];
        return data;
    }

    private static fillAuthorURI(data: Autor[] | any): Autor[] | any {
        for (let i = 0; i < data.length; i++) {
            data[i] = this.fillOneAuthorURI(data[i]);
        }
        return data;
    }

    public static findAll(pageNumber: number = 0, resultsPerPage: number = 20): Promise<Autor> | Promise<never> | any {

        resultsPerPage = (resultsPerPage <= 0?20:resultsPerPage);
        pageNumber = (pageNumber<0?0:pageNumber) * resultsPerPage;

        return getRepository(Autor).find({
            skip: pageNumber,
            take: resultsPerPage
        })
            .then((data) => {
                return Promise.resolve(this.fillAuthorURI(data));
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

    public static findOneById(authorId: number): Promise<Autor> | Promise<never> | any {

        return getRepository(Autor).findOneById(authorId)
            .then((data) => {
                return Promise.resolve(this.fillOneAuthorURI(data));
            })
            .catch((err) => {
                return Promise.reject(err);
            })
    }
}