/* ============================================================================
   THE CREATIVE WALL — the manifest.

   Every field below was read off the artwork itself, not off a filename and not
   off a Canva title. (Canva titles are actively unreliable here: the vault
   records a design titled "Laser Hair Removal - Ad Creatives" that contains
   zero laser hair removal.) Where a hook line appears in quotes, it is the
   literal type set on the image.

   PROVENANCE is the field that matters most and it has exactly three values:

     'client'  — designed and shipped for a real clinic campaign. Proves the ad
                 was built and went out. Proves NOTHING about what it returned.
     'own'     — Alex's own brand (CareLine / Supercharged). No client, no
                 release to chase, nothing here belongs to anyone else.
     'concept' — own brand AND never ran in market. Spec work, labelled.

   The bright line, inherited from the vault: a creative on this page is CRAFT
   evidence, never performance evidence. No figure from the claims contract is
   permitted to touch any tile. Performance lives on the home page, per campaign,
   sourced to Meta. Never staple one to the other.
   ========================================================================== */

/* --- The chiropractic hook ladder ---------------------------------------
   One offer written eight ways. The variable is WHERE ON THE AWARENESS LADDER
   the reader is standing when the ad reaches them — which is the actual unit of
   media-buying work, and the reason this is the best set in the library. */
const CHIRO = [
  ['01', 'Stairs feeling more difficult?',
   'Symptom-aware — names the moment the pain is felt',
   'A woman comes down a carpeted staircase at home, one hand on the rail; the offer sits in a blue panel on the right.'],
  ['02', 'Walking should feel easier',
   'Aspiration-led — sells the restored ability, not the pain',
   'A couple walk a golden retriever down a suburban sidewalk; the headline drops to the lower third and the offer badge moves to the top-left.'],
  ['03', 'Get clarity before bigger knee decisions',
   'Decision-anxiety — speaks to the reader already weighing surgery',
   'A clinician and a patient talk in a warm, book-lined consult room; the headline takes the top of the frame.'],
  ['04', 'Explore non-surgical knee pain options',
   'Solution-aware — names the modality (SoftWave, StemWave) outright',
   'A consultation across a desk with a SoftWave unit in use behind them; the price sits in a white circle at the lower-left.'],
  ['05', 'Everyday movement matters',
   'Symptom-aware — the ordinary difficulty, not the clinical one',
   'A woman pushes herself up out of an armchair; the offer badge overlays the upper-left.'],
  ['06', 'Stay active longer',
   'Identity-led — sells continuing to be the person you already are',
   'A man walks a golf course with a trolley; the headline sits in a white band across the upper third.'],
  ['07', '$49 Knee Pain & Mobility Screening',
   'Offer-led — no emotional hook at all, the control against the other seven',
   'A doctor in a white coat mid-explanation with a patient; the price becomes the headline and runs full-width across the top.'],
  ['08', 'Everyday movement should feel easier',
   'Symptom-aware, relocated — the errand, not the home',
   'A woman leans on a shopping trolley in a grocery aisle; the price sits in a solid circle at mid-left.'],
];

/* --- The laser art-direction test ---------------------------------------
   Copy frozen, art direction swung as far as it will go. Six worlds, one offer.
   This is the set that shows range without changing the argument. */
const LASER = [
  ['01', 'Beach, palm shade, magenta',
   'Price block bottom-right; benefits as solid pink pills',
   'A woman on a white-sand beach under palm fronds; a magenta band carries the headline.'],
  ['02', 'Overhead, underwater, gold on dark water',
   'Price block bottom-left, whole frame inside a hairline rule',
   'An overhead shot of a woman floating in dark green pool water, type in gold.'],
  ['03', 'Ocean blue, model right, outlined pills',
   'Price block bottom-left; benefits become outlined rather than filled',
   'A woman standing in the sea against a blue sky; the headline sits in a dark band on the left.'],
  ['04', 'Coastal sunset, inverted layout',
   'Price moved to the TOP-left and the headline to the bottom — the only inversion in the set',
   'A woman walks out of the surf in an open white shirt; the price leads the frame.'],
  ['05', 'Purple studio, italic wordmark',
   'Price bottom-right; the only variant to set the treatment name as an italic serif',
   'A studio cut-out against a purple gradient; benefits sit in white bars.'],
  ['06', 'In-clinic, teal, the procedure itself',
   'The only variant that shows the treatment happening rather than the result',
   'A client in protective eyewear during a laser session, clinician’s hands in frame.'],
];

/* --- The body-contouring casting test ------------------------------------
   Same offer, same three icons, same LIMITED TIME pill. What moves is who the
   ad is casting and which corner each block occupies. */
const CONTOUR = [
  ['01', 'Navy studio, headline top',
   'Casting: athletic, mid-30s, studio-lit',
   'A woman in black activewear against a deep navy gradient; the headline runs across the top and the price sits right.'],
  ['02', 'Hot pink, mid-air, joy',
   'Casting: exuberant, in motion — the only variant selling delight rather than resolve',
   'A woman leaps with one arm raised against a hot-pink ground; the price sits in a white band across the middle.'],
  ['03', 'Sky, low angle, power',
   'Casting: fuller-figured, shot from below against sky; headline moved to the BOTTOM',
   'A low-angle hero shot against clouds, hands on hips; the price sits top-right.'],
  ['04', 'Maroon, editorial, older casting',
   'Casting: visibly older, mid-workout, laughing — widens the age range of the set',
   'A woman in maroon activewear with earphones against a maroon-to-grey ground; a white band splits the frame.'],
  ['05', 'Coastal, eyes closed, calm',
   'Casting: serene rather than triumphant; the blue benefit band moves to the left edge',
   'A woman stretches with her eyes closed on a bright coastline; the price sits bottom-left.'],
];

/* --- CareLine own-brand exploration --------------------------------------
   30 stills selected from a 172-frame generated set, run as a directed
   exploration across named territories rather than a prompt free-for-all.
   Alt text carried over verbatim from the home page's wall. */
const CARELINE = [
  ['01-dusk-reception',    'Dusk & revenue',      'A clinic reception desk at dusk, London skyline through floor-to-ceiling glass'],
  ['02-dusk-revenue',      'Dusk & revenue',      'A holographic revenue spiral above a marble reception counter at dusk'],
  ['03-revenue-counter',   'Dusk & revenue',      'A glowing glass vessel labelled clinic revenue on a reception counter'],
  ['04-revenue-lounge',    'Dusk & revenue',      'A clinic lounge with a holographic revenue column and appointment cards'],
  ['05-revenue-corridor',  'Dusk & revenue',      'A holographic revenue spiral down a polished clinic corridor'],
  ['06-ba-phone-console',  'Before & after',      'A before-and-after split pairing a ringing desk phone with a booking confirmation'],
  ['07-ba-two-panel',      'Before & after',      'A two-panel before-and-after, missed-call notifications against a confirmed appointment'],
  ['08-ba-chaos-calm',     'Before & after',      'A labelled before-and-after split, a chaotic front desk against a calm one'],
  ['09-ba-inbox-chart',    'Before & after',      'An overflowing inbox on one side, a rising booking chart on the other'],
  ['10-london-aerial-a',   'London',              'An aerial view of London at dawn'],
  ['11-london-aerial-b',   'London',              'An aerial view of the Thames and the City of London'],
  ['12-highrise-holo',     'London',              'A high-rise interior overlaid with holographic booking panels'],
  ['13-phone-bus-timer',   'London',              'A phone held on a London street, a call timer running on screen'],
  ['14-storefront-glass',  'London',              'A glass clinic storefront on a wet London street'],
  ['15-rooftop-crew',      'London',              'A presenter and a camera operator on a London rooftop'],
  ['16-holo-never-miss',   'Holographic',         'A clinic corridor under the line never miss a call, never lose a lead'],
  ['17-holo-lobby',        'Holographic',         'A bright clinic lobby with a holographic brand wordmark'],
  ['18-humanoid-leaks',    'Humanoid',            'A humanoid figure at a desk under the line you do not need more leads, you need fewer leaks'],
  ['19-humanoid-featureset','Humanoid',           'A humanoid figure beside a feature list for an AI front desk'],
  ['20-podcast-two',       'Podcast',             'Two people recording a podcast at a wooden table'],
  ['21-podcast-neon',      'Podcast',             'A presenter at a microphone beside a neon monogram, London through the window'],
  ['22-podcast-tablet',    'Podcast',             'A presenter at a microphone holding a tablet showing a booking screen'],
  ['23-busy-desk',         'Front desk',          'A receptionist on a headset at a busy front desk'],
  ['24-overwhelm-desk',    'Front desk',          'A front desk mid-rush, phone and paperwork competing for attention'],
  ['25-calm-desk',         'Front desk',          'The same front desk, quiet, one screen open'],
  ['26-laptop-console',    'Product',             'A laptop on a marble counter showing a booking console'],
  ['27-standing-card',     'Product',             'A clinician standing beside an appointment-request card'],
  ['28-phone-screen',      'Product',             'A phone screen showing an incoming AI-handled call'],
  ['29-phone-handoff',     'Product',             'A tablet held up showing a queue of handled enquiries'],
  ['30-foam-pit',          'Behind the shoot',    'A shoot in progress, a figure leaping into a foam pit with Big Ben behind'],
];

const items = [];

CHIRO.forEach(([n, hook, stage, alt]) => items.push({
  dir: 'creative-static', base: `chiro-knee-pain-${n}`, w: 1080, h: 1350,
  kind: 'static', vertical: 'chiro', set: 'knee', seq: n,
  title: `Hook ${n}`, hook,
  offer: '$49 Knee Pain & Mobility Screening — consultation, knee evaluation, movement assessment, doctor’s findings',
  variable: stage,
  provenance: 'client', alt: `Chiropractic knee-pain ad, hook variant ${n}: ${alt}`,
}));

LASER.forEach(([n, hook, variable, alt]) => items.push({
  dir: 'creative-static', base: `medspa-laser-${n}`, w: 1080, h: 1080,
  kind: 'static', vertical: 'medspa', set: 'laser', seq: n,
  title: `Direction ${n}`, hook,
  offer: '“Effortless elegance, smooth to the touch” · laser hair removal · $79 now, regularly $149',
  variable,
  provenance: 'client', alt: `Laser hair removal ad, art direction ${n}: ${alt}`,
}));

CONTOUR.forEach(([n, hook, variable, alt]) => items.push({
  dir: 'creative-static', base: `medspa-body-contouring-${n}`, w: 1080, h: 1080,
  kind: 'static', vertical: 'medspa', set: 'contour', seq: n,
  title: `Casting ${n}`, hook,
  offer: '3-in-1 Mommy Makeover · $299 now only · non-invasive, effective results, goodbye tummy · LIMITED TIME',
  variable,
  provenance: 'client', alt: `Non-surgical body-contouring ad, casting variant ${n}: ${alt}`,
}));

items.push({
  dir: 'creative-static', base: 'medspa-weight-loss-01', w: 1080, h: 1080,
  kind: 'static', vertical: 'glp1', set: null, seq: '01',
  title: 'GLP-1 weekly price',
  hook: 'SKINNY SHOTS — $40 per week',
  offer: 'Medically supervised weight loss · no surgery, no downtime, safe & effective · slim down, control cravings, feel empowered',
  variable: 'The one page of a nine-page set that carries no identifiable clinic staff. The other eight are held back for exactly that reason — real people, embroidered scrubs, no signed release.',
  provenance: 'client',
  alt: 'GLP-1 weight-loss ad: the words SKINNY SHOTS in gold beside a $40 per week price capsule on white.',
});

CARELINE.forEach(([slug, territory, alt]) => {
  const n = slug.slice(0, 2);
  items.push({
    dir: 'careline', base: `cl-${slug}`, w: 480, h: slug.startsWith('21') ? 480 : 860,
    kind: 'static', vertical: 'careline', set: null, seq: n,
    title: `CareLine ${n}`, hook: territory,
    offer: 'CareLine — an AI front desk for clinics. Alex’s own product.',
    variable: `Territory: ${territory}. One of 30 stills kept from a 172-frame directed exploration.`,
    provenance: 'concept', alt: `Concept still: ${alt}`,
  });
});

items.push({
  dir: 'creatives', base: 'meta-variation', w: 1080, h: 1350,
  kind: 'static', vertical: 'agency', set: null, seq: '01',
  title: 'Agency lead-gen',
  hook: 'Meta Launch Trial — $1 Optimization Starter',
  offer: 'Supercharged’s own client-getting ad — the agency selling the agency.',
  variable: 'Own-brand, and it matters: presenting agency lead-gen as clinic client work would be a misattribution. It is filed here as what it is.',
  provenance: 'own',
  alt: 'Agency ad: a 3D-illustrated character holding a syringe and a laser handpiece under the words Meta Launch Trial.',
});

items.push({
  dir: 'creatives', base: 'knee-animation', w: 1080, h: 1920,
  kind: 'frame', vertical: 'chiro', set: null, seq: '01',
  title: 'Animated hook',
  hook: '“You down?”',
  offer: 'Knee pain — 3D-animated hook with burned captions, 9:16.',
  variable: 'A different school entirely: stylised 3D animation instead of stock photography, with the caption burned into the frame for sound-off feeds.',
  provenance: 'concept',
  alt: 'A frame from a 3D-animated ad: a stylised man bends to hold a glowing knee on a garden path, caption reading you down.',
});

/* --- Motion. Self-hosted, preload="none", nothing autoplays. -------------- */
const videos = [
  {
    dir: 'creative', base: 'ai-01-frontdesk-walk', w: 1080, h: 1920, poster: 540,
    title: 'Walking selfie', hook: 'The walking-selfie hook — a clinic owner talks to camera on the move',
    offer: 'CareLine — AI front desk for clinics. Own brand.',
    variable: 'Generated UGC. The walk is the variable: motion in the first frame is what buys the scroll-stop, and it is the harder thing to get out of a model cleanly.',
    provenance: 'concept',
    alt: 'Video: a presenter in a white coat speaks to a hand-held camera in a clinic corridor.',
  },
  {
    dir: 'creative', base: 'ai-01-frontdesk-ad', w: 1080, h: 1920, poster: 540,
    title: 'Static-frame cut', hook: 'The same setup, held still',
    offer: 'CareLine — AI front desk for clinics. Own brand.',
    variable: 'The controlled comparison against the walking cut: same presenter, same room, same offer, camera locked off. Output alone proves a subscription; the pair proves a decision.',
    provenance: 'concept',
    alt: 'Video: the same presenter in the same clinic corridor, camera held still.',
  },
];

export { items, videos, CHIRO, LASER, CONTOUR };
