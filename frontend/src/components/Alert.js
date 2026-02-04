export default function Alert({ type = 'info', message, onClose }) {
  const typeStyles = {
    info: {
      bg: 'bg-primary-50',
      border: 'border-primary-200',
      text: 'text-primary-800',
      icon: 'ℹ️',
    },
    success: {
      bg: 'bg-success-50',
      border: 'border-success-200',
      text: 'text-success-800',
      icon: '✓',
    },
    warning: {
      bg: 'bg-warning-50',
      border: 'border-warning-200',
      text: 'text-warning-800',
      icon: '⚠️',
    },
    error: {
      bg: 'bg-danger-50',
      border: 'border-danger-200',
      text: 'text-danger-800',
      icon: '✕',
    },
  };

  const style = typeStyles[type] || typeStyles.info;

  return (
    <div
      className={`${style.bg} ${style.border} ${style.text} border rounded-lg p-4 flex items-start justify-between`}
      role="alert"
    >
      <div className="flex items-start">
        <span className="mr-3 text-lg">{style.icon}</span>
        <div className="flex-1">{message}</div>
      </div>
      {onClose && (
        <button
          onClick={onClose}
          className={`${style.text} hover:opacity-75 ml-4`}
          aria-label="닫기"
        >
          ✕
        </button>
      )}
    </div>
  );
}
