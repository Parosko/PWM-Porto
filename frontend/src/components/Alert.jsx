// frontend/src/components/Alert.jsx
import { useEffect } from 'react';

const Alert = ({ alert, setAlert }) => {
  useEffect(() => {
    if (alert.show) {
      const timer = setTimeout(() => {
        setAlert({ show: false, type: "", message: "" });
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [alert, setAlert]);

  if (!alert.show) return null;

  return (
    <div className={`alert alert-${alert.type}`}>
      <div className="alert-content">
        <strong>{alert.type.toUpperCase()}</strong>
        <span>{alert.message}</span>
      </div>
    </div>
  );
};

export default Alert;