import React from "react";

import { RxCross2 } from "react-icons/rx";

const Modal = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex justify-center items-center  z-[100]">
      <div
        className="absolute inset-0 bg-black opacity-50 "
        onClick={onClose}
      ></div>

      <div className="relative min-w-1/2 h-auto overflow-auto  bg-white text-text shadow-lg rounded-2xl z-50">
        {/* Close icon */}
        <RxCross2
          size={30}
          onClick={onClose}
          className="absolute top-3 right-3 text-2xl bg-secondary-background p-1 text-text-muted hover:text-text-muted hover:bg-border rounded-full cursor-pointer"
        />

        {/* Modal content */}
        <div className=" rounded-3xl  p-4">{children}</div>
      </div>
    </div>
  );
};

export default Modal;
