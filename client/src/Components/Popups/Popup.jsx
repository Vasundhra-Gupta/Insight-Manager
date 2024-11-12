import { useEffect } from 'react';
import { usePopupContext } from '../../Context';
import { AnimatePresence, motion } from 'framer-motion';
import { icons } from '../../Assets/icons';
import { Button } from '..';

export default function Popup() {
    const { showPopup, popupText, setShowPopup, setPopupText } =
        usePopupContext();

    const popupVariants = {
        initial: {
            x: '100vw',
        },
        final: {
            x: 0,
            transition: {
                type: 'spring',
                stiffness: 200,
            },
        },
        exit: {
            x: '100vw',
            transition: {
                type: 'spring',
                stiffness: 200,
            },
        },
    };

    const progressVariants = {
        initial: {
            width: '0%',
        },
        final: {
            width: '100%',
            transition: {
                type: 'tween',
                duration: 4,
            },
        },
    };

    useEffect(() => {
        if (showPopup) {
            const timer = setTimeout(() => {
                setShowPopup(false);
            }, 4000);
            return () => clearTimeout(timer); // doubt❓
        }
    }, [popupText, showPopup]);

    return (
        // since we want to use exit property
        <AnimatePresence>
            {showPopup && (
                <motion.div
                    key={popupText} // whenever this key changes the component animation will restart (re-render)
                    variants={popupVariants}
                    initial="initial"
                    animate="final"
                    exit="exit"
                    className="text-white text-lg fixed top-4 right-4 z-[100] py-4 px-6 bg-slate-800 shadow-lg rounded-lg"
                >
                    {/* cross btn */}
                    <Button
                        btnText={
                            <div className="size-[20px] stroke-[#aeaeae]">
                                {icons.cross}
                            </div>
                        }
                        onClick={() => {
                            setShowPopup(false);
                            setPopupText('');
                        }}
                        className="absolute right-2 top-2"
                    />

                    <div className="pt-4">
                        {/* text */}
                        <div className="flex items-center justify-start gap-2 w-full">
                            <div className="size-[22px] fill-green-600">
                                {icons.check}
                            </div>
                            <div className="text-lg">{popupText}</div>
                        </div>

                        {/* Progress Bar */}
                        <motion.div
                            key={popupText}
                            className="relative h-1 mt-3 bg-[#8871ee] rounded"
                            variants={progressVariants}
                        />
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
