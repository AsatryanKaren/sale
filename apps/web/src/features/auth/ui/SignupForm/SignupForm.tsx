import { PASSWORD_MIN_LENGTH, type SignupRequest } from '@saleradar/contracts';
import { Alert, Button, Form, Input } from 'antd';

import { toUserFacingApiError } from '@/shared/api';
import { useSignupMutation } from '@/entities/session';

type SignupFormProps = {
  onSuccess: () => void;
};

export function SignupForm({ onSuccess }: SignupFormProps) {
  const signup = useSignupMutation();

  return (
    <Form<SignupRequest>
      layout="vertical"
      requiredMark={false}
      disabled={signup.isPending}
      onFinish={(values) => {
        signup.mutate(values, { onSuccess });
      }}
    >
      {signup.isError ? (
        <Form.Item>
          <Alert type="error" showIcon message={toUserFacingApiError(signup.error)} />
        </Form.Item>
      ) : null}
      <Form.Item
        label="Name"
        name="name"
        rules={[{ required: true, whitespace: true, message: 'Enter your name.' }]}
      >
        <Input autoComplete="name" placeholder="Anna" />
      </Form.Item>
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
        extra={`At least ${PASSWORD_MIN_LENGTH} characters.`}
        rules={[
          { required: true, message: 'Choose a password.' },
          {
            min: PASSWORD_MIN_LENGTH,
            message: `Use at least ${PASSWORD_MIN_LENGTH} characters.`,
          },
        ]}
      >
        <Input.Password autoComplete="new-password" />
      </Form.Item>
      <Button type="primary" htmlType="submit" block loading={signup.isPending}>
        Start free trial
      </Button>
    </Form>
  );
}
