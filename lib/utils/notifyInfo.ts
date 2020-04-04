import { toast } from "react-toastify";

const toastList = new Set();
const MAX_TOAST = 1;

const notifyInfo = message => {
  if (toastList.size < MAX_TOAST) {
    const id = toast(message, {
      position: toast.POSITION.BOTTOM_CENTER,
      autoClose: 10000,
      onClose: () => toastList.delete(id)
    });
    toastList.add(id);
  }
};

export default notifyInfo;
