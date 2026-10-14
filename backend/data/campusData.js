/**
 * Campus Navigator - Seed Data
 * Simulated campus layout with realistic walking network, junctions, buildings, and accessibility metrics.
 */

const locations = [
  {
    id: 'main-gate',
    name: 'Main Campus Gate',
    shortName: 'Main Gate',
    category: 'entry',
    code: 'MG-01',
    description: 'Primary campus entrance, visitor security kiosk, and bus transit stop.',
    coordinates: [28.5410, 77.1900],
    isJunction: false,
    accessible: true,
    openingHours: '24 Hours',
    features: ['Security Checkpoint', 'Bicycle Parking', 'Visitor Badge Counter', 'Bus Stop'],
    tags: ['entrance', 'bus', 'gate', 'transit']
  },
  {
    id: 'admin-block',
    name: 'Administration & Registrar Block',
    shortName: 'Admin Block',
    category: 'administrative',
    code: 'AD-01',
    description: 'Offices of the Dean, Registrar, Admissions, Fee Payment, and Student Affairs.',
    coordinates: [28.5430, 77.1910],
    isJunction: false,
    accessible: true,
    openingHours: '09:00 - 17:00 (Mon-Fri)',
    features: ['Ramp Access', 'Elevator', 'Fee Counter', 'Restrooms', 'Information Desk'],
    tags: ['admin', 'office', 'registrar', 'admissions', 'dean']
  },
  {
    id: 'library',
    name: 'Central Knowledge Library',
    shortName: 'Central Library',
    category: 'academic',
    code: 'LIB-01',
    description: 'Four-story library with silent study zones, book archive, digital repository, and cafes.',
    coordinates: [28.5455, 77.1905],
    isJunction: false,
    accessible: true,
    openingHours: '08:00 - 23:00 Daily',
    features: ['High-speed WiFi', 'Elevator', 'Wheelchair Ramp', 'Silent Pods', 'Cafeteria', 'Printing'],
    tags: ['study', 'books', 'quiet', 'digital', 'research']
  },
  {
    id: 'academic-block',
    name: 'Science & Academic Complex',
    shortName: 'Academic Block',
    category: 'academic',
    code: 'AB-01',
    description: 'Main lecture theaters (LT 1-8), faculty suites, physics and chemistry laboratories.',
    coordinates: [28.5445, 77.1935],
    isJunction: false,
    accessible: true,
    openingHours: '08:00 - 19:00 (Mon-Sat)',
    features: ['Lecture Theaters', 'Laboratories', 'Elevator', 'Braille Signage', 'Water Dispensers'],
    tags: ['classes', 'lectures', 'professors', 'labs']
  },
  {
    id: 'computer-lab',
    name: 'Turing Computer & AI Center',
    shortName: 'Computer Lab',
    category: 'academic',
    code: 'CS-01',
    description: 'Advanced computing labs, cloud servers, GPU clusters, and coding workstations.',
    coordinates: [28.5465, 77.1945],
    isJunction: false,
    accessible: true,
    openingHours: '08:00 - 22:00 Daily',
    features: ['24/7 Power Backup', 'Gigabit Ethernet', 'Ramp Access', 'Restrooms'],
    tags: ['coding', 'computers', 'hackathons', 'tech', 'software']
  },
  {
    id: 'canteen',
    name: 'Student Canteen & Food Court',
    shortName: 'Campus Canteen',
    category: 'amenity',
    code: 'FC-01',
    description: 'Multi-cuisine campus dining, snack counters, coffee bar, and outdoor terrace seating.',
    coordinates: [28.5440, 77.1960],
    isJunction: false,
    accessible: true,
    openingHours: '07:30 - 22:30 Daily',
    features: ['Indoor & Outdoor Seating', 'Vegetarian & Halal Options', 'UPI/Cards Accepted', 'Wheelchair Accessible'],
    tags: ['food', 'lunch', 'breakfast', 'coffee', 'snacks', 'dining']
  },
  {
    id: 'hostel-north',
    name: 'North Boys Residence Hall',
    shortName: 'North Hostel',
    category: 'residential',
    code: 'RH-01',
    description: 'Student hostel complex with common recreation room, laundry, and dining hall.',
    coordinates: [28.5485, 77.1915],
    isJunction: false,
    accessible: true,
    openingHours: 'Hostel Resident Access 24/7',
    features: ['Gymnasium', 'Study Lounge', 'Laundry Facility', 'Security'],
    tags: ['dorm', 'hostel', 'residence', 'boys']
  },
  {
    id: 'hostel-south',
    name: 'South Girls Residence Hall',
    shortName: 'South Hostel',
    category: 'residential',
    code: 'RH-02',
    description: 'Student residential suites with 24/7 gated security, garden courtyard, and study rooms.',
    coordinates: [28.5420, 77.1970],
    isJunction: false,
    accessible: true,
    openingHours: 'Hostel Resident Access 24/7',
    features: ['Courtyard Garden', 'Reading Rooms', 'Laundry', 'Security Gate'],
    tags: ['dorm', 'hostel', 'residence', 'girls']
  },
  {
    id: 'auditorium',
    name: 'Grand University Auditorium',
    shortName: 'Auditorium',
    category: 'amenity',
    code: 'AUD-01',
    description: '1200-seat performance theater for convocations, symposiums, guest lectures, and cultural fests.',
    coordinates: [28.5475, 77.1890],
    isJunction: false,
    accessible: true,
    openingHours: 'Event Dependent / 09:00 - 21:00',
    features: ['Acoustic Hall', 'Ramp Access', 'Green Rooms', 'Assistive Hearing System'],
    tags: ['events', 'theater', 'seminar', 'cultural', 'convocation']
  },
  {
    id: 'sports-complex',
    name: 'Olympic Sports Pavilion & Grounds',
    shortName: 'Sports Pavilion',
    category: 'sports',
    code: 'SP-01',
    description: 'Athletics track, football turf, tennis courts, badminton hall, and fitness center.',
    coordinates: [28.5425, 77.1870],
    isJunction: false,
    accessible: true,
    openingHours: '06:00 - 21:00 Daily',
    features: ['Running Track', 'Indoor Courts', 'Locker Rooms', 'Equipment Rental'],
    tags: ['gym', 'football', 'tennis', 'badminton', 'athletics', 'fitness']
  },
  {
    id: 'medical-centre',
    name: 'Campus Health & Wellness Clinic',
    shortName: 'Medical Centre',
    category: 'health',
    code: 'HC-01',
    description: '24/7 primary healthcare, emergency ambulance bay, pharmacy, and physician consultation.',
    coordinates: [28.5435, 77.1885],
    isJunction: false,
    accessible: true,
    openingHours: '24/7 Emergency Care',
    features: ['Emergency Bay', 'Pharmacy', 'Wheelchair Ramp', 'Ambulance Standby'],
    tags: ['doctor', 'clinic', 'first aid', 'emergency', 'medicine', 'hospital']
  },
  {
    id: 'innovation-hub',
    name: 'Center for Innovation & Robotics',
    shortName: 'Innovation Hub',
    category: 'academic',
    code: 'IH-01',
    description: 'Incubation ecosystem with 3D printing labs, maker spaces, and startup workstations.',
    coordinates: [28.5480, 77.1955],
    isJunction: false,
    accessible: true,
    openingHours: '08:30 - 21:30 (Mon-Sat)',
    features: ['3D Printers', 'Electronics Bench', 'Ramp Access', 'Conference Pods'],
    tags: ['robotics', 'startups', 'makerspace', 'incubation', 'prototyping']
  },
  // Junction Nodes for realistic walking path navigation
  {
    id: 'junction-gate',
    name: 'Main Avenue Crossing',
    shortName: 'Gate Junction',
    category: 'junction',
    code: 'JN-01',
    description: 'Intersection connecting Main Gate to Admin Block and Sports Pavilion.',
    coordinates: [28.5420, 77.1902],
    isJunction: true,
    accessible: true
  },
  {
    id: 'junction-central',
    name: 'Central Campus Plaza',
    shortName: 'Central Plaza',
    category: 'junction',
    code: 'JN-02',
    description: 'The vibrant heart of campus connecting Admin, Academic Block, and Library.',
    coordinates: [28.5440, 77.1918],
    isJunction: true,
    accessible: true
  },
  {
    id: 'junction-academic',
    name: 'Academic Quadrangle Crossing',
    shortName: 'Academic Crossing',
    category: 'junction',
    code: 'JN-03',
    description: 'Pathway intersection between Academic Complex, Computer Lab, and Canteen walkway.',
    coordinates: [28.5452, 77.1932],
    isJunction: true,
    accessible: true
  },
  {
    id: 'junction-tech',
    name: 'Tech Avenue Intersection',
    shortName: 'Tech Junction',
    category: 'junction',
    code: 'JN-04',
    description: 'Junction linking Computer Lab, Innovation Hub, and North Hostel.',
    coordinates: [28.5472, 77.1938],
    isJunction: true,
    accessible: true
  },
  {
    id: 'junction-library',
    name: 'Library Lawns Walkway',
    shortName: 'Library Crossing',
    category: 'junction',
    code: 'JN-05',
    description: 'Open green promenade connecting Library, Auditorium, and North Hostel.',
    coordinates: [28.5468, 77.1902],
    isJunction: true,
    accessible: true
  },
  {
    id: 'junction-canteen',
    name: 'Food Court Promenade',
    shortName: 'Canteen Junction',
    category: 'junction',
    code: 'JN-06',
    description: 'Intersection between Canteen, Academic Block, and South Hostel.',
    coordinates: [28.5432, 77.1952],
    isJunction: true,
    accessible: true
  },
  {
    id: 'junction-west',
    name: 'West Campus Promenade',
    shortName: 'West Crossing',
    category: 'junction',
    code: 'JN-07',
    description: 'Path linking Sports Complex, Health Clinic, and Admin Block.',
    coordinates: [28.5428, 77.1888],
    isJunction: true,
    accessible: true
  }
];

/**
 * Campus Walkway Network (Edges)
 * - distances in meters
 * - accessible: boolean (true = ramped/flat wheelchair friendly, false = stairs/steep obstacle)
 * - hasStairs: boolean
 * - pathCoordinates: intermediate path points for realistic Leaflet polyline drawing
 */
const paths = [
  // 1. Main Gate <-> Main Avenue Crossing
  {
    id: 'p-gate-jgate',
    from: 'main-gate',
    to: 'junction-gate',
    distance: 115,
    accessible: true,
    hasStairs: false,
    surface: 'paved',
    name: 'Main Palm Avenue',
    description: 'Wide paved pedestrian walkway flanked by palm trees from the main gate.',
    pathCoordinates: [
      [28.5410, 77.1900],
      [28.5415, 77.1901],
      [28.5420, 77.1902]
    ]
  },

  // 2. Main Avenue Crossing <-> Admin Block
  {
    id: 'p-jgate-admin',
    from: 'junction-gate',
    to: 'admin-block',
    distance: 130,
    accessible: true,
    hasStairs: false,
    surface: 'paved',
    name: 'Administration Boulevard',
    description: 'Broad paved walk with gentle gradient leading to the Admin foyer.',
    pathCoordinates: [
      [28.5420, 77.1902],
      [28.5425, 77.1906],
      [28.5430, 77.1910]
    ]
  },

  // 3. Main Avenue Crossing <-> West Crossing (Towards Sports & Medical)
  {
    id: 'p-jgate-jwest',
    from: 'junction-gate',
    to: 'junction-west',
    distance: 160,
    accessible: true,
    hasStairs: false,
    surface: 'paved',
    name: 'West Promenade Link',
    description: 'Smooth asphalt path connecting the main boulevard with the west athletics quad.',
    pathCoordinates: [
      [28.5420, 77.1902],
      [28.5424, 77.1895],
      [28.5428, 77.1888]
    ]
  },

  // 4. West Crossing <-> Sports Complex
  {
    id: 'p-jwest-sports',
    from: 'junction-west',
    to: 'sports-complex',
    distance: 180,
    accessible: true,
    hasStairs: false,
    surface: 'paved',
    name: 'Athletic Walkway',
    description: 'Paved tree-lined walk directly to the Sports Pavilion gates.',
    pathCoordinates: [
      [28.5428, 77.1888],
      [28.5426, 77.1879],
      [28.5425, 77.1870]
    ]
  },

  // 5. West Crossing <-> Medical Centre
  {
    id: 'p-jwest-medical',
    from: 'junction-west',
    to: 'medical-centre',
    distance: 85,
    accessible: true,
    hasStairs: false,
    surface: 'paved',
    name: 'Emergency Clinic Access',
    description: 'Zero-step wheelchair accessible pathway leading to the clinic emergency wing.',
    pathCoordinates: [
      [28.5428, 77.1888],
      [28.5432, 77.1886],
      [28.5435, 77.1885]
    ]
  },

  // 6. Admin Block <-> Central Plaza
  {
    id: 'p-admin-jcentral',
    from: 'admin-block',
    to: 'junction-central',
    distance: 140,
    accessible: true,
    hasStairs: false,
    surface: 'tile',
    name: 'President’s Walkway',
    description: 'Cobblestoned campus avenue between the Admin building and Central Plaza.',
    pathCoordinates: [
      [28.5430, 77.1910],
      [28.5435, 77.1914],
      [28.5440, 77.1918]
    ]
  },

  // 7. Central Plaza <-> Central Library (Short path via STAIRS)
  // Distance is 185m, but has steep steps (not wheelchair accessible)
  {
    id: 'p-jcentral-lib-stairs',
    from: 'junction-central',
    to: 'library',
    distance: 185,
    accessible: false,
    hasStairs: true,
    surface: 'stairs',
    name: 'Library Terrace Stone Steps',
    description: 'Direct scenic flight of 32 granite stairs leading up to Library entrance. Not wheelchair accessible.',
    pathCoordinates: [
      [28.5440, 77.1918],
      [28.5448, 77.1912],
      [28.5455, 77.1905]
    ]
  },

  // 8. Central Plaza <-> Central Library (ACCESSIBLE RAMP BYPASS)
  // Longer path (245m), but completely barrier-free with smooth gentle slope
  {
    id: 'p-jcentral-lib-ramp',
    from: 'junction-central',
    to: 'library',
    distance: 245,
    accessible: true,
    hasStairs: false,
    surface: 'ramped',
    name: 'West Library Accessible Ramp Walk',
    description: 'Wide barrier-free ramp path wrapping around the reflecting pool with handrails.',
    pathCoordinates: [
      [28.5440, 77.1918],
      [28.5442, 77.1908],
      [28.5449, 77.1902],
      [28.5455, 77.1905]
    ]
  },

  // 9. Central Plaza <-> Academic Block
  {
    id: 'p-jcentral-acad',
    from: 'junction-central',
    to: 'academic-block',
    distance: 175,
    accessible: true,
    hasStairs: false,
    surface: 'paved',
    name: 'Founders Walkway',
    description: 'Level shaded walkway with benches linking Central Plaza and Academic Complex.',
    pathCoordinates: [
      [28.5440, 77.1918],
      [28.5442, 77.1926],
      [28.5445, 77.1935]
    ]
  },

  // 10. Academic Block <-> Academic Quad Crossing
  {
    id: 'p-acad-jacad',
    from: 'academic-block',
    to: 'junction-academic',
    distance: 85,
    accessible: true,
    hasStairs: false,
    surface: 'paved',
    name: 'Science Quad Promenade',
    description: 'Smooth paved walk along the lecture theater gardens.',
    pathCoordinates: [
      [28.5445, 77.1935],
      [28.5449, 77.1933],
      [28.5452, 77.1932]
    ]
  },

  // 11. Academic Quad Crossing <-> Computer Lab
  {
    id: 'p-jacad-cs',
    from: 'junction-academic',
    to: 'computer-lab',
    distance: 195,
    accessible: true,
    hasStairs: false,
    surface: 'paved',
    name: 'Silicon Pathway',
    description: 'Direct accessible path from Academic crossing to the Turing Computer Center.',
    pathCoordinates: [
      [28.5452, 77.1932],
      [28.5458, 77.1938],
      [28.5465, 77.1945]
    ]
  },

  // 12. Academic Quad Crossing <-> Canteen Promenade
  {
    id: 'p-jacad-jcanteen',
    from: 'junction-academic',
    to: 'junction-canteen',
    distance: 260,
    accessible: true,
    hasStairs: false,
    surface: 'paved',
    name: 'South Campus Avenue',
    description: 'Paved avenue connecting the academic quad to student amenities.',
    pathCoordinates: [
      [28.5452, 77.1932],
      [28.5442, 77.1942],
      [28.5432, 77.1952]
    ]
  },

  // 13. Canteen Promenade <-> Student Canteen
  {
    id: 'p-jcanteen-canteen',
    from: 'junction-canteen',
    to: 'canteen',
    distance: 110,
    accessible: true,
    hasStairs: false,
    surface: 'paved',
    name: 'Food Court Plaza Walk',
    description: 'Accessible wide entryway leading to indoor and outdoor dining stalls.',
    pathCoordinates: [
      [28.5432, 77.1952],
      [28.5436, 77.1956],
      [28.5440, 77.1960]
    ]
  },

  // 14. Canteen Promenade <-> South Girls Hostel
  {
    id: 'p-jcanteen-hostelsouth',
    from: 'junction-canteen',
    to: 'hostel-south',
    distance: 210,
    accessible: true,
    hasStairs: false,
    surface: 'paved',
    name: 'South Residential Garden Walk',
    description: 'Well-lit pedestrian corridor to South Girls Residence security gate.',
    pathCoordinates: [
      [28.5432, 77.1952],
      [28.5426, 77.1961],
      [28.5420, 77.1970]
    ]
  },

  // 15. Computer Lab <-> Tech Junction
  {
    id: 'p-cs-jtech',
    from: 'computer-lab',
    to: 'junction-tech',
    distance: 110,
    accessible: true,
    hasStairs: false,
    surface: 'paved',
    name: 'Tech Walkway',
    description: 'Wide paved path northwards from the Turing Center.',
    pathCoordinates: [
      [28.5465, 77.1945],
      [28.5468, 77.1941],
      [28.5472, 77.1938]
    ]
  },

  // 16. Tech Junction <-> Innovation Hub
  {
    id: 'p-jtech-innovation',
    from: 'junction-tech',
    to: 'innovation-hub',
    distance: 190,
    accessible: true,
    hasStairs: false,
    surface: 'paved',
    name: 'Robotics Boulevard',
    description: 'Barrier-free ramped access into the Maker Space and Innovation Center.',
    pathCoordinates: [
      [28.5472, 77.1938],
      [28.5476, 77.1946],
      [28.5480, 77.1955]
    ]
  },

  // 17. Tech Junction <-> North Boys Hostel
  {
    id: 'p-jtech-hostelnorth',
    from: 'junction-tech',
    to: 'hostel-north',
    distance: 245,
    accessible: true,
    hasStairs: false,
    surface: 'paved',
    name: 'North Quad Walk',
    description: 'Paved avenue connecting tech blocks to North Residence hall.',
    pathCoordinates: [
      [28.5472, 77.1938],
      [28.5478, 77.1926],
      [28.5485, 77.1915]
    ]
  },

  // 18. Library <-> Library Crossing
  {
    id: 'p-lib-jlib',
    from: 'library',
    to: 'junction-library',
    distance: 150,
    accessible: true,
    hasStairs: false,
    surface: 'tile',
    name: 'Library North Promenade',
    description: 'Level tiled path connecting north library exit to the lawn promenade.',
    pathCoordinates: [
      [28.5455, 77.1905],
      [28.5461, 77.1903],
      [28.5468, 77.1902]
    ]
  },

  // 19. Library Crossing <-> Grand Auditorium (Shortcut via STAIRS)
  // Distance 140m, but steep amphitheater stairs
  {
    id: 'p-jlib-aud-stairs',
    from: 'junction-library',
    to: 'auditorium',
    distance: 140,
    accessible: false,
    hasStairs: true,
    surface: 'stairs',
    name: 'Amphitheater Stone Steps',
    description: 'Steep flight of stone stairs ascending directly to the upper auditorium entrance. Not wheelchair accessible.',
    pathCoordinates: [
      [28.5468, 77.1902],
      [28.5471, 77.1896],
      [28.5475, 77.1890]
    ]
  },

  // 20. Library Crossing <-> Grand Auditorium (ACCESSIBLE RAMP ROUTE)
  // Distance 215m, gently sloping ramp
  {
    id: 'p-jlib-aud-ramp',
    from: 'junction-library',
    to: 'auditorium',
    distance: 215,
    accessible: true,
    hasStairs: false,
    surface: 'ramped',
    name: 'Auditorium North Accessible Ramp',
    description: 'Wide ADA/accessible grade continuous ramp with stainless steel handrails.',
    pathCoordinates: [
      [28.5468, 77.1902],
      [28.5475, 77.1901],
      [28.5478, 77.1894],
      [28.5475, 77.1890]
    ]
  },

  // 21. Library Crossing <-> North Boys Hostel
  {
    id: 'p-jlib-hostelnorth',
    from: 'junction-library',
    to: 'hostel-north',
    distance: 220,
    accessible: true,
    hasStairs: false,
    surface: 'paved',
    name: 'North Green Corridor',
    description: 'Serene tree-canopied paved walkway linking library lawns and north residence.',
    pathCoordinates: [
      [28.5468, 77.1902],
      [28.5476, 77.1908],
      [28.5485, 77.1915]
    ]
  },

  // 22. Auditorium <-> Medical Centre
  {
    id: 'p-aud-medical',
    from: 'auditorium',
    to: 'medical-centre',
    distance: 440,
    accessible: true,
    hasStairs: false,
    surface: 'paved',
    name: 'West Campus Outer Boulevard',
    description: 'Paved perimeter road with sidewalks between auditorium and campus medical clinic.',
    pathCoordinates: [
      [28.5475, 77.1890],
      [28.5455, 77.1887],
      [28.5435, 77.1885]
    ]
  },

  // 23. Central Plaza <-> Library Crossing (Cross-lawn direct diagonal)
  {
    id: 'p-jcentral-jlib',
    from: 'junction-central',
    to: 'junction-library',
    distance: 335,
    accessible: true,
    hasStairs: false,
    surface: 'paved',
    name: 'Central Mall Path',
    description: 'Wide central boulevard bisecting the campus park.',
    pathCoordinates: [
      [28.5440, 77.1918],
      [28.5454, 77.1910],
      [28.5468, 77.1902]
    ]
  },

  // 24. Academic Quad Crossing <-> Library Crossing
  {
    id: 'p-jacad-jlib',
    from: 'junction-academic',
    to: 'junction-library',
    distance: 350,
    accessible: true,
    hasStairs: false,
    surface: 'paved',
    name: 'Inter-College Promenade',
    description: 'Paved walkway cutting across from Science quad to Library lawns.',
    pathCoordinates: [
      [28.5452, 77.1932],
      [28.5460, 77.1917],
      [28.5468, 77.1902]
    ]
  },

  // 25. Canteen <-> Admin Block
  {
    id: 'p-canteen-admin',
    from: 'canteen',
    to: 'admin-block',
    distance: 510,
    accessible: true,
    hasStairs: false,
    surface: 'paved',
    name: 'South Admin Walkway',
    description: 'Direct southern walkway connecting dining hub to administrative building.',
    pathCoordinates: [
      [28.5440, 77.1960],
      [28.5435, 77.1935],
      [28.5430, 77.1910]
    ]
  }
];

module.exports = {
  locations,
  paths
};
