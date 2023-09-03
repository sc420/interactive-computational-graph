interface TextType {
  type: "text";
  text: string;
}

interface LatexType {
  type: "latex";
  latex: string;
}

interface LatexLinkType {
  type: "latexLink";
  latex: string;
  nodeId: string;
}

type ExplainDerivativeDescriptionType = TextType | LatexType | LatexLinkType;

export default ExplainDerivativeDescriptionType;
