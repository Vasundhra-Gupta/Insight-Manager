export default function Image({ src = null, altText = "", className = "", ...props }) {
    return (
        <div className={`h-full w-full overflow-hidden`}>
            <img src={src} alt={altText} className={`object-cover ${className}`} {...props} />
        </div>
    );
}
