import { useNavigate } from 'react-router-dom';
import { CompassOutlined } from '@ant-design/icons';

import { AppEmptyState, Page } from '@/shared/ui';

export function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <Page width="narrow">
      <AppEmptyState
        icon={<CompassOutlined />}
        title="Page not found"
        description="That page isn't part of SaleRadar yet."
        actionLabel="Go to Discover"
        onAction={() => {
          void navigate('/discover');
        }}
      />
    </Page>
  );
}
