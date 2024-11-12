export default function fileRestrictions(file, name, setError) {
    if (file) {
        const extension = file.name.split('.').pop().toLowerCase();
        const fileSize = file.size / (1024 * 1024);
        const maxSizeMB = 100;
        const allowedExtensions = ['png', 'jpg', 'jpeg'];
        if (!allowedExtensions.includes(extension) || fileSize > maxSizeMB) {
            return setError((prevError) => ({
                ...prevError,
                [name]: 'only png, jpg/jpeg files are allowed and File size should not exceed 100mb.',
            }));
        }
        setError((prevError) => ({ ...prevError, [name]: '' }));
    }
}
