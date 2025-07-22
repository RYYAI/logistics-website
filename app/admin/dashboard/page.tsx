"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import {
  Upload,
  FileSpreadsheet,
  LogOut,
  BarChart3,
  Package,
  Brain,
  ImageIcon,
  Receipt,
  ShoppingCart,
  Truck,
  Sparkles,
  Check,
  Edit,
  RefreshCw,
  X,
  Lightbulb,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription, Badge } from "@/components/ui/alert"

export default function AdminDashboard() {
  const [file, setFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)
  const [uploadResult, setUploadResult] = useState<string>("")
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const [images, setImages] = useState<File[]>([])
  const [analyzing, setAnalyzing] = useState(false)
  const [analysisResult, setAnalysisResult] = useState<{
    orderNumber: string
    customerName: string
    weight: number
    shippingFee: number
    paymentStatus: string
    confidence: number
  } | null>(null)

  useEffect(() => {
    // 检查登录状态
    const checkAuth = async () => {
      try {
        const response = await fetch("/api/admin/verify")
        if (response.ok) {
          setIsAuthenticated(true)
        } else {
          router.push("/admin")
        }
      } catch (error) {
        router.push("/admin")
      } finally {
        setLoading(false)
      }
    }

    checkAuth()
  }, [router])

  const handleLogout = async () => {
    try {
      await fetch("/api/admin/logout", { method: "POST" })
      router.push("/admin")
    } catch (error) {
      router.push("/admin")
    }
  }

  const handleFileUpload = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!file) return

    setUploading(true)
    setUploadResult("")

    const formData = new FormData()
    formData.append("file", file)

    try {
      const response = await fetch("/api/upload-excel", {
        method: "POST",
        body: formData,
      })

      const result = await response.json()

      if (response.ok) {
        setUploadResult(`成功上传并处理了 ${result.count} 条订单记录`)
        setFile(null)
        // Reset file input
        const fileInput = document.getElementById("file-upload") as HTMLInputElement
        if (fileInput) fileInput.value = ""
      } else {
        setUploadResult(`上传失败: ${result.error}`)
      }
    } catch (error) {
      setUploadResult("上传过程中发生错误，请重试")
    } finally {
      setUploading(false)
    }
  }

  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index))
  }

  const handleImageAnalysis = async () => {
    if (images.length === 0) return

    setAnalyzing(true)

    // 模拟AI解析过程
    setTimeout(() => {
      setAnalysisResult({
        orderNumber:
          "LG2024" +
          Math.floor(Math.random() * 1000)
            .toString()
            .padStart(3, "0"),
        customerName: "张三",
        weight: Math.floor(Math.random() * 50) + 5,
        shippingFee: Math.floor(Math.random() * 300) + 100,
        paymentStatus: "已付款",
        confidence: Math.floor(Math.random() * 20) + 80,
      })
      setAnalyzing(false)
    }, 3000)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">验证登录状态...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
              <Package className="h-8 w-8 text-blue-600" />
              <div>
                <h1 className="text-xl font-bold text-gray-900">管理员控制台</h1>
                <p className="text-sm text-gray-600">订单数据管理</p>
              </div>
            </div>
            <Button onClick={handleLogout} variant="outline" className="flex items-center space-x-2 bg-transparent">
              <LogOut className="h-4 w-4" />
              <span>退出登录</span>
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Upload Section */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <FileSpreadsheet className="h-6 w-6 text-blue-600" />
                  <span>上传订单Excel文件</span>
                </CardTitle>
                <CardDescription>上传包含客户单号、重量、单价、运费、付款状态等信息的Excel文件</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors">
                  <form onSubmit={handleFileUpload} className="space-y-4">
                    <div>
                      <Label htmlFor="file-upload" className="cursor-pointer">
                        <div className="flex flex-col items-center space-y-2">
                          <Upload className="h-12 w-12 text-gray-400" />
                          <span className="text-lg font-medium">选择Excel文件</span>
                          <span className="text-sm text-gray-500">支持 .xlsx, .xls 格式</span>
                        </div>
                      </Label>
                      <Input
                        id="file-upload"
                        type="file"
                        accept=".xlsx,.xls"
                        onChange={(e) => setFile(e.target.files?.[0] || null)}
                        className="hidden"
                      />
                    </div>

                    {file && (
                      <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded">已选择文件: {file.name}</div>
                    )}

                    <Button type="submit" disabled={!file || uploading} className="w-full">
                      {uploading ? "上传中..." : "上传并解析"}
                    </Button>
                  </form>
                </div>

                {uploadResult && (
                  <Alert>
                    <AlertDescription>{uploadResult}</AlertDescription>
                  </Alert>
                )}
              </CardContent>
            </Card>

            {/* AI Image Analysis Section */}
            <Card className="mt-8">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Brain className="h-6 w-6 text-purple-600" />
                  <span>AI智能解析三单截图</span>
                  <Badge variant="secondary" className="ml-2">
                    Beta
                  </Badge>
                </CardTitle>
                <CardDescription>上传支付单、订单、物流单截图，AI将自动识别并提取订单信息</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <Receipt className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                    <h4 className="font-medium text-blue-900">支付单</h4>
                    <p className="text-sm text-blue-700">支付凭证截图</p>
                  </div>
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <ShoppingCart className="h-8 w-8 text-green-600 mx-auto mb-2" />
                    <h4 className="font-medium text-green-900">电商订单</h4>
                    <p className="text-sm text-green-700">订单详情截图</p>
                  </div>
                  <div className="text-center p-4 bg-orange-50 rounded-lg">
                    <Truck className="h-8 w-8 text-orange-600 mx-auto mb-2" />
                    <h4 className="font-medium text-orange-900">物流单</h4>
                    <p className="text-sm text-orange-700">物流信息截图</p>
                  </div>
                </div>

                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-purple-400 transition-colors">
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="image-upload" className="cursor-pointer">
                        <div className="flex flex-col items-center space-y-2">
                          <ImageIcon className="h-12 w-12 text-gray-400" />
                          <span className="text-lg font-medium">上传三单截图</span>
                          <span className="text-sm text-gray-500">支持 JPG, PNG格式</span>
                        </div>
                      </Label>
                      <Input
                        id="image-upload"
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={(e) => setImages(Array.from(e.target.files || []))}
                        className="hidden"
                      />
                    </div>

                    {images.length > 0 && (
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                        {images.map((image, index) => (
                          <div key={index} className="relative group">
                            <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                              <img
                                src={URL.createObjectURL(image) || "/placeholder.svg"}
                                alt={`上传的图片 ${index + 1}`}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <button
                              onClick={() => removeImage(index)}
                              className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <X className="h-4 w-4" />
                            </button>
                            <div className="mt-2 text-center">
                              <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">{image.name}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    <Button
                      onClick={handleImageAnalysis}
                      disabled={images.length === 0 || analyzing}
                      className="w-full"
                    >
                      {analyzing ? (
                        <div className="flex items-center space-x-2">
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                          <span>AI解析中...</span>
                        </div>
                      ) : (
                        <div className="flex items-center space-x-2">
                          <Brain className="h-4 w-4" />
                          <span>开始AI解析</span>
                        </div>
                      )}
                    </Button>
                  </div>
                </div>

                {analysisResult && (
                  <Card className="bg-gradient-to-r from-purple-50 to-blue-50 border-purple-200">
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2 text-purple-900">
                        <Sparkles className="h-5 w-5" />
                        <span>AI解析结果</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-3">
                          <div className="flex justify-between">
                            <span className="text-sm font-medium text-gray-700">订单号</span>
                            <span className="text-sm font-mono bg-white px-2 py-1 rounded">
                              {analysisResult.orderNumber}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm font-medium text-gray-700">客户姓名</span>
                            <span className="text-sm bg-white px-2 py-1 rounded">{analysisResult.customerName}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm font-medium text-gray-700">重量</span>
                            <span className="text-sm bg-white px-2 py-1 rounded">{analysisResult.weight} kg</span>
                          </div>
                        </div>
                        <div className="space-y-3">
                          <div className="flex justify-between">
                            <span className="text-sm font-medium text-gray-700">运费</span>
                            <span className="text-sm bg-white px-2 py-1 rounded">¥{analysisResult.shippingFee}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm font-medium text-gray-700">支付状态</span>
                            <Badge className="bg-green-100 text-green-800">{analysisResult.paymentStatus}</Badge>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm font-medium text-gray-700">置信度</span>
                            <span className="text-sm bg-white px-2 py-1 rounded">{analysisResult.confidence}%</span>
                          </div>
                        </div>
                      </div>

                      <div className="mt-6 flex space-x-3">
                        <Button size="sm" className="flex items-center space-x-2">
                          <Check className="h-4 w-4" />
                          <span>确认并保存</span>
                        </Button>
                        <Button size="sm" variant="outline" className="flex items-center space-x-2 bg-transparent">
                          <Edit className="h-4 w-4" />
                          <span>手动编辑</span>
                        </Button>
                        <Button size="sm" variant="outline" className="flex items-center space-x-2 bg-transparent">
                          <RefreshCw className="h-4 w-4" />
                          <span>重新解析</span>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )}

                <div className="bg-purple-50 p-4 rounded-lg">
                  <h4 className="font-medium text-purple-900 mb-2 flex items-center space-x-2">
                    <Lightbulb className="h-4 w-4" />
                    <span>AI解析提示：</span>
                  </h4>
                  <ul className="text-sm text-purple-800 space-y-1">
                    <li>• 请确保图片清晰，文字可读</li>
                    <li>• 支持中文和英文订单信息识别</li>
                    <li>• 建议上传完整的订单截图，包含关键信息</li>
                    <li>• AI解析结果仅供参考，请核实后使用</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Info Section */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <BarChart3 className="h-5 w-5 text-green-600" />
                  <span>系统状态</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">系统状态</span>
                    <span className="text-sm font-medium text-green-600">正常运行</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">数据库</span>
                    <span className="text-sm font-medium text-green-600">已连接</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">最后更新</span>
                    <span className="text-sm font-medium">{new Date().toLocaleString("zh-CN")}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Excel格式要求</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <p className="font-medium text-gray-900">必须包含以下列：</p>
                  <ul className="space-y-1 text-gray-600">
                    <li>• 单号</li>
                    <li>• 客户姓名</li>
                    <li>• 重量(kg)</li>
                    <li>• 单价</li>
                    <li>• 运费</li>
                    <li>• 付款状态</li>
                  </ul>
                  <p className="text-xs text-gray-500 mt-3">付款状态支持：已付款、未付款、部分付款</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
