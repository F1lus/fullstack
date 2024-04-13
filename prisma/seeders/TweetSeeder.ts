import { faker } from "@faker-js/faker";
import { PrismaClient } from "@prisma/client";

/**
 * Creates a fake tweets
 * 
 * @param prisma 
 * @param userId 
 * @returns 
 */
export async function TweetSeeder(prisma: PrismaClient, userId: string) {
    return prisma.tweet.create({
        data: {
            description: faker.commerce.productDescription(),
            userId
        },
        include: {
            likes: true,
            comments: true
        }
    })
}

export async function RetweetSeeder(prisma: PrismaClient, userId: string, tweetId: string) {
    return prisma.tweet.create({
        data: {
            description: faker.commerce.productDescription(),
            originalTweetId: tweetId,
            userId
        },
        include: {
            likes: true,
            comments: true
        }
    })
}