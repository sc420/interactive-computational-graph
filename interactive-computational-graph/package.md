# Package Configuration

- `zustand@4.3.1` is installed to suppress [deprecation](https://github.com/pmndrs/zustand/discussions/1937) warnings in the console
- We have added a `overrides` keyword with a specific typescript version as a [workaround](https://github.com/facebook/create-react-app/issues/13080#issuecomment-1487975896) to fix npm install problems, it should be removed in the future
