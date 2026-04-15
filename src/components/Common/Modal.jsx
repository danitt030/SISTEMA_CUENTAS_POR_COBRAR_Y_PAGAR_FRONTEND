
const Modal = ({
    isOpen,
    onClose,
    title,
    children,
    overlayClassName = "",
    contentClassName = "",
    bodyClassName = ""
}) => {
    if (!isOpen) return null;

    const overlayClasses = `modal-overlay ${overlayClassName}`.trim();
    const contentClasses = `modal-content ${contentClassName}`.trim();
    const bodyClasses = `modal-body ${bodyClassName}`.trim();

    return (
        <div className={overlayClasses} onClick={onClose}>
            <div className={contentClasses} onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h2>{title}</h2>
                    <button className="modal-close" onClick={onClose}>Cerrar</button>
                </div>
                <div className={bodyClasses}>
                    {children}
                </div>
            </div>
        </div>
    );
};

export default Modal;
