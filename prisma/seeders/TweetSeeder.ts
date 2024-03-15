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
    return await prisma.tweet.create({
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