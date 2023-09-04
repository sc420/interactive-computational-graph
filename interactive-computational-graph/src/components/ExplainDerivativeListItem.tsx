import { Box, Link, ListItem, Stack, Typography } from "@mui/material";
import { useCallback, type FunctionComponent } from "react";
import type ExplainDerivativeItem from "../features/ExplainDerivativeItem";
import Katex from "../latex/Katex";

interface ExplainDerivativesListItemProps {
  item: ExplainDerivativeItem;
  hasDivider: boolean;
}

const ExplainDerivativesListItem: FunctionComponent<
  ExplainDerivativesListItemProps
> = ({ item, hasDivider }) => {
  const handleClickLatexLink = useCallback((nodeId: string) => {
    console.log(nodeId); // TODO(sc420): Pass event to GraphContainer
  }, []);

  return (
    <ListItem disableGutters divider={hasDivider} sx={{ py: 1.5 }}>
      <Stack spacing={1}>
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
        <Katex latex={item.latex} />
      </Stack>
    </ListItem>
  );
};

export default ExplainDerivativesListItem;
