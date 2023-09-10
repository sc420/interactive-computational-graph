import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import {
  Box,
  IconButton,
  Link,
  ListItem,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";
import { useCallback, type FunctionComponent } from "react";
import type ExplainDerivativeItem from "../features/ExplainDerivativeItem";
import Katex from "../latex/Katex";

interface ExplainDerivativesListItemProps {
  item: ExplainDerivativeItem;
  hasDivider: boolean;
  onCopyLatex: (latex: string) => void;
}

const ExplainDerivativesListItem: FunctionComponent<
  ExplainDerivativesListItemProps
> = ({ item, hasDivider, onCopyLatex }) => {
  const handleClickLatexLink = useCallback((nodeId: string) => {
    console.log(nodeId); // TODO(sc420): Pass event to GraphContainer
  }, []);

  return (
    <ListItem disableGutters divider={hasDivider}>
      <Stack py={1} spacing={1} width="100%">
        {/* Description */}
        <Box>
          {item.descriptionParts.map((part) => {
            switch (part.type) {
              case "text": {
                return (
                  <Typography key={part.id} display="inline" variant="body2">
                    {part.text}
                  </Typography>
                );
              }
              case "latex": {
                return <Katex key={part.id} latex={part.latex} />;
              }
              case "latexLink": {
                return (
                  <Link
                    key={part.id}
                    href="#"
                    onClick={() => {
                      handleClickLatexLink(part.nodeId);
                    }}
                  >
                    <Katex latex={part.latex} />
                  </Link>
                );
              }
              default: {
                throw new Error("Unknown description part type");
              }
            }
          })}
        </Box>

        {/* Expression */}
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          spacing={1}
          overflow="auto hidden"
        >
          <Box py={1}>
            <Katex latex={item.latex} />
          </Box>
          <Tooltip title="Copy LaTeX">
            <IconButton
              aria-label="copy"
              onClick={() => {
                onCopyLatex(item.latex);
              }}
            >
              <ContentCopyIcon />
            </IconButton>
          </Tooltip>
        </Stack>
      </Stack>
    </ListItem>
  );
};

export default ExplainDerivativesListItem;
