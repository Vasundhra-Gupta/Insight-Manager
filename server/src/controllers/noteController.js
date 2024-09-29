import { v4 as uuid } from "uuid";
import validator from "validator";
import getServiceObject from "../db/serviceObjects";
import { OK, BAD_REQUEST, SERVER_ERROR } from "../constants/errorCodes";

export const noteObject = getServiceObject("notes");


