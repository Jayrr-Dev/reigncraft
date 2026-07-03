import { Hono } from 'hono';
import { serve } from '@hono/node-server';
import { createServer, getServerPort } from '@devvit/web/server';
import { api } from './routes/api';
import { forms } from './routes/forms';
import { menu } from './routes/menu';
import { plazaOnline } from './routes/plazaOnline';
import { triggers } from './routes/triggers';
import { worldBuilding } from './routes/worldBuilding';
import { worldInventory } from './routes/worldInventory';

const app = new Hono();
const internal = new Hono();

internal.route('/menu', menu);
internal.route('/form', forms);
internal.route('/triggers', triggers);

app.route('/api', api);
app.route('/api/plaza', plazaOnline);
app.route('/api/world-building', worldBuilding);
app.route('/api/world-inventory', worldInventory);
app.route('/internal', internal);

serve({
  fetch: app.fetch,
  createServer,
  port: getServerPort(),
});
