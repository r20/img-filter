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

export interface IExceptionRule {
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
  lastExceptionImgLevelUsed?: FilterLevel;
  lastExceptionIframeLevelUsed?: FilterLevel;
}
export interface IStoredDataRules  {
  /* If there's too much data within one key, we get this error: BYTES_PER_ITEM quota exceeded
    so split it up into chunks */
  exceptionRulesArray0to49?: IExceptionRule[];
  exceptionRulesArray50to99?: IExceptionRule[];
  exceptionRulesArray100to149?: IExceptionRule[];
}

