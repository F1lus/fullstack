import {Reply} from "@/app/lib/api/Reply";
import {ApiError, IFormError} from "@/app/lib/api/error/ApiError";

export class FormError<T extends IFormError> extends ApiError {

    constructor(formError: T, statusCode: number = 400) {
        super({message: "A form error has occurred!", statusCode, formError});
    }

    sendError() {
        return Reply.withStatus(this.params.statusCode).formError(this.params.formError!)
    }

}