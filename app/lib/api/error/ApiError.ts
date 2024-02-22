export type IFormError = { [key: string]: string | undefined }

export interface IRegisterFormError extends IFormError {
    email?: string,
    username?: string,
    displayName?: string,
    password?: string,
    passwordRepeat?: string,
    termsAccepted?: string
}

export interface ILoginFormError extends IFormError {
    email?: string,
    password?: string
}

type ParamType = { message: string, statusCode: number, formError?: IFormError }

export abstract class ApiError extends Error {

    protected constructor(protected readonly params: ParamType) {
        super(params.message)
    }

    abstract sendError(): Response;
}