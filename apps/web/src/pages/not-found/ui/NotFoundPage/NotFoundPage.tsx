import { Link } from 'react-router-dom';
import { Button, Result } from 'antd';

export function NotFoundPage() {
  return (
    <Result
      status="404"
      title="Page not found"
      subTitle="That route is not part of SaleRadar yet."
      extra={
        <Link to="/discover">
          <Button type="primary">Go to Discover</Button>
        </Link>
      }
    />
  );
}
