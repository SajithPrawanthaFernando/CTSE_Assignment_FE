"use client";
import { useNotificationStore } from "@/store/useNotificationStore";
import { motion, AnimatePresence } from "framer-motion";
import { X, CheckCircle, AlertCircle, Info, Trash2, Check } from "lucide-react";

const icons = {
  success: <CheckCircle className="text-green-500" size={18} />,
  error: <AlertCircle className="text-red-500" size={18} />,
  info: <Info className="text-blue-500" size={18} />,
  confirm: <Trash2 className="text-red-500" size={18} />, //    NEW
};

export const NotificationContainer = () => {
  const { notifications, removeNotification } = useNotificationStore();

  return (
    <div className="fixed bottom-5 right-5 z-[100] flex flex-col gap-3 w-full max-w-sm">
      <AnimatePresence>
        {notifications.map((n) => (
          <motion.div
            key={n.id}
            initial={{ opacity: 0, x: 50, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
            className="bg-white border border-gray-100 shadow-2xl rounded-2xl p-4 flex flex-col gap-3"
          >
            {n.type === 'confirm' ? (
              //    Confirmation toast with Yes/No buttons
              <>
                <div className="flex items-center gap-3">
                  {icons.confirm}
                  <p className="text-sm font-medium text-gray-800 flex-1">
                    {n.message}
                  </p>
                </div>
                <div className="flex items-center gap-2 ml-7">
                  {/*    Yes button */}
                  <button
                    onClick={n.onConfirm}
                    className="flex items-center gap-1.5 bg-red-500 text-white px-4 py-2 rounded-xl text-xs font-bold hover:bg-red-600 transition-all active:scale-95 flex-1 justify-center"
                  >
                    <Check size={14} />
                    Yes, Remove
                  </button>
                  {/*    No button */}
                  <button
                    onClick={n.onCancel}
                    className="flex items-center gap-1.5 bg-gray-100 text-gray-700 px-4 py-2 rounded-xl text-xs font-bold hover:bg-gray-200 transition-all active:scale-95 flex-1 justify-center"
                  >
                    <X size={14} />
                    Cancel
                  </button>
                </div>
              </>
            ) : (
              //    Normal toast
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  {icons[n.type]}
                  <p className="text-sm font-medium text-gray-800">{n.message}</p>
                </div>
                <button
                  onClick={() => removeNotification(n.id)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X size={16} />
                </button>
              </div>
            )}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};