import { Select } from 'antd';

import { formatAlertThreshold, type AlertThresholdValue } from '../../model';

const OPTIONS: readonly { value: string; threshold: AlertThresholdValue }[] = [
  { value: 'any', threshold: null },
  { value: '20', threshold: 20 },
  { value: '30', threshold: 30 },
  { value: '40', threshold: 40 },
  { value: '50', threshold: 50 },
];

type AlertThresholdSelectProps = {
  value: number | null;
  onChange: (value: AlertThresholdValue) => void;
  disabled?: boolean;
  id?: string;
  'aria-label'?: string;
};

function toSelectValue(value: number | null): string {
  if (value === null) {
    return 'any';
  }

  return String(value);
}

function fromSelectValue(value: string): AlertThresholdValue {
  if (value === 'any') {
    return null;
  }

  const parsed = Number(value);
  if (parsed === 20 || parsed === 30 || parsed === 40 || parsed === 50) {
    return parsed;
  }

  return null;
}

export function AlertThresholdSelect({
  value,
  onChange,
  disabled = false,
  id,
  'aria-label': ariaLabel = 'Alert threshold',
}: AlertThresholdSelectProps) {
  return (
    <Select
      {...(id ? { id } : {})}
      aria-label={ariaLabel}
      value={toSelectValue(value)}
      disabled={disabled}
      variant="filled"
      popupMatchSelectWidth={false}
      style={{ minWidth: 124 }}
      options={OPTIONS.map((option) => ({
        value: option.value,
        label: formatAlertThreshold(option.threshold),
      }))}
      onChange={(nextValue) => {
        onChange(fromSelectValue(nextValue));
      }}
    />
  );
}
