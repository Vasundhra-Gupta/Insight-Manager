export default function fileRestrictions(file, name, setError) {
    if (file) {
        const extension = file.name.split(".").pop().toLowerCase();
        const fileSize = file.size / (1024 * 1024);
        const maxSizeMB = 100;
        const allowedExtensions = ["png", "jpg", "jpeg"];
        if (!allowedExtensions.includes(extension) || fileSize > maxSizeMB) {
            return setError((prevError) => ({
                ...prevError,
                [name]: "only PNG, JPG/JPEG files are allowed & File size should be less than 100MB.",
            }));
        }
        setError((prevError) => ({ ...prevError, [name]: "" }));
    }
}
