import { faker } from "@faker-js/faker";
import { PrismaClient } from "@prisma/client";

export async function CommentSeeder(prisma: PrismaClient, userId: string, tweetId: string) {
    return await prisma.comment.create({
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