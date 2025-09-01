import React, { forwardRef } from "react";
import { useNotiPanel } from "src/hooks/useFile";
import { useNavigate } from "react-router-dom";

interface NotiType {
  open: boolean;
  onClose: () => void;
  user_id: string;
}

// Wrap with forwardRef
const NotificationPanel = forwardRef<HTMLDivElement, NotiType>(
  ({ open, onClose, user_id }, ref) => {
    const { data: notifications = [], isLoading } = useNotiPanel(user_id);
    const navigate = useNavigate();

    return (
      <>
        {/* Overlay */}
        {open && (
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
            onClick={onClose}
          />
        )}

        {/* Panel */}
        <div
          ref={ref} 
          className={`fixed top-0 right-0 h-full w-80 sm:w-96 bg-white shadow-2xl border-l border-gray-200 z-50
`}
        >
          {/* Header */}
          <div className="flex justify-between items-center px-4 py-4 border-b bg-gray-50">
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-semibold text-gray-800">Notifications</h2>
            </div>
            <button
              className="text-gray-400 hover:text-gray-600 transition text-xl"
              onClick={onClose}
            >
              ✖
            </button>
          </div>

          {/* Content */}
          <div className="h-[calc(100%-4rem)] overflow-y-auto px-3 py-2 space-y-3">
            {isLoading ? (
              <p className="text-sm text-gray-500 text-center mt-6">Loading...</p>
            ) : notifications.length > 0 ? (
              notifications.map((noti) => (
                <div
                  key={noti.id}
                  className="bg-white border rounded-xl p-4 shadow-sm hover:shadow-md transition cursor-pointer"
                  onClick={() => {
                    if (noti.file_id) {
                      navigate(`detail/${noti.file_id}`);
                      onClose();
                    }
                  }}
                >
                  <h3 className="text-sm font-semibold text-gray-800">{noti.title}</h3>
                  <p className="text-sm text-gray-600 mt-1">{noti.body}</p>
                  <div className="flex justify-between items-center mt-2">
                    <span className="text-xs text-gray-400">
                      {new Date(noti.sent_at).toLocaleString()}
                    </span>
                    {noti.filemetadata[0]?.name && (
                      <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                        {noti.filemetadata[0].name}
                      </span>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-gray-400">
                <p className="text-sm">No new notifications</p>
              </div>
            )}
          </div>
        </div>
      </>
    );
  }
);

export default NotificationPanel;
