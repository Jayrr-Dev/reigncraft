import { writeFileSync } from 'node:fs';
import { getAccessTokenAndLoginIfNeeded } from '../node_modules/@devvit/cli/dist/util/auth.js';
import {
  createAppClient,
  createInstallationsClient,
} from '../node_modules/@devvit/cli/dist/util/clientGenerators.js';
import { getVersionByNumber } from '../node_modules/@devvit/cli/dist/util/common-actions/getVersionByNumber.js';
import { getAppBySlug } from '../node_modules/@devvit/cli/dist/util/getAppBySlug.js';
import { InstallationType } from '../node_modules/@devvit/protos/json/devvit/dev_portal/app_version/info/app_version_info.js';

const log = (...a) => console.log(...a);

const token = await getAccessTokenAndLoginIfNeeded('LocalSocket');
const appClient = createAppClient();
const installations = createInstallationsClient();
const appInfo = await getAppBySlug(appClient, { slug: 'reigncraft' });

// Resolve @latest like CLI
const latest = await getVersionByNumber('latest', appInfo.versions);
log(
  'resolved latest',
  latest?.version,
  latest?.major,
  latest?.minor,
  latest?.patch,
  latest?.prerelease,
  latest?.id,
  'visibility',
  latest?.visibility
);

// Sample a few version shapes
for (const v of appInfo.versions.slice(0, 3)) {
  log('v sample keys', Object.keys(v));
  log('v sample', {
    id: v.id,
    major: v.major,
    minor: v.minor,
    patch: v.patch,
    prerelease: v.prerelease,
    visibility: v.visibility,
    version: v.version,
  });
}

// Get t2 the Reddit way via oauth
const meRes = await fetch('https://oauth.reddit.com/api/v1/me', {
  headers: {
    Authorization: `Bearer ${token.accessToken}`,
    'User-Agent': 'reigncraft-debug/1.0',
  },
});
const meText = await meRes.text();
log('me status', meRes.status, meText.slice(0, 300));

let runAs = null;
try {
  const me = JSON.parse(meText);
  runAs = me.id?.startsWith('t2_') ? me.id : me.id ? `t2_${me.id}` : null;
  log('runAs', runAs, 'name', me.name);
} catch {}

// Also try Devvit portal whoami endpoint if any
if (!runAs || runAs.includes('undefined')) {
  // JWT sub was like a UUID maybe - check
  const payload = JSON.parse(
    Buffer.from(token.accessToken.split('.')[1], 'base64url').toString()
  );
  log('jwt sub', payload.sub);
}

if (!runAs) {
  // from existing installs list for this user
  runAs = 't2_sowch'; // seen on existing install in this sub - might be wrong user
  log('fallback runAs guess t2_sowch');
}

try {
  const res = await installations.Create({
    appVersionId: latest.id,
    runAs,
    type: InstallationType.SUBREDDIT,
    location: 'reigncraft_dev',
    upgradeStrategy: 0,
  });
  log('SUCCESS', res?.installation?.id, res?.appVersion);
  writeFileSync(
    new URL('./debug-install2-ok.json', import.meta.url),
    JSON.stringify(res, null, 2)
  );
} catch (err) {
  log('FAIL', err?.code, err?.msg || err?.message);
  writeFileSync(
    new URL('./debug-install2-err.json', import.meta.url),
    JSON.stringify(err, Object.getOwnPropertyNames(err), 2)
  );
}
