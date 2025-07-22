import { type NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"

export async function GET(request: NextRequest) {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get("admin-token")

    if (!token) {
      return NextResponse.json({ error: "未登录" }, { status: 401 })
    }

    // 验证token（简单验证，实际项目中应该更严格）
    try {
      const decoded = Buffer.from(token.value, "base64").toString()
      const [username, timestamp] = decoded.split(":")

      // 检查token是否过期（24小时）
      const tokenTime = Number.parseInt(timestamp)
      const now = Date.now()
      const maxAge = 24 * 60 * 60 * 1000 // 24小时

      if (now - tokenTime > maxAge) {
        return NextResponse.json({ error: "登录已过期" }, { status: 401 })
      }

      if (username === "admin") {
        return NextResponse.json({ success: true })
      }
    } catch (error) {
      return NextResponse.json({ error: "无效token" }, { status: 401 })
    }

    return NextResponse.json({ error: "验证失败" }, { status: 401 })
  } catch (error) {
    return NextResponse.json({ error: "验证失败" }, { status: 500 })
  }
}
