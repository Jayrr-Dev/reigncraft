/**
 * HUD toast after a Study channel finishes.
 *
 * @module components/home/domains/formattingPlazaStudyCompleteToastMessage
 */

export type FormattingPlazaStudyCompleteToastMessageParams = {
  readonly subjectDisplayName: string;
  readonly codexLabel: string;
  readonly progressLabel: string;
};

/** `Studied Yarrow · Herbarium 2/100` */
export function formattingPlazaStudyCompleteToastMessage({
  subjectDisplayName,
  codexLabel,
  progressLabel,
}: FormattingPlazaStudyCompleteToastMessageParams): string {
  return `Studied ${subjectDisplayName} · ${codexLabel} ${progressLabel}`;
}
