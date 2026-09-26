type CssModule = Readonly<Record<string, string | undefined>>;

export function cssModuleClass(styles: CssModule, className: string): string {
  const value = styles[className];
  if (!value) {
    throw new Error(`Missing CSS module class "${className}".`);
  }

  return value;
}
