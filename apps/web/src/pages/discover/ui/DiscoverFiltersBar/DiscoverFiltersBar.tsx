import { STORE_CATEGORIES } from '@saleradar/contracts';
import { Input, Select, Switch } from 'antd';
import { SearchOutlined } from '@ant-design/icons';

import { CATEGORY_LABELS } from '@/entities/store';

import type { DiscoverFilters } from '../../model';
import styles from './DiscoverFiltersBar.module.css';

type DiscoverFiltersBarProps = {
  filters: DiscoverFilters;
  onChange: (next: DiscoverFilters) => void;
};

export function DiscoverFiltersBar({ filters, onChange }: DiscoverFiltersBarProps) {
  return (
    <div className={styles.bar}>
      <Input
        allowClear
        value={filters.search}
        prefix={<SearchOutlined aria-hidden />}
        placeholder="Search stores"
        aria-label="Search stores"
        onChange={(event) => {
          onChange({
            ...filters,
            search: event.target.value,
          });
        }}
      />

      <Select
        value={filters.category}
        aria-label="Category"
        options={[
          { value: 'all', label: 'All categories' },
          ...STORE_CATEGORIES.map((category) => ({
            value: category,
            label: CATEGORY_LABELS[category],
          })),
        ]}
        onChange={(category: DiscoverFilters['category']) => {
          onChange({
            ...filters,
            category,
          });
        }}
      />

      <Select
        value={filters.sort}
        aria-label="Sort stores"
        options={[
          { value: 'name', label: 'Sort by name' },
          { value: 'sale', label: 'Sort by discount' },
        ]}
        onChange={(sort: DiscoverFilters['sort']) => {
          onChange({
            ...filters,
            sort,
          });
        }}
      />

      <label className={styles.switchLabel}>
        <Switch
          checked={filters.sale === 'active'}
          onChange={(checked) => {
            onChange({
              ...filters,
              sale: checked ? 'active' : 'all',
            });
          }}
          aria-label="Active sales only"
        />
        <span>Active sales</span>
      </label>
    </div>
  );
}
