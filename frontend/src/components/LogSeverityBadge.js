export default function LogSeverityBadge({ severity }) {
  const severityStyles = {
    critical: {
      bg: 'bg-danger-100',
      text: 'text-danger-800',
      label: '긴급',
    },
    high: {
      bg: 'bg-danger-50',
      text: 'text-danger-700',
      label: '높음',
    },
    medium: {
      bg: 'bg-warning-100',
      text: 'text-warning-800',
      label: '중간',
    },
    low: {
      bg: 'bg-primary-100',
      text: 'text-primary-800',
      label: '낮음',
    },
    info: {
      bg: 'bg-gray-100',
      text: 'text-gray-800',
      label: '정보',
    },
  };

  const style = severityStyles[severity] || severityStyles.info;

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${style.bg} ${style.text}`}
    >
      {style.label}
    </span>
  );
}
