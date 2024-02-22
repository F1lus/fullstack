import { JSONResponse } from "../lib/api/JSONResponse";

export async function POST() {
    return JSONResponse.status(200)
        .send({
            status: 'You are logged in!'
        })
}