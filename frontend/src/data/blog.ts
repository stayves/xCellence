export type BlogPost = {
  title: string;
  date: string;
  author: string;
  summary: string;
  readTime: string;
  tag: string;
  slug?: string;
};

export type ArticleSection = {
  title: string;
  paragraphs: string[];
  bullets?: string[];
};

export type FeatureArticle = {
  kicker: string;
  title: string;
  date: string;
  author: string;
  readTime: string;
  slug: string;
  heroImage: string;
  heroAlt: string;
  intro: string;
  sections: ArticleSection[];
  closing: string;
};

export const fusionGuideArticle: FeatureArticle = {
  kicker: 'CAD Playbook',
  title: "A Fisherman's Guide to Fusion 360",
  date: 'December 23, 2025',
  author: 'Zhanibek - CAD Engineer',
  readTime: '7 min read',
  slug: 'fusion-360',
  heroImage: '/zhanibek.jpg',
  heroAlt: 'Zhanibek walking through Fusion 360 workflows with the CAD team',
  intro:
    'Fusion 360 is the quiet superstar of our workshop. In this fisherman-style guide, Zhanibek explains how we lean on Autodesk’s toolkit to model custom FIRST Tech Challenge parts even when off-the-shelf components fall short.',
  sections: [
    {
      title: "What's Fusion 360?",
      paragraphs: [
        'Fusion 360 is the all-in-one environment we trust for robotics: CAD, CAM, rendering, assemblies, and exports in a single window so we never break focus mid-build.',
        'While you can assemble a functioning FTC robot from kit parts alone, modeling and printing your own improves efficiency, trims weight, and offsets the limited supply of REV or goBilda stock in local shops.',
      ],
    },
    {
      title: 'What do we use it for?',
      paragraphs: [
        "Inside our INTO THE DEEP CAD, every colored component highlights a custom-printed part, and it's nearly every mechanism that manipulates game elements.",
        'The arm, claw, extension, and lift were all tuned digitally before touching printers, which saved plastic, sped up iteration, and let strategy drive geometry.',
      ],
    },
    {
      title: 'Method 1: "TENET" and the Parametric Timeline',
      paragraphs: [
        'The parametric timeline logs every feature you create, and Fusion 360 lets you edit that ledger—almost like rewinding time TENET-style.',
        'Adjust a dimension, replay the timeline, and the downstream features rebuild automatically. It is how we keep experimentation safe instead of brittle.',
      ],
      bullets: [
        'Correct the size of a part when measurements were off.',
        'Fix misaligned joints or constraints without redrawing.',
        'Move sketches that started on the wrong plane.',
        'Extend or shorten extrusions after testing feedback.',
      ],
    },
    {
      title: 'Method 2: Sketch Me Like One of Your French Girls',
      paragraphs: [
        'Everything begins with sketches raised from the base plane, so rookies master lines, arcs, and circles before they ever extrude.',
        'Constraints are the unsung heroes: Equal keeps lines matched, Coincident locks points together, and fully constrained sketches prevent messy geometry when dimensions change.',
      ],
      bullets: [
        'Equal: tie two segments together so scaling one scales the other.',
        'Coincident: snap points (and everything attached) into alignment.',
        'Constraint discipline keeps edits from warping the rest of the sketch.',
      ],
    },
    {
      title: 'Method 3: Astral Projection with Project & Intersect',
      paragraphs: [
        'Project and Intersect duplicate geometry from other sketches or bodies so you can reference it on a new plane—almost like astral projecting shapes into place.',
        'Those projections stay linked to the original, which means timeline edits ripple through every dependent feature and make late-stage tweaks far less painful.',
      ],
    },
  ],
  closing:
    'Zhanibek’s fisherman guide boils down to habits: learn the tools, constrain the sketches, and let Fusion 360 carry the heavy lifting so every print, driver practice, and match day feels lighter.',
};

export const blogPosts: BlogPost[] = [
  {
    title: "A Fisherman's Guide to Fusion 360",
    date: 'December 23, 2025',
    author: 'Zhanibek - CAD Engineer',
    summary:
      'Zhanibek shares the Fusion 360 habits that let us design lighter custom FTC parts even when kit inventories run thin.',
    readTime: '7 min read',
    tag: 'CAD',
    slug: 'fusion-360',
  },
  {
    title: 'Building a Reliable Underwater Intake for INTO THE DEEP',
    date: 'October 18, 2025',
    author: 'Aruzhan — Mechanical Lead',
    summary:
      'A deep dive into our dual-roller intake prototype, from CAD iterations and material selection to water-resistant sealing tests.',
    readTime: '6 min read',
    tag: 'Engineering',
  },
  {
    title: 'Training Autonomous Neural Networks with FTC Dashboard',
    date: 'September 29, 2025',
    author: 'Arman — Software Captain',
    summary:
      'How we leveraged TensorFlow object detection, AprilTag localization, and Road Runner trajectories to score reliably in auto.',
    readTime: '8 min read',
    tag: 'Programming',
  },
  {
    title: 'Inside Our Community STEM Workshops',
    date: 'September 10, 2025',
    author: 'Ainur — Outreach Lead',
    summary:
      'Highlights from the 200+ students we mentored this fall, including lesson plans, feedback, and future collaboration goals.',
    readTime: '5 min read',
    tag: 'Outreach',
  },
  {
    title: 'Season Kickoff Strategy: From Whiteboard to Drive Practice',
    date: 'August 28, 2025',
    author: 'Dias — Team Captain',
    summary:
      'Our process for breaking down the game manual, defining scoring priorities, and translating strategy into subsystem milestones.',
    readTime: '7 min read',
    tag: 'Strategy',
  },
];

export const blogArticlesBySlug: Record<string, FeatureArticle> = {
  [fusionGuideArticle.slug]: fusionGuideArticle,
};

