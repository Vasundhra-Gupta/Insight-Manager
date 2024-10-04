const OK = 200;
const BAD_REQUEST = 400;
const SERVER_ERROR = 500;
const FORBIDDEN = 403;

const COOKIE_OPTIONS = {
    httpOnly: true,
    path: "/",
    secure: true,
    sameSite: "None",
};

export { OK, BAD_REQUEST, SERVER_ERROR, FORBIDDEN, COOKIE_OPTIONS };
