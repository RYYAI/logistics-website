import { type NextRequest, NextResponse } from "next/server"
import * as XLSX from "xlsx"
import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get("file") as File

    if (!file) {
      return NextResponse.json({ error: "没有选择文件" }, { status: 400 })
    }

    // 读取Excel文件
    const buffer = await file.arrayBuffer()
    const workbook = XLSX.read(buffer, { type: "array" })
    const sheetName = workbook.SheetNames[0]
    const worksheet = workbook.Sheets[sheetName]

    // 转换为JSON
    const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 })

    if (jsonData.length < 2) {
      return NextResponse.json({ error: "Excel文件格式不正确或没有数据" }, { status: 400 })
    }

    // 获取表头和数据
    const headers = jsonData[0] as string[]
    const rows = jsonData.slice(1) as any[][]

    // 验证必要的列是否存在
    const requiredColumns = ["单号", "客户姓名", "重量", "单价", "运费", "付款状态"]
    const columnIndexes: { [key: string]: number } = {}

    for (const col of requiredColumns) {
      const index = headers.findIndex((h) => h && h.toString().includes(col.split("(")[0]))
      if (index === -1) {
        return NextResponse.json({ error: `缺少必要列: ${col}` }, { status: 400 })
      }
      columnIndexes[col] = index
    }

    // 处理数据并插入数据库
    let successCount = 0
    const errors: string[] = []

    for (let i = 0; i < rows.length; i++) {
      const row = rows[i]
      if (!row || row.length === 0) continue

      try {
        const orderNumber = row[columnIndexes["单号"]]?.toString().trim()
        const customerName = row[columnIndexes["客户姓名"]]?.toString().trim()
        const weight = Number.parseFloat(row[columnIndexes["重量"]] || 0)
        const unitPrice = Number.parseFloat(row[columnIndexes["单价"]] || 0)
        const shippingFee = Number.parseFloat(row[columnIndexes["运费"]] || 0)
        const paymentStatus = row[columnIndexes["付款状态"]]?.toString().trim() || "未付款"

        if (!orderNumber || !customerName) {
          errors.push(`第${i + 2}行: 单号或客户姓名不能为空`)
          continue
        }

        // 检查订单号是否已存在
        const existing = await sql`
          SELECT id FROM orders WHERE order_number = ${orderNumber}
        `

        if (existing.length > 0) {
          // 更新现有记录
          await sql`
            UPDATE orders 
            SET customer_name = ${customerName},
                weight = ${weight},
                unit_price = ${unitPrice},
                shipping_fee = ${shippingFee},
                payment_status = ${paymentStatus},
                updated_at = NOW()
            WHERE order_number = ${orderNumber}
          `
        } else {
          // 插入新记录
          await sql`
            INSERT INTO orders (order_number, customer_name, weight, unit_price, shipping_fee, payment_status)
            VALUES (${orderNumber}, ${customerName}, ${weight}, ${unitPrice}, ${shippingFee}, ${paymentStatus})
          `
        }

        successCount++
      } catch (error) {
        errors.push(`第${i + 2}行处理失败: ${error}`)
      }
    }

    return NextResponse.json({
      count: successCount,
      errors: errors.length > 0 ? errors : undefined,
    })
  } catch (error) {
    console.error("Excel处理错误:", error)
    return NextResponse.json({ error: "文件处理失败" }, { status: 500 })
  }
}
