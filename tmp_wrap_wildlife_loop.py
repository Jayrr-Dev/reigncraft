from pathlib import Path

p = Path("src/client/world/wildlife/domains/advancingWildlifeSimulationTick.ts")
text = p.read_text(encoding="utf-8")

needle_start = "  for (const staleInstance of instances) {\n    // Earlier iterations"
if needle_start not in text:
    raise SystemExit("start not found")

text = text.replace(
    needle_start,
    "  for (const staleInstance of instances) {\n    try {\n    // Earlier iterations",
    1,
)

needle_end = """    updatedById.set(nextInstance.instanceId, nextInstance);
  }

  for (const [instanceId, instance] of updatedById) {"""

replacement_end = """    updatedById.set(nextInstance.instanceId, nextInstance);
    } catch (error) {
      loggingWorldPlazaClientError(
        `[wildlife:sim:${staleInstance.instanceId}] ${formattingWorldPlazaClientCapturedError(error)}`
      );
    }
  }

  for (const [instanceId, instance] of updatedById) {"""

if needle_end not in text:
    raise SystemExit("end not found")

text = text.replace(needle_end, replacement_end, 1)

import_line = "import { checkingWorldPlazaDevQaLoadEnabled } from '@/components/world/domains/managingWorldPlazaDevQaLoadStore';"
new_import = """import {
  formattingWorldPlazaClientCapturedError,
  loggingWorldPlazaClientError,
} from '@/components/world/domains/loggingWorldPlazaClientErrors';
import { checkingWorldPlazaDevQaLoadEnabled } from '@/components/world/domains/managingWorldPlazaDevQaLoadStore';"""

if import_line not in text:
    raise SystemExit("import not found")

text = text.replace(import_line, new_import, 1)
p.write_text(text, encoding="utf-8")
print("wildlife sim loop wrapped")
