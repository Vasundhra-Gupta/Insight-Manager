import { icons } from '../Assets/icons';
import { CONTRIBUTORS } from '../Constants/constants';
import { ContributorCard } from '../Components';

export default function SupportPage() {
    const contributorElements = CONTRIBUTORS?.map((contributor) => (
        <ContributorCard key={contributor.name} contributor={contributor} />
    ));

    return (
        <div className="h-full w-full text-black flex flex-col justify-start items-center gap-14">
            <div className="flex items-center justify-center flex-col gap-6">
                <div className="bg-[#ffffff] group rounded-full overflow-hidden drop-shadow-xl hover:drop-shadow-lg hover:brightness-105 w-fit">
                    <div className="size-[100px] fill-[#3a67d8] ">
                        {icons.support}
                    </div>
                </div>

                <div className="text-3xl font-semibold underline">
                    Contact for any Issue or Support
                </div>
            </div>

            <div className="grid grid-cols-[repeat(auto-fit,minmax(330px,1fr))] w-full lg:w-[80%] gap-10">
                {contributorElements}
            </div>
        </div>
    );
}
