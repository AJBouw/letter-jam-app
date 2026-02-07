export const colorTokens = {
  /* === Brand === */
  brand: {
    accent: "#76e000",      // Granny Smith green
    strong: "#76e000",      // using same green for buttons
    hover: "#67b800",       // slightly darker on hover
    active: "#569f00"       // slightly darker when active
  },
  
  /* === Text === */
  text: {
    light: {
      primary: "#212529",
      secondary: "#6c757d"
    },
    dark: {
      primary: "#f8f9fa",
      secondary: "#ced4da"
    }
  },
  
  /* === Backgrounds === */
  background: {
    light: {
      page: "#f0f0f0",  // light grey page background for contrast with green
      card: "#ffffff"
    },
    dark: {
      page: "rgb(18,18,18)", // dark page background
      card: "#2b3035"
    }
  },
  
  /* === UI === */
  ui: {
    light: {
      border: "#dee2e6",
      disabled: "#adb5bd"
    },
    dark: {
      border: "#495057",
      disabled: "#495057"
    }
  },
  
  /* === Status === */
  status: {
    success: {
      light: {
        bg: "#d1e7dd",
        text: "#0f5132"
      },
      dark: {
        bg: "#76e000",    // brand green for dark mode success
        text: "#121212"   // dark text on bright green for contrast
      }
    },
    danger: {
      light: {
        bg: "#f8d7da",
        text: "#842029"
      },
      dark: {
        bg: "#842029",
        text: "#f8d7da"
      }
    }
  }
};