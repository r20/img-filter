import React, { useEffect, useState, useCallback } from "react";

const useActiveTab = () => {
  const [activeTab, setActiveTab] = useState<chrome.tabs.Tab | null>(null);

  // For simplicity use the same function for both listeners that doesn't take any arguments. The listener signature has args and it'll be passed args but ignore them.
  const queryActiveTab = useCallback(() => {
    (async () => {
      const [tab] = await chrome.tabs.query({ active: true, lastFocusedWindow: true });
      setActiveTab(tab);
    })();
  }, []);

  useEffect(() => {
    // Get initial active tab
    queryActiveTab();

    // If active tab changes, update
    chrome.tabs.onActivated.addListener(queryActiveTab);
    chrome.tabs.onUpdated.addListener(queryActiveTab);
    // cleanup
    return () => {
      chrome.tabs.onActivated.removeListener(queryActiveTab);
      chrome.tabs.onUpdated.removeListener(queryActiveTab);
    };
  }, []);

  return { activeTab };
};

export default useActiveTab;
