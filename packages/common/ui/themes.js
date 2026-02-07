import { colorTokens } from "./color-tokens.js";

export const lightTheme = {
  "--bs-body-bg": colorTokens.background.light.page,
  "--bs-body-color": colorTokens.text.light.primary,
  
  "--bs-primary": "#0d6efd",
  "--bs-primary-hover": "#0b5ed7",
  
  "--bs-card-bg": colorTokens.background.light.card,
  "--bs-card-color": colorTokens.text.light.primary,
  
  "--bs-btn-disabled-bg": colorTokens.ui.light.disabled,
  "--bs-btn-disabled-color": "#ffffff",
  
  "--bs-alert-success-bg": colorTokens.status.success.light.bg,
  "--bs-alert-success-color": colorTokens.status.success.light.text,
  
  "--bs-alert-danger-bg": colorTokens.status.danger.light.bg,
  "--bs-alert-danger-color": colorTokens.status.danger.light.text,
  
  "--brand-accent": colorTokens.brand.accent,
  "--brand-strong": colorTokens.brand.strong,
  "--brand-hover": colorTokens.brand.hover,
  "--brand-active": colorTokens.brand.active
};

export const darkTheme = {
  "--bs-body-bg": colorTokens.background.dark.page,
  "--bs-body-color": colorTokens.text.dark.primary,
  
  "--bs-primary": "#3d8bfd",
  "--bs-primary-hover": "#5c9dff",
  
  "--bs-card-bg": colorTokens.background.dark.card,
  "--bs-card-color": colorTokens.text.dark.primary,
  
  "--bs-btn-disabled-bg": colorTokens.ui.dark.disabled,
  "--bs-btn-disabled-color": colorTokens.text.dark.secondary,
  
  "--bs-alert-success-bg": colorTokens.status.success.dark.bg,
  "--bs-alert-success-color": colorTokens.status.success.dark.text,
  
  "--bs-alert-danger-bg": colorTokens.status.danger.dark.bg,
  "--bs-alert-danger-color": colorTokens.status.danger.dark.text,
  
  "--brand-accent": colorTokens.brand.accent,
  "--brand-strong": colorTokens.brand.strong,
  "--brand-hover": colorTokens.brand.hover,
  "--brand-active": colorTokens.brand.active
};