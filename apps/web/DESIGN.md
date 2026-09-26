# SaleRadar Design System

**Mode:** Operate (product UI)  
**References applied:** [Impeccable](https://github.com/pbakaus/impeccable) Operate + craft-floor; [Deslopify](https://github.com/AntonioSpagnol/UI-Deslopify-Skill) anti-slop rules.

## Direction

Clean modern retail tool. Familiar product affordances. Hierarchy from type weight and spacing. One accent for action and hot sales only.

## Tokens

| Token | Value | Use |
| --- | --- | --- |
| brandPrimary | `#111111` | Primary actions, text, selection |
| brandSecondary | `#2A2A2A` | Secondary emphasis |
| accent / saleHot | `#E11D48` | Hot discounts, unread, destructive emphasis |
| saleModerate | `#0F766E` | Moderate discounts |
| backgroundBase | `#F4F4F5` | App canvas |
| backgroundElevated | `#FFFFFF` | Panels, cards |
| textSecondary | `#71717A` | Meta, helpers |
| border | `#E4E4E7` | Hairlines |
| radius | `12px` | Surfaces; pills only on small tags/buttons |
| font | Plus Jakarta Sans | Single family for all UI |

## Rules

- No decorative gradients, glass, orbs, radar rings, or multi-shadow stacks
- Accent color only on CTAs, active nav, hot sale badges, unread
- Brand wordmark lives in the shell; pages lead with the task title
- Cards are interaction containers only; flat white + 1px border
- Motion ≤ 200ms and only for state (hover/focus), not page theater
