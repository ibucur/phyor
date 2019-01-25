/**
 * Created by ibucur on 10/28/2017.
 */
import {Service} from "typedi";
import {FindOneOptions, getRepository} from "typeorm";

import {Request, Response} from 'express';

import * as util from "util";
import {Validator} from "class-validator";
import {registerDecorator, ValidationOptions, ValidatorConstraint, ValidatorConstraintInterface, ValidationArguments} from "class-validator";
import {isNull, isNullOrUndefined, isNumber} from "util";

import {User} from "../../entities/users";
import {StringHelper} from "../../helper/stringHelper";




@Service()
export class UserRepository {

    /**
     * Method that searches for a user based on user id
     * @param {number} id
     * @returns {Promise<User> | Promise<any> | any}
     */
    public static findOneById(id: number): Promise<User> | Promise<never> | any  {
        return getRepository(User).findOne({where: {id: id}, cache: false});
    }

    /**
     * Method that searches for a user based on e-mail address and password
     * @param {string} email
     * @param {string} hashPassword
     * @returns {Promise<User> | Promise<any> | any}
     */
    public static findOneByEmailAndPassword(email: string, hashPassword: string): Promise<User> | Promise<never> | any  {
        //console.log("HASHPASSWORD="+User.getHashPassword(hashPassword));
        return getRepository(User).findOne({
            where: {email: StringHelper.formatEmail(email), password: User.getHashPassword(hashPassword), active: true}
        })
            .then((user) => {
                if (user && user instanceof User) {
                    //console.log(util.inspect(user));
                    return Promise.resolve(user);
                }
                return Promise.reject(false);
            })
            .catch((err) => {
                //console.log(util.inspect(err));
                return Promise.reject(err);
            });
    }


}
