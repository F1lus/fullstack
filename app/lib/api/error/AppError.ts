import {Reply} from "@/app/lib/api/Reply";
import {ApiError} from "@/app/lib/api/error/ApiError";

export class AppError extends ApiError {

    constructor(message: string, statusCode: number = 400) {
        super({message, statusCode});
    }

    sendError() {
        return Reply.withStatus(this.params.statusCode).error(this.message)
    }
}