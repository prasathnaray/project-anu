import { toast, POSITION  } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import APP_URL from '../API/config';
const showEnableConfirmToast = (email, onSuccess, token, statusUpdate) => {
  const toastId = 'confirm-disable';
  console.log(statusUpdate);
  toast(
    ({ closeToast }) => (
      <div>
        <p>Are you sure you want to enable this trainee?</p>
        <div className="mt-2 flex justify-end gap-2">
          <button
            onClick={async () => {
              try {
                await axios.patch(`${APP_URL}/api/v1/disable-trainee/${email}/${statusUpdate}`, {}, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                toast.success("Trainee enabled successfully");
                onSuccess?.();
              } catch (err) {
                toast.error("Failed to enable trainee");
              } finally {
                toast.dismiss(toastId);
              }
            }}
            className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
          >
            Okay
          </button>
          <button
            onClick={() => toast.dismiss(toastId)}
            className="bg-gray-300 text-gray-800 px-3 py-1 rounded hover:bg-gray-400"
          >
            Cancel
          </button>
        </div>
      </div>
    ),
    {
      toastId,
      className: 'center-screen-toast',
      closeOnClick: false,
      closeButton: false,
      autoClose: false,
      draggable: false,
    }
  );
};
export default showEnableConfirmToast;