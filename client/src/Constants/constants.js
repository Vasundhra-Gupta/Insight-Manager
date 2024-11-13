const LIMIT = 10;
const DEFAULT_RTE_TEXT = 'Welcome to Post Manager ⭐';
import SANIAIMAGE from '../Assets/images/sania.jpg';
import VASUNDHRAIMAGE from '../Assets/images/vasundhra.jpg';
import VANSHIKAIMAGE from '../Assets/images/vanshika.jpg';
import LOGO from '../Assets/images/logo.jpg';
const EMAIL = 'peerconnect@gmail.com';
const CONTACTNUMBER = 'xxxxxxxxxx';

const CONTRIBUTORS = [
    {
        image: SANIAIMAGE,
        role: 'Lead Developer',
        bio: 'Full-stack developer passionate about creating beautiful, scalable applications',
        name: 'Sania Singla',
        socials: {
            linkedIn: 'https://www.linkedin.com/in/sania-singla',
            discord: 'https://discord.com/channels/@sania_singla',
            gitHub: 'https://github.com/Sania-Singla',
            threads: 'https://x.com/sania_singla',
            instagram: 'https://www.instagram.com/sania__singla',
        },
    },
    {
        image: VASUNDHRAIMAGE,
        role: 'Aspiring Web Developer',
        bio: 'Design enthusiast focused on creating intuitive and engaging user experiences',
        name: 'Vasundhra Gupta',
        socials: {
            linkedIn: 'https://www.linkedin.com/in/vasundhra-gupta-764713291',
            discord: '',
            gitHub: 'https://github.com/Vasundhra-Gupta',
            threads: '',
        },
    },
    {
        image: VANSHIKAIMAGE,
        role: 'HTML & CSS Visionary',
        bio: 'Design enthusiast focused on creating intuitive and engaging user experiences',
        name: 'Vanshika Dhariya',
        socials: {
            linkedIn: 'https://www.linkedin.com/in/vanshika-dhariya-486a872b1',
            discord: '',
            gitHub: 'https://github.com/vanshika-1136',
            threads: '',
        },
    },
];

export { LIMIT, DEFAULT_RTE_TEXT, LOGO, CONTRIBUTORS, EMAIL, CONTACTNUMBER };
