/**
 * Class that manages the user authorization token encoding and decoding plus validation
 */


import * as util from "util";
import {isUndefined} from "util";
import {User} from "../../entities/users";

const jwt    = require('jsonwebtoken');

export class TokenResponse {
    success: boolean = true;
    message: string = "Make sure you send the token in the request header within authorization variable!";
    token: string;
    user: any;
}


export class UserAuthorization {
    public static getUserToken(user: User, expireInMinutes: number = 120): Promise<any> {

        if (process.env.NODE_ENV == "DEVELOPMENT") {
            expireInMinutes = 60*24*365;
        }

        let token = jwt.sign(JSON.parse(JSON.stringify(user)), process.env.TOKEN_SECRET, {
            expiresIn: expireInMinutes * 60 // expires in 2 hours
        });

        let response = new TokenResponse();
        response.success = true;
        response.token = token;
        response.user = user;
        delete response.user.password;
        delete response.user.active;
        return new Promise((resolve, reject) => {
            //console.log(util.inspect(response))
            resolve(response);
        });
    }

    public static getUserFromToken(token: string): User {
        //console.log("AUTH RECEIVED TOKEN: "+token);
        return jwt.verify(token, process.env.TOKEN_SECRET, (err, decoded) => {
            if (err) {
                //console.log(err);
                if (err.name == 'JsonWebTokenError')
                    return -1;
                //throw {error: ErrorCodes.failedToAuthenticateToken, details: token};
                else if (err.name == 'TokenExpiredError') {
                    return -2;
                    //throw {error: ErrorCodes.failedToAuthenticateToken, details: token};
                }
                return -100;
            } else {
                // if everything is good, save to request for use in other routes

                let user = new User;
                for(let prop in decoded){
                    // for safety you can use the hasOwnProperty function
                    if (decoded.hasOwnProperty(prop))
                    {
                        user[prop] = decoded[prop];
                    }
                }

                //delete user['iat'];
                //delete user['exp'];

                return user;
            }
        });
    }
}