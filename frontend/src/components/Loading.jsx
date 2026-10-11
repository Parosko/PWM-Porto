// frontend/src/components/Loading.jsx
const Loading = ({ type = 'fixed', title = 'Loading...' }) => {
  return (
    <div
      className={`loading-${type}`}
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '30px'
      }}
    >
      <div className="loading"></div>
      {title && (
        <p style={{ marginTop: '15px', fontWeight: 'bold' }}>
          {title}
        </p>
      )}
    </div>
  );
};

export default Loading;