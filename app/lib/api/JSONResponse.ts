export class JSONResponse {

    private static statusCode = 200

    private constructor() {}

    static status(statusCode: number) { 
        this.statusCode = statusCode
        return this
    }

    static send(content: any = {}) {
        return Response.json(
            content, 
            { 
                status: this.statusCode
            }
        )
    }

    static error(content: string) {
        return this.send({ error: content })
    }

    static formError(content: object) {
        return this.send({ formError: content })
    }
}