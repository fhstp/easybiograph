const colorModes = {
    'green-mode': { primary: '#488193', secondary: '#d2dee2', text: 'white', secondaryText: 'black', moment: "#c1121f", button: "#333", buttonText: "white" },
    'yellow-mode': { primary: '#deac18', secondary: '#F2DC99', text: 'black', secondaryText: 'black', moment: "#1252e6", button: "#333", buttonText: "white" },
    'black-mode': { primary: '#333333', secondary: '#666666', text: 'white', secondaryText: 'white', moment: "black",button: "#e3e3e3", buttonText: "black" }
  };

//hell: F2BC1B, mittel: c99c16, dunkel: deac18
//rot: c1121f, blau: 1240AB, neues blau: 1252e6
//altes grün für Zeitpunkt: a1d592

export function changeColorMode(newMode: string) {
  const colors = colorModes[newMode as 'green-mode' | 'yellow-mode' | 'black-mode'];
  document.documentElement.style.setProperty('--main-color', colors.primary);
  document.documentElement.style.setProperty('--secondary-color', colors.secondary);
  document.documentElement.style.setProperty('--text-color', colors.text);
  document.documentElement.style.setProperty('--secondary-text-color', colors.secondaryText);
  document.documentElement.style.setProperty('--moment-color', colors.moment);
  document.documentElement.style.setProperty('--button-color', colors.button);
  document.documentElement.style.setProperty('--button-text-color', colors.buttonText);
}  