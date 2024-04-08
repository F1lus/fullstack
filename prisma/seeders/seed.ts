import { UserSeeder } from "./UserSeeder";
import { TweetSeeder } from "./TweetSeeder";
import { CommentSeeder } from "./CommentSeeder";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient()
const RANDOM_CHANCE = 0.25

/**
 * Database seeder entry point
 * 
 * A seeder will only execute when it is called within this function
 */
async function seed() {
    for (const _ of Array(20)) {
        const user = await UserSeeder(prisma)
        const tweet = await TweetSeeder(prisma, user.id)
        const comment = await CommentSeeder(prisma, user.id, tweet.id)

        const shouldLikeTweet = Math.random() < RANDOM_CHANCE
        const shouldLikeComment = Math.random() < RANDOM_CHANCE

        if(shouldLikeTweet) {
            await prisma.user.update({
                where: { id: user.id },
                data: {
                    likedTweets: {
                        connect: [
                            { id: tweet.id }
                        ]
                    }
                }
            })
        }

        if(shouldLikeComment) {
            await prisma.user.update({
                where: { id: user.id },
                data: {
                    likedComments: {
                        connect: {
                           id: comment.id
                        }
                    }
                },
                include: {
                    likedComments: true
                }
            })
        }
    }
}

seed()
    .then(async () => await prisma.$disconnect())
    .catch(async e => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })