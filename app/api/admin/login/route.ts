import { type NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"

// 简单的用户验证（实际项目中应该使用数据库和加密）
const ADMIN_CREDENTIALS = {
  username: "admin",
  password: "logistics2024", // 实际项目中应该使用哈希密码
}

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json()

    if (username === ADMIN_CREDENTIALS.username && password === ADMIN_CREDENTIALS.password) {
      // 创建简单的会话token（实际项目中应该使用JWT或其他安全方案）
      const token = Buffer.from(`${username}:${Date.now()}`).toString("base64")

      // 设置cookie
      const cookieStore = await cookies()
      cookieStore.set("admin-token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 60 * 60 * 24, // 24小时
      })

      return NextResponse.json({ success: true })
    } else {
      return NextResponse.json({ error: "用户名或密码错误" }, { status: 401 })
    }
  } catch (error) {
    return NextResponse.json({ error: "登录失败" }, { status: 500 })
  }
}
