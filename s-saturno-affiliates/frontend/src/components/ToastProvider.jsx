import { Toaster } from 'react-hot-toast'

export const ToastProvider = () => (
  <Toaster
    position="top-right"
    toastOptions={{
      duration: 4000,
      style: {
        background: '#363636',
        color: '#fff',
        borderRadius: '8px',
        fontWeight: '500'
      },
      success: {
        style: {
          background: '#4caf50',
        },
        iconTheme: {
          primary: '#fff',
          secondary: '#4caf50',
        },
      },
      error: {
        style: {
          background: '#f44336',
        },
        iconTheme: {
          primary: '#fff',
          secondary: '#f44336',
        },
      },
      loading: {
        style: {
          background: '#ff9800',
        },
      },
    }}
  />
)

export default ToastProvider