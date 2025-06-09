"use client";

import Link from "next/link";
import {
  ShoppingBagIcon,
  TagIcon,
  DocumentTextIcon,
  ChartBarIcon,
} from "@heroicons/react/24/outline";

export default function Home() {
  const menuItems = [
    {
      title: "Quản lý Sản phẩm",
      description: "Thêm, sửa, xóa sản phẩm trong cửa hàng",
      icon: ShoppingBagIcon,
      href: "/products",
      color: "bg-blue-500",
    },
    {
      title: "Quản lý Thương hiệu",
      description: "Quản lý các thương hiệu sản phẩm",
      icon: TagIcon,
      href: "/brands",
      color: "bg-green-500",
    },
    {
      title: "Tạo Hóa đơn",
      description: "Tạo hóa đơn bán hàng mới",
      icon: DocumentTextIcon,
      href: "/invoices/create",
      color: "bg-purple-500",
    },
    {
      title: "Danh sách Hóa đơn",
      description: "Xem và quản lý các hóa đơn đã tạo",
      icon: ChartBarIcon,
      href: "/invoices",
      color: "bg-orange-500",
    },
  ];

  return (
    <div>
      {/* Header */}
      <div className="text-center mb-16">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Chào mừng đến với Self Invoice
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Hệ thống quản lý cửa hàng và xuất hóa đơn đơn giản, dễ sử dụng
        </p>
      </div>

      {/* Menu Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
        {menuItems.map((item, index) => (
          <Link
            key={index}
            href={item.href}
            className="group relative bg-white rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300 p-8 border border-gray-200"
          >
            <div className="flex items-start space-x-4">
              <div className={`${item.color} p-3 rounded-lg`}>
                <item.icon className="h-8 w-8 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                  {item.title}
                </h3>
                <p className="text-gray-600 mt-2">{item.description}</p>
              </div>
            </div>
            <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
              <svg
                className="w-5 h-5 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </div>
          </Link>
        ))}
      </div>

      {/* Footer */}
      <div className="text-center mt-16 pt-8 border-t border-gray-200">
        <p className="text-gray-500">Phiên bản 1.0.0 - Được xây dựng với ❤️</p>
      </div>
    </div>
  );
}
