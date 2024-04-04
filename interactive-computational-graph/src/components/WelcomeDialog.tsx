import FunctionsIcon from "@mui/icons-material/Functions";
import {
  Button,
  Card,
  CardActions,
  CardContent,
  Dialog,
  DialogContent,
  DialogTitle,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Stack,
  Typography,
} from "@mui/material";
import {
  useCallback,
  useEffect,
  useState,
  type FunctionComponent,
} from "react";
import basicArithmetic1 from "../examples/basic_arithmetic1.json";
import type GraphContainerState from "../states/GraphContainerState";

interface ExampleItem {
  latex: string;
  state: GraphContainerState;
}

interface ExampleSection {
  title: string;
  exampleItems: ExampleItem[];
}

const exampleSections: ExampleSection[] = [
  {
    title: "Basic Arithmetic",
    exampleItems: [
      { latex: "f = x + y", state: basicArithmetic1 as GraphContainerState },
      { latex: "f = x * y", state: basicArithmetic1 as GraphContainerState },
      { latex: "f = a * x^n", state: basicArithmetic1 as GraphContainerState },
    ],
  },
  {
    title: "Advanced Arithmetic",
    exampleItems: [
      {
        latex: "f = (a+b)*(c+d)",
        state: basicArithmetic1 as GraphContainerState,
      },
      {
        latex: "f = (a+b)^(c+d)",
        state: basicArithmetic1 as GraphContainerState,
      },
      {
        latex: "f = (sin(x) + cos(y)) / (sin(x) * cos(y))",
        state: basicArithmetic1 as GraphContainerState,
      },
    ],
  },
  {
    title: "Neural Network",
    exampleItems: [
      {
        latex: "2-1 fully connected",
        state: basicArithmetic1 as GraphContainerState,
      },
      {
        latex: "2-2-1 fully connected",
        state: basicArithmetic1 as GraphContainerState,
      },
      {
        latex: "2-3-4-1 fully connected",
        state: basicArithmetic1 as GraphContainerState,
      },
    ],
  },
];

interface WelcomeDialogProps {
  onLoad: (graphContainerState: GraphContainerState) => void;
}

const WelcomeDialog: FunctionComponent<WelcomeDialogProps> = ({ onLoad }) => {
  const [open, setOpen] = useState(false);

  // Open the dialog on start
  useEffect(() => {
    setOpen(true);
  }, []);

  const handleClose = useCallback(() => {
    setOpen(false);
  }, []);

  return (
    <Dialog
      open={open}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">Get Started</DialogTitle>
      <DialogContent>
        <Stack direction="row" spacing={3}>
          {/* Load from examples */}
          <Card variant="outlined" sx={{ px: 2 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Load From Examples
              </Typography>

              {exampleSections.map((section) => (
                <div key={section.title}>
                  <Typography variant="subtitle1" gutterBottom>
                    {section.title}
                  </Typography>

                  <List dense>
                    {section.exampleItems.map((exampleItem) => (
                      <ListItem key={exampleItem.latex} disablePadding>
                        <ListItemButton>
                          <ListItemIcon>
                            <FunctionsIcon fontSize="small" />
                          </ListItemIcon>
                          <ListItemText
                            primary={exampleItem.latex}
                            onClick={() => {
                              onLoad(exampleItem.state);
                              setOpen(false);
                            }}
                          />
                        </ListItemButton>
                      </ListItem>
                    ))}
                  </List>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Start with blank graph */}
          <Card variant="outlined" sx={{ px: 2 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Build Your Own Graph
              </Typography>
              <Typography>GIF Here</Typography>
            </CardContent>
            <CardActions>
              <Button
                variant="outlined"
                size="large"
                fullWidth
                onClick={handleClose}
              >
                Blank Graph
              </Button>
            </CardActions>
          </Card>
        </Stack>
      </DialogContent>
    </Dialog>
  );
};

export default WelcomeDialog;
