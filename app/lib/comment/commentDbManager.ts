import {GlobalPrisma} from "@/app/lib/GlobalPrisma";

export function getAllCommentsForTweet(tweetId: string) {
    return GlobalPrisma.comment.findMany({
        select: {
            id: true,
            text: true,
            createdAt: true,
            modifiedAt: true,
            Owner: {
                select: {
                    id: true,
                    name: true,
                    displayName: true,
                    profilePicturePath: true,
                }
            },
            _count: {
                select: {
                    likes: true
                }
            },
        },
        where: {
            tweetId
        }
    })
}