import getServiceObject from "../db/seviceObjects.js"
import { OK, SERVER_ERROR, BAD_REQUEST } from "../constants/errorCodes.js"
import { v4 as uuid } from "uuid"

let userObject = getServiceObject("user")

const getUsers = async (req, res) => {
    try {
        const result = await userObject.getUsers()
        return res.status(OK).json(result)
    } catch (err) {
        return res
            .status(SERVER_ERROR)
            .json({ error: "Failed to get Users", message: err.message })
    }
}

const getUser = async (req, res) => {
    try {
        const { id } = req.params
        if (!id)
            return res.status(BAD_REQUEST).json({ message: "Id is missing" }) //where execution
        const result = await userObject.getUser(id)
        if (result?.message)
            return res.status(BAD_REQUEST).json({ message: result.message })
        else return res.status(OK).json(result)
    } catch (err) {
        return res
            .status(SERVER_ERROR)
            .json({ error: "Failed to get user", message: err.message })
    }
}

const deleteUsers = async (req, res) => {
    try {
        await userObject.deleteUsers()
        return res.status(OK).json({ message: "All users deleted" })
    } catch (err) {
        return res
            .status(SERVER_ERROR)
            .json({ error: "Failed to delete users", message: err.message })
    }
}

const deleteUser = async (req, res) => {
    try {
        const { id } = req.params
        if (!id)
            return res.status(BAD_REQUEST).json({ message: "Id is missing" })
        const result = await userObject.deleteUser(id) //err or msg
        if (!result.success)
            return res
                .status(BAD_REQUEST)
                .json({ err: "user not found", msg: result.message })
        else return res.status(OK).json({ message: result })
    } catch (err) {
        return res
            .status(SERVER_ERROR)
            .json({ error: "Failed to delete user", message: err.message })
    }
}

const createUser = async (req, res) => {
    try {
        // const { id } = req.params;
        const {
            id,
            name,
            firstName,
            lastName,
            avatar,
            coverImage,
            email,
            password,
        } = req.body
        // if (
        //     !name ||
        //     !firstName ||
        //     !lastName ||
        //     !avatar ||
        //     !coverImage ||
        //     !email ||
        //     !password ||
        //     !createdAt
        // ) {
        //     return res
        //         .status(BAD_REQUEST)
        //         .json({ message: "Please Fill all Details" });
        // }
        // const id = uuid();
        const result = await userObject.createUser(
            id,
            name,
            firstName,
            lastName,
            avatar,
            coverImage,
            email,
            password
        ) //result of getuser
        if (result?.message)
            return res.status(BAD_REQUEST).json({ message: result.message })
        else return res.status(OK).json(result)
    } catch (err) {
        return res
            .status(SERVER_ERROR)
            .json({ error: "Failed to create user", message: err.message })
    }
}

const editUser = async (req, res) => {
    try {
        const { id } = req.params
        if (!id)
            return res.status(BAD_REQUEST).json({ message: "Id is missing" })
        const {
            name,
            firstName,
            lastName,
            avatar,
            coverImage,
            email,
            password,
        } = req.body
        const result = await userObject.editUser(
            id,
            name,
            firstName,
            lastName,
            avatar,
            coverImage,
            email,
            password
        )
        if (result?.message)
            return res.status(BAD_REQUEST).json({ message: result.message })
        else return res.status(OK).json(result)
    } catch (err) {
        return res
            .status(SERVER_ERROR)
            .json({ error: "Failed to edit user", message: err.message })
    }
}

export { getUsers, getUser, deleteUsers, deleteUser, createUser, editUser }
