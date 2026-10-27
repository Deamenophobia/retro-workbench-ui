export type SelectOption = {
  value: string;
  label: string;
  description?: string;
  disabled?: boolean;
};
export type SelectionFieldProps = {
  label: string;
  options: readonly SelectOption[];
  help?: string;
  error?: string;
  disabled?: boolean;
  name?: string;
  placeholder?: string;
};
