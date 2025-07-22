"use client"

import type React from "react"
import { useState } from "react"
import { Search, Package, TrendingUp, Users, MapPin, Clock, Lock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table"

interface Order {
  id: number
  order_number: string
  customer_name: string
  weight: number
  unit_price: number
  shipping_fee: number
  payment_status: string
  created_at: string
}

export default function HomePage() {
  const [searchNumber, setSearchNumber] = useState("")
  const [searchResult, setSearchResult] = useState<Order | null>(null)
  const [searching, setSearching] = useState(false)
  const [searchError, setSearchError] = useState("")

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!searchNumber.trim()) return

    setSearching(true)
    setSearchError("")
    setSearchResult(null)

    try {
      const response = await fetch(`/api/search-order?orderNumber=${encodeURIComponent(searchNumber.trim())}`)
      const result = await response.json()

      if (response.ok) {
        setSearchResult(result.order)
      } else {
        setSearchError(result.error || "查询失败")
      }
    } catch (error) {
      setSearchError("查询过程中发生错误，请重试")
    } finally {
      setSearching(false)
    }
  }

  const getPaymentStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case "已付款":
      case "paid":
        return <Badge className="bg-green-100 text-green-800">已付款</Badge>
      case "未付款":
      case "unpaid":
        return <Badge variant="destructive">未付款</Badge>
      case "部分付款":
      case "partial":
        return <Badge className="bg-yellow-100 text-yellow-800">部分付款</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-3">
              <Package className="h-8 w-8 text-blue-600" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">跨境物流查询</h1>
                <p className="text-sm text-gray-600">快速查询您的物流订单信息</p>
              </div>
            </div>
            <div className="flex items-center space-x-6">
              <div className="hidden sm:flex items-center space-x-6 text-sm text-gray-600">
                <div className="flex items-center space-x-2">
                  <TrendingUp className="h-4 w-4" />
                  <span>实时追踪</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Users className="h-4 w-4" />
                  <span>专业服务</span>
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => (window.location.href = "/admin")}
                className="flex items-center space-x-2 text-gray-600 hover:text-blue-600 border-gray-300"
              >
                <Lock className="h-4 w-4" />
                <span className="hidden sm:inline">管理员</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">物流订单查询</h2>
          <p className="text-xl text-gray-600 mb-8">输入您的订单号，即可查询物流状态和详细信息</p>

          {/* Search Form */}
          <Card className="max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle className="flex items-center justify-center space-x-2">
                <Search className="h-6 w-6 text-blue-600" />
                <span>订单查询</span>
              </CardTitle>
              <CardDescription>请输入您的完整订单号进行查询</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <form onSubmit={handleSearch} className="space-y-4">
                <div>
                  <Label htmlFor="order-number">订单号</Label>
                  <Input
                    id="order-number"
                    type="text"
                    placeholder="例如：LG2024001"
                    value={searchNumber}
                    onChange={(e) => setSearchNumber(e.target.value)}
                    className="mt-1 text-lg py-3"
                  />
                </div>
                <Button type="submit" disabled={!searchNumber.trim() || searching} className="w-full py-3 text-lg">
                  {searching ? "查询中..." : "查询订单"}
                </Button>
              </form>

              {searchError && (
                <Alert variant="destructive">
                  <AlertDescription>{searchError}</AlertDescription>
                </Alert>
              )}

              {searchResult && (
                <Card className="mt-6">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center space-x-2">
                      <Package className="h-5 w-5 text-blue-600" />
                      <span>订单详情</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableBody>
                        <TableRow>
                          <TableCell className="font-medium">订单号</TableCell>
                          <TableCell className="font-mono text-lg">{searchResult.order_number}</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className="font-medium">客户姓名</TableCell>
                          <TableCell>{searchResult.customer_name}</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className="font-medium">货物重量</TableCell>
                          <TableCell className="text-lg font-semibold">{searchResult.weight} kg</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className="font-medium">单价</TableCell>
                          <TableCell>¥{searchResult.unit_price}</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className="font-medium">运费</TableCell>
                          <TableCell className="text-lg font-semibold text-blue-600">
                            ¥{searchResult.shipping_fee}
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className="font-medium">付款状态</TableCell>
                          <TableCell>{getPaymentStatusBadge(searchResult.payment_status)}</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className="font-medium">创建时间</TableCell>
                          <TableCell>{new Date(searchResult.created_at).toLocaleString("zh-CN")}</TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              )}
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">我们的服务优势</h3>
            <p className="text-lg text-gray-600">专业的跨境物流服务，让您的货物安全快速到达</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <MapPin className="h-8 w-8 text-blue-600" />
              </div>
              <h4 className="text-xl font-semibold mb-2">全球覆盖</h4>
              <p className="text-gray-600">覆盖全球主要国家和地区，提供门到门服务</p>
            </div>

            <div className="text-center">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="h-8 w-8 text-green-600" />
              </div>
              <h4 className="text-xl font-semibold mb-2">快速时效</h4>
              <p className="text-gray-600">优化物流路线，确保货物快速安全送达</p>
            </div>

            <div className="text-center">
              <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="h-8 w-8 text-purple-600" />
              </div>
              <h4 className="text-xl font-semibold mb-2">实时追踪</h4>
              <p className="text-gray-600">24小时在线查询，随时掌握货物动态</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <Package className="h-8 w-8 text-blue-400" />
                <span className="text-xl font-bold">跨境物流</span>
              </div>
              <p className="text-gray-400">专业的跨境物流服务商，为您提供安全、快速、可靠的物流解决方案。</p>
            </div>

            <div>
              <h4 className="text-lg font-semibold mb-4">联系我们</h4>
              <div className="space-y-2 text-gray-400">
                <p>客服热线：400-888-8888</p>
                <p>邮箱：service@logistics.com</p>
                <p>工作时间：周一至周日 9:00-18:00</p>
              </div>
            </div>

            <div>
              <h4 className="text-lg font-semibold mb-4">服务范围</h4>
              <div className="space-y-2 text-gray-400">
                <p>• 国际快递</p>
                <p>• 海运拼箱</p>
                <p>• 空运专线</p>
                <p>• 仓储配送</p>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 跨境物流管理系统. 专业的货代服务平台</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
