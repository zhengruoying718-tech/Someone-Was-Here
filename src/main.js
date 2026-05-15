import React, { useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';

const h = React.createElement;
const ACCOUNT_COUNT = 1000;
const INITIAL_VISIBLE = 120;
const LOAD_STEP = 120;

const banReasons = [
  'violated platform rules',
  'reported by multiple users',
  'content temporarily unavailable',
  'identity verification failed',
  'account exists at risk',
  'profile reset by system',
  'content removed according to regulations',
  'user not found',
  'account unavailable',
];

const statuses = ['unavailable', 'banned', 'hidden', 'reset'];
const avatarTypes = ['silhouette', 'blank', 'defaultIcon', 'silhouette', 'blank', 'defaultIcon'];
const traceTexts = [
  'last active 247 days ago',
  'signature removed',
  'one comment remains',
  'profile image failed to load',
  '3 posts hidden',
  'follow relation remains',
  'content deleted',
];
const garbledLines = ['usr: //r3m_--nant', 'sig: ▒▒▒ removed', 'img_src: failed://null', 'last packet: 00:4f:__'];

function seededRandom(seed) {
  const x = Math.sin(seed * 999.91) * 10000;
  return x - Math.floor(x);
}

function randomInt(seed, min, max) {
  return Math.floor(seededRandom(seed) * (max - min + 1)) + min;
}

function buildAccounts() {
  return Array.from({ length: ACCOUNT_COUNT }, (_, index) => {
    const rawId = String(randomInt(index + 11, 1000000000, 9999999999));
    const followers = randomInt(index + 31, 0, 98000);
    const following = randomInt(index + 47, 0, 1200);
    const likes = randomInt(index + 63, 0, 240000);
    const lastActive = randomInt(index + 79, 4, 1300);
    const hiddenPosts = randomInt(index + 95, 0, 47);

    return {
      id: rawId,
      userName: `User_${rawId}`,
      avatar: avatarTypes[index % avatarTypes.length],
      followers,
      following,
      likes,
      lastActive,
      hiddenPosts,
      banReason: banReasons[index % banReasons.length],
      status: statuses[index % statuses.length],
      damaged: index % 6 === 0 || index % 19 === 0,
      delay: `${(index % INITIAL_VISIBLE) * 18}ms`,
    };
  });
}

const accounts = buildAccounts();

function Avatar({ type, large = false }) {
  return h(
    'div',
    { className: `avatar avatar--${type} ${large ? 'avatar--large' : ''}`, 'aria-hidden': 'true' },
    type === 'silhouette'
      ? h(
          'svg',
          { viewBox: '0 0 80 80' },
          h('circle', { cx: '40', cy: '29', r: '13' }),
          h('path', { d: 'M17 68c3.5-16 14.5-25 23-25s19.5 9 23 25' }),
        )
      : null,
    type === 'blank' ? h('span', { className: 'blank-hole' }) : null,
    type === 'defaultIcon' ? h('span', { className: 'default-mark' }) : null,
  );
}

function AvatarCard({ account, onOpen }) {
  return h(
    'button',
    {
      className: 'avatar-card',
      type: 'button',
      style: { animationDelay: account.delay },
      onClick: () => onOpen(account),
      'aria-label': `Open incomplete profile for ${account.userName}`,
    },
    h(Avatar, { type: account.avatar }),
    h('span', { className: `card-user ${account.damaged ? 'is-erased' : ''}` }, account.userName),
    h('span', { className: 'card-status' }, account.status),
  );
}

function TracePoint({ children }) {
  return h(
    'span',
    { className: 'trace-point', tabIndex: '0' },
    h('span', { className: 'trace-surface' }),
    h('span', { className: 'trace-copy' }, children),
  );
}

function BrokenImageBlock({ label, wide = false }) {
  return h(
    'div',
    { className: `broken-block ${wide ? 'broken-block--wide' : ''}` },
    h('div', { className: 'broken-image', 'aria-hidden': 'true' }, h('span')),
    h('div', { className: 'missing-lines' }, h('i'), h('i'), h('small', null, label)),
  );
}

function IncompleteProfile({ account, onClose }) {
  if (!account) return null;

  return h(
    'div',
    { className: 'modal-backdrop', onMouseDown: (event) => event.target === event.currentTarget && onClose() },
    h(
      'aside',
      { className: 'profile-panel', 'aria-modal': 'true', role: 'dialog', 'aria-labelledby': 'profile-title' },
      h('button', { className: 'close-button', type: 'button', onClick: onClose, 'aria-label': 'Close incomplete profile' }, '×'),
      h('div', { className: 'blank-banner' }, h('span', null, 'banner unavailable')),
      h(
        'header',
        { className: 'profile-header' },
        h(Avatar, { type: account.avatar, large: true }),
        h(
          'div',
          null,
          h('p', { className: 'eyebrow' }, 'Incomplete Profile'),
          h('h2', { id: 'profile-title', className: account.damaged ? 'is-erased' : '' }, account.userName),
          h('p', { className: 'profile-number' }, `random user number: ${account.id}`),
        ),
      ),
      h(
        'section',
        { className: 'profile-stats', 'aria-label': 'Unavailable profile counts' },
        h('div', null, h('span', null, account.followers.toLocaleString()), h('small', null, 'followers')),
        h('div', null, h('span', null, account.following.toLocaleString()), h('small', null, 'following')),
        h('div', null, h('span', null, account.likes.toLocaleString()), h('small', null, 'likes')),
      ),
      h('section', { className: 'warning-row' }, h('strong', { 'aria-hidden': 'true' }, '!'), h('p', null, account.banReason)),
      h(
        'section',
        { className: 'trace-field', 'aria-label': 'hover areas with temporary traces' },
        traceTexts.map((trace, index) =>
          h(
            TracePoint,
            { key: trace },
            index === 0 ? `last active ${account.lastActive} days ago` : index === 4 ? `${account.hiddenPosts} posts hidden` : trace,
          ),
        ),
      ),
      h(
        'section',
        { className: 'garbled-area', 'aria-label': 'damaged account text' },
        garbledLines.map((line) => h('p', { key: line }, line)),
      ),
      h(
        'section',
        { className: 'missing-grid', 'aria-label': 'missing profile contents' },
        h(BrokenImageBlock, { label: 'profile image failed to load' }),
        h(BrokenImageBlock, { label: 'grey missing content block' }),
        h(BrokenImageBlock, { label: 'deleted signature' }),
        h(BrokenImageBlock, { label: `${account.hiddenPosts} hidden posts` }),
        h(BrokenImageBlock, { label: 'content deleted', wide: true }),
      ),
    ),
  );
}

function App() {
  const [visibleCount, setVisibleCount] = useState(INITIAL_VISIBLE);
  const [selectedAccount, setSelectedAccount] = useState(null);
  const visibleAccounts = useMemo(() => accounts.slice(0, visibleCount), [visibleCount]);

  return h(
    'main',
    { className: 'page-shell' },
    h(
      'section',
      { className: 'intro' },
      h('p', { className: 'surface-label' }, 'fictional unavailable account archive'),
      h('h1', null, 'Someone was here.'),
      h('p', { className: 'subtitle' }, 'This account is no longer available.'),
    ),
    h(
      'section',
      { className: 'archive-count', 'aria-live': 'polite' },
      h('span', null, '1000 unavailable accounts'),
      h('em', null, `${visibleAccounts.length} currently visible`),
    ),
    h(
      'section',
      { className: 'avatar-grid', 'aria-label': 'Unavailable account avatar grid' },
      accounts.map((account, index) =>
        index < visibleCount ? h(AvatarCard, { key: account.id, account, onOpen: setSelectedAccount }) : null,
      ),
    ),
    visibleCount < accounts.length
      ? h(
          'div',
          { className: 'load-more-row' },
          h(
            'button',
            {
              type: 'button',
              className: 'load-more',
              onClick: () => setVisibleCount((count) => Math.min(count + LOAD_STEP, accounts.length)),
            },
            'load more traces',
          ),
        )
      : null,
    h(IncompleteProfile, { account: selectedAccount, onClose: () => setSelectedAccount(null) }),
  );
}

createRoot(document.getElementById('root')).render(h(App));
