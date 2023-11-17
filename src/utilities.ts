import { IExceptionRule, MatchType, FilterLevel } from "./types";

/** Returns true if URL starts with http */
export const checkUrlEligibility = (url: string | null | undefined) => {
  return url && url.startsWith("http");
};

export const getMatchingRules = (
  currentUrl: string,
  exceptionRulesArray: IExceptionRule[]
): IExceptionRule[] => {
  let matchingExceptionRules = [];
  if (currentUrl) {
    for (let idx = 0; idx < exceptionRulesArray.length; idx++) {
      const { matchString, matchType } = exceptionRulesArray[idx];
      if (matchString) {
        if (matchType === MatchType.StartsWith) {
          const withoutProtocol = currentUrl
            .replace("https://", "")
            .replace("http://", "");

          if (withoutProtocol.startsWith(matchString)) {
            matchingExceptionRules.push(exceptionRulesArray[idx]);
          }
        } else {
          // This is MatchType.Contains
          if (currentUrl.indexOf(matchString) >= 0) {
            matchingExceptionRules.push(exceptionRulesArray[idx]);
          }
        }
      }
    }
  }
  return matchingExceptionRules;
};

const generateMockRules = () => {
  const manyRules = [];
  for (let idx = 0; idx < 50; idx++) {
    const rule: IExceptionRule = {
      imgLevel: FilterLevel.None,
      iframeLevel: FilterLevel.None,
      idx,
      matchString: "example-website-" + idx,
      matchType: MatchType.StartsWith,
    };
    manyRules.push(rule);
  }
  return manyRules;
};
