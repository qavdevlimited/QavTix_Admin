"use server"

import axios from "axios"
import { cookies } from "next/headers"

export async function getServerAxios(token: string | undefined) {

    return axios.create({
        baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
        headers: {
            "Content-Type": "application/json",
            ...(token && { Authorization: `Bearer ${token}` }),
        },
    })
}