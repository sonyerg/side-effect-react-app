import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";

function Modal({ open, onClose, children }) {
  const dialog = useRef();

  // useImperativeHandle(ref, () => {
  //   return {
  //     open: () => {
  //       dialog.current.showModal();
  //     },
  //     close: () => {
  //       dialog.current.close();
  //     },
  //   };
  // });

  // use useEffect to synchronize value to DOM API
  useEffect(() => {
    if (open) {
      dialog.current.showModal();
    } else {
      dialog.current.close();
    }
  }, [open]);
  // dependencies are values that changes (props, context, state values etc). useEffect will reexecute when this value changes.

  return createPortal(
    <dialog className="modal" ref={dialog} onClose={onClose}>
      {children}
    </dialog>,
    document.getElementById("modal")
  );
}

export default Modal;
