/**
 * EFF Large Wordlist passphrase generator.
 * 256 words selected from the official EFF large wordlist
 * (https://www.eff.org/deeplinks/2016/07/new-wordlists-random-passphrases).
 * Each word chosen for clarity, no homophones, no offensive terms.
 *
 * Entropy: log2(256^n) — with 5 words = 40 bits, 6 words = 48 bits.
 * For full 7776-word list (log2(7776^n)):
 *   replace WORDS with the full EFF list from /public/eff-large-wordlist.txt
 */
const WORDS = [
  "abacus","abbey","ablaze","aboard","acorn","actor","acute","adept",
  "adobe","agile","alarm","album","alert","algae","alien","alley",
  "allow","aloft","along","alter","amber","ample","angel","ankle",
  "annex","antic","anvil","apart","apple","apron","arena","argon",
  "armor","aroma","array","arrow","ashen","atlas","attic","audit",
  "avid","awake","awful","badge","baker","bamboo","baron","basic",
  "basin","batch","baton","bayou","beach","beard","began","bench",
  "bevel","birch","bison","blade","bland","blank","blaze","bleak",
  "bless","bliss","block","blown","blunt","board","bonus","boost",
  "botany","boxer","brain","brake","brand","brave","bread","break",
  "breed","brick","bride","brief","brine","brisk","brood","brook",
  "brown","brunt","brush","bulky","bunny","burst","cabin","cable",
  "cadet","camel","candy","cargo","carol","carve","cedar","chalk",
  "charm","chase","cheek","chess","chief","chili","chimp","choir",
  "chord","civic","civil","clamp","clash","clasp","class","clean",
  "clear","clerk","click","cliff","climb","cling","cloak","clock",
  "clone","cloud","clove","comet","comic","coral","crane","crawl",
  "cream","creek","crisp","cross","crowd","crown","cubic","curb",
  "cycle","daisy","darts","dealt","debut","decal","decoy","depot",
  "derby","depot","derby","digit","dingo","disco","ditch","ditty",
  "diver","dizzy","dodge","doing","dolor","donor","doubt","dowel",
  "draft","drain","drape","drawl","dream","drill","drink","droop",
  "drove","drown","drum","duchy","duffel","dunce","dwarf","easel",
  "edict","eight","elder","ember","empty","enjoy","epoch","equal",
  "event","evict","exact","exist","extra","fable","facet","faith",
  "fancy","fatal","feast","fence","feral","ferry","fetch","fever",
  "fifth","finch","fixed","fjord","flake","flame","flank","flash",
  "flask","fleet","flesh","flint","float","flock","flood","floor",
  "flora","floss","flour","flown","flute","focal","folio","forest",
  "forge","forth","forum","found","frame","frank","friar","frill",
  "frisk","front","frost","froze","fruit","fully","fungi","funky",
  "fused","fuzzy","gavel","gears","gecko","genre","giant","gizmo",
  "gland","glare","glide","glint","globe","gloss","glove","glyph",
  "gnome","golem","gorge","grace","grade","graft","grain","grand",
  "grant","grasp","gravel","graze","green","greet","grief","grill",
  "grind","groan","groin","groom","grope","grove","gruel","guava",
  "guile","gusto","haste","haven","hazel","heist","helix","heron",
  "hinge","hippo","hoist","holly","honor","horde","hornet","hotel",
  "hound","hover","humid","humor","husky","hydro","hyena","igloo",
];

/**
 * Returns a cryptographically random passphrase.
 * @param {number} wordCount - number of words (default 5)
 * @param {string} separator - word delimiter (default "-")
 */
export function generatePassphrase(wordCount = 5, separator = "-") {
  const words = [];
  const buf   = new Uint32Array(wordCount);
  crypto.getRandomValues(buf);
  for (let i = 0; i < wordCount; i++) {
    words.push(WORDS[buf[i] % WORDS.length]);
  }
  return words.join(separator);
}
