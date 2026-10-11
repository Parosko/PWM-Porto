// frontend/src/components/Button.jsx
const Button = ({
  type = "submit",
  primary = true,
  text,
  disabled = false,
  onClick,
  className = ""
}) => {
  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={`btn ${primary ? 'btn-primary' : 'btn-secondary'} ${className}`}
    >
      {text}
    </button>
  );
};

export default Button;