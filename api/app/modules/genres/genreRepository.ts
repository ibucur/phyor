import {Service} from "typedi";
import {getRepository} from "typeorm";
import {Genre} from "../../entities/genres";

@Service()
export class GenreRepository {
    public constructor() {}

    public static save(data: Genre) {
        return getRepository(Genre).save(data);
    }

    public static fillOneResourceURI(data: Genre|any):Genre|any {
        data["resourceUri"] = process.env.HOST + '/api/genres/'+data["id"];
        data["="] = "genre";
        data["@1"] = {
            "id": data.id
        };
        delete data.id;

        return data;
    }

    private static fillResourceURI(data: Genre[] | any): Genre[] | any {
        for (let i = 0; i < data.length; i++) {
            data[i] = this.fillOneResourceURI(data[i]);
        }
        return data;
    }

    public static findAll(pageNumber: number = 0, resultsPerPage: number = 20): Promise<Genre> | Promise<never> | any {

        resultsPerPage = (resultsPerPage <= 0?20:resultsPerPage);
        pageNumber = (pageNumber<0?0:pageNumber) * resultsPerPage;

        return getRepository(Genre).find({
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

    public static findOneById(genreId: number): Promise<Genre> | Promise<never> | any {

        return getRepository(Genre).findOneById(genreId)
            .then((data) => {
                return Promise.resolve(this.fillOneResourceURI(data));
            })
            .catch((err) => {
                return Promise.reject(err);
            })
    }
}