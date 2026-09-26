import { Button } from 'antd';

import { useFollowStoreMutation, useUnfollowStoreMutation } from '@/entities/watch';

type FollowButtonProps = {
  storeId: string;
  storeName: string;
  isFollowing: boolean;
};

export function FollowButton({ storeId, storeName, isFollowing }: FollowButtonProps) {
  const followMutation = useFollowStoreMutation();
  const unfollowMutation = useUnfollowStoreMutation();
  const isPending = followMutation.isPending || unfollowMutation.isPending;

  if (isFollowing) {
    return (
      <Button
        size="small"
        loading={unfollowMutation.isPending}
        disabled={isPending}
        onClick={() => {
          unfollowMutation.mutate(storeId);
        }}
        aria-label={`Unfollow ${storeName}`}
      >
        Following
      </Button>
    );
  }

  return (
    <Button
      size="small"
      type="primary"
      loading={followMutation.isPending}
      disabled={isPending}
      onClick={() => {
        followMutation.mutate({
          storeId,
          minimumDiscountPercent: null,
          notifyOnSaleStart: true,
          notifyOnDiscountIncrease: true,
          notifyOnNewSaleItems: false,
        });
      }}
      aria-label={`Follow ${storeName}`}
    >
      Follow
    </Button>
  );
}
