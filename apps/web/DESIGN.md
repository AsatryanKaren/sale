# SaleRadar Design System

**Mode:** Operate (product UI), distilled  
**References:** [Impeccable](https://github.com/pbakaus/impeccable) Operate + distill/quieter.

## Direction

Calm retail radar: compact cards, small controls, one rose signal. Discount stays the motif — hierarchy comes from type weight and sale wells, not oversized chrome.

## Tokens

| Token | Value | Use |
| --- | --- | --- |
| brandPrimary | `#0B0B0C` | Primary actions, ink |
| shell | `#121316` | Sidebar / mobile chrome |
| accent / saleHot | `#E11D48` | Hot discount, unread, brand mark |
| saleModerate | `#0F766E` | Moderate discount |
| backgroundBase | `#E9EDF2` | App canvas |
| backgroundElevated | `#FFFFFF` | Cards, trays |
| textSecondary | `#667085` | Meta |
| border | `#D7DEE7` | Hairlines |
| radius | `12px` cards / `8px` controls | Surfaces |
| control height | `30px` / `26px` small | Buttons |
| font | Montserrat | UI + brand |
| font size | `14px` base | Body |

## Rules

- Prefer border over shadow for cards
- In-card actions use `size="small"` buttons
- No glass, decorative gradients, orbs, or page-load theater
- Accent only for signal: hot sales, unread, brand mark
- Motion ≤ 140ms for hover/focus only
