export const ValidationTextEn = {
  usernameOrEmail: {
    REQUIRED: "Username or email is required.",
    INVALID_FORMAT: "Enter a valid username (2–32 characters) or email address."
  },
  
  username: {
    REQUIRED: "Username is required.",
    TOO_SHORT: "Username must be at least 2 characters.",
    TOO_LONG: "Username cannot exceed 32 characters.",
    MUST_START_WITH_LETTER: "Username must start with a letter.",
    INVALID_CHARACTERS:
      "Only letters, numbers, dot, dash, and underscore are allowed.",
    CONSECUTIVE_SPECIALS:
      "Special characters cannot be used consecutively.",
    TRAILING_SPECIAL:
      "Username cannot end with a dot, dash, or underscore."
  },
  
  nickname: {
    REQUIRED: "Nickname is required.",
    TOO_SHORT: "Nickname must be at least 2 characters.",
    INVALID_CHARACTERS:
      "Only letters, numbers, spaces, dot, dash, underscore, and # are allowed."
  },
  
  email: {
    REQUIRED: "Email is required.",
    INVALID_FORMAT: "Enter a valid email address (e.g., name@provider.com)."
  },
  
  password: {
    login: {
      REQUIRED: "Password is required.",
      INVALID: "Invalid password." // optional catch-all
    },
    register: {
      REQUIRED: "Password is required.",
      TOO_SHORT: "Password must be at least 8 characters.",
      TOO_WEAK:
        "Password must contain a number, an uppercase letter, and a symbol."
    }
  }
};