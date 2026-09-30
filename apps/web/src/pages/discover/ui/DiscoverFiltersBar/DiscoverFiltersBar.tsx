import { STORE_CATEGORIES } from '@saleradar/contracts';
import { Input, Select, Switch } from 'antd';
import { SearchOutlined } from '@ant-design/icons';

import { cx } from '@/shared/lib';
import { CATEGORY_LABELS } from '@/entities/store';

import type { DiscoverFilters } from '../../model';
import styles from './DiscoverFiltersBar.module.css';

type DiscoverFiltersBarProps = {
  filters: DiscoverFilters;
  onChange: (next: DiscoverFilters) => void;
};

const CATEGORY_OPTIONS: readonly { value: DiscoverFilters['category']; label: string }[] = [
  { value: 'all', label: 'All' },
  ...STORE_CATEGORIES.map((category) => ({ value: category, label: CATEGORY_LABELS[category] })),
];

export function DiscoverFiltersBar({ filters, onChange }: DiscoverFiltersBarProps) {
  return (
    <div className={styles.root}>
      <div className={styles.controls}>
        <Input
          allowClear
          value={filters.search}
          prefix={<SearchOutlined aria-hidden className={styles.searchIcon} />}
          placeholder="Search stores"
          aria-label="Search stores"
          className={cx(styles.search)}
          onChange={(event) => {
            onChange({ ...filters, search: event.target.value });
          }}
        />

        <Select
          value={filters.sort}
          aria-label="Sort stores"
          className={cx(styles.sort)}
          options={[
            { value: 'name', label: 'Sort: A to Z' },
            { value: 'sale', label: 'Sort: Biggest discount' },
          ]}
          onChange={(sort: DiscoverFilters['sort']) => {
            onChange({ ...filters, sort });
          }}
        />

        <label className={styles.toggle}>
          <Switch
            size="small"
            checked={filters.sale === 'active'}
            onChange={(checked) => {
              onChange({ ...filters, sale: checked ? 'active' : 'all' });
            }}
            aria-label="Active sales only"
          />
          <span>Live sales only</span>
        </label>
      </div>

      <div className={styles.chips} role="group" aria-label="Category">
        {CATEGORY_OPTIONS.map((option) => {
          const isSelected = filters.category === option.value;
          return (
            <button
              key={option.value}
              type="button"
              className={isSelected ? styles.chipActive : styles.chip}
              aria-pressed={isSelected}
              onClick={() => {
                onChange({ ...filters, category: option.value });
              }}
            >
              {option.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
