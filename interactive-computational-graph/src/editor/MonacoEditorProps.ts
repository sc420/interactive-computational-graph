interface MonacoEditorProps {
  // Test ID. Only used in mock
  testId: string;
  defaultValue?: string;
  defaultLanguage?: string;
  value?: string;
  isDarkMode: boolean;
  readOnly?: boolean;
  onChange?: (code: string) => void;
}

export default MonacoEditorProps;
