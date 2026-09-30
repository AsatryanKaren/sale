import { lightBrandTokens } from './brandTokens';
import { toCssVariables } from './cssVariables';
import type { BrandTokens } from './types';

type ThemeCssVariablesProps = {
  tokens?: BrandTokens;
};

export function ThemeCssVariables({ tokens = lightBrandTokens }: ThemeCssVariablesProps) {
  return <style>{toCssVariables(tokens)}</style>;
}
