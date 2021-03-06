import {Request, Response} from "express";
import * as util from "util";
import {isNullOrUndefined} from "util";
import {Res} from "routing-controllers";
const js2xmlparser = require("js2xmlparser");

export class ResponseFormatter {
    public static removeXMLTransformDetails(data: any): any {
        if (isNullOrUndefined(data) || isNullOrUndefined(data["="])) return data;
        delete data["="];
        data["id"] = data["@1"]["id"];
        delete data["@1"];

        return data;
    }

    public static removeXMLTransformData(data: any): any {
        if (Array.isArray(data)) {
            for (let i = 0; i < data.length; i++) {
                data[i] = ResponseFormatter.removeXMLTransformDetails(data[i]);
                if (!isNullOrUndefined(data[i]['author'])) data[i]['author'] = ResponseFormatter.removeXMLTransformDetails(data[i]['author']);
                if (!isNullOrUndefined(data[i]['genre'])) data[i]['genre'] = ResponseFormatter.removeXMLTransformDetails(data[i]['genre']);
                if (!isNullOrUndefined(data[i]['publisher'])) data[i]['publisher'] = ResponseFormatter.removeXMLTransformDetails(data[i]['publisher']);
                if (!isNullOrUndefined(data[i]['language'])) data[i]['language'] = ResponseFormatter.removeXMLTransformDetails(data[i]['language']);
                if (!isNullOrUndefined(data[i]['currency'])) data[i]['currency'] = ResponseFormatter.removeXMLTransformDetails(data[i]['currency']);
            }
        }
        else if (!isNullOrUndefined(data.sameAuthor) && !isNullOrUndefined(data.sameGenre) && !isNullOrUndefined(data.samePublisher) && !isNullOrUndefined(data.sameLanguage)) {
            data.sameAuthor = ResponseFormatter.removeXMLTransformData(data.sameAuthor);
            data.sameGenre = ResponseFormatter.removeXMLTransformData(data.sameGenre);
            data.samePublisher = ResponseFormatter.removeXMLTransformData(data.samePublisher);
            data.sameLanguage = ResponseFormatter.removeXMLTransformData(data.sameLanguage);
        }
        else {
            data = ResponseFormatter.removeXMLTransformDetails(data);
        }
        return data;
    }

    public static response(res: any, req:any, data: any, status: number = 200, xmlRoot: string = 'root'): any {
        if (!req.headers["accept"] || isNullOrUndefined(req.headers["accept"]) || req.headers.accept == 'application/json' || req.headers.accept == '*/*') {
            res.setHeader('Content-Type', 'application/json');
            res.status(status);
            data = ResponseFormatter.removeXMLTransformData(data);
            return res.json(data);
        }
        else if (!isNullOrUndefined(req.headers["accept"]) && req.headers.accept == 'application/xml') {
            res.setHeader('Content-Type', 'application/xml');
            res.status(status);
            return res.send(js2xmlparser.parse(xmlRoot, data));
        }
        else {
            res.setHeader('Content-Type', 'application/json');
            res.status(status);

            data = ResponseFormatter.removeXMLTransformData(data);

            return res.json(data);
        }
    }
}