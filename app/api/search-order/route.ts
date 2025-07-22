import { type NextRequest, NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const orderNumber = searchParams.get("orderNumber")

    if (!orderNumber) {
      return NextResponse.json({ error: "请提供订单号" }, { status: 400 })
    }

    const result = await sql`
      SELECT * FROM orders 
      WHERE order_number = ${orderNumber.trim()}
      ORDER BY created_at DESC
      LIMIT 1
    `

    if (result.length === 0) {
      return NextResponse.json({ error: "未找到该订单号的记录" }, { status: 404 })
    }

    return NextResponse.json({ order: result[0] })
  } catch (error) {
    console.error("查询订单错误:", error)
    return NextResponse.json({ error: "查询失败" }, { status: 500 })
  }
}
