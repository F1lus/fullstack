import { GlobalPrisma } from "@/app/lib/GlobalPrisma";
import { SHA256, enc } from 'crypto-js'

/**
 * Finds a unique user in the database
 * 
 * @param email this is a unique value in the database
 * @param password
 * 
 * @throws if the user could not be found
 * @returns id, name, displayName, session
 */
export async function findUserByLogin(email: string, password: string) {
    const hash = SHA256(password)

    return await GlobalPrisma.user.findUniqueOrThrow({
        select: {
            id: true,
            name: true,
            displayName: true,
            session: true
        },
        where: {
            email,
            password: hash.toString(enc.Hex)
        }
    })
}

/**
 * Creates a new 1-1 relation between a user, and a newly created session.
 * 
 * @param id the user's id
 * @param token the generated JWT
 */
export async function createUserSession(id: string, token: string) {
    try {
        await GlobalPrisma.user.update({
            where: { id },
            data: {
                session: {
                    create: {
                        token
                    }
                }
            }
        })
    } catch {}
}

/**
 * Finds a unique user by email
 * 
 * @param email this is a unique value in the database
 * @returns User ID
 */
export async function findUserByEmail(email: string) {
    return await GlobalPrisma.user.findUnique({
        select: {
            id: true
        },
        where: { email }
    })
}

/**
 * Finds a unique user by its username
 * 
 * @param name this is a unique value in the database
 * @returns User ID
 */
export async function findUserByUsername(name: string) {
    return await GlobalPrisma.user.findUnique({
        select: {
            id: true
        },
        where: { name }
    })
}

/**
 * Creates a new user in the database with the given parameters
 * 
 * @param email this is a unique value in the database
 * @param name this is a unique value in the database
 * @param displayName 
 * @param password 
 * 
 * @throws if the unique constraint fails
 * 
 * @returns the created user
 */
export async function registerUser(email: string, name: string, displayName: string, password: string) {
    const hash = SHA256(password)

    return await GlobalPrisma.user.create({
        data: {
            email,
            name,
            displayName,
            password: hash.toString(enc.Hex)
        }
    })
}

export async function getUserSession(userId: string) {
    return await GlobalPrisma.user.findUniqueOrThrow({
        select: {
            session: true
        },
        where: {
            id: userId
        }
    })
}

export async function deleteUserSession(userId: string) {
    return await GlobalPrisma.session.delete({
        where: {
            userId
        }
    })
}