// Mapping des codes de touches JavaScript vers les codes MechVibes
export const keyCodeToMechVibesMap: Record<string, string> = {
  // Chiffres
  'Digit1': '2',
  'Digit2': '3', 
  'Digit3': '4',
  'Digit4': '5',
  'Digit5': '6',
  'Digit6': '7',
  'Digit7': '8',
  'Digit8': '9',
  'Digit9': '10',
  'Digit0': '11',
  'Minus': '12',
  'Equal': '13',
  'Backspace': '14',
  
  // Première ligne de lettres
  'Tab': '15',
  'KeyQ': '16',
  'KeyW': '17',
  'KeyE': '18',
  'KeyR': '19',
  'KeyT': '20',
  'KeyY': '21',
  'KeyU': '22',
  'KeyI': '23',
  'KeyO': '24',
  'KeyP': '25',
  'BracketLeft': '26',
  'BracketRight': '27',
  'Enter': '28',
  
  // Deuxième ligne de lettres
  'CapsLock': '58',
  'KeyA': '30',
  'KeyS': '31',
  'KeyD': '32',
  'KeyF': '33',
  'KeyG': '34',
  'KeyH': '35',
  'KeyJ': '36',
  'KeyK': '37',
  'KeyL': '38',
  'Semicolon': '39',
  'Quote': '40',
  
  // Troisième ligne de lettres
  'ShiftLeft': '42',
  'KeyZ': '44',
  'KeyX': '45',
  'KeyC': '46',
  'KeyV': '47',
  'KeyB': '48',
  'KeyN': '49',
  'KeyM': '50',
  'Comma': '51',
  'Period': '52',
  'Slash': '53',
  'ShiftRight': '54',
  
  // Barre d'espace et modificateurs
  'ControlLeft': '29',
  'AltLeft': '56',
  'Space': '57',
  'AltRight': '3640',
  'ControlRight': '3613',
  
  // Touches de fonction
  'Escape': '1',
  'F1': '59',
  'F2': '60',
  'F3': '61',
  'F4': '62',
  'F5': '63',
  'F6': '64',
  'F7': '65',
  'F8': '66',
  'F9': '67',
  'F10': '68',
  'F11': '87',
  'F12': '88',
  
  // Flèches
  'ArrowUp': '3639',
  'ArrowDown': '3665',
  'ArrowLeft': '3663',
  'ArrowRight': '3677',
  
  // Autres touches
  'Insert': '3666',
  'Delete': '3675',
  'Home': '3655',
  'End': '3657',
  'PageUp': '3653',
  'PageDown': '3667'
}

export const getMechVibesKeyCode = (jsKeyCode: string): string | undefined => {
  return keyCodeToMechVibesMap[jsKeyCode]
}