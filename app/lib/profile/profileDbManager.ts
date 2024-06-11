import {GlobalPrisma} from "@/app/lib/GlobalPrisma";
import {AppError} from "@/app/lib/api/error/AppError";

export function getProfileInfo(userId: string) {
    try {
        return GlobalPrisma.user.findUniqueOrThrow({
            select: {
                id: true,
                name: true,
                displayName: true,
                description: true,
                profilePicturePath: true,
                createdAt: true,
            },
            where: {
                id: userId
            }
        })
    } catch (error) {
        throw new AppError('User could not be found!', 404)
    }
}

export function getProfileData(userId: string) {
    try {
        return GlobalPrisma.user.findUniqueOrThrow({
            select: {
                id: true,
                name: true,
                email: true,
                password: true,
                displayName: true,
                description: true,
                profilePicturePath: true,
                createdAt: true,
            },
            where: {
                id: userId
            }
        })
    } catch (error) {
        throw new AppError('User could not be found!', 404)
    }
}

interface ProfileProps {
    id: string,
    userId: string,
    profilePicturePath?: string,
    description?: string,

}

export function updateProfile(
    userId: string,
    profilePicturePath: string,
    displayName: string,
    email: string,
    description: string | null,
    password: string,
) {

    return GlobalPrisma.user.update({
        data: {
            displayName,
            email,
            description,
            profilePicturePath,
            password,
        },
        where: {
            id: userId
        }
    })
}