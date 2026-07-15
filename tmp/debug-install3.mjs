import { getAccessTokenAndLoginIfNeeded } from '../node_modules/@devvit/cli/dist/util/auth.js';
import {
  createAppClient,
  createInstallationsClient,
} from '../node_modules/@devvit/cli/dist/util/clientGenerators.js';
import { getVersionByNumber } from '../node_modules/@devvit/cli/dist/util/common-actions/getVersionByNumber.js';
import { getAppBySlug } from '../node_modules/@devvit/cli/dist/util/getAppBySlug.js';
import { InstallationType } from '../node_modules/@devvit/protos/json/devvit/dev_portal/app_version/info/app_version_info.js';

const token = await getAccessTokenAndLoginIfNeeded('LocalSocket');
const installations = createInstallationsClient();
const appInfo = await getAppBySlug(createAppClient(), { slug: 'reigncraft' });
const latest = getVersionByNumber('latest', appInfo.versions);
const play = getVersionByNumber('playtest', appInfo.versions);
const runAs = 't2_sowch';

const attempts = [
  {
    label: 'latest by name',
    appVersionId: latest.id,
    location: 'reigncraft_dev',
  },
  {
    label: 'playtest by name',
    appVersionId: play.id,
    location: 'reigncraft_dev',
  },
  { label: 'latest by t5 id', appVersionId: latest.id, location: 't5_isfi97' },
  { label: 'playtest by t5 id', appVersionId: play.id, location: 't5_isfi97' },
];

for (const a of attempts) {
  try {
    const res = await installations.Create({
      appVersionId: a.appVersionId,
      runAs,
      type: InstallationType.SUBREDDIT,
      location: a.location,
      upgradeStrategy: 0,
    });
    console.log('OK', a.label, res?.installation?.id);
    break;
  } catch (err) {
    console.log('FAIL', a.label, err?.code, err?.msg || err?.message);
  }
}
