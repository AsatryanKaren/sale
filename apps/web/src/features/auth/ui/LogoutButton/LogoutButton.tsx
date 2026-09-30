import { Button } from 'antd';
import { LogoutOutlined } from '@ant-design/icons';

import { useLogoutMutation } from '@/entities/session';

type LogoutButtonProps = {
  onSuccess?: () => void;
};

export function LogoutButton({ onSuccess }: LogoutButtonProps) {
  const logout = useLogoutMutation();

  return (
    <Button
      icon={<LogoutOutlined />}
      loading={logout.isPending}
      onClick={() => {
        logout.mutate(undefined, onSuccess ? { onSuccess } : {});
      }}
    >
      Sign out
    </Button>
  );
}
