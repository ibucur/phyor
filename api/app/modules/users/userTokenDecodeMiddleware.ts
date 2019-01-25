import {Middleware, ExpressMiddlewareInterface} from "routing-controllers";
import * as util from "util";
import {Request, Response} from "express";
import {ErrorController} from "../../helper/errorController";
import {ErrorCodes} from "../../constants/errorCodes";
import {UserController} from "./userController";



@Middleware({ type: "before" })
export class UserTokenDecodeMiddleware implements ExpressMiddlewareInterface {

    /**
     * Method that performs the token decode.
     * @param request
     * @param response
     * @param {(err: any) => any} next
     */
    use(request: any, response: any, next: (err?: any) => any): void {
        UserController.getUserFromToken(request,request.headers["authorization"])
            .then((success) => {
                next();
            })
            .catch((err) => {

                if (err === -1) {
                    ErrorController.processError(ErrorCodes.failedToAuthenticateToken, request, response,request.headers["authorization"]);
                    //throw {error: ErrorCodes.failedToAuthenticateToken, details: {token: request.headers["authorization"]}};
                }
                else if (err === -2 || err === false) {
                    ErrorController.processError(ErrorCodes.authenticationTokenExpired, request, response,request.headers["authorization"]);
                    //throw {error: ErrorCodes.authenticationTokenExpired, details: {token: request.headers["authorization"]}};
                }
                else ErrorController.processError(ErrorCodes.failedToAuthenticateToken, request, response,request.headers["authorization"]);
            });
    }

}