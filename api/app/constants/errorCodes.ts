export const ErrorCodes = {
    /**
     * @apiDefine errorCodeNotAvailableError
     * @apiError (Error 5xx) errorCodeNotAvailableError Error code not available.
     * @apiErrorExample errorCodeNotAvailableError-Response:
     *     HTTP/1.1 501 Not IMPLEMENTED
     *     {
     *      "success": false,
     *      "message": "Error code not available."
     *     }
     */

    errorCodeNotAvailable: {code: 0, message: 'Error code not available.', status: 501},
    /**
     * @apiDefine resourceNotFoundError
     * @apiError (Error 4xx) resourceNotFoundError Unable to find resources matching your request.
     * @apiErrorExample resourceNotFoundError-Response:
     *     HTTP/1.1 404 Not found
     *     {
     *      "success": false,
     *      "message": "Unable to find resources matching your request."
     *     }
     */

    resourceNotFound: {code: 1, message: 'Unable to find resources matching your request.', status: 404},
    /**
     * @apiDefine resourceNotValidError
     * @apiError (Error 4xx) resourceNotValidError Unable to save the resource since errors are present.
     * @apiErrorExample resourceNotValidError-Response:
     *     HTTP/1.1 409 Conflict
     *     {
     *      "success": false,
     *      "message": "Unable to save the resource since errors are present."
     *     }
     */
    resourceNotValid: {code: 2, message: 'Unable to save the resource since errors are present.', status: 409},

    /**
     * @apiDefine unauthorizedAccessError
     * @apiError (Error 4xx) unauthorizedAccessError You do not have access to the specified resource.
     * @apiErrorExample unauthorizedAccessError-Response:
     *     HTTP/1.1 401 Unauthorized
     *     {
     *      "success": false,
     *      "message": "You do not have access to the requested resource."
     *     }
     */
    unauthorizedAccess: {code: 6, message: 'You do not have access to the requested resource.', status: 401},

    /**
     * @apiDefine dataValidationFailed
     * @apiError (Error 4xx) dataValidationFailed The data you have submitted failed at validation step.
     * @apiErrorExample dataValidationFailed-Response:
     *     HTTP/1.1 406 Not Acceptable
     *     {
     *      "success": false,
     *      "message": "The data you have submitted failed at validation step."
     *     }
     */
    dataValidationFailed: {code: 9, message: 'The data you have submitted failed at validation step.', status: 406},

};
