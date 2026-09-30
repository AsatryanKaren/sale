import type { LoginRequest } from '@saleradar/contracts';
import { Alert, Button, Form, Input } from 'antd';

import { toUserFacingApiError } from '@/shared/api';
import { useLoginMutation } from '@/entities/session';

type LoginFormProps = {
  onSuccess: () => void;
};

export function LoginForm({ onSuccess }: LoginFormProps) {
  const login = useLoginMutation();

  return (
    <Form<LoginRequest>
      layout="vertical"
      requiredMark={false}
      disabled={login.isPending}
      onFinish={(values) => {
        login.mutate(values, { onSuccess });
      }}
    >
      {login.isError ? (
        <Form.Item>
          <Alert type="error" showIcon message={toUserFacingApiError(login.error)} />
        </Form.Item>
      ) : null}
      <Form.Item
        label="Email"
        name="email"
        rules={[{ required: true, type: 'email', message: 'Enter a valid email.' }]}
      >
        <Input autoComplete="email" inputMode="email" placeholder="you@example.com" />
      </Form.Item>
      <Form.Item
        label="Password"
        name="password"
        rules={[{ required: true, message: 'Enter your password.' }]}
      >
        <Input.Password autoComplete="current-password" />
      </Form.Item>
      <Button type="primary" htmlType="submit" block loading={login.isPending}>
        Sign in
      </Button>
    </Form>
  );
}
