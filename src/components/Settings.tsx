// Saves options to chrome.storage
// const saveOptions = () => {
//   const color = (document.getElementById("color") as HTMLSelectElement).value;
//   const likesColor = (document?.getElementById("like") as HTMLInputElement).checked;

//   chrome.storage.sync.set({ favoriteColor: color, likesColor: likesColor }, () => {
//     // Update status to let user know options were saved.
//     const status = document.getElementById("status") as HTMLDivElement;
//     status.textContent = "Options saved.";
//     setTimeout(() => {
//       status.textContent = "";
//     }, 750);
//   });
// };

// // Restores select box and checkbox state using the preferences
// // stored in chrome.storage.
// const restoreOptions = () => {
//   chrome.storage.sync.get({ favoriteColor: "red", likesColor: true }, (items) => {
//     (document.getElementById("color") as HTMLSelectElement).value = items.favoriteColor;
//     (document.getElementById("like") as HTMLInputElement).checked = items.likesColor;
//   });
// };

// document.addEventListener("DOMContentLoaded", restoreOptions);
// (document.getElementById("save") as HTMLButtonElement).addEventListener("click", saveOptions);

import React, { useEffect, useState } from "react";
import { MDBSwitch } from "mdb-react-ui-kit";
import FilterSettings from "./FilterSettings";

interface ISiteNotFiltered {
  host: string;
  img: boolean;
  iframe: boolean;
}
const Settings = () => {
  const [isEnabled, setIsEnabled] = useState<boolean>(true);

  const [sitesNotFiltered, setSitesNotFiltered] = useState<ISiteNotFiltered[]>([]);

  useEffect(() => {
    // Restores preferences stored in chrome.storage.
    chrome.storage.sync.get(
      {
        isEnabled: true,

        sitesNotFiltered: [],
      },
      (items) => {
        setIsEnabled(items.isEnabled);

        setSitesNotFiltered(items.sitesNotFiltered);
      }
    );
  }, []);

  const saveIsEnabled = (newIsEnabled: boolean) => {
    chrome.storage.sync.set({ isEnabled: newIsEnabled });
    setIsEnabled(newIsEnabled);
  };

  const addSiteNotFiltered = (newSite: ISiteNotFiltered) => {
    const withoutHost = sitesNotFiltered.filter((item: ISiteNotFiltered) => {
      item.host !== newSite.host;
    });
    const newSitesNotFiltered = [...withoutHost, newSite];
    chrome.storage.sync.set({ sitesNotFiltered: newSitesNotFiltered });
    setSitesNotFiltered(newSitesNotFiltered);
  };

  const removeSiteNotFiltered = (siteToRemove: ISiteNotFiltered) => {
    const withoutHost = sitesNotFiltered.filter((item: ISiteNotFiltered) => {
      item.host !== siteToRemove.host;
    });
    chrome.storage.sync.set({ sitesNotFiltered: withoutHost });
    setSitesNotFiltered(withoutHost);
  };

  return (
    <div style={{ width: "400px", padding: "20px" }}>
      <MDBSwitch
        id="isEnabled"
        label="Enable"
        checked={isEnabled}
        onChange={(evt) => saveIsEnabled(evt.target.checked)}
      />
      <br />
      <FilterSettings />
    </div>
  );
};

export default Settings;
