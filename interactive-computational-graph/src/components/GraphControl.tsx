import {
  AppBar,
  FormControlLabel,
  FormGroup,
  Switch,
  Toolbar,
} from "@mui/material";

const GraphControl: React.FunctionComponent = () => {
  return (
    <AppBar position="static" color="transparent">
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

export default GraphControl;
