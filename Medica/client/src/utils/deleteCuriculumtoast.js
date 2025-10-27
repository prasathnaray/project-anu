import { toast, POSITION  } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import APP_URL from '../API/config';
import DeleteCurAPI from '../API/deleteCurAPI';
const DeleteCuriculumToast = (curiculum_id, onSuccess, token) => {
  const toastId = 'confirm-disable';
  toast(
    ({ closeToast }) => (
      <div>
        <p>Are you sure you want to delete the Curiculum?</p>
        <div className="mt-2 flex justify-end gap-2">
          <button
            onClick={async () => {
              try {
                const res = await DeleteCurAPI(token, curiculum_id)
                toast.success("Curiculum deleted successfully");
                onSuccess?.();
              } catch (err) {
                toast.error("Failed to delete the curiculum");
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
export default DeleteCuriculumToast;