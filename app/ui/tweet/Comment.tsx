import {Card, CardBody, CardHeader} from "@nextui-org/card";
import useFetchComments from "@/app/ui/hooks/useFetchComments";
import {Dispatch, SetStateAction, useCallback} from "react";
import {Avatar} from "@nextui-org/avatar";
import {Button, Input} from "@nextui-org/react";
import {ITweet} from "@/app/lib/definitions";

interface CommentProps {
    tweet: ITweet,
    setTweet: Dispatch<SetStateAction<ITweet | undefined>>
}

export default function Comment(commentProps: CommentProps) {

    const {comments, comment} = useFetchComments(
         commentProps.tweet, 
         commentProps.setTweet
    );

    const renderComments = useCallback(() => {
        return comments.map((comment) => {
            return (
                <Card key={comment.id}>
                    <CardHeader className="flex flex-row gap-5">
                        <Avatar
                            isBordered
                            radius='full'
                            size='md'
                            src={comment.Owner.profilePicturePath}
                            alt='ProfilePicture'
                        />
                        <div className="flex flex-col gap-1 items-start justify-center">
                            <h4 className="text-small font-semibold leading-none text-default-600">
                                {comment.Owner.displayName}
                            </h4>
                            <h5 className="text-small tracking-tight text-default-400">
                                @{comment.Owner.name}
                            </h5>
                        </div>

                    </CardHeader>
                    <CardBody>
                        <p>{comment.text}</p>
                    </CardBody>
                </Card>
            )
        })
    }, [comments])

    return (
        <Card className="w-screen lg:w-[30rem]">
            <CardHeader>
                <form className="w-full h-full flex gap-5 items-center" action={comment}>
                    <Input
                        name="text"
                        type="text"
                        placeholder="Share your thoughts"
                        variant="bordered"
                        radius="full"
                        size="sm"
                        isRequired

                        className="flex-1"
                    />

                    <Button
                        radius="full"
                        color="success"
                        variant="shadow"
                        type="submit"
                    >
                        Comment
                    </Button>
                </form>
            </CardHeader>
            <CardBody className="flex flex-col gap-5">
                {renderComments()}
            </CardBody>
        </Card>
    )
}