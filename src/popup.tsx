import React from "react";
import { createRoot } from "react-dom/client";

import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";

import PopupContents from "./components/PopupContents";

import { CustomRulesContextProvider } from "./context/CustomRulesContext";
import { ActiveTabContextProvider } from "./context/ActiveTabContext";

const root = createRoot(document.getElementById("root")!);

root.render(
  <React.StrictMode>
    <CustomRulesContextProvider>
      <ActiveTabContextProvider>
        <PopupContents />
      </ActiveTabContextProvider>
    </CustomRulesContextProvider>
  </React.StrictMode>
);

/* If I wanted to see when popup closes I could try this in this file:
chrome.runtime.connect({ name: "popup" });

and in background.js or elsewhere do this
chrome.runtime.onConnect.addListener(function(port) {
    if (port.name === "popup") {
        port.onDisconnect.addListener(function() {
           console.log("popup has been closed")
        });
    }
});

Or alternatively, I could try this to execute a function when the popup closes
document.addEventListener('visibilitychange', MyFunction, false);

*/
