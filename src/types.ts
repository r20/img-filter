export enum FilterLevel {
  None = 0,
  Low = 1,
  Medium = 2,
  High = 3,
}

export enum MatchType {
  Contains = "Contains",
  StartsWith = "Starts with",
}

export interface ICustomRule {
  idx: number;
  matchType: MatchType;
  matchString: string;
  imgLevel: FilterLevel;
  iframeLevel: FilterLevel;
}

export interface IStoredDataOther {
  isEnabled?: boolean;
  generalImgLevel?: FilterLevel;
  generalIframeLevel?: FilterLevel;
  lastCustomImgLevelUsed?: FilterLevel;
  lastCustomIframeLevelUsed?: FilterLevel;
}
export interface IStoredDataRules {
  /* If there's too much data within one key, we get this error: BYTES_PER_ITEM quota exceeded
    so split it up into chunks */
  customRulesArray0to49?: ICustomRule[];
  customRulesArray50to99?: ICustomRule[];
  customRulesArray100to149?: ICustomRule[];
}
