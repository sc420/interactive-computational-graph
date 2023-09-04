interface TextType {
  type: "text";
  id: string;
  text: string;
}

interface LatexType {
  type: "latex";
  id: string;
  latex: string;
}

interface LatexLinkType {
  type: "latexLink";
  id: string;
  latex: string;
  nodeId: string;
}

type ExplainDerivativeDescriptionType = TextType | LatexType | LatexLinkType;

export default ExplainDerivativeDescriptionType;
