import { writeFileSync } from 'node:fs';
import { getAccessTokenAndLoginIfNeeded } from '../node_modules/@devvit/cli/dist/util/auth.js';
import {
  createAppClient,
  createInstallationsClient,
} from '../node_modules/@devvit/cli/dist/util/clientGenerators.js';
import { getAppBySlug } from '../node_modules/@devvit/cli/dist/util/getAppBySlug.js';
import { InstallationType } from '../node_modules/@devvit/protos/json/devvit/dev_portal/app_version/info/app_version_info.js';

const token = await getAccessTokenAndLoginIfNeeded('LocalSocket');
const installations = createInstallationsClient();
const appInfo = await getAppBySlug(createAppClient(), { slug: 'reigncraft' });
console.log('app', {
  id: appInfo.app?.id,
  slug: appInfo.app?.slug,
  defaultPlaytestSubredditId: appInfo.app?.defaultPlaytestSubredditId,
  // dump more keys
  keys: Object.keys(appInfo.app || {}),
});
writeFileSync('tmp/app-info.json', JSON.stringify(appInfo.app, null, 2));

const prod = await installations.GetAllWithInstallLocation({
  location: 'Reigncraft',
  type: InstallationType.SUBREDDIT,
});
const details = [];
for (const inst of prod.installations) {
  const full = await installations.GetByUUID({ id: inst.id });
  details.push({
    id: inst.id,
    appSlug: full.app?.slug,
    appName: full.app?.name,
    appAccount: full.app?.account || full.installation?.runAs,
    version: full.appVersion
      ? `${full.appVersion.majorVersion}.${full.appVersion.minorVersion}.${full.appVersion.patchVersion}${full.appVersion.prereleaseVersion ? '.' + full.appVersion.prereleaseVersion : ''}`
      : null,
    runAs: inst.runAs,
    location: inst.location,
    appInstallState: inst.appInstallState,
    fullKeys: Object.keys(full),
    appKeys: full.app ? Object.keys(full.app) : [],
  });
}
writeFileSync('tmp/prod-installs.json', JSON.stringify(details, null, 2));
console.log('prod installs', JSON.stringify(details, null, 2));

const headers = {
  Authorization: 'Bearer ' + token.accessToken,
  'User-Agent': 'reigncraft-debug/1.0',
};

for (const user of ['reigncraft', 'devvit-dev-bot']) {
  const r = await fetch('https://oauth.reddit.com/user/' + user + '/about', {
    headers,
  });
  const j = await r.json();
  console.log(
    'user',
    user,
    r.status,
    j?.data?.name,
    j?.data?.id,
    j?.data?.is_employee,
    j?.data?.subreddit?.display_name
  );
}

// Check if reigncraft is already a mod on Reigncraft
const prodMods = await fetch(
  'https://oauth.reddit.com/r/Reigncraft/about/moderators',
  { headers }
);
const prodModsJ = await prodMods.json();
console.log(
  'Reigncraft mods',
  (prodModsJ.data?.children || []).map((c) => c.name)
);

const devMods = await fetch(
  'https://oauth.reddit.com/r/reigncraft_dev/about/moderators',
  { headers }
);
const devModsJ = await devMods.json();
console.log(
  'reigncraft_dev mods',
  (devModsJ.data?.children || []).map((c) => ({
    name: c.name,
    id: c.id,
    mod_permissions: c.mod_permissions,
  }))
);
