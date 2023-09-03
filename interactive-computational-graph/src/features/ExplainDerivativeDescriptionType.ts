interface TextType {
  type: "text";
  text: string;
}

interface LatexLinkType {
  type: "latexLink";
  latex: string;
  nodeId: string;
}

type ExplainDerivativeDescriptionType = TextType | LatexLinkType;

export default ExplainDerivativeDescriptionType;
