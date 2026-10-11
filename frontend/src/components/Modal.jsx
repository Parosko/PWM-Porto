// frontend/src/components/Modal.jsx
import Loading from "./Loading";

const Modal = ({
  children,
  isOpen,
  onClose,
  title,
  isLoading = false,
  loadingTitle = "Memproses..."
}) => {
  if (!isOpen) return null;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      {/* stopPropagation agar klik di dalam kotak modal tidak menutup modal */}
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose} disabled={isLoading}>
          ×
        </button>
        {title && <h3 className="modal-title">{title}</h3>}
        <div className="modal-body">
          {children}
        </div>
        {isLoading && <Loading type="modal" title={loadingTitle} />}
      </div>
    </div>
  );
};

export default Modal;