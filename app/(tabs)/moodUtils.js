export const moodToValue = (mood) => {
  switch (mood) {
    case 'happy':
      return 5;
    case 'calm':
      return 4;
    case 'tired': // Assuming tired is a neutral/slightly negative state for charting
      return 3;
    case 'sad':
      return 2;
    case 'angry':
      return 1;
    default:
      return 3; // Default to neutral if mood is unknown
  }
};