import { UserSeeder } from "./UserSeeder";
import { TweetSeeder } from "./TweetSeeder";
import { CommentSeeder } from "./CommentSeeder";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient()
const RANDOM_CHANCE = 0.25

async function seed() {
    for (const _ of Array(5)) {
        const user = await UserSeeder(prisma)
        const tweet = await TweetSeeder(prisma, user.id)
        const comment = await CommentSeeder(prisma, user.id, tweet.id)

        const shouldLikeTweet = Math.random() < RANDOM_CHANCE
        const shouldLikeComment = Math.random() < RANDOM_CHANCE

        if(shouldLikeTweet) {
            const a = await prisma.user.update({
                where: { id: user.id },
                data: {
                    likedTweets: {
                        connect: [
                            { id: tweet.id }
                        ]
                    }
                }
            })

            console.log(a)
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