"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  DocumentArrowDownIcon,
  ArrowLeftIcon,
} from "@heroicons/react/24/outline";
import { invoicesApi } from "@/lib/api";
import { Invoice } from "@/types";
import toast from "react-hot-toast";

export default function InvoiceDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [invoice, setInvoice] = useState<Invoice | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (params.id) {
      fetchInvoice(params.id as string);
    }
  }, [params.id]);

  const fetchInvoice = async (invoiceId: string) => {
    try {
      const response = await invoicesApi.getById(invoiceId);
      setInvoice(response.data);
    } catch (error) {
      toast.error("Lỗi khi tải thông tin hóa đơn");
      router.push("/invoices");
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadPdf = async () => {
    if (!invoice) return;

    try {
      const response = await invoicesApi.downloadPdf(invoice.id);

      // Tạo blob URL và download
      const blob = new Blob([response.data], { type: "application/pdf" });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `hoa-don-${invoice.invoiceNumber}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      toast.success("Đã tải xuống hóa đơn PDF");
    } catch (error) {
      toast.error("Lỗi khi tải xuống hóa đơn");
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!invoice) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Không tìm thấy hóa đơn</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center">
          <button
            onClick={() => router.back()}
            className="mr-4 p-2 text-gray-400 hover:text-gray-600"
          >
            <ArrowLeftIcon className="h-5 w-5" />
          </button>
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">
              Hóa đơn {invoice.invoiceNumber}
            </h1>
            <p className="text-sm text-gray-500">
              Tạo ngày {new Date(invoice.createdAt).toLocaleDateString("vi-VN")}
            </p>
          </div>
        </div>

        <button
          onClick={handleDownloadPdf}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
        >
          <DocumentArrowDownIcon className="h-5 w-5 mr-2" />
          Tải xuống PDF
        </button>
      </div>

      {/* Invoice Content */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="px-6 py-8">
          {/* Invoice Header */}
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900">
              HÓA ĐƠN BÁN HÀNG
            </h2>
            <p className="text-lg text-gray-600 mt-2">
              Số: {invoice.invoiceNumber}
            </p>
            <p className="text-gray-500">
              Ngày: {new Date(invoice.createdAt).toLocaleDateString("vi-VN")}
            </p>
          </div>

          {/* Customer Information */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Thông tin khách hàng:
            </h3>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p>
                <strong>Tên:</strong> {invoice.customerName || "Khách lẻ"}
              </p>
              {invoice.customerPhone && (
                <p>
                  <strong>Điện thoại:</strong> {invoice.customerPhone}
                </p>
              )}
              {invoice.customerEmail && (
                <p>
                  <strong>Email:</strong> {invoice.customerEmail}
                </p>
              )}
              {invoice.customerAddress && (
                <p>
                  <strong>Địa chỉ:</strong> {invoice.customerAddress}
                </p>
              )}
            </div>
          </div>

          {/* Items Table */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Chi tiết sản phẩm:
            </h3>
            <div className="overflow-x-auto">
              <table className="min-w-full border border-gray-300">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                      STT
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                      Tên sản phẩm
                    </th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                      Số lượng
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                      Đơn giá
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                      Thành tiền
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {invoice.items.map((item, index) => (
                    <tr key={item.id} className="border-b">
                      <td className="px-6 py-4 text-center text-sm text-gray-900">
                        {index + 1}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {item.product.name}
                      </td>
                      <td className="px-6 py-4 text-center text-sm text-gray-900">
                        {item.quantity}
                      </td>
                      <td className="px-6 py-4 text-right text-sm text-gray-900">
                        {formatPrice(item.unitPrice)}
                      </td>
                      <td className="px-6 py-4 text-right text-sm text-gray-900">
                        {formatPrice(item.totalPrice)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Summary */}
          <div className="flex justify-end">
            <div className="w-full max-w-sm">
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Tổng tiền hàng:</span>
                  <span className="text-sm font-medium text-gray-900">
                    {formatPrice(invoice.totalAmount)}
                  </span>
                </div>

                {invoice.discountAmount > 0 && (
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Giảm giá:</span>
                    <span className="text-sm font-medium text-red-600">
                      -{formatPrice(invoice.discountAmount)}
                    </span>
                  </div>
                )}

                {invoice.taxAmount > 0 && (
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Thuế:</span>
                    <span className="text-sm font-medium text-gray-900">
                      {formatPrice(invoice.taxAmount)}
                    </span>
                  </div>
                )}

                <div className="border-t border-gray-200 pt-3">
                  <div className="flex justify-between">
                    <span className="text-base font-semibold text-gray-900">
                      Tổng thanh toán:
                    </span>
                    <span className="text-lg font-bold text-gray-900">
                      {formatPrice(invoice.finalAmount)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Notes */}
          {invoice.notes && (
            <div className="mt-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Ghi chú:
              </h3>
              <p className="text-gray-700 bg-gray-50 p-4 rounded-lg">
                {invoice.notes}
              </p>
            </div>
          )}

          {/* Footer */}
          <div className="text-center mt-12 pt-8 border-t border-gray-200">
            <p className="text-gray-500">Cảm ơn quý khách đã mua hàng!</p>
          </div>
        </div>
      </div>
    </div>
  );
}
