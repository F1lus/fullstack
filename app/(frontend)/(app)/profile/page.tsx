import {Avatar} from "@nextui-org/avatar";

export default function ProfilePage() {

    return (
        <div
            className="w-full grid grid-rows-[60vh_1fr] gap-5 items-start lg:grid lg:grid-cols-[25vw_1fr] lg:h-[calc(100vh-6rem)]"
        >
            <div
                className="h-full bg-white p-6 rounded-xl shadow-lg flex flex-col items-center"
            >
                <Avatar
                    isBordered
                    radius='full'
                    src="/images/bird.png"
                    alt='ProfilePicture'
                    className="w-32 h-32 text-large"
                />
                <div
                    className="flex flex-col gap-2 items-center justify-center grow"
                >
                    <p>Istók István</p>
                    <p>@ististi</p>
                    <p>istok.istvan2001@gmail.com</p>
                    <p>
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris imperdiet ac urna quis
                        gravida.
                    </p>
                </div>
            </div>


            <div
                className="h-full w-full bg-white p-6 rounded-xl shadow-lg flex flex-col items-center gap-5 md:row-span-2 md:overflow-y-auto"
            >
                <p>asd</p>
                <p>asd</p>
                <p>asd</p>
                <p>asd</p>
                <p>asd</p>
                <p>asd</p>
                <p>asd</p>
                <p>asd</p>
                <p>asd</p>
                <p>asd</p>
                <p>asd</p>
                <p>asd</p>
                <p>asd</p>
                <p>asd</p>
                <p>asd</p>
                <p>asd</p>
                <p>asd</p>
                <p>asd</p>
                <p>asd</p>
                <p>asd</p>
                <p>asd</p>
                <p>asd</p>
                <p>asd</p>
                <p>asd</p>
                <p>asd</p>
                <p>asd</p>
                <p>asd</p>
                <p>asd</p>
                <p>asd</p>
                <p>asd</p>
                <p>asd</p>
                <p>asd</p>
                <p>asd</p>
                <p>asd</p>
                <p>asd</p>
                <p>asd</p>
                <p>asd</p>
                <p>asd</p>
                <p>asd</p>
                <p>asd</p>
                <p>asd</p>
                <p>asd</p>
                <p>asd</p>
                <p>asd</p>
                <p>asd</p>
                <p>asd</p>
                <p>asd</p>
                <p>asd</p>
                <p>asd</p>
                <p>asd</p>
                <p>asd</p>
                <p>asd</p>
                <p>asd</p>
                <p>asd</p>
                <p>asd</p>
                <p>asd</p>
                <p>asd</p>
                <p>asd</p>
                <p>asd</p>
                <p>asd</p>
                <p>asd</p>
            </div>
        </div>
    )
}