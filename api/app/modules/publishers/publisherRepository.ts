import {Service} from "typedi";
import {getRepository} from "typeorm";
import {Publisher} from "../../entities/publishers";

@Service()
export class PublisherRepository {
    public constructor() {}

    public static save(data: Publisher) {
        return getRepository(Publisher).save(data);
    }

    public static fillOneResourceURI(data: Publisher|any):Publisher|any {
        data["resourceUri"] = process.env.HOST + '/api/publishers/'+data["id"];
        data["="] = "publisher";
        data["@1"] = {
            "id": data.id
        };
        delete data.id;
        return data;
    }

    public static fillResourceURI(data: Publisher[] | any): Publisher[] | any {
        for (let i = 0; i < data.length; i++) {
            data[i] = this.fillOneResourceURI(data[i]);
        }
        return data;
    }

    public static findAll(pageNumber: number = 0, resultsPerPage: number = 20): Promise<Publisher> | Promise<never> | any {

        resultsPerPage = (resultsPerPage <= 0?20:resultsPerPage);
        pageNumber = (pageNumber<0?0:pageNumber) * resultsPerPage;

        return getRepository(Publisher).find({
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

    public static findOneById(id: number): Promise<Publisher> | Promise<never> | any {

        return getRepository(Publisher).findOneById(id)
            .then((data) => {
                return Promise.resolve(this.fillOneResourceURI(data));
            })
            .catch((err) => {
                return Promise.reject(err);
            })
    }
}