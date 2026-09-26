import { Button } from 'antd';

import { useUnfollowStoreMutation } from '@/entities/watch';

type UnfollowButtonProps = {
  storeId: string;
  storeName: string;
};

export function UnfollowButton({ storeId, storeName }: UnfollowButtonProps) {
  const unfollowMutation = useUnfollowStoreMutation();

  return (
    <Button
      size="small"
      danger
      loading={unfollowMutation.isPending}
      onClick={() => {
        unfollowMutation.mutate(storeId);
      }}
      aria-label={`Unfollow ${storeName}`}
    >
      Unfollow
    </Button>
  );
}
