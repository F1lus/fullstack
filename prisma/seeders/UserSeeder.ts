import { faker } from '@faker-js/faker'
import { PrismaClient } from '@prisma/client'

/**
 * Creates a fake user
 * 
 * @param prisma 
 * @returns 
 */
export async function UserSeeder(prisma: PrismaClient) {
    return await prisma.user.create({ 
        data: {
            name: faker.internet.userName(),
            displayName: faker.internet.displayName(),
            email: faker.internet.email(),
            role: faker.helpers.arrayElement([ 'common', 'common', 'common', 'admin' ]),
            description: faker.helpers.arrayElement([ faker.commerce.productDescription(), null ]),
            profilePicturePath: '/profile_ph.webp',
            password: faker.internet.password()
        },
        include: {
            likedTweets: true,
            likedComments: true
        }
     })
}