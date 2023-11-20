import React, { useContext } from "react";

import { ICustomRule } from "../types";
import useActiveTab from "../hooks/useActiveTab";
import { getMatchingRules } from "../utilities";
import { useCustomRulesContext } from "./CustomRulesContext";

/** activeTab has the chomre.tabs.Tab object of the current active tab.
 * activeEligibleHostname and activeEligibleUrl strings are the hostname and url if eligible for filtering (else they are empty string).
 * activeTabMatchingRules are all rules that match the current tab.
 * activeTabCustomRule is the rule in effect (the last item in activeTabMatchingRules) */
interface IActiveTabContext {
  activeTab: chrome.tabs.Tab | null;
  activeEligibleHostname: string;
  activeEligibleUrl: string;
  activeTabMatchingRules: ICustomRule[];
  activeTabCustomRule: ICustomRule | null; // The actual matching rule that's in effect
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
  const { activeTab, activeEligibleHostname, activeEligibleUrl } =
    useActiveTab();

  const { customRulesArray } = useCustomRulesContext();
  const activeTabMatchingRules = getMatchingRules(
    activeEligibleUrl,
    customRulesArray
  );

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
    throw new Error(
      `useActiveTabContext must be used within a ActiveTabContextProvider`
    );
  }
  return context;
};

export { ActiveTabContextProvider, useActiveTabContext };
