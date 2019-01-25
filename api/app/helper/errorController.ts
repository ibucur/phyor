import "reflect-metadata";
import {Request, Response} from "express";
import {Service} from "typedi";
import {Middleware, ExpressErrorMiddlewareInterface} from "routing-controllers";
import * as util from "util";
import {ErrorCodes} from "../constants/errorCodes";
import {ResponseFormatter} from "./responseFormatter";


@Middleware({ type: "after" })
export class CustomErrorHandler implements ExpressErrorMiddlewareInterface {

    async error(error: any, request: any, response: any, next: (err?: any) => any) {
        //console.log("ERROR HANDLER:"+ util.inspect(error));

        /*
        //does not work as expected
        if (process.env.NODE_ENV && process.env.NODE_ENV.toUpperCase().trim() == 'DEVELOPMENT') {
            Error.captureStackTrace(error);
            error['details']['DEBUG_DETAILS'] = error.stack;
        }
        */

        if (error && error.error) {
            if (error.details)
            {
                await ErrorController.processError(error.error, request, response, error.details);
            }
            else {
                await ErrorController.processError(error.error, request, response);
            }
        }
        else {
            console.log(util.inspect(error));
            if (error.httpCode == 400) {
                await ErrorController.processError(ErrorCodes.resourceNotValid, request, response, error.errors)
            }
            else await ErrorController.processError(ErrorCodes.errorCodeNotAvailable, request, response)
        }

        next();
    }

}




export class ErrorController {

    public static processError(error, req: Request, res: Response, details: any = []) {
        return new Promise((resolve, reject) => {
            //console.log(util.inspect(res));
            let data = this.getResponseJson(error.code, error.message, req, res, details);

            return resolve(ResponseFormatter.response(res, req, data, error.status));

        });
    }

    private static getDebugInformation(req: Request, res: Response) {
        return {
            request: {
                request_url: req.originalUrl,
                request_queryParams: req.query,
                request_uriParams: req.params,
                request_postParams: req.body,
            }
        };
    }

    private static getResponseJson(code: number, message: string, req: Request, res: Response, details: any = []) {
        let resp = {
            success: false,
            code: code,
            message: message,
            debug: this.getDebugInformation(req, res),
            extraDetails: details
        };
        if (!details || details.length <= 0) {
            delete resp.extraDetails;
        }
        return resp;
    }

}