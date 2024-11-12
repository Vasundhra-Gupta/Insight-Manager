import { Link } from 'react-router-dom';
import { icons } from '../../Assets/icons';
import { Button } from '..';
import { useState } from 'react';
import { LOGO } from '../../Constants/constants';
import { usePopupContext } from '../../Context';

export default function Footer() {
    const [feedback, setFeedback] = useState('');
    const { setShowPopup, setPopupText } = usePopupContext();

    const socials = [
        {
            link: 'https://discord.com/channels/@sania_singla',
            icon: icons.discord,
        },
        { link: 'https://github.com/Sania-Singla', icon: icons.gitHub },
        {
            link: 'https://www.instagram.com/sania__singla',
            icon: icons.instagram,
        },
        { link: 'https://x.com/sania_singla', icon: icons.threads },
        {
            link: 'https://www.linkedin.com/in/sania-singla',
            icon: icons.linkedIn,
        },
    ];

    const socialElements = socials.map((social) => (
        <Link key={social.link} to={social.link} target="_blank">
            <div className="bg-[#dadada] p-2 rounded-full drop-shadow-xl hover:bg-[#c9c9c9] w-fit">
                <div className="size-[20px]">{social.icon}</div>
            </div>
        </Link>
    ));

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

    return (
        <div className="px-10 pt-6 pb-4 bg-[#f6f6f6]">
            <div className="flex items-start justify-between ">
                <div className="w-full">
                    <p className="text-black font-medium text-lg">
                        Stay Social, Stay Organized.
                    </p>

                    <div className="flex items-center mt-4 justify-start gap-4">
                        <div>
                            <div className="size-[50px] rounded-full overflow-hidden drop-shadow-xl">
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
                    </div>
                </div>

                <div className="w-full pr-10">
                    <p className="text-center underline text-lg font-medium text-black">
                        Quick Links
                    </p>
                    <div className="mt-2 text-black grid grid-cols-2 gap-x-[10%] w-full">
                        {linkElements}
                    </div>
                </div>

                <div className="w-full pl-[10%] flex flex-col items-start justify-center gap-4">
                    <p className="text-black text-lg font-medium underline">
                        Provide a Feedback
                    </p>
                    <input
                        type="text"
                        placeholder="Drop a Feedback !!"
                        value={feedback}
                        onChange={(e) => setFeedback(e.target.value)}
                        className="bg-transparent border-black border-[0.01rem] w-[80%] indent-2 rounded-md p-2 text-black placeholder:text-[15px] placeholder:text-[#505050]"
                    />
                    <Button
                        btnText={'Submit'}
                        onClick={() => {
                            setFeedback('');
                            setShowPopup(true);
                            setPopupText('Feedback Submitted Successfully 🤗');
                        }}
                        className="text-white mt-2 rounded-md py-[5px] px-3 bg-[#4977ec] hover:bg-[#3b62c2]"
                    />
                </div>
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
