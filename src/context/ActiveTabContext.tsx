import React, { useContext } from "react";

import { ICustomRule } from "../types";
import useActiveTab from "../hooks/useActiveTab";
import { getMatchingRules } from "../utilities";
import { useCustomRulesContext } from "./CustomRulesContext";

interface IActiveTabContext {
  /** Has the chrome.tabs.Tab object of the current active tab. */
  activeTab: chrome.tabs.Tab | null;
  /**  hostname if eligible for filtering (else empty string) */
  activeEligibleHostname: string;
  /**  url if eligible for filtering (else empty string) */
  activeEligibleUrl: string;
  /** all rules that match the current tab */
  activeTabMatchingRules: ICustomRule[];
  /** The rule in effect (the last item in activeTabMatchingRules) */
  activeTabCustomRule: ICustomRule | null;
}

const ActiveTabContext = React.createContext<IActiveTabContext>({
  activeTab: null,
  activeEligibleHostname: "",
  activeEligibleUrl: "",
  activeTabMatchingRules: [],
  activeTabCustomRule: null,
});

interface IProps {
  children?: React.ReactNode;
}
const ActiveTabContextProvider = (props: IProps) => {
  const { activeTab, activeEligibleHostname, activeEligibleUrl } = useActiveTab();

  const { customRulesArray } = useCustomRulesContext();
  const activeTabMatchingRules = getMatchingRules(activeEligibleUrl, customRulesArray);

  const activeTabCustomRule = activeTabMatchingRules.length
    ? activeTabMatchingRules[activeTabMatchingRules.length - 1]
    : null;

  const val = {
    activeTab,
    activeEligibleHostname,
    activeEligibleUrl,
    activeTabMatchingRules,
    activeTabCustomRule,
  };
  return <ActiveTabContext.Provider value={val} {...props} />;
};

const useActiveTabContext = () => {
  const context = useContext(ActiveTabContext);
  if (!context) {
    throw new Error(`useActiveTabContext must be used within a ActiveTabContextProvider`);
  }
  return context;
};

export { ActiveTabContextProvider, useActiveTabContext };
