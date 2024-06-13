import {ApiError} from "@/app/lib/api/error/ApiError";
import {Reply} from "@/app/lib/api/Reply";

export function ErrorHandler(error: any) {
    if (error instanceof ApiError) {
        return error.sendError()
    }

    return Reply.withStatus(500).error("Request could not be processed!")
}