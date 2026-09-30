import { Button, Popconfirm } from 'antd';

import { useCancelSubscriptionMutation, useResumeSubscriptionMutation } from '@/entities/session';

type ManageSubscriptionProps = {
  cancelAtPeriodEnd: boolean;
  periodEndLabel: string;
};

export function ManageSubscription({ cancelAtPeriodEnd, periodEndLabel }: ManageSubscriptionProps) {
  const cancel = useCancelSubscriptionMutation();
  const resume = useResumeSubscriptionMutation();

  if (cancelAtPeriodEnd) {
    return (
      <Button
        loading={resume.isPending}
        onClick={() => {
          resume.mutate(undefined);
        }}
      >
        Resume plan
      </Button>
    );
  }

  return (
    <Popconfirm
      title="Cancel your plan?"
      description={`You keep access until ${periodEndLabel}.`}
      okText="Cancel plan"
      okButtonProps={{ danger: true }}
      cancelText="Keep plan"
      onConfirm={() => cancel.mutateAsync(undefined)}
    >
      <Button danger type="text" loading={cancel.isPending}>
        Cancel plan
      </Button>
    </Popconfirm>
  );
}
