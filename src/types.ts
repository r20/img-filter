export enum FilterLevel {
  None = 0,
  Low = 1,
  Medium = 2,
  High = 3,
}

export enum MatchType {
  Contains = 0,
  StartsWith = 1,
}

export interface ISiteOverride {
  idx: number;
  matchType: MatchType;
  matchString: string;
  imgLevel: FilterLevel;
  iframeLevel: FilterLevel;
}
