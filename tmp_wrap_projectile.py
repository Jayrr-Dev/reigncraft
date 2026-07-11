from pathlib import Path

p = Path("src/client/world/projectile/domains/computingWorldPlazaProjectileStep.ts")
text = p.read_text(encoding="utf-8")

import_line = "import type { DefiningWorldCollisionContext } from '@/components/world/collision/domains/definingWorldCollisionContext';"
new_import = """import type { DefiningWorldCollisionContext } from '@/components/world/collision/domains/definingWorldCollisionContext';
import {
  formattingWorldPlazaClientCapturedError,
  loggingWorldPlazaClientError,
} from '@/components/world/domains/loggingWorldPlazaClientErrors';"""

if import_line not in text:
    raise SystemExit("import not found")
text = text.replace(import_line, new_import, 1)

needle_start = "  for (const instance of instances) {\n    const archetype = resolvingWorldPlazaProjectileArchetype("
if needle_start not in text:
    raise SystemExit("start not found")
text = text.replace(
    needle_start,
    "  for (const instance of instances) {\n    try {\n    const archetype = resolvingWorldPlazaProjectileArchetype(",
    1,
)

needle_end = """    nextInstances.push(working);
  }

  return {
    instances: nextInstances,"""

replacement_end = """    nextInstances.push(working);
    } catch (error) {
      loggingWorldPlazaClientError(
        `[projectile:sim:${instance.projectileId}] ${formattingWorldPlazaClientCapturedError(error)}`
      );
    }
  }

  return {
    instances: nextInstances,"""

if needle_end not in text:
    raise SystemExit("end not found")
text = text.replace(needle_end, replacement_end, 1)

# Wrap target loops with try/catch per target
text = text.replace(
    """        for (const target of targets) {
          if (
            archetype.impact.aoeRadiusGrid !== undefined &&
            checkingWorldPlazaProjectileAoeIncludesTarget(
              working.position,
              archetype.impact.aoeRadiusGrid,
              target
            ) &&
            !checkingWorldPlazaProjectileAlreadyHitTarget(
              working,
              target.targetId
            )
          ) {
            hitEvents.push({
              projectileId: working.projectileId,
              archetypeId: working.archetypeId,
              targetId: target.targetId,
              position: working.position,
            });
            working = updatingWorldPlazaProjectileInstanceFields(working, {
              hitTargetIds: [...working.hitTargetIds, target.targetId],
            });
          }
        }""",
    """        for (const target of targets) {
          try {
          if (
            archetype.impact.aoeRadiusGrid !== undefined &&
            checkingWorldPlazaProjectileAoeIncludesTarget(
              working.position,
              archetype.impact.aoeRadiusGrid,
              target
            ) &&
            !checkingWorldPlazaProjectileAlreadyHitTarget(
              working,
              target.targetId
            )
          ) {
            hitEvents.push({
              projectileId: working.projectileId,
              archetypeId: working.archetypeId,
              targetId: target.targetId,
              position: working.position,
            });
            working = updatingWorldPlazaProjectileInstanceFields(working, {
              hitTargetIds: [...working.hitTargetIds, target.targetId],
            });
          }
          } catch (error) {
            loggingWorldPlazaClientError(
              `[projectile:aoe-hit:${working.projectileId}:${target.targetId}] ${formattingWorldPlazaClientCapturedError(error)}`
            );
          }
        }""",
    1,
)

# single-target loop - wrap carefully
old_single = """    if (archetype.impact.behaviorId === 'singleTarget') {
      for (const target of targets) {
        if (
          checkingWorldPlazaProjectileAlreadyHitTarget(working, target.targetId)
        ) {
          continue;
        }

        if (
          resolvingWorldPlazaProjectileHit({
            instance: working,
            archetype,
            target,
          })
        ) {
          hitEvents.push({
            projectileId: working.projectileId,
            archetypeId: working.archetypeId,
            targetId: target.targetId,
            position: working.position,
          });
          working = updatingWorldPlazaProjectileInstanceFields(working, {
            hitTargetIds: [...working.hitTargetIds, target.targetId],
            hasImpacted: true,
          });
        } else if (
          resolvingWorldPlazaProjectileMissReason({
            instance: working,
            archetype,
            target,
          }) === 'jump_dodge' &&
          !working.missFeedbackTargetIds.includes(target.targetId)
        ) {
          missEvents.push({
            projectileId: working.projectileId,
            archetypeId: working.archetypeId,
            targetId: target.targetId,
            position: working.position,
            reason: 'jump_dodge',
          });
          working = updatingWorldPlazaProjectileInstanceFields(working, {
            missFeedbackTargetIds: [
              ...working.missFeedbackTargetIds,
              target.targetId,
            ],
          });
        }
      }"""

new_single = """    if (archetype.impact.behaviorId === 'singleTarget') {
      for (const target of targets) {
        try {
        if (
          checkingWorldPlazaProjectileAlreadyHitTarget(working, target.targetId)
        ) {
          continue;
        }

        if (
          resolvingWorldPlazaProjectileHit({
            instance: working,
            archetype,
            target,
          })
        ) {
          hitEvents.push({
            projectileId: working.projectileId,
            archetypeId: working.archetypeId,
            targetId: target.targetId,
            position: working.position,
          });
          working = updatingWorldPlazaProjectileInstanceFields(working, {
            hitTargetIds: [...working.hitTargetIds, target.targetId],
            hasImpacted: true,
          });
        } else if (
          resolvingWorldPlazaProjectileMissReason({
            instance: working,
            archetype,
            target,
          }) === 'jump_dodge' &&
          !working.missFeedbackTargetIds.includes(target.targetId)
        ) {
          missEvents.push({
            projectileId: working.projectileId,
            archetypeId: working.archetypeId,
            targetId: target.targetId,
            position: working.position,
            reason: 'jump_dodge',
          });
          working = updatingWorldPlazaProjectileInstanceFields(working, {
            missFeedbackTargetIds: [
              ...working.missFeedbackTargetIds,
              target.targetId,
            ],
          });
        }
        } catch (error) {
          loggingWorldPlazaClientError(
            `[projectile:hit:${working.projectileId}:${target.targetId}] ${formattingWorldPlazaClientCapturedError(error)}`
          );
        }
      }"""

if old_single not in text:
    raise SystemExit("single target loop not found")
text = text.replace(old_single, new_single, 1)

p.write_text(text, encoding="utf-8")
print("projectile step wrapped")
