const TOTAL_ACCOUNTS = 1000;

const usernameSeeds = [
  'User',
  'account',
  'unavailable',
  'deleted_user',
  'visitor',
  'blank',
  'removed',
  'ghost',
  'archived',
  'unknown',
  'reset',
  'hidden',
];

const avatarTypes = ['silhouette', 'blank', 'broken', 'starter-blue', 'starter-slate', 'starter-dusk'];
const hoverTraces = [
  'last active 247 days ago',
  'content unavailable',
  '3 hidden posts',
  'verification required',
  'profile reset',
];
const warnings = [
  'Account unavailable.',
  'No content can be shown.',
  'User verification required before viewing this profile.',
  'This page is empty, but the structure remains.',
  'This account may be at risk. Notes are temporarily unavailable.',
];
const signatures = ['signature deleted', 'signature removed', 'bio unavailable', 'status line erased'];

function seededNumber(index) {
  return Math.floor(Math.abs(Math.sin(index * 931.231)) * 10000000000);
}

function padId(value, length = 3) {
  return String(value).padStart(length, '0');
}

function makeUsername(index, rawNumber) {
  const seed = usernameSeeds[index % usernameSeeds.length];
  if (seed === 'User') return `User_${rawNumber}`;
  if (seed === 'account') return `account_${index % 9 === 0 ? 404 : padId(rawNumber % 9999, 4)}`;
  if (seed === 'unavailable') return `unavailable_${rawNumber % 1000}`;
  if (seed === 'visitor') return `visitor_${padId(index % 1000)}`;
  if (seed === 'deleted_user') return 'deleted_user';
  return `${seed}_${padId(rawNumber % 10000, 4)}`;
}

function hiddenId(rawNumber) {
  const id = String(rawNumber).padStart(10, '0');
  return `${id.slice(0, 3)}•••${id.slice(-3)}`;
}

function buildProfiles() {
  return Array.from({ length: TOTAL_ACCOUNTS }, (_, index) => {
    const rawNumber = seededNumber(index + 7);
    const hiddenPosts = (rawNumber % 8) + (index % 3);
    const username = makeUsername(index, rawNumber);

    return {
      id: `local-${index + 1}-${rawNumber}`,
      userNumber: `No.${padId(index + 1, 4)}`,
      username,
      partialId: hiddenId(rawNumber),
      damaged: index % 7 === 0 || index % 13 === 0,
      avatar: avatarTypes[index % avatarTypes.length],
      hoverTrace: hoverTraces[index % hoverTraces.length],
      followers: index % 6 === 0 ? '—' : String(rawNumber % 130),
      following: index % 5 === 0 ? '0' : String((rawNumber >> 3) % 44),
      likes: index % 8 === 0 ? '0' : String((rawNumber >> 5) % 2400),
      warning: warnings[index % warnings.length],
      signature: signatures[index % signatures.length],
      hiddenPosts,
      traces: [
        hoverTraces[index % hoverTraces.length],
        `${hiddenPosts} hidden posts`,
        signatures[index % signatures.length],
        index % 2 === 0 ? 'missing image source' : 'avatar reset by system',
        index % 3 === 0 ? 'follow relation remains' : 'content unavailable',
      ],
    };
  });
}

const profiles = buildProfiles();
const avatarWall = document.querySelector('#avatar-wall');
const modal = document.querySelector('#profile-modal');
const modalContent = document.querySelector('#modal-content');
const closeButton = modal.querySelector('.panel-close');
let lastFocusedNode = null;

function avatarGlyph(type = 'silhouette', large = false) {
  const glyph = document.createElement('div');
  glyph.className = `avatar avatar--${type}${large ? ' avatar--large' : ''}`;
  glyph.setAttribute('aria-hidden', 'true');

  if (type === 'silhouette') {
    glyph.innerHTML = `
      <svg viewBox="0 0 80 80" role="img">
        <circle cx="40" cy="29" r="13"></circle>
        <path d="M17 68c3.5-16 14.5-25 23-25s19.5 9 23 25"></path>
      </svg>`;
  }

  if (type === 'broken') {
    glyph.innerHTML = '<span class="broken-mark">⌁</span>';
  }

  if (type.startsWith('starter')) {
    glyph.innerHTML = '<span class="starter-mark"></span>';
  }

  return glyph;
}

function renderAvatarWall() {
  const fragment = document.createDocumentFragment();

  profiles.forEach((profile) => {
    const button = document.createElement('button');
    button.className = 'profile-node';
    button.type = 'button';
    button.dataset.profileId = profile.id;
    button.setAttribute('aria-label', `Inspect ${profile.username}, ${profile.hoverTrace}`);

    const wrap = document.createElement('div');
    wrap.className = 'node-avatar-wrap';
    wrap.append(avatarGlyph(profile.avatar));

    const tooltip = document.createElement('span');
    tooltip.className = 'trace-tooltip';
    tooltip.textContent = profile.hoverTrace;
    wrap.append(tooltip);

    const userNumber = document.createElement('span');
    userNumber.className = 'node-number';
    userNumber.textContent = profile.userNumber;

    const name = document.createElement('span');
    name.className = `node-name${profile.damaged ? ' is-damaged' : ''}`;
    name.textContent = profile.username;

    const id = document.createElement('span');
    id.className = 'node-id';
    id.textContent = profile.partialId;

    button.append(wrap, userNumber, name, id);
    button.addEventListener('click', () => openModal(profile, button));
    fragment.append(button);
  });

  avatarWall.replaceChildren(fragment);
}

function traceZone(text) {
  const zone = document.createElement('span');
  zone.className = 'trace-zone';
  zone.tabIndex = 0;
  zone.innerHTML = `<span class="trace-dot"></span><span class="trace-fragment"></span>`;
  zone.querySelector('.trace-fragment').textContent = text;
  return zone;
}

function contentBlock(label, index) {
  const block = document.createElement('div');
  block.className = 'content-block';
  block.innerHTML = `
    <div class="content-thumb"><span></span></div>
    <div class="content-lines">
      <i></i>
      <i></i>
      <small></small>
    </div>`;
  block.querySelector('small').textContent = label || `missing image ${index + 1}`;
  return block;
}

function openModal(profile, trigger) {
  lastFocusedNode = trigger;

  const head = document.createElement('div');
  head.className = 'profile-head';
  const profileText = document.createElement('div');
  profileText.innerHTML = `
    <p class="micro-label">unavailable profile fragment</p>
    <h2 id="modal-title" class="${profile.damaged ? 'is-damaged' : ''}"></h2>
    <p class="profile-id"></p>`;
  profileText.querySelector('h2').textContent = profile.username;
  profileText.querySelector('.profile-id').textContent = `${profile.userNumber} / ID ${profile.partialId}`;
  head.append(avatarGlyph(profile.avatar, true), profileText);

  const stats = document.createElement('dl');
  stats.className = 'stats';
  [
    ['followers', profile.followers],
    ['following', profile.following],
    ['likes', profile.likes],
  ].forEach(([label, value]) => {
    const item = document.createElement('div');
    item.innerHTML = `<dt>${label}</dt><dd></dd>`;
    item.querySelector('dd').textContent = value;
    stats.append(item);
  });

  const warning = document.createElement('div');
  warning.className = 'warning-box';
  warning.innerHTML = '<span class="warning-icon">!</span><p></p>';
  warning.querySelector('p').textContent = profile.warning;

  const signature = document.createElement('div');
  signature.className = 'signature-row';
  signature.innerHTML = '<span>signature</span><em></em>';
  signature.querySelector('em').textContent = profile.signature;

  const traceMap = document.createElement('div');
  traceMap.className = 'trace-map';
  profile.traces.forEach((trace) => traceMap.append(traceZone(trace)));

  const missing = document.createElement('div');
  missing.className = 'missing-content';
  [
    'blank content block',
    'missing image placeholder',
    `${profile.hiddenPosts} hidden posts`,
    'deleted signature field',
    'unavailable media record',
    'empty comment structure',
  ].forEach((label, index) => missing.append(contentBlock(label, index)));

  const metadata = document.createElement('div');
  metadata.className = 'metadata-list';
  [
    ['profile state', 'unavailable'],
    ['image source', 'failed'],
    ['archive relation', 'remains'],
    ['last action', profile.hoverTrace],
  ].forEach(([label, value]) => {
    const row = document.createElement('p');
    row.innerHTML = '<span></span><em></em>';
    row.querySelector('span').textContent = label;
    row.querySelector('em').textContent = value;
    metadata.append(row);
  });

  const banner = document.createElement('div');
  banner.className = 'banner';
  modalContent.replaceChildren(banner, head, stats, warning, signature, traceMap, missing, metadata);
  modal.hidden = false;
  document.body.classList.add('modal-open');
  closeButton.focus();
}

function closeModal() {
  modal.hidden = true;
  document.body.classList.remove('modal-open');
  lastFocusedNode?.focus();
}

closeButton.addEventListener('click', closeModal);
modal.addEventListener('click', (event) => {
  if (event.target === modal) closeModal();
});
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && !modal.hidden) closeModal();
});

renderAvatarWall();
