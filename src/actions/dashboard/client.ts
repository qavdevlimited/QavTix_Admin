"use server"

import { revalidateTag } from "next/cache"
import { CACHE_TAGS } from "@/cache-tags"

export async function revalidateDashboard() {
    revalidateTag(CACHE_TAGS.DASHBOARD_CARDS, 'max')
    revalidateTag(CACHE_TAGS.DASHBOARD_ACTIVITIES, 'max')
}
