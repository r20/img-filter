import { IExceptionRule, MatchType } from "./types";

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
          console.log("jmr match info", withoutProtocol, matchString);
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
