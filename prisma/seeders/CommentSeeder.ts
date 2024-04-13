import { faker } from "@faker-js/faker";
import { PrismaClient } from "@prisma/client";

/**
 * Creates a fake comment for a tweets
 * 
 * @param prisma 
 * @param userId 
 * @param tweetId 
 * @returns 
 */
export async function CommentSeeder(prisma: PrismaClient, userId: string, tweetId: string) {
    return prisma.comment.create({
        data: {
            text: faker.lorem.sentences({ min: 1, max: 6 }),
            userId,
            tweetId
        },
        include: {
            likes: true
        }
    })
}