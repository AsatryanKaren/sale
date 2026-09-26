# SaleRadar Design System

**Mode:** Operate (product UI), amplified  
**References:** [Impeccable](https://github.com/pbakaus/impeccable) Operate + bolder/delight; [Deslopify](https://github.com/AntonioSpagnol/UI-Deslopify-Skill) anti-slop rules.

## Direction

Modern retail radar: calm ink surfaces, one rose signal, and **discount as the product’s visual motif**. Familiar app structure, stronger hierarchy and material contrast than a wireframe.

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
| radius | `14px` | Surfaces |
| font body | Plus Jakarta Sans | UI |
| font display | Fraunces | Brand + page titles only |

## Rules

- No glass, decorative multi-stop gradients, orbs, or page-load theater
- Accent used for signal: hot sales, unread, primary brand mark, rare emphasis
- Active-sale cards get a tinted sale well (solid tint, not gradient fill)
- Elevation: soft shadow **or** border — not both stacked heavily
- Motion ≤ 180ms for hover/focus only
