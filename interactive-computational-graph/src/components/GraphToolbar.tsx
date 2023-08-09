import {
  AppBar,
  FormControlLabel,
  FormGroup,
  Switch,
  Toolbar,
} from "@mui/material";

const GraphToolbar: React.FunctionComponent = () => {
  return (
    <AppBar elevation={0} position="static" sx={{ bgcolor: "primary.light" }}>
      <Toolbar variant="dense">
        <FormGroup>
          <FormControlLabel
            control={<Switch defaultChecked />}
            label="Reverse-Mode"
          />
        </FormGroup>
      </Toolbar>
    </AppBar>
  );
};

export default GraphToolbar;
