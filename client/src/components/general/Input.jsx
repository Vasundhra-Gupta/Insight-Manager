export default function Input({ type = "text", placeholder = "", name, value, onChange, ref, className = "", label, ...props }) {
    return (
        <div>
            <div>
                <label htmlFor={name}>{label}</label>
            </div>
            <div>
                <input
                    type={type}
                    placeholder={placeholder}
                    id={name}
                    name={name}
                    value={value}
                    onChange={onChange}
                    {...props}
                    className={`${className}`}
                />
            </div>
        </div>
    );
}
