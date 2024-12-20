import { Link } from 'react-router-dom';
import { icons } from '../../Assets/icons';
import { Button } from '..';
import { useState } from 'react';
import { CONTRIBUTORS, LOGO } from '../../Constants/constants';
import { usePopupContext } from '../../Context';

export default function Footer() {
    const [feedback, setFeedback] = useState('');
    const { setShowPopup, setPopupText } = usePopupContext();

    const socialElements = Object.entries(CONTRIBUTORS[0].socials).map(
        ([platform, url]) => (
            <Link key={platform} to={url} target="_blank">
                <div className="bg-[#dadada] p-2 rounded-full drop-shadow-md hover:bg-[#c9c9c9] w-fit">
                    <div className="size-[20px]">{icons[platform]}</div>
                </div>
            </Link>
        )
    );

    const links = [
        { path: '/', name: 'Home' },
        { path: '/support', name: 'Support' },
        { path: '/about-us', name: 'About Us' },
        { path: '/add', name: 'Add Blog' },
    ];

    const linkElements = links.map((link) => (
        <p className="text-center" key={link.name}>
            <Link
                to={link.path}
                className="hover:text-[#4977ec] hover:underline"
            >
                {link.name}
            </Link>
        </p>
    ));

    function submitFeedback(e) {
        e.preventDefault();
        setFeedback('');
        setShowPopup(true);
        setPopupText('Feedback Submitted Successfully 🤗');
    }

    return (
        <div className="px-10 pt-6 pb-4 bg-[#f6f6f6]">
            <div className="flex items-start justify-between ">
                <div className="w-full">
                    <p className="text-black font-medium text-lg">
                        Stay Social, Stay Organized.
                    </p>

                    <Link
                        to={'/'}
                        className="flex items-center mt-4 justify-start gap-4"
                    >
                        <div>
                            <div className="size-[50px] rounded-full overflow-hidden drop-shadow-md">
                                <img
                                    src={LOGO}
                                    alt="peer connect logo"
                                    className="object-cover size-full"
                                />
                            </div>
                        </div>
                        <div className="text-black text-lg font-medium">
                            Peer Connect
                        </div>
                    </Link>
                </div>

                <div className="w-full pr-10">
                    <p className="text-center underline text-lg font-medium text-black">
                        Quick Links
                    </p>
                    <div className="mt-2 text-black grid grid-cols-2 gap-x-[10%] w-full">
                        {linkElements}
                    </div>
                </div>

                <form
                    onSubmit={submitFeedback}
                    className="w-full pl-[10%] flex flex-col items-start justify-center gap-4"
                >
                    <p className="text-black text-lg font-medium underline">
                        Provide a Feedback
                    </p>
                    <input
                        type="text"
                        placeholder="Provide a Feedback !!"
                        value={feedback}
                        onChange={(e) => setFeedback(e.target.value)}
                        className="bg-transparent border-black border-[0.01rem] w-[80%] indent-2 rounded-md p-2 text-black placeholder:text-[15px] placeholder:text-[#505050]"
                    />
                    <Button
                        btnText={'Submit'}
                        className="text-white mt-2 rounded-md py-[5px] px-3 bg-[#4977ec] hover:bg-[#3b62c2]"
                    />
                </form>
            </div>

            <hr className="w-full mt-6 mb-4" />

            <div className="flex items-center justify-between w-full">
                <p className="text-black text-sm">
                    &copy; 2024 Peer Connect. All rights reserved.
                </p>
                <div className="flex items-center justify-center gap-4">
                    {socialElements}
                </div>
            </div>
        </div>
    );
}
