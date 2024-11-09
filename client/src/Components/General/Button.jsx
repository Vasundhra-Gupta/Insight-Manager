export default function Button({
    disabled = false,
    className = '',
    btnText,
    ...props
}) {
    return (
        <div className="">
            <button
                disabled={disabled}
                {...props}
                className={`disabled:cursor-not-allowed bg-slate-600 ${className}`}
            >
                {btnText}
            </button>
        </div>
    );
}
