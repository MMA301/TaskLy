export const taskerColors = {
  background: '#f9f9ff',
  border: '#c7c4d8',
  card: '#ffffff',
  error: '#ba1a1a',
  errorContainer: '#ffdad6',
  muted: '#464555',
  outline: '#777587',
  primary: '#3525cd',
  primaryContainer: '#4f46e5',
  primaryFixed: '#e2dfff',
  secondary: '#831ada',
  secondaryFixed: '#f0dbff',
  success: '#16a34a',
  surface: '#f9f9ff',
  surfaceContainer: '#e7eeff',
  surfaceContainerHigh: '#dee8ff',
  surfaceContainerLow: '#f0f3ff',
  text: '#111c2d',
  tertiary: '#7e3000',
  tertiaryFixed: '#ffdbcc',
  white: '#ffffff',
};

export const taskerSpacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 40,
};

export function formatCurrency(value: number) {
  return new Intl.NumberFormat('vi-VN').format(value);
}
