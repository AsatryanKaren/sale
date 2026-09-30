# SaleRadar design system

A quiet, neutral product UI where the only loud thing is a good discount.

## Principles

1. **Signal over chrome.** Surfaces are white on a warm off-white canvas with hairline borders. Color is reserved for sale strength and the few places that need attention (unread, active nav).
2. **One accent.** Ink (`brandPrimary`) drives primary actions. Signal orange (`brandAccent`, `saleHot`) marks hot deals, unread items and the active route.
3. **Discount strength is visual.** `getSaleTone` maps a discount to `hot` (40%+, solid orange), `moderate` (20–39%, tinted) or `muted` (gray). Live-sale cards get a thin orange top edge.
4. **Consistent rhythm.** Spacing, radius and shadow come from the scales in `app/styles/global.css`.

## Tokens

| Where                             | What                                               |
| --------------------------------- | -------------------------------------------------- |
| `app/theme/brandTokens.ts`        | All colors. The only place a hex value is allowed. |
| `app/theme/ThemeCssVariables.tsx` | Emits the tokens as `--sr-*` CSS variables.        |
| `app/theme/createTheme.ts`        | Maps tokens to Ant Design's theme.                 |
| `app/styles/global.css`           | Radius, spacing, shadow, easing and layout scales. |

## Type

Geist Variable, self-hosted. Headings are 600 weight with tight negative tracking; eyebrows are small uppercase labels in the tertiary text color. Numbers in stats use tabular figures.

## Building blocks (`shared/ui`)

- `Page`: page frame with `narrow`, `default` and `wide` widths
- `PageHeader`: eyebrow, title, description and actions
- `Surface` / `SurfaceSection`: the card container every panel builds on
- `Stat` / `StatGroup`: KPI tiles joined by hairlines
- `AppEmptyState`, `AppErrorState`, `AppLoadingState`: feedback states
- `BrandMark`: the radar logo, drawn with theme variables

## Layout

Desktop uses a 248px sticky sidebar. Below 992px it becomes a blurred top bar plus a fixed bottom tab bar, with an unread dot on Notifications.
