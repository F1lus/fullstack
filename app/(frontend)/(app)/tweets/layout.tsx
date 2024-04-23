import {ReactNode} from "react";

export default function TweetLayout({children}: { children: ReactNode }) {

    return (
        <section className="flex flex-col items-center">
            { children }
        </section>
    )

}