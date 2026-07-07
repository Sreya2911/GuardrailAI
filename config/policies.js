export const POLICIES = {
    blockedDirectories: [
      "/system",
      "/root",
      "/etc",
      "C:\\Windows",
      "C:\\Program Files"
    ],
  
    piiPatterns: [
      {
        name: "Email Address",
        regex: /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b/g
      },
  
      {
        name: "Phone Number",
        regex: /\b\d{10}\b/g
      },
  
      {
        name: "Aadhaar Number",
        regex: /\b\d{4}\s?\d{4}\s?\d{4}\b/g
      },
  
      {
        name: "Credit Card",
        regex: /\b(?:\d[ -]*?){13,16}\b/g
      }
    ],
  
    secretPatterns: [
      {
        name: "Google API Key",
        regex: /AIza[0-9A-Za-z\-_]{35}/g
      },
  
      {
        name: "AWS Access Key",
        regex: /AKIA[0-9A-Z]{16}/g
      },
  
      {
        name: "GitHub Token",
        regex: /ghp_[A-Za-z0-9]{36}/g
      },
  
      {
        name: "OpenAI API Key",
        regex: /sk-[A-Za-z0-9]{40,}/g
      }
    ],
  
    maxRiskScore: 100,
  
    blockThreshold: 70
  };