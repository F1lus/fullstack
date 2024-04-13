'use server'

import {GlobalPrisma} from "@/app/lib/GlobalPrisma";
import {enc, SHA256} from 'crypto-js'
import {AppError} from "@/app/lib/api/error/AppError";

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
    try {
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
        });
    } catch {
        throw new AppError('The username or password was incorrect!', 400)
    }
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
            where: {id},
            data: {
                session: {
                    create: {
                        token
                    }
                }
            }
        })
    } catch {

    }
}

/**
 * Finds a unique user by email
 *
 * @param email this is a unique value in the database
 * @returns User ID
 */
export async function findUserByEmail(email: string) {
    return GlobalPrisma.user.findUnique({
        select: {
            id: true
        },
        where: {email}
    });
}

/**
 * Finds a unique user by its username
 *
 * @param name this is a unique value in the database
 * @returns User ID
 */
export async function findUserByUsername(name: string) {
    return GlobalPrisma.user.findUnique({
        select: {
            id: true
        },
        where: {name}
    });
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

    return GlobalPrisma.user.create({
        data: {
            email,
            name,
            displayName,
            password: hash.toString(enc.Hex)
        }
    });
}

/**
 * Retrieves the session of a user
 *
 * @param userId
 * @returns user session if there is any
 */
export async function getUserSession(userId: string) {
    try {
        return await GlobalPrisma.user.findUniqueOrThrow({
            select: {
                session: true
            },
            where: {
                id: userId
            }
        });
    } catch {
        throw new AppError("This user does not exists!")
    }
}

/**
 * Removes a user session from the database
 *
 * @param userId
 * @returns
 */
export async function deleteUserSession(userId: string) {
    return GlobalPrisma.session.delete({
        where: {
            userId
        }
    });
}

export async function getUserById(userId: string) {
    try {
        return await GlobalPrisma.user.findUniqueOrThrow({
            select: {
                id: true
            },
            where: {
                id: userId
            }
        });
    } catch {
        throw new AppError("This user does not exists!")
    }
}