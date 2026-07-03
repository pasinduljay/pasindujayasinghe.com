// Fixed "T E R I M" Banner
export const ASCII_BANNERS = [
  `
    ████████╗    ███████╗    ██████╗     ██╗    ███╗   ███╗
    ╚══██╔══╝    ██╔════╝    ██╔══██╗    ██║    ████╗ ████║
       ██║       █████╗      ██████╔╝    ██║    ██╔████╔██║
       ██║       ██╔══╝      ██╔══██╗    ██║    ██║╚██╔╝██║
       ██║       ███████╗    ██║  ██║    ██║    ██║ ╚═╝ ██║
       ╚═╝       ╚══════╝    ╚═╝  ╚═╝    ╚═╝    ╚═╝     ╚═╝
    `
];

// Deprecated but kept for compatibility
export const BIG_BANNERS = [];

export const SYSTEM_INFO = [
  "RAM: 64GB DDR5 / SWAP: 0GB",
  "CPU: Neural Core x128",
  "KERNEL: Linux 6.8.0-kali3-amd64",
  "CONNECTION: ENCRYPTED (SSL/TLS)",
  "USER: guest@portfolio-shell"
];


// Always return the fixed banner
export const getRandomBanner = () => {
  return ASCII_BANNERS[0];
};

export const getRandomSystemInfo = () => {
  return SYSTEM_INFO[Math.floor(Math.random() * SYSTEM_INFO.length)];
};
