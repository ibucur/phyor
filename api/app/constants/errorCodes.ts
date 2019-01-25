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
    /**
     * @apiDefine resourceNotValid
     * @apiError (Error 4xx) resourceNotValid The provided provided e-mail address is already in use.
     * @apiErrorExample resourceNotValid-Response:
     *     HTTP/1.1 409 Conflict
     *     {
     *      "success": false,
     *      "message": "Unable to save the user details. The password is not a valid one."
     *     }
     */
    userPasswordNotValid: {code: 3, message: 'Unable to save the user details. The password is not a valid one.', status: 409},
    /**
     * @apiDefine invalidLoginCredentialsError
     * @apiError (Error 4xx) invalidLoginCredentialsError The provided credentials are incorrect.
     * @apiErrorExample invalidLoginCredentialsError-Response:
     *     HTTP/1.1 401 Unauthorized
     *     {
     *      "success": false,
     *      "message": "Unable to authenticate the user using provided credentials."
     *     }
     */
    invalidLoginCredentials: {code: 5, message: 'Unable to authenticate the user using provided credentials.', status: 401},

    /**
     * @apiDefine failedToAuthenticateTokenError
     * @apiError (Error 4xx) failedToAuthenticateTokenError The provided token is not correct.
     * @apiErrorExample failedToAuthenticateTokenError-Response:
     *     HTTP/1.1 401 Unauthorized
     *     {
     *      "success": false,
     *      "message": "The authorization token provided is not correct."
     *     }
     */
    failedToAuthenticateToken: {code: 7, message: 'The authorization token provided is not correct.', status: 401},
    /**
     * @apiDefine authenticationTokenExpiredError
     * @apiError (Error 4xx) authenticationTokenExpiredError The provided token expired. You need to login again to get a new token.
     * @apiErrorExample authenticationTokenExpiredError-Response:
     *     HTTP/1.1 401 Unauthorized
     *     {
     *      "success": false,
     *      "message": "The authorization token provided is expired."
     *     }
     */
    authenticationTokenExpired: {code: 8, message: 'The authorization token provided is expired.', status: 401},

};
