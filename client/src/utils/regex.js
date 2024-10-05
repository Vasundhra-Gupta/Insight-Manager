export default function verifyExpression(name, value, setError) {
    if (value) {
        if (name === "email") {
            /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,100}$/.test(value)
                ? setError((prevError) => ({ ...prevError, [name]: "" }))
                : setError((prevError) => ({
                      ...prevError,
                      [name]: "please enter a valid email.",
                  }));
        }

        if (name === "firstName" || name === "lastName") {
            /^[a-zA-Z]{1,15}$/.test(value)
                ? setError((prevError) => ({ ...prevError, [name]: "" }))
                : setError((prevError) => ({
                      ...prevError,
                      [name]: `only letters are allowed and ${name} can be only 15 char long.`,
                  }));
        }

        if (name === "userName") {
            /^[a-zA-Z0-9_]{1,20}$/.test(value)
                ? setError((prevError) => ({ ...prevError, [name]: "" }))
                : setError((prevError) => ({
                      ...prevError,
                      [name]: "only numbers, letters and underscores are allowed and userName can be 20 char long",
                  }));
        }

        if (name === "password" || name === "newPassword") {
            value.length >= 8 && value.length <= 12
                ? setError((prevError) => ({ ...prevError, [name]: "" }))
                : setError((prevError) => ({
                      ...prevError,
                      [name]: `${name} must be 8-12 characters.`,
                  }));
        }

        if (name === "bio") {
            value.length <= 100
                ? setError((prevError) => ({ ...prevError, [name]: "" }))
                : setError((prevError) => ({
                      ...prevError,
                      [name]: "Bio should not exceed 100 characters.",
                  }));
        }
    }
}
