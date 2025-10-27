import { toast, POSITION  } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import APP_URL from '../API/config';
import DeleteTraineeAPI from '../API/DeleteTraineeAPI';
const DeleteTraineeToast = (user_mail, onSuccess, token) => {
  const toastId = 'confirm-disable';
//   console.log(statusUpdate);
  toast(
    ({ closeToast }) => (
      <div>
        <p>Are you sure you want to delete the trainee?</p>
        <div className="mt-2 flex justify-end gap-2">
          <button
            onClick={async () => {
              try {
                const res = await DeleteTraineeAPI(token, user_mail)
                toast.success("Trainee deleted successfully");
                onSuccess?.();
              } catch (err) {
                toast.error("Failed to delete the trainee");
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
export default DeleteTraineeToast;