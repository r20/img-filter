import { ICustomRule, MatchType, FilterLevel } from "./types";

/** Returns true if URL starts with http and is also not among sites not allowed (like chrome.google.com)*/
export const checkUrlEligibility = (url: string | null | undefined) => {
  return url && url.startsWith("http") && url.indexOf("https://chrome.google.com") === -1;
};

/** Given a url and the custom rules, finds which rules match. */
export const getMatchingRules = (currentUrl: string, customRulesArray: ICustomRule[]): ICustomRule[] => {
  let matchingCustomRules = [];
  if (currentUrl) {
    for (let idx = 0; idx < customRulesArray.length; idx++) {
      const { matchString, matchType } = customRulesArray[idx];
      if (matchString) {
        if (matchType === MatchType.StartsWith) {
          const withoutProtocol = currentUrl.replace("https://", "").replace("http://", "");

          if (withoutProtocol.startsWith(matchString)) {
            matchingCustomRules.push(customRulesArray[idx]);
          }
        } else {
          // This is MatchType.Contains
          if (currentUrl.indexOf(matchString) >= 0) {
            matchingCustomRules.push(customRulesArray[idx]);
          }
        }
      }
    }
  }
  return matchingCustomRules;
};

/** This is for debug to make lots of rules */
const generateMockRules = () => {
  const manyRules = [];
  for (let idx = 0; idx < 50; idx++) {
    const rule: ICustomRule = {
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
