import {
  LABELING_PLAZA_HERBARIUM_BERRY_STUDY_TIER_SECTION_TITLES,
  LABELING_PLAZA_HERBARIUM_BERRY_STUDY_TIER_TEASERS,
  type PlazaHerbariumBerryStudyTierId,
} from '@/components/home/domains/definingPlazaHerbariumBerryStudyTier';
import {
  LABELING_PLAZA_HERBARIUM_CLOVER_STUDY_TIER_SECTION_TITLES,
  LABELING_PLAZA_HERBARIUM_CLOVER_STUDY_TIER_TEASERS,
  type PlazaHerbariumCloverStudyTierId,
} from '@/components/home/domains/definingPlazaHerbariumCloverStudyTier';
import {
  LABELING_PLAZA_HERBARIUM_FLOWER_STUDY_TIER_SECTION_TITLES,
  LABELING_PLAZA_HERBARIUM_FLOWER_STUDY_TIER_TEASERS,
  type PlazaHerbariumFlowerStudyTierId,
} from '@/components/home/domains/definingPlazaHerbariumFlowerStudyTier';
import {
  LABELING_PLAZA_HERBARIUM_STUDY_TIER_SECTION_TITLES,
  LABELING_PLAZA_HERBARIUM_STUDY_TIER_TEASERS,
  type PlazaHerbariumStudyTierId,
} from '@/components/home/domains/definingPlazaHerbariumStudyTier';
import {
  checkingPlazaHerbariumCloverStudyTierUnlocked,
  formattingPlazaHerbariumCloverStudyCountProgress,
  formattingPlazaHerbariumCloverStudyProgressLabel,
  resolvingPlazaHerbariumCloverStudyTierBookIcon,
} from '@/components/home/domains/resolvingPlazaHerbariumCloverStudyTier';
import {
  checkingPlazaHerbariumFlowerStudyTierUnlocked,
  formattingPlazaHerbariumFlowerStudyCountProgress,
  formattingPlazaHerbariumFlowerStudyProgressLabel,
  resolvingPlazaHerbariumFlowerStudyTierBookIcon,
} from '@/components/home/domains/resolvingPlazaHerbariumFlowerStudyTier';
import type { PlazaHerbariumGuideDisplayEntry } from '@/components/home/domains/resolvingPlazaHerbariumGuideDisplayEntries';
import {
  checkingPlazaHerbariumBerryStudyTierUnlocked,
  formattingPlazaHerbariumBerryStudyCountProgress,
  formattingPlazaHerbariumBerryStudyProgressLabel,
  resolvingPlazaHerbariumBerryStudyTierBookIcon,
} from '@/components/home/domains/resolvingPlazaHerbariumBerryStudyTier';
import {
  checkingPlazaHerbariumStudyTierUnlocked,
  formattingPlazaHerbariumStudyCountProgress,
  formattingPlazaHerbariumStudyProgressLabel,
  resolvingPlazaHerbariumStudyTierBookIcon,
} from '@/components/home/domains/resolvingPlazaHerbariumStudyTier';

type HerbariumDetailTierId =
  | Exclude<PlazaHerbariumFlowerStudyTierId, 'sighted'>
  | Exclude<PlazaHerbariumStudyTierId, 'sighted'>
  | Exclude<PlazaHerbariumCloverStudyTierId, 'sighted'>
  | Exclude<PlazaHerbariumBerryStudyTierId, 'sighted'>;

export function formattingPlazaHerbariumEntryStudyCountProgress(
  entry: PlazaHerbariumGuideDisplayEntry
): string {
  switch (entry.kind) {
    case 'flower':
      return formattingPlazaHerbariumFlowerStudyCountProgress(entry.studyCount);
    case 'clover':
      return formattingPlazaHerbariumCloverStudyCountProgress(entry.studyCount);
    case 'berry':
      return formattingPlazaHerbariumBerryStudyCountProgress(entry.studyCount);
    case 'tree':
      return formattingPlazaHerbariumStudyCountProgress(entry.studyCount);
  }
}

export function resolvingPlazaHerbariumEntryStudyTierBookIcon(
  entry: PlazaHerbariumGuideDisplayEntry
): string {
  switch (entry.kind) {
    case 'flower':
      return resolvingPlazaHerbariumFlowerStudyTierBookIcon(entry.studyCount);
    case 'clover':
      return resolvingPlazaHerbariumCloverStudyTierBookIcon(entry.studyCount);
    case 'berry':
      return resolvingPlazaHerbariumBerryStudyTierBookIcon(entry.studyCount);
    case 'tree':
      return resolvingPlazaHerbariumStudyTierBookIcon(entry.studyCount);
  }
}

export function formattingPlazaHerbariumEntryStudyProgressLabel(
  entry: PlazaHerbariumGuideDisplayEntry
): string {
  switch (entry.kind) {
    case 'flower':
      return formattingPlazaHerbariumFlowerStudyProgressLabel(entry.studyCount);
    case 'clover':
      return formattingPlazaHerbariumCloverStudyProgressLabel(entry.studyCount);
    case 'berry':
      return formattingPlazaHerbariumBerryStudyProgressLabel(entry.studyCount);
    case 'tree':
      return formattingPlazaHerbariumStudyProgressLabel(entry.studyCount);
  }
}

export function labelingPlazaHerbariumEntryStudyTierSectionTitle(
  entry: PlazaHerbariumGuideDisplayEntry,
  tierId: HerbariumDetailTierId
): string {
  switch (entry.kind) {
    case 'flower':
      return LABELING_PLAZA_HERBARIUM_FLOWER_STUDY_TIER_SECTION_TITLES[
        tierId as Exclude<PlazaHerbariumFlowerStudyTierId, 'sighted'>
      ];
    case 'clover':
      return LABELING_PLAZA_HERBARIUM_CLOVER_STUDY_TIER_SECTION_TITLES[
        tierId as Exclude<PlazaHerbariumCloverStudyTierId, 'sighted'>
      ];
    case 'berry':
      return LABELING_PLAZA_HERBARIUM_BERRY_STUDY_TIER_SECTION_TITLES[
        tierId as Exclude<PlazaHerbariumBerryStudyTierId, 'sighted'>
      ];
    case 'tree':
      return LABELING_PLAZA_HERBARIUM_STUDY_TIER_SECTION_TITLES[
        tierId as Exclude<PlazaHerbariumStudyTierId, 'sighted'>
      ];
  }
}

export function labelingPlazaHerbariumEntryStudyTierTeaser(
  entry: PlazaHerbariumGuideDisplayEntry,
  tierId: HerbariumDetailTierId
): string {
  switch (entry.kind) {
    case 'flower':
      return LABELING_PLAZA_HERBARIUM_FLOWER_STUDY_TIER_TEASERS[
        tierId as Exclude<PlazaHerbariumFlowerStudyTierId, 'sighted'>
      ];
    case 'clover':
      return LABELING_PLAZA_HERBARIUM_CLOVER_STUDY_TIER_TEASERS[
        tierId as Exclude<PlazaHerbariumCloverStudyTierId, 'sighted'>
      ];
    case 'berry':
      return LABELING_PLAZA_HERBARIUM_BERRY_STUDY_TIER_TEASERS[
        tierId as Exclude<PlazaHerbariumBerryStudyTierId, 'sighted'>
      ];
    case 'tree':
      return LABELING_PLAZA_HERBARIUM_STUDY_TIER_TEASERS[
        tierId as Exclude<PlazaHerbariumStudyTierId, 'sighted'>
      ];
  }
}

export function checkingPlazaHerbariumEntryStudyTierUnlocked(
  entry: PlazaHerbariumGuideDisplayEntry,
  tierId: HerbariumDetailTierId | 'sighted'
): boolean {
  switch (entry.kind) {
    case 'flower':
      return checkingPlazaHerbariumFlowerStudyTierUnlocked(
        tierId as PlazaHerbariumFlowerStudyTierId,
        entry.studyCount
      );
    case 'clover':
      return checkingPlazaHerbariumCloverStudyTierUnlocked(
        tierId as PlazaHerbariumCloverStudyTierId,
        entry.studyCount
      );
    case 'berry':
      return checkingPlazaHerbariumBerryStudyTierUnlocked(
        tierId as PlazaHerbariumBerryStudyTierId,
        entry.studyCount
      );
    case 'tree':
      return checkingPlazaHerbariumStudyTierUnlocked(
        tierId as PlazaHerbariumStudyTierId,
        entry.studyCount
      );
  }
}
