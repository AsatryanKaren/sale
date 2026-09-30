import { Button } from 'antd';
import { CheckOutlined, PlusOutlined } from '@ant-design/icons';

import { useFollowStoreMutation, useUnfollowStoreMutation } from '@/entities/watch';

type FollowButtonProps = {
  storeId: string;
  storeName: string;
  isFollowing: boolean;
  size?: 'small' | 'middle';
};

export function FollowButton({
  storeId,
  storeName,
  isFollowing,
  size = 'small',
}: FollowButtonProps) {
  const followMutation = useFollowStoreMutation();
  const unfollowMutation = useUnfollowStoreMutation();
  const isPending = followMutation.isPending || unfollowMutation.isPending;

  if (isFollowing) {
    return (
      <Button
        size={size}
        icon={<CheckOutlined />}
        loading={unfollowMutation.isPending}
        disabled={isPending}
        onClick={() => {
          unfollowMutation.mutate(storeId);
        }}
        aria-label={`Unfollow ${storeName}`}
        title="Click to unfollow"
      >
        Following
      </Button>
    );
  }

  return (
    <Button
      size={size}
      type="primary"
      icon={<PlusOutlined />}
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
