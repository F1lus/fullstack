import {Reply} from "../lib/api/Reply";

export async function POST() {
    return Reply.send({
        status: 'You are logged in!'
    })
}