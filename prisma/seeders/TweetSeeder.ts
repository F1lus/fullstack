import { faker } from "@faker-js/faker";
import { PrismaClient } from "@prisma/client";

export async function TweetSeeder(prisma: PrismaClient, userId: string) {
    return await prisma.tweet.create({
        data: {
            description: faker.commerce.productDescription(),
            retweets: 0,
            isRetweet: false,
            userId
        },
        include: {
            likes: true,
            comments: true
        }
    })
}