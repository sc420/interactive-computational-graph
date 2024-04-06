import {
  Grid,
  Link,
  List,
  ListItem,
  ListItemText,
  Stack,
  Typography,
} from "@mui/material";
import { Fragment, type FunctionComponent } from "react";

interface KeyboardShortcutItem {
  action: string;
  shortcut: string;
}

const keyboardShortcutNodeItems: KeyboardShortcutItem[] = [
  { action: "Move nodes", shortcut: "Click header + Drag" },
  { action: "Select single node", shortcut: "Click node" },
  { action: "Select multiple nodes", shortcut: "Shift + Click blank + Drag" },
  { action: "Select more nodes", shortcut: "Ctrl + Click header" },
  { action: "Remove selected nodes", shortcut: "Delete / Backspace" },
];

const keyboardShortcutConnectionItems: KeyboardShortcutItem[] = [
  { action: "Add connection", shortcut: "Click output + Drag + Release input" },
  { action: "Select connection", shortcut: "Click connection" },
  { action: "Select more connections", shortcut: "Ctrl + Click connection" },
  { action: "Remove connection", shortcut: "Delete / Backspace" },
];

const keyboardShortcutGraphItems: KeyboardShortcutItem[] = [
  { action: "Zoom in/out", shortcut: "Mouse wheel" },
  { action: "Pan", shortcut: "Click blank + Drag" },
];

const TutorialPanel: FunctionComponent = () => {
  return (
    <>
      {/* Header and toolbar */}
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        px={2}
        py={0.5}
      >
        <Typography variant="subtitle1">Tutorial</Typography>
      </Stack>

      {/* Contents */}
      <Stack px={2} pt={1} pb={3} spacing={2}>
        {/* About */}
        <section>
          <Typography variant="subtitle2" gutterBottom>
            About
          </Typography>
          <Typography variant="body2" gutterBottom>
            This educational tool allows you to explore how backpropagation
            works in neural networks by seeing chain rule in action. This tool
            is inspired by the article{" "}
            <Link
              href="https://colah.github.io/posts/2015-08-Backprop/"
              target="_blank"
              rel="noopener"
            >
              Calculus on Computational Graphs: Backpropagation
            </Link>
            .
          </Typography>
        </section>

        {/* Get started */}
        <section>
          <Typography variant="subtitle2" gutterBottom>
            Get Started
          </Typography>
          <List
            dense
            disablePadding
            component="ol"
            sx={{ listStyle: "decimal", pl: 3 }}
          >
            <ListItem disablePadding sx={{ display: "list-item" }}>
              <ListItemText primary="Add nodes by dragging or clicking them from the Add Nodes panel" />
            </ListItem>
            <ListItem disablePadding sx={{ display: "list-item" }}>
              <ListItemText primary="Set initial values for variable/constant nodes" />
            </ListItem>
            <ListItem disablePadding sx={{ display: "list-item" }}>
              <ListItemText primary="Connect nodes by dragging lines from outputs to inputs" />
            </ListItem>
            <ListItem disablePadding sx={{ display: "list-item" }}>
              <ListItemText primary="Set the derivative target (usually the last node) on the toolbar" />
            </ListItem>
            <ListItem disablePadding sx={{ display: "list-item" }}>
              <ListItemText primary="Click the derivative links to view detailed explanations" />
            </ListItem>
          </List>
        </section>

        {/* Keyboard shortcuts (Node) */}
        <section>
          <Typography variant="subtitle2" gutterBottom>
            Keyboard Shortcuts (Node)
          </Typography>
          <Grid container spacing={2}>
            {keyboardShortcutNodeItems.map((item) => (
              <Fragment key={item.action}>
                <Grid item xs={6}>
                  <Typography variant="body2">{item.action}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">
                    {item.shortcut}
                  </Typography>
                </Grid>
              </Fragment>
            ))}
          </Grid>
        </section>

        {/* Keyboard shortcuts (Connection) */}
        <section>
          <Typography variant="subtitle2" gutterBottom>
            Keyboard Shortcuts (Connection)
          </Typography>
          <Grid container spacing={2}>
            {keyboardShortcutConnectionItems.map((item) => (
              <Fragment key={item.action}>
                <Grid item xs={6}>
                  <Typography variant="body2">{item.action}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">
                    {item.shortcut}
                  </Typography>
                </Grid>
              </Fragment>
            ))}
          </Grid>
        </section>

        {/* Keyboard shortcuts (Graph) */}
        <section>
          <Typography variant="subtitle2" gutterBottom>
            Keyboard Shortcuts (Graph)
          </Typography>
          <Grid container spacing={2}>
            {keyboardShortcutGraphItems.map((item) => (
              <Fragment key={item.action}>
                <Grid item xs={6}>
                  <Typography variant="body2">{item.action}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">
                    {item.shortcut}
                  </Typography>
                </Grid>
              </Fragment>
            ))}
          </Grid>
        </section>
      </Stack>
    </>
  );
};

export default TutorialPanel;
