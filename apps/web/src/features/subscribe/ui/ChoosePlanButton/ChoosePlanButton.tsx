import { useState } from 'react';
import type { Plan } from '@saleradar/contracts';
import { Alert, Button, Modal } from 'antd';
import { LockOutlined } from '@ant-design/icons';

import { toUserFacingApiError } from '@/shared/api';
import { cx } from '@/shared/lib';
import { getPlanPriceLabel } from '@/entities/plan';
import { useCheckoutMutation } from '@/entities/session';

import styles from './ChoosePlanButton.module.css';

type ChoosePlanButtonProps = {
  plan: Plan;
  primary?: boolean;
  isCurrent?: boolean;
  onSubscribed?: () => void;
};

/**
 * Opens checkout for a plan. Payments are simulated until a payment provider
 * is connected; the confirmation step says so plainly.
 */
export function ChoosePlanButton({
  plan,
  primary = false,
  isCurrent = false,
  onSubscribed,
}: ChoosePlanButtonProps) {
  const [open, setOpen] = useState(false);
  const checkout = useCheckoutMutation();
  const amd = getPlanPriceLabel(plan, 'AMD');
  const usd = getPlanPriceLabel(plan, 'USD');

  if (isCurrent) {
    return (
      <Button block disabled>
        Current plan
      </Button>
    );
  }

  return (
    <>
      <Button
        block
        type={primary ? 'primary' : 'default'}
        onClick={() => {
          checkout.reset();
          setOpen(true);
        }}
      >
        Choose {plan.name.toLowerCase()}
      </Button>

      <Modal
        open={open}
        title={`Subscribe to ${plan.name}`}
        okText={`Pay ${amd}`}
        okButtonProps={{ icon: <LockOutlined />, loading: checkout.isPending }}
        cancelButtonProps={{ disabled: checkout.isPending }}
        onCancel={() => {
          setOpen(false);
        }}
        onOk={() => {
          checkout.mutate(
            { plan: plan.id },
            {
              onSuccess: () => {
                setOpen(false);
                onSubscribed?.();
              },
            },
          );
        }}
        destroyOnHidden
      >
        <div className={styles.summary}>
          <div className={styles.row}>
            <span>{plan.name} plan</span>
            <strong>
              {amd} <span className={styles.secondary}>({usd})</span>
            </strong>
          </div>
          <div className={styles.row}>
            <span>Billed</span>
            <span>Every {plan.interval}, cancel anytime</span>
          </div>
        </div>
        <Alert
          type="info"
          showIcon
          message="Demo checkout"
          description="Payments are simulated in this version. No card is charged."
        />
        {checkout.isError ? (
          <Alert
            className={cx(styles.error)}
            type="error"
            showIcon
            message={toUserFacingApiError(checkout.error)}
          />
        ) : null}
      </Modal>
    </>
  );
}
