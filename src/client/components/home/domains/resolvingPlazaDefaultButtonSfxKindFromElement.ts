import {
  DEFINING_PLAZA_BUTTON_SFX_DATA_ATTRIBUTE,
  DEFINING_PLAZA_BUTTON_SFX_KIND,
  type DefiningPlazaButtonSfxKind,
} from '@/components/home/domains/definingPlazaDefaultButtonSfxConstants';

const DEFINING_PLAZA_BUTTON_SFX_KIND_VALUES = new Set<string>(
  Object.values(DEFINING_PLAZA_BUTTON_SFX_KIND)
);

function checkingPlazaButtonSfxKind(
  rawKind: string | null
): DefiningPlazaButtonSfxKind {
  if (!rawKind || !DEFINING_PLAZA_BUTTON_SFX_KIND_VALUES.has(rawKind)) {
    return 'default';
  }

  return rawKind as Exclude<DefiningPlazaButtonSfxKind, 'default'>;
}

/**
 * Resolves the nearest button's press sound from a click target.
 */
export function resolvingPlazaDefaultButtonSfxKindFromElement(
  target: Element
): { button: HTMLButtonElement; kind: DefiningPlazaButtonSfxKind } | null {
  const button = target.closest('button');
  if (!(button instanceof HTMLButtonElement) || button.disabled) {
    return null;
  }

  const owningElement =
    button.closest(`[${DEFINING_PLAZA_BUTTON_SFX_DATA_ATTRIBUTE}]`) ?? button;

  const kind = checkingPlazaButtonSfxKind(
    owningElement.getAttribute(DEFINING_PLAZA_BUTTON_SFX_DATA_ATTRIBUTE)
  );

  return { button, kind };
}
