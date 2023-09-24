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
  href: string;
}

type MathLabelPartType = TextType | LatexType | LatexLinkType;

export default MathLabelPartType;
