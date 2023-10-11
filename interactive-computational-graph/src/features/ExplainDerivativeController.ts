import type DifferentiationMode from "../core/DifferentiationMode";
import type ExplainDerivativeBuildOptions from "./ExplainDerivativeBuildOptions";
import type ExplainDerivativeItem from "./ExplainDerivativeItem";
import type ExplainDerivativeType from "./ExplainDerivativeType";
import type MathLabelPartType from "./MathLabelPartType";

type ChainRuleType = "raw" | "previousDerivativesReplaced" | "allReplaced";

const buildExplainDerivativeItems = (
  explainDerivativeType: ExplainDerivativeType,
  options: ExplainDerivativeBuildOptions,
): ExplainDerivativeItem[] => {
  switch (explainDerivativeType) {
    case "someValueBecauseChainRule": {
      return buildChainRuleItems(options);
    }
    case "oneBecauseFEqualsX": {
      return buildOneBecauseFEqualsXItems(options);
    }
    case "zeroBecauseFNotDependsOnX": {
      return buildZeroBecauseFNotDependsOnXItems(options);
    }
    case "zeroBecauseXIsConstant": {
      return buildZeroBecauseXIsConstantItems(options);
    }
  }
};

const buildOneBecauseFEqualsXItems = (
  options: ExplainDerivativeBuildOptions,
): ExplainDerivativeItem[] => {
  const nodeName = getNodeName(options.nodeId, options.nodeIdToNames);
  return [
    buildCalculateDerivativeItem(options),
    {
      type: "oneBecauseFEqualsX",
      descriptionParts: [
        {
          type: "text",
          id: "which",
          text: "Which is ",
        },
        {
          type: "latex",
          id: "value",
          latex: "1",
        },
        {
          type: "text",
          id: "because",
          text: " because the derivative target is ",
        },
        {
          type: "latex",
          id: "node",
          latex: nodeName,
        },
        {
          type: "text",
          id: "colon",
          text: ":",
        },
      ],
      latex: "\\displaystyle 1",
    },
  ];
};

const buildZeroBecauseFNotDependsOnXItems = (
  options: ExplainDerivativeBuildOptions,
): ExplainDerivativeItem[] => {
  const nodeName = getNodeName(options.nodeId, options.nodeIdToNames);
  return [
    buildCalculateDerivativeItem(options),
    {
      type: "zeroBecauseFNotDependsOnX",
      descriptionParts: [
        {
          type: "text",
          id: "which",
          text: "Which is ",
        },
        {
          type: "latex",
          id: "value",
          latex: "0",
        },
        {
          type: "text",
          id: "because",
          text: " because the derivative target doesn't depend on ",
        },
        {
          type: "latex",
          id: "node",
          latex: nodeName,
        },
        {
          type: "text",
          id: "colon",
          text: ":",
        },
      ],
      latex: "\\displaystyle 0",
    },
  ];
};

const buildZeroBecauseXIsConstantItems = (
  options: ExplainDerivativeBuildOptions,
): ExplainDerivativeItem[] => {
  const nodeName = getNodeName(options.nodeId, options.nodeIdToNames);
  return [
    buildCalculateDerivativeItem(options),
    {
      type: "zeroBecauseXIsConstant",
      descriptionParts: [
        {
          type: "text",
          id: "which",
          text: "Which is ",
        },
        {
          type: "latex",
          id: "value",
          latex: "0",
        },
        {
          type: "text",
          id: "because",
          text: " because ",
        },
        {
          type: "latex",
          id: "node",
          latex: nodeName,
        },
        {
          type: "text",
          id: "is",
          text: " is a constant:",
        },
      ],
      latex: "\\displaystyle 0",
    },
  ];
};

const buildChainRuleItems = (
  options: ExplainDerivativeBuildOptions,
): ExplainDerivativeItem[] => {
  return [
    buildCalculateDerivativeItem(options),
    {
      type: "useChainRule",
      descriptionParts: [
        {
          type: "text",
          id: "mainText",
          text: "Use the chain rule:",
        },
      ],
      latex: buildChainRuleLatex("raw", options),
    },
    {
      type: "previousDerivativesReplaced",
      descriptionParts: buildPreviousDerivativesReplacedDescription(options),
      latex: buildChainRuleLatex("previousDerivativesReplaced", options),
    },
    {
      type: "allReplaced",
      descriptionParts: buildAllReplacedDescription(
        options.differentiationMode,
      ),
      latex: buildChainRuleLatex("allReplaced", options),
    },
    {
      type: "equalTo",
      descriptionParts: [
        {
          type: "text",
          id: "mainText",
          text: "Which is equal to:",
        },
      ],
      latex: `\\displaystyle ${options.nodeDerivative}`,
    },
  ];
};

const buildCalculateDerivativeItem = (
  options: ExplainDerivativeBuildOptions,
): ExplainDerivativeItem => {
  return {
    type: "calculatePartialDerivative",
    descriptionParts: [
      {
        type: "text",
        id: "mainText",
        text: "Calculate the partial derivative:",
      },
    ],
    latex: buildPartialDerivativeSubject(options),
  };
};

const buildPartialDerivativeSubject = (
  options: ExplainDerivativeBuildOptions,
): string => {
  const nodeName = getNodeName(options.nodeId, options.nodeIdToNames);
  const targetNodeName = getNodeName(
    options.targetNodeId,
    options.nodeIdToNames,
  );
  const derivative =
    options.differentiationMode === "REVERSE"
      ? buildPartialDerivativeLatex(targetNodeName, nodeName)
      : buildPartialDerivativeLatex(nodeName, targetNodeName);
  return `\\displaystyle ${derivative}`;
};

const buildPreviousDerivativesReplacedDescription = (
  options: ExplainDerivativeBuildOptions,
): MathLabelPartType[] => {
  const side = options.differentiationMode === "REVERSE" ? "right" : "left";
  const targetNodeName = getNodeName(
    options.targetNodeId,
    options.nodeIdToNames,
  );
  const previousDerivativeTerms: MathLabelPartType[] =
    options.chainRuleTerms.map((chainRuleTerm) => {
      const neighborNodeName = getNodeName(
        chainRuleTerm.neighborNodeId,
        options.nodeIdToNames,
      );
      let derivative: string;
      if (options.differentiationMode === "REVERSE") {
        derivative = buildPartialDerivativeLatex(
          targetNodeName,
          neighborNodeName,
        );
      } else {
        derivative = buildPartialDerivativeLatex(
          neighborNodeName,
          targetNodeName,
        );
      }
      return {
        type: "latexLink",
        id: `chainRuleTerm-${chainRuleTerm.neighborNodeId}`,
        latex: derivative,
        href: chainRuleTerm.neighborNodeId,
      };
    });

  const commaListParts: MathLabelPartType[] = [];
  previousDerivativeTerms.forEach((previousDerivativeTerm, index) => {
    if (index > 0) {
      commaListParts.push({
        type: "text",
        id: `and-${index}`,
        text: index === previousDerivativeTerms.length - 1 ? " and " : ", ",
      });
    }
    commaListParts.push(previousDerivativeTerm);
  });

  return [
    {
      type: "text",
      id: "replace",
      text: `Replace the ${side}-hand side `,
    },
    ...commaListParts,
    {
      type: "text",
      id: "with",
      text: " with the previously calculated value(s):",
    },
  ];
};

const buildAllReplacedDescription = (
  differentiationMode: DifferentiationMode,
): MathLabelPartType[] => {
  const side = differentiationMode === "REVERSE" ? "left" : "right";
  return [
    {
      type: "text",
      id: "mainText",
      text: `Calculate the ${side}-hand side derivative(s):`,
    },
  ];
};

const buildChainRuleLatex = (
  chainRuleType: ChainRuleType,
  options: ExplainDerivativeBuildOptions,
): string => {
  const multiplicationTerms = buildChainRuleMultiplicationTerms(
    chainRuleType,
    options,
  );
  const expression = multiplicationTerms.join("+");
  return `\\displaystyle =${expression}`;
};

const buildChainRuleMultiplicationTerms = (
  chainRuleType: ChainRuleType,
  options: ExplainDerivativeBuildOptions,
): string[] => {
  const nodeName = getNodeName(options.nodeId, options.nodeIdToNames);
  const targetNodeName = getNodeName(
    options.targetNodeId,
    options.nodeIdToNames,
  );
  return options.chainRuleTerms.map((chainRuleTerm) => {
    const neighborNodeName = getNodeName(
      chainRuleTerm.neighborNodeId,
      options.nodeIdToNames,
    );
    let derivative1: string;
    let derivative2: string;
    if (options.differentiationMode === "REVERSE") {
      derivative1 =
        chainRuleType === "allReplaced"
          ? chainRuleTerm.derivativeRegardingCurrent
          : buildPartialDerivativeLatex(neighborNodeName, nodeName);
      derivative2 =
        chainRuleType === "raw"
          ? buildPartialDerivativeLatex(targetNodeName, neighborNodeName)
          : chainRuleTerm.derivativeRegardingTarget;
    } else {
      derivative1 =
        chainRuleType === "raw"
          ? buildPartialDerivativeLatex(neighborNodeName, targetNodeName)
          : chainRuleTerm.derivativeRegardingTarget;
      derivative2 =
        chainRuleType === "allReplaced"
          ? chainRuleTerm.derivativeRegardingCurrent
          : buildPartialDerivativeLatex(nodeName, neighborNodeName);
    }
    return `${derivative1} \\cdot ${derivative2}`;
  });
};

const buildPartialDerivativeLatex = (
  numerator: string,
  denominator: string,
): string => {
  return `\\frac{\\partial{${numerator}}}{\\partial{${denominator}}}`;
};

const getNodeName = (
  nodeId: string,
  nodeIdToNames: ReadonlyMap<string, string>,
): string => {
  const name = nodeIdToNames.get(nodeId);
  if (name === undefined) {
    throw new Error(`The nodeIdToNames mapping should have node ID ${nodeId}`);
  }
  return name;
};

export { buildExplainDerivativeItems };
