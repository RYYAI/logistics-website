-- 创建订单表
CREATE TABLE IF NOT EXISTS orders (
    id SERIAL PRIMARY KEY,
    order_number VARCHAR(100) UNIQUE NOT NULL,
    customer_name VARCHAR(200) NOT NULL,
    weight DECIMAL(10,2) NOT NULL DEFAULT 0,
    unit_price DECIMAL(10,2) NOT NULL DEFAULT 0,
    shipping_fee DECIMAL(10,2) NOT NULL DEFAULT 0,
    payment_status VARCHAR(50) NOT NULL DEFAULT '未付款',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 创建索引以提高查询性能
CREATE INDEX IF NOT EXISTS idx_orders_order_number ON orders(order_number);
CREATE INDEX IF NOT EXISTS idx_orders_customer_name ON orders(customer_name);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at);

-- 插入示例数据
INSERT INTO orders (order_number, customer_name, weight, unit_price, shipping_fee, payment_status) VALUES
('LG2024001', '张三', 15.5, 25.00, 180.00, '已付款'),
('LG2024002', '李四', 8.2, 30.00, 120.00, '未付款'),
('LG2024003', '王五', 22.1, 20.00, 250.00, '部分付款'),
('LG2024004', '赵六', 12.8, 28.00, 160.00, '已付款'),
('LG2024005', '陈七', 18.9, 22.00, 200.00, '未付款');
