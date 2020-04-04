import { toast } from "react-toastify";

const toastList = new Set();
const MAX_TOAST = 1;

const notifyWarning = message => {
  if (toastList.size < MAX_TOAST) {
    const id = toast.warn(message, {
      position: toast.POSITION.BOTTOM_CENTER,
      onClose: () => toastList.delete(id)
    });
    toastList.add(id);
  }
};

export default notifyWarning;
