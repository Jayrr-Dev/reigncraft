import { getAccessTokenAndLoginIfNeeded } from '../node_modules/@devvit/cli/dist/util/auth.js';
import {
  createAppClient,
  createInstallationsClient,
} from '../node_modules/@devvit/cli/dist/util/clientGenerators.js';
import { getVersionByNumber } from '../node_modules/@devvit/cli/dist/util/common-actions/getVersionByNumber.js';
import { getAppBySlug } from '../node_modules/@devvit/cli/dist/util/getAppBySlug.js';
import { InstallationType } from '../node_modules/@devvit/protos/json/devvit/dev_portal/app_version/info/app_version_info.js';

const token = await getAccessTokenAndLoginIfNeeded('LocalSocket');
const appInfo = await getAppBySlug(createAppClient(), { slug: 'reigncraft' });
console.log('appAccount', appInfo.app.appAccount);

const headers = {
  Authorization: 'Bearer ' + token.accessToken,
  'User-Agent': 'reigncraft-debug/1.0',
};

// Full user about for reigncraft
const u = await fetch('https://oauth.reddit.com/user/reigncraft/about', {
  headers,
});
console.log(
  'reigncraft about',
  JSON.stringify(await u.json(), null, 2).slice(0, 800)
);

// Invite reigncraft as mod on reigncraft_dev
const form = new URLSearchParams({
  api_type: 'json',
  name: 'reigncraft',
  type: 'moderator_invite',
  permissions: '+all',
});
const invite = await fetch(
  'https://oauth.reddit.com/r/reigncraft_dev/api/friend',
  {
    method: 'POST',
    headers: {
      ...headers,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: form.toString(),
  }
);
console.log('invite status', invite.status, await invite.text());

// Try AcceptInvite via gateway if we can find client
const latest = getVersionByNumber('latest', appInfo.versions);
const installations = createInstallationsClient();
try {
  const res = await installations.Create({
    appVersionId: latest.id,
    runAs: 't2_sowch',
    type: InstallationType.SUBREDDIT,
    location: 'reigncraft_dev',
    upgradeStrategy: 0,
  });
  console.log('install OK', res?.installation?.id);
} catch (err) {
  console.log('install FAIL', err?.code, err?.msg || err?.message);
}
