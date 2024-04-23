import {GlobalPrisma} from "@/app/lib/GlobalPrisma";

export function getProfileInfo(userId: string) {
    return GlobalPrisma.user.findUnique({
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
}