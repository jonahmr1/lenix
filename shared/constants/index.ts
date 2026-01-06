export const styleConfig = {
  ui: {
    title: "Public Job Center",
    subtitle: "Find your next opportunity",
    maxWidth: "1200px",
    maxHeight: "80vh",
    coords: [-1083.17, -245.77, 37.76, 204.31] //don't ask me why this is here XD
  },
  theme: {
    primary: "80, 128, 118",
    secondary: "132, 96, 58",
    background: "24, 53, 47, 0.25",
    text: "#ffffff",
    gradient: 'linear-gradient(0deg,rgba(16, 91, 77, 0.52) 0%, rgba(24, 53, 47, 0.52) 52%, rgba(41, 41, 41, 0.93) 100%)',
    ui_title: 'Public Job Center',
    ui_subtitle: 'Find your next opportunity',
    placeholder_h3: 'Select a job to view details',
    placeholder_p: 'Choose a job from the list to see more information',
    stats: 'none'
  }
}

export const jobsConfig = {
  garbage: {
    name: "Garbage Collection",
    position: "Sanitation Worker",
    description: "Collect and dispose of waste materials throughout the city to keep the streets clean and maintain public health standards.",
    category: "Public Services",
    icon: "fas fa-trash",
    enabled: true,
    repGrades: {
      [0]: 1,
      [1]: 10,
      [2]: 20,
      [3]: 40,
      [4]: 60,
    },
    repMultiplier: 1.1,
    difficultyMultiplierThresHold: 25,
    repTypes: {
      ['highend']: 6,
      ['high']: 7,
      ['average']: 8,
      ['low']: 9,
      ['lowend']: 10,
    },
    maxXP: 100,
    location: { x: -322.24, y: -1546.02, z: 30.02 },
    image: {
      type: "img",
      content: "public/garbage.jpg"
    },
    stats: { payment: "", paymentLabel: "", availability: "", availabilityLabel: "" }
  },
  tow: {
    name: "Towing Service",
    position: "Tow Truck Driver",
    description: "Provide roadside assistance and vehicle towing services to help stranded motorists and clear traffic incidents.",
    category: "Emergency Services",
    icon: "fas fa-truck",
    enabled: true,
    repGrades: {
      [0]: 1,
      [1]: 25,
      [2]: 50,
    },
    repMultiplier: 1.1,
    difficultyMultiplierThresHold: 25,
    repTypes: {
      ['highend']: 6,
      ['high']: 7,
      ['average']: 8,
      ['low']: 9,
      ['lowend']: 10,
    },
    maxXP: 100,
    location: { x: 909.0, y: -177.4, z: 74.2 },
    image: {
      type: "img",
      content: "public/tow.jpeg"
    },
    stats: { payment: "", paymentLabel: "", availability: "", availabilityLabel: "" }
  },
}
