// Central list of remote image URLs. Change them here and every record that uses them updates.
//
// IMPORTANT: these three Unsplash URLs were supplied by the tutor as CANDIDATE fitness
// photos. Their availability and exact content could NOT be verified when this project
// was built (the build environment could not reach images.unsplash.com). They are
// treated as generic gym photos, not as pictures of the specific equipment named on a
// card. Replace them with your own photos before the workshop (see README, "Images").
// The app never depends on them loading: a failed image shows an icon instead.

export const IMAGE_ASSETS = {
  gymFloorCandidate:
    'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=1000&q=80',
  weightsCandidate:
    'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=1000&q=80',
  // Home screen background. Reuses the gym floor candidate; swap for your own photo if you like.
  homeBackground:
    'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=1400&q=80',
  trainingCandidate:
    'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?auto=format&fit=crop&w=1000&q=80',
} as const;

// Banner photo used behind the title on each screen. These reuse the same three candidate
// photos above, so there is only one place to swap them for your own images.
export const BANNER_IMAGES = {
  inventory: IMAGE_ASSETS.gymFloorCandidate,
  statistics: IMAGE_ASSETS.weightsCandidate,
  settings: IMAGE_ASSETS.trainingCandidate,
  form: IMAGE_ASSETS.trainingCandidate,
  details: IMAGE_ASSETS.weightsCandidate,
} as const;
