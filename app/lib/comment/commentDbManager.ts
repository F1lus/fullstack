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

export function createComment(tweetId: string, userId: string, text: string) {
    return GlobalPrisma.comment.create({
        data: {
            text,
            tweetId,
            userId
        },
        include: {
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
            }
        }
    })
}

export function updateComment(commentId: string, userId: string, text: string) {
    return GlobalPrisma.comment.update({
        data: {
            text
        },
        where: {
            id: commentId,
            userId
        }
    })
}