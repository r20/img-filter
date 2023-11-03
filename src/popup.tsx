import React from "react";
import { createRoot } from "react-dom/client";

import "mdb-react-ui-kit/dist/css/mdb.min.css";
import "@fortawesome/fontawesome-free/css/all.min.css";

import Settings from "./components/Settings";

const root = createRoot(document.getElementById("root")!);

root.render(
  <React.StrictMode>
    <Settings />
  </React.StrictMode>
);

/* if I want to see when popup closes I could try this in this file:
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
