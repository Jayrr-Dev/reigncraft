import { writeFileSync } from 'node:fs';
import { getAccessTokenAndLoginIfNeeded } from '../node_modules/@devvit/cli/dist/util/auth.js';
import { createAppClient } from '../node_modules/@devvit/cli/dist/util/clientGenerators.js';
import { getVersionByNumber } from '../node_modules/@devvit/cli/dist/util/common-actions/getVersionByNumber.js';
import { getAppBySlug } from '../node_modules/@devvit/cli/dist/util/getAppBySlug.js';

const lines = [];
const log = (...a) => {
  const s = a
    .map((x) => (typeof x === 'string' ? x : JSON.stringify(x)))
    .join(' ');
  lines.push(s);
  console.log(s);
};

const token = await getAccessTokenAndLoginIfNeeded('LocalSocket');
const appInfo = await getAppBySlug(createAppClient(), { slug: 'reigncraft' });
const latest = getVersionByNumber('latest', appInfo.versions);
const play = getVersionByNumber('playtest', appInfo.versions);
log(
  'latest',
  `${latest.majorVersion}.${latest.minorVersion}.${latest.patchVersion}`,
  'vis',
  latest.visibility,
  'validInstallTypes',
  latest.validInstallTypes,
  'build',
  latest.buildStatus
);
log(
  'play',
  `${play.majorVersion}.${play.minorVersion}.${play.patchVersion}.${play.prereleaseVersion}`,
  'vis',
  play.visibility,
  'validInstallTypes',
  play.validInstallTypes,
  'build',
  play.buildStatus
);
log('app fields', {
  name: appInfo.app?.name,
  slug: appInfo.app?.slug,
  defaultPlaytestSubredditId: appInfo.app?.defaultPlaytestSubredditId,
  owner: appInfo.app?.owner,
});

for (const sub of ['reigncraft_dev', 'Reigncraft']) {
  const r = await fetch('https://oauth.reddit.com/r/' + sub + '/about', {
    headers: {
      Authorization: 'Bearer ' + token.accessToken,
      'User-Agent': 'reigncraft-debug/1.0',
    },
  });
  const j = await r.json();
  const d = j.data || {};
  log(sub, {
    status: r.status,
    subscribers: d.subscribers,
    user_is_moderator: d.user_is_moderator,
    subreddit_type: d.subreddit_type,
    over18: d.over18,
    name: d.display_name,
  });
}

const mods = await fetch(
  'https://oauth.reddit.com/r/reigncraft_dev/about/moderators',
  {
    headers: {
      Authorization: 'Bearer ' + token.accessToken,
      'User-Agent': 'reigncraft-debug/1.0',
    },
  }
);
const modsJ = await mods.json();
const names = (modsJ.data?.children || []).map((c) => c.name);
log('mods count', names.length, names);

writeFileSync(
  new URL('./debug-sub-out.txt', import.meta.url),
  lines.join('\n')
);
