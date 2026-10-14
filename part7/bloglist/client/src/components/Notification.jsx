import { Alert } from "@mui/material";
import { useNotification } from "../stores/notificationStore";

// const Notification = ({ errorMessage, successMessage }) => {
//   if (errorMessage === null && successMessage === null) {
//     return null;
//   }

//   return (
//     <div className={errorMessage ? "error" : "success"}>
//       {errorMessage || successMessage}
//     </div>
//   );
// };

// export default Notification;

const Notification = () => {
  const notification = useNotification();

  if (notification === null) {
    return null;
  }

  return (
    <Alert
      style={{ marginTop: 10, marginBottom: 10 }}
      severity={notification.type}
    >
      {notification.text}
    </Alert>
  );
};

export default Notification;
