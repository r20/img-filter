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

import { MDBInput } from "mdb-react-ui-kit";

export const defaultGrayscale = 90;
export const defaultContrast = 15;

const FilterSettings = () => {
  const [grayscale, setGrayscale] = useState<number>(defaultGrayscale);
  const [contrast, setContrast] = useState<number>(defaultContrast);

  useEffect(() => {
    // Restores preferences stored in chrome.storage.
    chrome.storage.sync.get(
      {
        grayscale: defaultGrayscale,
        contrast: defaultContrast,
      },
      (items) => {
        setGrayscale(items.grayscale);
        setContrast(items.contrast);
      }
    );
  }, []);

  const saveGrayscale = (newGrayscale: number | null) => {
    if (newGrayscale || newGrayscale === 0) {
      chrome.storage.sync.set({ grayscale: newGrayscale });
      setGrayscale(newGrayscale);
    }
  };
  const saveContrast = (newContrast: number | null) => {
    if (newContrast || newContrast === 0) {
      chrome.storage.sync.set({ contrast: newContrast });
      setContrast(newContrast);
    }
  };

  return (
    <>
      <MDBInput
        value={grayscale}
        onChange={(e) => saveGrayscale(Number(e.target.value))}
        label="Grayscale (0-100)"
        id="grayscale"
        type="number"
        min={0}
        max={100}
      />
      <br />
      <MDBInput
        value={contrast}
        onChange={(e) => saveContrast(Number(e.target.value))}
        label="Contrast (0-100)"
        id="contrast"
        type="number"
        min={0}
        max={100}
      />
    </>
  );
};

export default FilterSettings;
