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
import {UserRepository} from "./userRepository";
import {TokenResponse, UserAuthorization} from "./userAuthorization";
import {User} from "../../entities/users";
import {ResponseFormatter} from "../../helper/responseFormatter";

export class LoginDetails {
    email: string;
    password: string;
}


@Service()
@Controller()
export class UserController {

    constructor(private repo: UserRepository) {
    }

    public static getUserFromToken(request: Request, token): Promise<boolean|number> {
        let user;
        if (!request.user && token) {

            user = UserAuthorization.getUserFromToken(token);

            if (user && user instanceof User) {
                request.user = user;
                return Promise.resolve(true);
            }
            else {
                return Promise.reject(false);
            }
        }
        return Promise.resolve(true);
    }

    @Post("/users/login")
    login(@Body() loginDetails: LoginDetails, @Res() response: any,
          @Req() request: any): Promise<TokenResponse|any> {
        return UserRepository.findOneByEmailAndPassword(loginDetails.email, loginDetails.password)
            .then(async (user) => {
                //console.log(util.inspect(user));
                await user;
                if (user && user instanceof User) {
                    return await ResponseFormatter.response(response, request, await UserAuthorization.getUserToken(user));
                }
                else throw {error: ErrorCodes.invalidLoginCredentials};
            })
            .catch((err) => {
                throw {error: ErrorCodes.invalidLoginCredentials};
            })
    }


}