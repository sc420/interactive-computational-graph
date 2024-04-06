import FunctionsIcon from "@mui/icons-material/Functions";
import {
  Box,
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
import advancedArithmetic1 from "../examples/advanced_arithmetic1.json";
import advancedArithmetic2 from "../examples/advanced_arithmetic2.json";
import advancedArithmetic3 from "../examples/advanced_arithmetic3.json";
import basicArithmetic1 from "../examples/basic_arithmetic1.json";
import basicArithmetic2 from "../examples/basic_arithmetic2.json";
import basicArithmetic3 from "../examples/basic_arithmetic3.json";
import neuralNetwork1 from "../examples/neural_network1.json";
import neuralNetwork2 from "../examples/neural_network2.json";
import neuralNetwork3 from "../examples/neural_network3.json";
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
      { latex: "f = x * y", state: basicArithmetic2 as GraphContainerState },
      { latex: "f = a * x^n", state: basicArithmetic3 as GraphContainerState },
    ],
  },
  {
    title: "Advanced Arithmetic",
    exampleItems: [
      {
        latex: "f = (a+b)^(c+d)",
        state: advancedArithmetic1 as GraphContainerState,
      },
      {
        latex: "f = ln(x^2) + ln(y^2)",
        state: advancedArithmetic2 as GraphContainerState,
      },
      {
        latex: "f = sin(x) / x",
        state: advancedArithmetic3 as GraphContainerState,
      },
    ],
  },
  {
    title: "Neural Network",
    exampleItems: [
      {
        latex: "2-1 fully connected",
        state: neuralNetwork1 as GraphContainerState,
      },
      {
        latex: "2-2-1 fully connected",
        state: neuralNetwork2 as GraphContainerState,
      },
      {
        latex: "5-4-3-2 fully connected",
        state: neuralNetwork3 as GraphContainerState,
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
      maxWidth="lg"
    >
      <DialogTitle id="alert-dialog-title">Get Started</DialogTitle>
      <DialogContent>
        <Stack direction="row" spacing={3}>
          {/* Load from examples */}
          <Card variant="outlined" sx={{ px: 2, minWidth: 250 }}>
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
          <Card variant="outlined" sx={{ px: 2, minWidth: 300, maxWidth: 600 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Build Your Own Graph
              </Typography>
              <Typography variant="body2" gutterBottom>
                See Tutorial side panel for more information.
              </Typography>
              <Box
                component="img"
                src={`${process.env.PUBLIC_URL}/get_started.gif`}
                alt="get started"
                maxWidth={"100%"}
                my={2}
              ></Box>
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
