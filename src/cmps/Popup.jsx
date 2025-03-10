import { useEffect } from "react";
import { createPortal } from "react-dom";

export function Popup({ heading, footing, children, onClose }){
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        onClose();
      }
    };
    document.body.addEventListener("keydown", handleKeyDown);
    return () => document.body.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);
//main div fixed inset-0 flex items-center justify-center bg-black bg-opacity-50
  return createPortal(
    <div className="pop-up">
      <div className="popup-container">
        <header className="popup-header">{heading}</header>
        <main className="popup-main">{children}</main>
        <footer className="popup-footer">{footing}</footer>
      </div>
    </div>,
    document.body
  );
};