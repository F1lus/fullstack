'use server'

import {Tweet} from "@prisma/client"
import {GlobalPrisma} from "../GlobalPrisma"

/**
 * Gets all the tweets from the database with pagination
 * - the page parameter starts with 1
 * - a page contains 10 elements at the most
 * - the elements are ordered by the createdAt attribute
 * - if there page is out of bounds, the function returns an empty array
 *
 * @param page 1-based parameter = [1;Infinity)
 * @returns Tweet array
 */
export async function getAllTweets(page: number = 1) {
    if (page < 1) {
        return [] as Tweet[]
    }
    return GlobalPrisma.tweet.findMany({
        skip: 10 * (page - 1),
        take: 10,
        //TODO: Add cursor based pagination
        select: {
            id: true,
            description: true,
            createdAt: true,
            modifiedAt: true,
            retweets: true,
            comments: true,
            likes: true,
            Owner: true
        },
        orderBy: {
            createdAt: 'desc'
        }
    })
}

/**
 * Gets all the tweets of a specific user from the database with pagination
 * - the page parameter starts with 1
 * - a page contains 10 elements at the most
 * - the elements are ordered by the createdAt attribute
 * - if there page is out of bounds, the function returns an empty array
 *
 * @param page 1-based parameter = [1;Infinity)
 * @param userId the ID of the user
 * @returns Tweet array
 */
export async function getUserTweets(userId: string, page: number = 1) {
    if (page < 1) {
        return [] as Tweet[]
    }

    return GlobalPrisma.tweet.findMany({
        skip: 10 * (page - 1),
        take: 10,
        //TODO: Add cursor based pagination
        select: {
            description: true,
            createdAt: true,
            modifiedAt: true,
            originalTweet: true,
            retweets: true,
            comments: true,
            likes: true,
            Owner: true
        },
        where: {
            userId
        },
        orderBy: {
            createdAt: 'desc'
        }
    })
}

/**
 * Retrieves one tweet from the database by ID
 *
 * @param tweetId
 * @returns tweet if the ID exists, otherwise undefined
 */
export async function getTweet(tweetId: string) {
    return GlobalPrisma.tweet.findUnique({
        select: {
            description: true,
            createdAt: true,
            modifiedAt: true,
            originalTweet: true,
            retweets: true,
            comments: true,
            likes: true,
            Owner: true
        },
        where: {
            id: tweetId
        }
    })
}

/**
 * Creates a new tweet
 *
 * @param userId
 * @param description
 * @returns boolean = did the query execute
 */
export async function createTweet(userId: string, description: string) {
    const tweet = await GlobalPrisma.tweet.create({
        data: {
            description,
            Owner: {
                connect: {
                    id: userId
                }
            }
        }
    })

    return !!tweet
}

/**
 * Removes a tweet from the database
 *
 * @param tweetId the tweet to be removed
 * @param userId the user who sent the request
 * @returns boolean = did the query execute
 */
export async function deleteTweet(tweetId: string, userId: string) {
    const deletedTweet = await GlobalPrisma.tweet.delete({
        where: {
            id: tweetId,
            userId
        }
    })

    return !!deletedTweet
}

/**
 * Modifies a tweet in the database
 * - also updates the modifiedAt property to the current DateTime
 *
 * @param tweetId the tweet to be modified
 * @param userId the user who sent the request
 * @param description the new description
 * @returns boolean = did the query execute
 */
export async function modifyTweet(tweetId: string, userId: string, description: string) {
    const tweet = await GlobalPrisma.tweet.update({
        data: {
            description
        },
        where: {
            id: tweetId,
            userId
        }
    })

    return !!tweet
}

/**
 * Toggles the like on a tweet
 * - if the user has already liked the tweet, the like will be removed
 * - if the user has not liked the tweet yet, the like will be added
 *
 * @param tweetId
 * @param userId
 * @returns boolean = did the query execute
 */
export async function toggleTweetLike(tweetId: string, userId: string) {
    try {
        const user = await GlobalPrisma.user.findUniqueOrThrow({
            select: {
                likedTweets: true
            },
            where: {
                id: userId
            }
        })

        const isTweetLiked = user.likedTweets.some(tweet => tweet.id === tweetId)
        const updateBody = {
            [isTweetLiked ? "connect" : "disconnect"]: {
                id: tweetId
            }
        }

        const updateQuery = await GlobalPrisma.user.update({
            where: {
                id: userId
            },
            data: {
                likedTweets: {
                    ...updateBody
                }
            }
        })

        return !!updateQuery

    } catch {
        return false
    }
}

/**
 * Retweets a tweet
 *
 * Retweeting means that we create a new tweet
 * which has a parent tweet
 *
 * @param userId the user who wants to retweet something
 * @param tweetId the tweet to be retweeted
 * @param description the description for the tweet
 * @returns boolean = did the query execute
 */
export async function retweet(tweetId: string, userId: string, description: string) {
    const tweet = await GlobalPrisma.tweet.create({
        data: {
            description,
            Owner: {
                connect: {
                    id: userId
                }
            },
            originalTweet: {
                connect: {
                    id: tweetId
                }
            }
        }
    })

    return !!tweet
}