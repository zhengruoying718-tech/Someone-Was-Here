const profiles = [
  {
    id: 'user-1202934032',
    name: 'User_1202934032',
    displayName: 'User_1202934032',
    damaged: false,
    avatar: 'default',
    hoverTrace: 'last active 247 days ago',
    followers: '0',
    following: '0',
    likes: '0',
    status: 'This account may be at risk. Notes are temporarily unavailable.',
    traceZones: ['last active: 247 days ago', 'signature removed', '3 posts hidden', 'follow relation remains'],
    contentLabels: ['post index missing', 'image failed', 'comment thread unavailable'],
  },
  {
    id: 'unavailable-691',
    name: 'unavailable_691',
    displayName: 'unavailable_691',
    damaged: true,
    avatar: 'blank',
    hoverTrace: 'content unavailable',
    followers: '12',
    following: '0',
    likes: '—',
    status: 'Account unavailable.',
    traceZones: ['content deleted', 'avatar reset by system', 'one message was sent before disappearance'],
    contentLabels: ['unavailable media', 'removed note', 'empty saved slot'],
  },
  {
    id: 'account-404',
    name: 'account_404',
    displayName: 'account_404',
    damaged: false,
    avatar: 'broken',
    hoverTrace: '0 posts',
    followers: '0',
    following: '0',
    likes: '0',
    status: 'No content can be shown.',
    traceZones: ['profile image failed to load', '0 posts', 'ID remains', 'IP location: unknown'],
    contentLabels: ['broken image', 'missing caption', 'blank archive'],
  },
  {
    id: 'visitor-000',
    name: 'visitor_000',
    displayName: 'visitor_000',
    damaged: false,
    avatar: 'blur',
    hoverTrace: 'profile reset',
    followers: '1',
    following: '4',
    likes: '0',
    status: 'This page is empty, but the structure remains.',
    traceZones: ['profile reset', 'follow relation remains', 'signature removed', 'last active: unknown'],
    contentLabels: ['reset block', 'empty image field', 'deleted reply'],
  },
  {
    id: 'pending-8831',
    name: 'pending_8831',
    displayName: 'pending_8831',
    damaged: true,
    avatar: 'default',
    hoverTrace: 'verification required',
    followers: '0',
    following: '2',
    likes: '6',
    status: 'User verification required before viewing this profile.',
    traceZones: ['verification required', 'liked by 28.1k users', 'content hidden', 'last active: 61 days ago'],
    contentLabels: ['locked field', 'withheld image', 'private remainder'],
  },
  {
    id: 'node-77840',
    name: 'node_77840',
    displayName: 'node_77840',
    damaged: false,
    avatar: 'default',
    hoverTrace: 'ID remains',
    followers: '—',
    following: '—',
    likes: '—',
    status: 'Account unavailable.',
    traceZones: ['ID remains', 'content deleted', 'profile image failed to load'],
    contentLabels: ['record only', 'no preview', 'unreadable source'],
  },
  {
    id: 'archive-0092',
    name: 'archive_0092',
    displayName: 'archive_0092',
    damaged: false,
    avatar: 'blank',
    hoverTrace: '3 posts hidden',
    followers: '28',
    following: '0',
    likes: '1.2k',
    status: 'Notes are temporarily unavailable.',
    traceZones: ['3 posts hidden', 'liked by 28.1k users', 'signature removed', 'content deleted'],
    contentLabels: ['hidden post', 'hidden post', 'hidden post'],
  },
  {
    id: 'removed-73',
    name: 'removed_73',
    displayName: 'removed_73',
    damaged: true,
    avatar: 'broken',
    hoverTrace: 'avatar reset by system',
    followers: '0',
    following: '0',
    likes: '0',
    status: 'No content can be shown.',
    traceZones: ['avatar reset by system', 'IP location: unknown', 'content deleted'],
    contentLabels: ['erased media', 'damaged timestamp', 'empty slot'],
  },
  {
    id: 'ghost-5110',
    name: 'ghost_5110',
    displayName: 'ghost_5110',
    damaged: false,
    avatar: 'blur',
    hoverTrace: 'one message remains',
    followers: '4',
    following: '4',
    likes: '18',
    status: 'This account may be at risk.',
    traceZones: ['one message was sent before disappearance', 'last active: 389 days ago', 'follow relation remains'],
    contentLabels: ['message shell', 'unavailable image', 'muted thread'],
  },
  {
    id: 'blank-2006',
    name: 'blank_2006',
    displayName: 'blank_2006',
    damaged: false,
    avatar: 'blank',
    hoverTrace: 'it is empty here',
    followers: '0',
    following: '1',
    likes: '0',
    status: 'This page is empty, but the structure remains.',
    traceZones: ['signature removed', '0 posts', 'last active: not found', 'content deleted'],
    contentLabels: ['empty profile object', 'blank media object', 'blank note object'],
  },
  {
    id: 'temp-620449',
    name: 'temp_620449',
    displayName: 'temp_620449',
    damaged: true,
    avatar: 'default',
    hoverTrace: 'notes temporarily unavailable',
    followers: '7',
    following: '0',
    likes: '0',
    status: 'Notes are temporarily unavailable.',
    traceZones: ['content deleted', '3 posts hidden', 'profile image failed to load', 'ID remains'],
    contentLabels: ['temporary absence', 'unloaded tile', 'silent reply'],
  },
  {
    id: 'unknown-808',
    name: 'unknown_808',
    displayName: 'unknown_808',
    damaged: false,
    avatar: 'broken',
    hoverTrace: 'IP location: unknown',
    followers: '—',
    following: '0',
    likes: '—',
    status: 'User verification required before viewing this profile.',
    traceZones: ['IP location: unknown', 'verification required', 'follow relation remains'],
    contentLabels: ['unknown record', 'blank preview', 'failed load'],
  },
];

const avatarWall = document.querySelector('#avatar-wall');
const inspectionPanel = document.querySelector('#inspection-panel');
let selectedId = profiles[0].id;

function avatarGlyph(type = 'default', large = false) {
  const glyph = document.createElement('div');
  glyph.className = `avatar avatar--${type}${large ? ' avatar--large' : ''}`;
  glyph.setAttribute('aria-hidden', 'true');

  if (type === 'default') {
    glyph.innerHTML = `
      <svg viewBox="0 0 80 80" role="img">
        <circle cx="40" cy="30" r="13"></circle>
        <path d="M17 68c3.5-16 14.5-25 23-25s19.5 9 23 25"></path>
      </svg>`;
  }

  if (type === 'broken') {
    glyph.innerHTML = '<span class="broken-mark">⌁</span>';
  }

  if (type === 'blur') {
    glyph.innerHTML = '<span class="blur-core"></span>';
  }

  return glyph;
}

function renderAvatarWall() {
  avatarWall.replaceChildren();
  profiles.forEach((profile) => {
    const button = document.createElement('button');
    button.className = `profile-node${selectedId === profile.id ? ' is-selected' : ''}`;
    button.type = 'button';
    button.dataset.profileId = profile.id;

    const wrap = document.createElement('div');
    wrap.className = 'node-avatar-wrap';
    wrap.append(avatarGlyph(profile.avatar));

    const tooltip = document.createElement('span');
    tooltip.className = 'trace-tooltip';
    tooltip.textContent = profile.hoverTrace;
    wrap.append(tooltip);

    const name = document.createElement('span');
    name.className = `node-name${profile.damaged ? ' is-damaged' : ''}`;
    name.textContent = profile.name;

    button.append(wrap, name);
    button.addEventListener('click', () => selectProfile(profile.id));
    avatarWall.append(button);
  });
}

function traceZone(text) {
  const zone = document.createElement('span');
  zone.className = 'trace-zone';
  zone.tabIndex = 0;
  zone.innerHTML = `<span class="trace-dot"></span><span class="trace-fragment"></span>`;
  zone.querySelector('.trace-fragment').textContent = text;
  return zone;
}

function renderProfilePanel(profile) {
  const close = document.createElement('button');
  close.className = 'panel-close';
  close.type = 'button';
  close.setAttribute('aria-label', 'Close profile inspection');
  close.textContent = '×';
  close.addEventListener('click', () => selectProfile(profiles[0].id));

  const banner = document.createElement('div');
  banner.className = 'banner';

  const head = document.createElement('div');
  head.className = 'profile-head';
  const text = document.createElement('div');
  text.innerHTML = `
    <p class="micro-label">profile fragment</p>
    <h2 class="${profile.damaged ? 'is-damaged' : ''}"></h2>
    <p class="profile-id"></p>`;
  text.querySelector('h2').textContent = profile.displayName;
  text.querySelector('.profile-id').textContent = `#${profile.id}`;
  head.append(avatarGlyph(profile.avatar, true), text);

  const stats = document.createElement('dl');
  stats.className = 'stats';
  stats.setAttribute('aria-label', 'Remaining profile counts');
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
  warning.querySelector('p').textContent = profile.status;

  const traceMap = document.createElement('div');
  traceMap.className = 'trace-map';
  traceMap.setAttribute('aria-label', 'Interactive trace fragments');
  profile.traceZones.forEach((trace) => traceMap.append(traceZone(trace)));

  const missing = document.createElement('div');
  missing.className = 'missing-content';
  missing.setAttribute('aria-label', 'Missing content blocks');
  profile.contentLabels.forEach((label, index) => {
    const block = document.createElement('div');
    block.className = 'content-block';
    block.innerHTML = `
      <div class="content-thumb"><span></span></div>
      <div class="content-lines"><i></i><i></i><small></small></div>`;
    block.querySelector('small').textContent = label || `missing object ${index + 1}`;
    missing.append(block);
  });

  const metadata = document.createElement('div');
  metadata.className = 'metadata-list';
  ['metadata', 'caption', 'image-source', 'comment residue'].forEach((row) => {
    const p = document.createElement('p');
    p.innerHTML = '<span></span><em>unavailable</em>';
    p.querySelector('span').textContent = row;
    metadata.append(p);
  });

  inspectionPanel.replaceChildren(close, banner, head, stats, warning, traceMap, missing, metadata);
}

function selectProfile(id) {
  selectedId = id;
  const profile = profiles.find((item) => item.id === id) || profiles[0];
  renderAvatarWall();
  renderProfilePanel(profile);
}

selectProfile(selectedId);
