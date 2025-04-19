import { toast } from "sonner";

class ToastNotifications {
  success(message) {
    return toast.success(message,
      {
        style: {
          backgroundColor: '#D1FAE5', // Tailwind's green-100
          color: '#065F46',           // Tailwind's green-800
          border: '1px solid #34D399' // Tailwind's green-400
        },
        icon: '✅'
      }
    );
  };

  error(message , desc) {
    return toast.error(message, {
      description: desc ? desc : 'Please check your internet connection and try again.',
      closeButton: true,
      style: {
        backgroundColor: '#FEE2E2', // Tailwind's red-100
        color: '#991B1B',           // Tailwind's red-800
        border: '1px solid #F87171' // Tailwind's red-400
      },
      duration: 6000, // Display duration in milliseconds
    });
  }
};

const toastNotifications = new ToastNotifications();
export default toastNotifications;