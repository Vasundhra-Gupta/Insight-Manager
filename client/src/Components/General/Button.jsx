export default function Button({
    disabled = false,
    className = "px-[8px] py-[5px] text-2xl rounded-lg overflow-hidden hover:border-[#b5b4b4] hover:bg-slate-800",
    btnText,
    ...props
}) {
    return (
        <div className={`w-fit h-fit bg-slate-600 ${className}`}>
            <button
                disabled={disabled}
                {...props}
                className="disabled:cursor-not-allowed h-full w-full"
            >
                {btnText}
            </button>
        </div>
    );
}
