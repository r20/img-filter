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

export interface IStoredValues {
  isEnabled?: boolean;
  generalImgLevel?: FilterLevel;
  generalIframeLevel?: FilterLevel;
  exceptionRulesArray?: IExceptionRule[];
  lastExceptionImgLevelUsed?: FilterLevel;
  lastExceptionIframeLevelUsed?: FilterLevel;
}
