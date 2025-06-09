"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm, useFieldArray } from "react-hook-form";
import { PlusIcon, TrashIcon } from "@heroicons/react/24/outline";
import { productsApi, invoicesApi } from "@/lib/api";
import { Product, CreateInvoiceRequest } from "@/types";
import toast from "react-hot-toast";

interface InvoiceFormData {
  customerName?: string;
  customerPhone?: string;
  customerEmail?: string;
  customerAddress?: string;
  items: {
    productId: string;
    quantity: number;
    unitPrice: number;
  }[];
  taxAmount?: number;
  discountAmount?: number;
  notes?: string;
}

export default function CreateInvoicePage() {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<InvoiceFormData>({
    defaultValues: {
      customerName: "",
      customerPhone: "",
      customerEmail: "",
      customerAddress: "",
      items: [{ productId: "", quantity: 1, unitPrice: 0 }],
      taxAmount: 0,
      discountAmount: 0,
      notes: "",
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "items",
  });

  const watchedItems = watch("items");
  const watchedTaxAmount = watch("taxAmount") || 0;
  const watchedDiscountAmount = watch("discountAmount") || 0;

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await productsApi.getAll();
      setProducts(response.data);
    } catch (error) {
      toast.error("Lỗi khi tải danh sách sản phẩm");
    } finally {
      setLoading(false);
    }
  };

  const handleProductChange = (index: number, productId: string) => {
    const product = products.find((p) => p.id === productId);
    if (product) {
      setValue(`items.${index}.unitPrice`, product.price);
    }
  };

  const calculateSubtotal = () => {
    return watchedItems.reduce((sum, item) => {
      return sum + item.quantity * item.unitPrice;
    }, 0);
  };

  const calculateTotal = () => {
    const subtotal = calculateSubtotal();
    return subtotal + watchedTaxAmount - watchedDiscountAmount;
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  const onSubmit = async (data: InvoiceFormData) => {
    // Validate items
    const validItems = data.items.filter(
      (item) => item.productId && item.quantity > 0
    );
    if (validItems.length === 0) {
      toast.error("Vui lòng thêm ít nhất một sản phẩm");
      return;
    }

    setSubmitting(true);
    try {
      const invoiceData: CreateInvoiceRequest = {
        ...data,
        items: validItems,
      };

      const response = await invoicesApi.create(invoiceData);
      toast.success("Đã tạo hóa đơn thành công!");
      router.push(`/invoices/${response.data.id}`);
    } catch (error) {
      toast.error("Lỗi khi tạo hóa đơn");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-gray-900">
          Tạo hóa đơn mới
        </h1>
        <p className="mt-2 text-sm text-gray-700">
          Nhập thông tin khách hàng và sản phẩm để tạo hóa đơn.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        {/* Customer Information */}
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">
            Thông tin khách hàng
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Tên khách hàng
              </label>
              <input
                type="text"
                {...register("customerName")}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                placeholder="Nhập tên khách hàng"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Số điện thoại
              </label>
              <input
                type="tel"
                {...register("customerPhone")}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                placeholder="Nhập số điện thoại"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                type="email"
                {...register("customerEmail")}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                placeholder="Nhập email"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Địa chỉ
              </label>
              <input
                type="text"
                {...register("customerAddress")}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                placeholder="Nhập địa chỉ"
              />
            </div>
          </div>
        </div>

        {/* Invoice Items */}
        <div className="bg-white shadow rounded-lg p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-medium text-gray-900">Sản phẩm</h2>
            <button
              type="button"
              onClick={() =>
                append({ productId: "", quantity: 1, unitPrice: 0 })
              }
              className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200"
            >
              <PlusIcon className="h-4 w-4 mr-1" />
              Thêm sản phẩm
            </button>
          </div>

          <div className="space-y-4">
            {fields.map((field, index) => (
              <div key={field.id} className="grid grid-cols-12 gap-4 items-end">
                <div className="col-span-5">
                  <label className="block text-sm font-medium text-gray-700">
                    Sản phẩm
                  </label>
                  <select
                    {...register(`items.${index}.productId`, {
                      required: "Vui lòng chọn sản phẩm",
                    })}
                    onChange={(e) => handleProductChange(index, e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  >
                    <option value="">Chọn sản phẩm</option>
                    {products.map((product) => (
                      <option key={product.id} value={product.id}>
                        {product.name} - {formatPrice(product.price)}
                      </option>
                    ))}
                  </select>
                  {errors.items?.[index]?.productId && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.items[index]?.productId?.message}
                    </p>
                  )}
                </div>

                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Số lượng
                  </label>
                  <input
                    type="number"
                    min="1"
                    {...register(`items.${index}.quantity`, {
                      required: "Vui lòng nhập số lượng",
                      min: { value: 1, message: "Số lượng phải lớn hơn 0" },
                    })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  />
                  {errors.items?.[index]?.quantity && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.items[index]?.quantity?.message}
                    </p>
                  )}
                </div>

                <div className="col-span-3">
                  <label className="block text-sm font-medium text-gray-700">
                    Đơn giá
                  </label>
                  <input
                    type="number"
                    step="1000"
                    {...register(`items.${index}.unitPrice`, {
                      required: "Vui lòng nhập đơn giá",
                      min: { value: 0, message: "Đơn giá phải lớn hơn 0" },
                    })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  />
                  {errors.items?.[index]?.unitPrice && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.items[index]?.unitPrice?.message}
                    </p>
                  )}
                </div>

                <div className="col-span-1">
                  <p className="text-sm font-medium text-gray-900">
                    {formatPrice(
                      watchedItems[index]?.quantity *
                        watchedItems[index]?.unitPrice || 0
                    )}
                  </p>
                </div>

                <div className="col-span-1">
                  {fields.length > 1 && (
                    <button
                      type="button"
                      onClick={() => remove(index)}
                      className="text-red-600 hover:text-red-900"
                    >
                      <TrashIcon className="h-5 w-5" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Summary & Additional Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Additional Info */}
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">
              Thông tin bổ sung
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Thuế (VND)
                </label>
                <input
                  type="number"
                  step="1000"
                  {...register("taxAmount")}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  placeholder="0"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Giảm giá (VND)
                </label>
                <input
                  type="number"
                  step="1000"
                  {...register("discountAmount")}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  placeholder="0"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Ghi chú
                </label>
                <textarea
                  {...register("notes")}
                  rows={3}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  placeholder="Nhập ghi chú cho hóa đơn..."
                />
              </div>
            </div>
          </div>

          {/* Summary */}
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Tổng kết</h2>

            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Tạm tính:</span>
                <span className="text-sm font-medium text-gray-900">
                  {formatPrice(calculateSubtotal())}
                </span>
              </div>

              {watchedTaxAmount > 0 && (
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Thuế:</span>
                  <span className="text-sm font-medium text-gray-900">
                    {formatPrice(watchedTaxAmount)}
                  </span>
                </div>
              )}

              {watchedDiscountAmount > 0 && (
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Giảm giá:</span>
                  <span className="text-sm font-medium text-red-600">
                    -{formatPrice(watchedDiscountAmount)}
                  </span>
                </div>
              )}

              <div className="border-t border-gray-200 pt-3">
                <div className="flex justify-between">
                  <span className="text-base font-medium text-gray-900">
                    Tổng cộng:
                  </span>
                  <span className="text-lg font-semibold text-gray-900">
                    {formatPrice(calculateTotal())}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={() => router.back()}
            className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
          >
            Hủy
          </button>
          <button
            type="submit"
            disabled={submitting}
            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
          >
            {submitting ? "Đang tạo..." : "Tạo hóa đơn"}
          </button>
        </div>
      </form>
    </div>
  );
}
