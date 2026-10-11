// Data structure for French political parties and personalities
// In a real implementation, this would be much more detailed and sourced from actual party programs, declarations, etc.

export const parties = [
  {
    id: 'rn',
    name: 'Rassemblement National',
    shortName: 'RN',
    description: 'Parti politique français d\'idée nationale et sociale, fondé sur le principe de la préférence nationale.',
    logo: '/logos/rn.png', // Would be actual logo in real implementation
    position: {
      // These would be calculated scores based on detailed policy matching
      economy: 0.4,      // More interventionist, protectionist
      social: 0.3,       // Conservative on social issues
      liberty: 0.5,      // Mixed on civil liberties
      europe: 0.2,       // Eurosceptic
      immigration: 0.1,  // Very restrictive
      security: 0.8,     // Strong on law and order
      laicite: 0.7       // Strong laïcité stance
    }
  },
  {
    id: 'lfi',
    name: 'La France Insoumise',
    shortName: 'LFI',
    description: 'Parti politique français de gauche radicale, se réclamant de l\'héritage de la Révolution française et du socialisme.',
    logo: '/logos/lfi.png',
    position: {
      economy: 0.8,      // Interventionist, redistributive
      social: 0.9,       // Progressive on social issues
      liberty: 0.7,      // Liberal on civil liberties
      europe: 0.3,       // Critical of EU but not for exit
      immigration: 0.7,  // Welcoming but with conditions
      security: 0.4,     // Focus on root causes rather than repression
      laicite: 0.6       // Supportive but accommodative
    }
  },
  {
    id: 'ps',
    name: 'Parti Socialiste',
    shortName: 'PS',
    description: 'Parti politique français de centre-gauche, social-démocrate et européen.',
    logo: '/logos/ps.png',
    position: {
      economy: 0.6,      // Moderately interventionist
      social: 0.7,       // Socially progressive
      liberty: 0.6,      // Liberal on civil liberties
      europe: 0.8,       // Pro-European
      immigration: 0.5,  // Balanced approach
      security: 0.5,     // Balanced approach
      laicite: 0.7       // Strong laïcité
    }
  },
  {
    id: 'lr',
    name: 'Les Républicains',
    shortName: 'LR',
    description: 'Parti politique français de droite, gaulliste et libéral-conservateur.',
    logo: '/logos/lr.png',
    position: {
      economy: 0.5,      // Mixed economic approach
      social: 0.4,       // Moderately conservative
      liberty: 0.5,      // Mixed on civil liberties
      europe: 0.6,       // Pro-European but Gaullist
      immigration: 0.3,  // Restrictive but controlled
      security: 0.7,     // Strong on security
      laicite: 0.8       // Very strong laïcité
    }
  },
  {
    id: 're',
    name: 'Renaissance',
    shortName: 'RE',
    description: 'Parti politique français de centre, libéral et pro-européen, issu de La République En Marche !.',
    logo: '/logos/re.png',
    position: {
      economy: 0.5,      // Pro-business but with social measures
      social: 0.5,       // Centrist on social issues
      liberty: 0.6,      // Liberal on civil liberties
      europe: 0.9,       // Strongly pro-European
      immigration: 0.5,  // Controlled but open
      security: 0.6,     // Balanced approach
      laicite: 0.7       // Strong laïcité
    }
  },
  {
    id: 'horizons',
    name: 'Horizons',
    shortName: 'H!',
    description: 'Parti politique français de centre droit, fondé par Édouard Philippe.',
    logo: '/logos/horizons.png',
    position: {
      economy: 0.4,      // Liberal economic tendencies
      social: 0.4,       // Moderately conservative
      liberty: 0.5,      // Mixed on civil liberties
      europe: 0.7,       // Pro-European
      immigration: 0.3,  // Controlled immigration
      security: 0.6,     // Balanced approach
      laicite: 0.6       // Supportive of laïcité
    }
  },
  {
    id: 'pcf',
    name: 'Parti Communiste Français',
    shortName: 'PCF',
    description: 'Parti politique français communiste, membre de la Gauche démocrate et sociale.',
    logo: '/logos/pcf.png',
    position: {
      economy: 0.9,      // Highly interventionist, anti-capitalist
      social: 0.8,       // Socially progressive
      liberty: 0.6,      // Mixed on civil liberties (historically restrictive)
      europe: 0.4,       // Critical of EU
      immigration: 0.6,  // Welcoming but regulated
      security: 0.3,     // Focus on social prevention
      laicite: 0.5       // Variable historical position
    }
  },
  {
    id: 'ee',
    name: 'Les Écologistes',
    shortName: 'EÉLV',
    description: 'Parti politique français écologiste.',
    logo: '/logos/ee.png',
    position: {
      economy: 0.6,      // Regulated economy for ecological transition
      social: 0.8,       // Socially progressive
      liberty: 0.7,      // Liberal on civil liberties
      europe: 0.7,       // Pro-European ecological
      immigration: 0.6,  // Welcoming with integration
      security: 0.4,     // Focus on prevention
      laicite: 0.6       // Supportive but accommodative
    }
  }
];

export const personalities = [
  {
    id: 'bardella',
    name: 'Jordan Bardella',
    role: 'Président du Rassemblement National',
    description: 'Homme politique français, président du Rassemblement National depuis 2021 et député européen depuis 2019.',
    party: 'RN',
    position: {
      economy: 0.4,
      social: 0.3,
      liberty: 0.5,
      europe: 0.2,
      immigration: 0.1,
      security: 0.8,
      laicite: 0.7
    }
  },
  {
    id: 'lepen',
    name: 'Marine Le Pen',
    role: 'Présidente du groupe RN à l\'Assemblée nationale',
    description: 'Homme politique français, présidente du Rassemblement National depuis 2011 et députée du Pas-de-Calais.',
    party: 'RN',
    position: {
      economy: 0.4,
      social: 0.3,
      liberty: 0.5,
      europe: 0.2,
      immigration: 0.1,
      security: 0.8,
      laicite: 0.7
    }
  },
  {
    id: 'melenchon',
    name: 'Jean-Luc Mélenchon',
    role: 'Député des Bouches-du-Rhône',
    description: 'Homme politique français, fondateur de La France Insoumise et ancien candidat à l\'élection présidentielle.',
    party: 'LFI',
    position: {
      economy: 0.8,
      social: 0.9,
      liberty: 0.7,
      europe: 0.3,
      immigration: 0.7,
      security: 0.4,
      laicite: 0.6
    }
  },
  {
    id: 'glucksmann',
    name: 'Raphaël Glucksmann',
    role: 'Député européen',
    description: 'Homme politique français, essayiste et fondateur du mouvement Place Publique.',
    party: 'Place Publique (allié PS)',
    position: {
      economy: 0.5,
      social: 0.7,
      liberty: 0.6,
      europe: 0.8,
      immigration: 0.5,
      security: 0.5,
      laicite: 0.6
    }
  },
  {
    id: 'attal',
    name: 'Gabriel Attal',
    role: 'Premier ministre',
    description: 'Homme politique français, actuel Premier ministre et ancien ministre de l\'Éducation nationale et de la Jeunesse.',
    party: 'RE',
    position: {
      economy: 0.5,
      social: 0.5,
      liberty: 0.6,
      europe: 0.9,
      immigration: 0.5,
      security: 0.6,
      laicite: 0.7
    }
  },
  {
    id: 'philippe',
    name: 'Édouard Philippe',
    role: 'Maire du Havre',
    description: 'Homme politique français, ancien Premier ministre et fondateur du parti Horizons.',
    party: 'Horizons',
    position: {
      economy: 0.4,
      social: 0.4,
      liberty: 0.5,
      europe: 0.7,
      immigration: 0.3,
      security: 0.6,
      laicite: 0.6
    }
  },
  {
    id: 'ruffin',
    name: 'François Ruffin',
    role: 'Député de la Somme',
    description: 'Homme politique français, député de la Somme et fondateur du journal Fakir.',
    party: 'LFI (allié)',
    position: {
      economy: 0.7,
      social: 0.8,
      liberty: 0.6,
      europe: 0.4,
      immigration: 0.6,
      security: 0.3,
      laicite: 0.5
    }
  },
  {
    id: 'tondelier',
    name: 'Marine Tondelier',
    role: 'Secrétaire nationale des Écologistes',
    description: 'Femme politique française, secrétaire nationale du parti Les Écologistes.',
    party: 'EÉLV',
    position: {
      economy: 0.6,
      social: 0.8,
      liberty: 0.7,
      europe: 0.7,
      immigration: 0.6,
      security: 0.4,
      laicite: 0.6
    }
  },
  {
    id: 'hollande',
    name: 'François Hollande',
    role: 'Ancien Président de la République',
    description: 'Homme politique français, ancien Président de la République française de 2012 à 2017.',
    party: 'PS',
    position: {
      economy: 0.5,
      social: 0.6,
      liberty: 0.6,
      europe: 0.7,
      immigration: 0.5,
      security: 0.5,
      laicite: 0.7
    }
  },
  {
    id: 'roussel',
    name: 'Fabien Roussel',
    role: 'Secrétaire national du Parti communiste français',
    description: 'Homme politique français, secrétaire national du Parti communiste français et député du Nord.',
    party: 'PCF',
    position: {
      economy: 0.9,
      social: 0.8,
      liberty: 0.6,
      europe: 0.4,
      immigration: 0.6,
      security: 0.3,
      laicite: 0.5
    }
  }
];

// Helper function to get party by id
export const getPartyById = (id) => {
  return parties.find(p => p.id === id) || null;
};

// Helper function to get personality by id
export const getPersonalityById = (id) => {
  return personalities.find(p => p.id === id) || null;
};