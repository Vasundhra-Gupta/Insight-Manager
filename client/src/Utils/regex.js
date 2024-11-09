export default function verifyExpression(name, value, setError) {
    if (value) {
        switch (name) {
            case 'email': {
                /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,100}$/.test(
                    value
                )
                    ? setError((prevError) => ({ ...prevError, [name]: '' }))
                    : setError((prevError) => ({
                          ...prevError,
                          [name]: 'please enter a valid email.',
                      }));
                break;
            }

            case 'firstName':
            case 'lastName': {
                /^[a-zA-Z]{1,15}$/.test(value)
                    ? setError((prevError) => ({ ...prevError, [name]: '' }))
                    : setError((prevError) => ({
                          ...prevError,
                          [name]: `only letters are allowed and ${name} can be only 15 char long.`,
                      }));
                break;
            }

            case 'userName': {
                /^[a-zA-Z0-9_]{1,20}$/.test(value)
                    ? setError((prevError) => ({ ...prevError, [name]: '' }))
                    : setError((prevError) => ({
                          ...prevError,
                          [name]: 'only numbers, letters and underscores are allowed and userName can be 20 char long',
                      }));
                break;
            }

            case 'password':
            case 'newPassword': {
                value.length >= 8 && value.length <= 12
                    ? setError((prevError) => ({ ...prevError, [name]: '' }))
                    : setError((prevError) => ({
                          ...prevError,
                          [name]: `${name} must be 8-12 characters.`,
                      }));
                break;
            }

            case 'bio':
            case 'title': {
                value.length <= 100
                    ? setError((prevError) => ({ ...prevError, [name]: '' }))
                    : setError((prevError) => ({
                          ...prevError,
                          [name]: `${name} should not exceed 100 characters.`,
                      }));
                break;
            }

            default: {
                console.log("Doesn't have a defined regex.");
                return;
            }
        }
    }
}
