import {IFormError} from "@/app/lib/api/error/ApiError";

function sendResponse(content: object = {}, statusCode: number = 200) {
    return Response.json(
        content,
        {
            status: statusCode
        }
    )
}

function withStatus(statusCode: number = 200) {
    return {
        send: (content: object = {}) => sendResponse(content, statusCode),
        error: (message: string) => sendResponse({error: message}, statusCode),
        formError: (content: IFormError) => sendResponse({formError: content}, statusCode)
    }
}

export const Reply = {
    withStatus,
    send: (content: object = {}) => sendResponse(content),
    error: (message: string) => sendResponse({error: message}, 400),
    formError: (content: IFormError) => sendResponse({formError: content}, 400)
}