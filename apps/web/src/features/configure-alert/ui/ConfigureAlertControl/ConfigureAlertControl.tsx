import {
  AlertThresholdSelect,
  useUpdateWatchMutation,
  type AlertThresholdValue,
} from '@/entities/watch';

type ConfigureAlertControlProps = {
  storeId: string;
  value: number | null;
  disabled?: boolean;
  'aria-label'?: string;
};

export function ConfigureAlertControl({
  storeId,
  value,
  disabled = false,
  'aria-label': ariaLabel,
}: ConfigureAlertControlProps) {
  const updateWatchMutation = useUpdateWatchMutation();

  return (
    <AlertThresholdSelect
      value={value}
      disabled={disabled || updateWatchMutation.isPending}
      {...(ariaLabel ? { 'aria-label': ariaLabel } : {})}
      onChange={(nextValue: AlertThresholdValue) => {
        updateWatchMutation.mutate({
          storeId,
          payload: {
            minimumDiscountPercent: nextValue,
          },
        });
      }}
    />
  );
}
