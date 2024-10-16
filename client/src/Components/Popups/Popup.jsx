import { useEffect } from "react";
import { usePopupContext } from "../../Context";
import { AnimatePresence, motion } from "framer-motion";
import { icons } from "../../Assets/icons";

export default function Popup() {
    const { showPopup, popupText, setShowPopup } = usePopupContext();

    const popupVariants = {
        initial: {
            x: "100vw",
        },
        final: {
            x: 0,
            transition: {
                type: "spring",
                stiffness: 200,
            },
        },
        exit: {
            x: "100vw",
            transition: {
                type: "spring",
                stiffness: 200,
            },
        },
    };

    const progressVariants = {
        initial: {
            width: "0%",
        },
        final: {
            width: "100%",
            transition: {
                type: "tween",
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
    }, [showPopup]);

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
                    className="text-white text-lg fixed top-4 right-4 p-4 bg-slate-800 shadow-lg rounded-lg"
                >
                    <div className="size-[20px] stroke-[#aeaeae] absolute right-2 top-2">
                        {icons.cross}
                    </div>

                    <div className="flex items-center justify-start gap-2 mt-2 mr-8">
                        <div className="size-[22px] fill-green-600">{icons.check}</div>
                        <div>{popupText}</div>
                    </div>

                    {/* Progress Bar */}
                    <motion.div
                        className="relative h-1 mt-3 bg-[#8871ee] rounded"
                        variants={progressVariants}
                    />
                </motion.div>
            )}
        </AnimatePresence>
    );
}
