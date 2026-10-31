/**
 * Page transition settings. Every value the overlay uses lives here.
 *
 * Sequence (ms from the click, full motion):
 *   0            light-orange lead ring, then the orange disc, grow from the screen centre
 *   logoInAt     white xCellence mark pops in
 *   spinAt       mark makes one turn; halfway through it morphs into the xCeption mark
 *   blueAt       light-blue lead ring, then the deep blue disc, sweep in behind the mark
 *   ...          blue holds (mark breathes) until the new page has committed
 *   exit         blue disc shrinks to a point in the centre, revealing the page
 */
export const PAGE_TRANSITION = {
  colors: {
    orangeLead: '#ff8a3d', // --orange-2
    orange: '#ff5a1f', // --orange
    blueLead: '#5b8dff', // --blue-2
    blue: '#2563eb', // --blue: centre of the blue disc
    blueDeep: '#1a3fd6', // xCeption gradient start: edge of the blue disc
  },

  /** Logos shown in the centre: the lab's white xCellence mark morphs into its sister team's xCeption mark. */
  logos: { from: 'xcellence', to: 'xception' } as const,

  timing: {
    expand: 460, // each disc's growth
    layerLag: 80, // gap between a lead ring and the disc that follows it
    logoInAt: 330,
    logoIn: 240,
    spinAt: 440,
    spin: 720,
    blueAt: 700,
    labelAt: 460,
    exit: 560,
    /** Hard ceiling from the click. Past it the overlay always leaves, whatever the page is doing. */
    maxWait: 10000,
    reducedFade: 160,
  },

  easing: {
    // Gentle spring: a little overshoot on growth, never a wobble.
    expand: 'cubic-bezier(0.34, 1.3, 0.64, 1)',
    out: 'cubic-bezier(0.22, 1, 0.36, 1)', // --ease-out
    inOut: 'cubic-bezier(0.65, 0, 0.35, 1)', // --ease-in-out
    pop: 'cubic-bezier(0.34, 1.56, 0.64, 1)', // --ease-spring
    exit: 'cubic-bezier(0.7, 0, 0.84, 0)',
  },
};
