import { type NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"

export async function POST(request: NextRequest) {
  try {
    const cookieStore = await cookies()
    cookieStore.delete("admin-token")

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: "退出登录失败" }, { status: 500 })
  }
}
