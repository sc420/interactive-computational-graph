import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import { Box, IconButton, ListItem, Stack, Tooltip } from "@mui/material";
import { type FunctionComponent } from "react";
import type ExplainDerivativeItem from "../features/ExplainDerivativeItem";
import Katex from "../latex/Katex";
import MathLabel from "./MathLabel";

interface ExplainDerivativesListItemProps {
  item: ExplainDerivativeItem;
  hasDivider: boolean;
  onCopyLatex: (latex: string) => void;
  onClickLatexLink: (nodeId: string) => void;
}

const ExplainDerivativesListItem: FunctionComponent<
  ExplainDerivativesListItemProps
> = ({ item, hasDivider, onCopyLatex, onClickLatexLink }) => {
  return (
    <ListItem disableGutters divider={hasDivider}>
      <Stack py={1} spacing={1} width="100%">
        {/* Description */}
        <MathLabel
          parts={item.descriptionParts}
          onClickLatexLink={onClickLatexLink}
        />

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
