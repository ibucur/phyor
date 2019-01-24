import {Service} from "typedi";
import {getRepository} from "typeorm";
import {Currency} from "../../entities/currencies";

@Service()
export class CurrencyRepository {
    public constructor() {}

    public static save(data: Currency) {
        return getRepository(Currency).save(data);
    }

    public static fillOneResourceURI(data: Currency|any):Currency|any {
        data["resourceUri"] = process.env.HOST + '/api/currencies/'+data["id"];
        return data;
    }

    private static fillResourceURI(data: Currency[] | any): Currency[] | any {
        for (let i = 0; i < data.length; i++) {
            data[i] = this.fillOneResourceURI(data[i]);
        }
        return data;
    }

    public static findAll(pageNumber: number = 0, resultsPerPage: number = 20): Promise<Currency> | Promise<never> | any {

        resultsPerPage = (resultsPerPage <= 0?20:resultsPerPage);
        pageNumber = (pageNumber<0?0:pageNumber) * resultsPerPage;

        return getRepository(Currency).find({
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

    public static findOneById(currencyId: number): Promise<Currency> | Promise<never> | any {

        return getRepository(Currency).findOneById(currencyId)
            .then((data) => {
                return Promise.resolve(this.fillOneResourceURI(data));
            })
            .catch((err) => {
                return Promise.reject(err);
            })
    }
}