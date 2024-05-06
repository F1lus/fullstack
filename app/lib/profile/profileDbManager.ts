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

interface ProfileProps {
    id: string,
    userId: string,
    profilePicturePath?: string,
    description?: string,

}

export function updateProfile() {

}