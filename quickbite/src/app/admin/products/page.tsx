"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  Edit2,
  Trash2,
  X,
  Check,
  AlertCircle,
  Loader,
  Image as ImageIcon,
  AlertTriangle,
} from "lucide-react";
import { Product } from "@/types";
import { adminProductService } from "@/services/admin.products.service";
import { useNotificationStore } from "@/store/useNotificationStore";

const CATEGORIES = ["Burgers", "Pizza", "Pasta", "Beverages", "Desserts"] as const;

interface FormData extends Omit<Product, "id"> {
  id?: string;
}

interface FormErrors {
  [key: string]: string;
}

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Product | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const { addNotification } = useNotificationStore();

  const [formData, setFormData] = useState<FormData>({
    name: "",
    description: "",
    price: 0,
    category: "Burgers",
    image: "",
    rating: 0,
  });

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const data = await adminProductService.getProducts();
      const productsArray = Array.isArray(data)
        ? data
        : (data as any)?.data || [];
      setProducts(productsArray);
    } catch (error) {
      addNotification("Failed to load products", "error");
      console.error("Error fetching products:", error);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const validateForm = (): boolean => {
    const errors: FormErrors = {};

    if (!formData.name?.trim()) {
      errors.name = "Product name is required";
    } else if (formData.name.length < 3) {
      errors.name = "Product name must be at least 3 characters";
    }

    if (!formData.description?.trim()) {
      errors.description = "Description is required";
    } else if (formData.description.length < 10) {
      errors.description = "Description must be at least 10 characters";
    }

    if (!formData.price || formData.price <= 0) {
      errors.price = "Price must be greater than 0";
    } else if (formData.price > 10000) {
      errors.price = "Price cannot exceed 10000";
    }

    if (!formData.image?.trim()) {
      errors.image = "Image URL is required";
    } else if (!isValidUrl(formData.image)) {
      errors.image = "Image URL must be valid";
    }

    if (!formData.category) {
      errors.category = "Category is required";
    }

    if (formData.rating < 0 || formData.rating > 5) {
      errors.rating = "Rating must be between 0 and 5";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const isValidUrl = (string: string) => {
    try {
      new URL(string);
      return true;
    } catch (_) {
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      addNotification("Please fix all errors", "error");
      return;
    }

    try {
      setSubmitting(true);
      if (editingId) {
        const { id, _id, createdAt, updatedAt, ...updateData } = formData as any;
        await adminProductService.updateProduct(editingId, updateData);
        addNotification("Product updated successfully", "success");
      } else {
        const { id, ...createData } = formData;
        await adminProductService.createProduct(createData);
        addNotification("Product created successfully", "success");
      }
      resetForm();
      fetchProducts();
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.message ||
        "Failed to save product";
      console.error("Full error:", error.response?.data);
      addNotification(errorMessage, "error");
    } finally {
      setSubmitting(false);
    }
  };

  // Opens the confirmation dialog
  const handleDeleteClick = (product: Product) => {
    setDeleteTarget(product);
  };

  // Called when user confirms deletion in the dialog
  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    try {
      setIsDeleting(true);
      await adminProductService.deleteProduct(deleteTarget.id);
      addNotification("Product deleted successfully", "success");
      setDeleteTarget(null);
      fetchProducts();
    } catch (error: any) {
      addNotification(
        error.response?.data?.message || "Failed to delete product",
        "error"
      );
      console.error("Error deleting product:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteTarget(null);
  };

  const handleEdit = (product: Product) => {
    setFormData({
      ...product,
      name: product.name ?? "",
      description: product.description ?? "",
      price: product.price ?? 0,
      category: product.category ?? "Burgers",
      image: product.image ?? "",
      rating: product.rating ?? 0,
    });
    setEditingId(product.id);
    setShowForm(true);
    setFormErrors({});
  };

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      price: 0,
      category: "Burgers",
      image: "",
      rating: 0,
    });
    setEditingId(null);
    setShowForm(false);
    setFormErrors({});
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        name === "price" || name === "rating"
          ? parseFloat(value) || 0
          : value,
    }));
    if (formErrors[name]) {
      setFormErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (formErrors[name]) {
      setFormErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-28 pb-20 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-4xl font-black text-gray-900">Products</h1>
            <p className="text-gray-500 mt-2">Manage your product catalog</p>
          </motion.div>

          {!showForm && (
            <motion.button
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              onClick={() => setShowForm(true)}
              className="bg-orange-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-orange-700 transition flex items-center gap-2"
            >
              <Plus size={20} />
              Add Product
            </motion.button>
          )}
        </div>

        {/* ── Delete Confirmation Dialog ── */}
        <AnimatePresence>
          {deleteTarget && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
              onClick={handleDeleteCancel}
            >
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-white rounded-xl shadow-xl w-full max-w-md p-6"
              >
                {/* Icon + heading */}
                <div className="flex items-center gap-4 mb-4">
                  <div className="flex-shrink-0 w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
                    <AlertTriangle size={24} className="text-red-600" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-gray-900">
                      Delete product?
                    </h2>
                  
                  </div>
                </div>

                {/* Product preview */}
                <div className="flex items-center gap-3 bg-gray-50 rounded-lg px-4 py-3 mb-6">
                  <div className="w-10 h-10 rounded-lg overflow-hidden bg-gray-200 flex-shrink-0">
                    {deleteTarget.image ? (
                      <img
                        src={deleteTarget.image}
                        alt={deleteTarget.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <ImageIcon size={16} className="text-gray-400" />
                      </div>
                    )}
                  </div>
                  <div className="min-w-0">
                    <p className="font-semibold text-gray-900 truncate">
                      {deleteTarget.name}
                    </p>
                    <p className="text-sm text-gray-500">
                      ${(deleteTarget.price ?? 0).toFixed(2)} ·{" "}
                      {deleteTarget.category}
                    </p>
                  </div>
                </div>

                {/* Buttons */}
                <div className="flex gap-3">
                  <button
                    onClick={handleDeleteCancel}
                    disabled={isDeleting}
                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-100 transition disabled:opacity-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleDeleteConfirm}
                    disabled={isDeleting}
                    className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {isDeleting ? (
                      <>
                        <Loader size={16} className="animate-spin" />
                        Deleting...
                      </>
                    ) : (
                      <>
                        <Trash2 size={16} />
                        Delete
                      </>
                    )}
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Form Modal */}
        <AnimatePresence>
          {showForm && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
              onClick={() => resetForm()}
            >
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
              >
                <div className="sticky top-0 bg-white border-b border-gray-200 flex justify-between items-center p-6">
                  <h2 className="text-2xl font-bold">
                    {editingId ? "Edit Product" : "Add New Product"}
                  </h2>
                  <button
                    onClick={() => resetForm()}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <X size={24} />
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                  {/* Name */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Product Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="e.g., Classic Cheeseburger"
                      className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 ${
                        formErrors.name ? "border-red-500" : "border-gray-300"
                      }`}
                    />
                    {formErrors.name && (
                      <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                        <AlertCircle size={16} />
                        {formErrors.name}
                      </p>
                    )}
                  </div>

                  {/* Description */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Description *
                    </label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      placeholder="Describe your product..."
                      rows={3}
                      className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 ${
                        formErrors.description
                          ? "border-red-500"
                          : "border-gray-300"
                      }`}
                    />
                    {formErrors.description && (
                      <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                        <AlertCircle size={16} />
                        {formErrors.description}
                      </p>
                    )}
                  </div>

                  {/* Price */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Price ($) *
                    </label>
                    <input
                      type="number"
                      name="price"
                      value={formData.price}
                      onChange={handleInputChange}
                      placeholder="0.00"
                      step="0.01"
                      min="0"
                      max="10000"
                      className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 ${
                        formErrors.price ? "border-red-500" : "border-gray-300"
                      }`}
                    />
                    {formErrors.price && (
                      <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                        <AlertCircle size={16} />
                        {formErrors.price}
                      </p>
                    )}
                  </div>

                  {/* Category */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Category *
                    </label>
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleSelectChange}
                      className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 ${
                        formErrors.category
                          ? "border-red-500"
                          : "border-gray-300"
                      }`}
                    >
                      {CATEGORIES.map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                    </select>
                    {formErrors.category && (
                      <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                        <AlertCircle size={16} />
                        {formErrors.category}
                      </p>
                    )}
                  </div>

                  {/* Image URL */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Image URL *
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="url"
                        name="image"
                        value={formData.image}
                        onChange={handleInputChange}
                        placeholder="https://..."
                        className={`flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 ${
                          formErrors.image
                            ? "border-red-500"
                            : "border-gray-300"
                        }`}
                      />
                      {formData.image && isValidUrl(formData.image) && (
                        <div className="w-12 h-12 rounded-lg overflow-hidden border border-gray-300">
                          <img
                            src={formData.image}
                            alt="Preview"
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}
                    </div>
                    {formErrors.image && (
                      <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                        <AlertCircle size={16} />
                        {formErrors.image}
                      </p>
                    )}
                  </div>

                  {/* Rating */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Rating (0-5) *
                    </label>
                    <input
                      type="number"
                      name="rating"
                      value={formData.rating}
                      onChange={handleInputChange}
                      placeholder="4.5"
                      step="0.1"
                      min="0"
                      max="5"
                      className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 ${
                        formErrors.rating
                          ? "border-red-500"
                          : "border-gray-300"
                      }`}
                    />
                    {formErrors.rating && (
                      <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                        <AlertCircle size={16} />
                        {formErrors.rating}
                      </p>
                    )}
                  </div>

                  {/* Buttons */}
                  <div className="flex gap-3 pt-6">
                    <button
                      type="button"
                      onClick={() => resetForm()}
                      className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-100 transition"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={submitting}
                      className="flex-1 px-4 py-2 bg-orange-600 text-white rounded-lg font-semibold hover:bg-orange-700 transition disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                      {submitting ? (
                        <>
                          <Loader size={18} className="animate-spin" />
                          Saving...
                        </>
                      ) : (
                        <>
                          <Check size={18} />
                          {editingId ? "Update" : "Create"}
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Products Table */}
        {loading ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <Loader className="animate-spin w-12 h-12 mx-auto text-orange-600" />
            <p className="text-gray-500 mt-4">Loading products...</p>
          </motion.div>
        ) : products.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20 bg-gray-100 rounded-lg"
          >
            <p className="text-gray-500 text-lg">No products yet</p>
            <p className="text-gray-400">Click "Add Product" to get started</p>
          </motion.div>
        ) : (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="overflow-x-auto bg-white rounded-xl shadow">
              <table className="w-full">
                <thead className="bg-gray-100 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                      Image
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                      Name
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                      Category
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                      Price
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                      Rating
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <AnimatePresence>
                    {products.map((product) => (
                      <motion.tr
                        key={product.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="border-b border-gray-200 hover:bg-gray-50 transition"
                      >
                        <td className="px-6 py-4">
                          <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-200">
                            {product.image ? (
                              <img
                                src={product.image}
                                alt={product.name}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <ImageIcon size={20} className="text-gray-400" />
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <p className="font-semibold text-gray-900">
                            {product.name}
                          </p>
                          <p className="text-sm text-gray-500 line-clamp-1">
                            {product.description}
                          </p>
                        </td>
                        <td className="px-6 py-4">
                          <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full">
                            {product.category}
                          </span>
                        </td>
                        <td className="px-6 py-4 font-semibold text-gray-900">
                          ${(product.price ?? 0).toFixed(2)}
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-yellow-500">
                            ★ {(product.rating ?? 0).toFixed(1)}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex gap-2 items-center">
                            <button
                              onClick={() => handleEdit(product)}
                              className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition"
                              title="Edit"
                            >
                              <Edit2 size={18} />
                            </button>
                            <button
                              onClick={() => handleDeleteClick(product)}
                              className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition"
                              title="Delete"
                            >
                              <Trash2 size={18} />
                            </button>
                          </div>
                        </td>
                      </motion.tr>
                    ))}
                  </AnimatePresence>
                </tbody>
              </table>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}