"use client";

import {
  DEFINING_WORLD_BUILDING_CUT_ACTION_BUTTON_CLASS_NAME,
  DEFINING_WORLD_BUILDING_CUT_CELL_BUTTON_CLASS_NAME,
  DEFINING_WORLD_BUILDING_CUT_CELL_BUTTON_SELECTED_CLASS_NAME,
  DEFINING_WORLD_BUILDING_CUT_GRID_CLASS_NAMES_BY_AXIS_CELL_COUNT,
  DEFINING_WORLD_BUILDING_CUT_GRID_PAINTER_INTERACTION_CLASS_NAME,
  DEFINING_WORLD_BUILDING_CUT_GRID_TYPE_BADGE_GRID_CLASS_NAME,
  DEFINING_WORLD_BUILDING_CUT_GRID_TYPE_BADGE_CELL_CLASS_NAME,
  DEFINING_WORLD_BUILDING_CUT_GRID_TYPE_BADGE_BUTTON_CLASS_NAME,
  DEFINING_WORLD_BUILDING_CUT_GRID_TYPE_BADGE_BUTTON_SELECTED_CLASS_NAME,
  DEFINING_WORLD_BUILDING_SECTION_LABEL_CLASS_NAME,
} from "@/components/world/building/domains/definingWorldBuildingBuildModeConstants";
import {
  DEFINING_WORLD_BUILDING_CUT_FOOTPRINT_EMPTY_MASK,
  DEFINING_WORLD_BUILDING_CUT_GRID_AXIS_CELL_COUNTS,
  applyingWorldBuildingCutFootprintCellState,
  checkingWorldBuildingCutFootprintCellSet,
  checkingWorldBuildingCutFootprintIsEmpty,
  checkingWorldBuildingCutFootprintIsFull,
  resolvingWorldBuildingCutFootprintFullMask,
  type DefiningWorldBuildingCutGridAxisCellCount,
} from "@/components/world/building/domains/definingWorldBuildingCutFootprintConstants";
import { DEFINING_WORLD_PLAZA_UI_DATA_ATTRIBUTE } from "@/components/world/domains/definingWorldPlazaClickMovementConstants";
import { useCallback, useEffect, useMemo, useRef } from "react";

/** Accessible label for filling every cut sub-cell. */
const RENDERING_WORLD_PLAZA_BUILD_MODE_CUT_FULL_LABEL = "Fill all cut cells";

/** Accessible label for clearing every cut sub-cell. */
const RENDERING_WORLD_PLAZA_BUILD_MODE_CUT_CLEAR_LABEL = "Clear all cut cells";

/** Data attribute marking a cut painter cell for drag hit-testing. */
const RENDERING_WORLD_PLAZA_BUILD_MODE_CUT_CELL_DATA_ATTRIBUTE =
  "data-cut-cell" as const;

/** Data attribute storing a cut painter cell column index. */
const RENDERING_WORLD_PLAZA_BUILD_MODE_CUT_CELL_COL_DATA_ATTRIBUTE =
  "data-cut-col" as const;

/** Data attribute storing a cut painter cell row index. */
const RENDERING_WORLD_PLAZA_BUILD_MODE_CUT_CELL_ROW_DATA_ATTRIBUTE =
  "data-cut-row" as const;

export interface RenderingWorldPlazaBuildModeCutFootprintSelectorProps {
  selectedCutGridAxisCellCount: DefiningWorldBuildingCutGridAxisCellCount;
  selectedCutFootprintMask: number;
  onChangeCutGridAxisCellCount: (
    axisCellCount: DefiningWorldBuildingCutGridAxisCellCount,
  ) => void;
  onChangeCutFootprintMask: (cutFootprintMask: number) => void;
}

/**
 * Cut grid that designs which sub-cells of a tile the next block fills.
 */
export function RenderingWorldPlazaBuildModeCutFootprintSelector({
  selectedCutGridAxisCellCount,
  selectedCutFootprintMask,
  onChangeCutGridAxisCellCount,
  onChangeCutFootprintMask,
}: RenderingWorldPlazaBuildModeCutFootprintSelectorProps): React.JSX.Element {
  const isCutCellPaintingActiveRef = useRef(false);
  const cutCellPaintingShouldSetRef = useRef(true);
  const paintingCutFootprintMaskRef = useRef(selectedCutFootprintMask);

  paintingCutFootprintMaskRef.current = selectedCutFootprintMask;

  const cutAxisIndices = useMemo(
    () =>
      Array.from(
        { length: selectedCutGridAxisCellCount },
        (_unused, index) => index,
      ),
    [selectedCutGridAxisCellCount],
  );

  const isFull = checkingWorldBuildingCutFootprintIsFull(
    selectedCutFootprintMask,
    selectedCutGridAxisCellCount,
  );
  const isEmpty = checkingWorldBuildingCutFootprintIsEmpty(
    selectedCutFootprintMask,
  );

  const endingCutCellPaint = useCallback((): void => {
    isCutCellPaintingActiveRef.current = false;
  }, []);

  useEffect(() => {
    const handlingWindowPointerRelease = (): void => {
      endingCutCellPaint();
    };

    window.addEventListener("pointerup", handlingWindowPointerRelease);
    window.addEventListener("pointercancel", handlingWindowPointerRelease);

    return () => {
      window.removeEventListener("pointerup", handlingWindowPointerRelease);
      window.removeEventListener("pointercancel", handlingWindowPointerRelease);
    };
  }, [endingCutCellPaint]);

  const applyingCutCellPaint = useCallback(
    (col: number, row: number, shouldSetCell: boolean): void => {
      const nextMask = applyingWorldBuildingCutFootprintCellState(
        paintingCutFootprintMaskRef.current,
        col,
        row,
        shouldSetCell,
        selectedCutGridAxisCellCount,
      );

      if (nextMask === paintingCutFootprintMaskRef.current) {
        return;
      }

      paintingCutFootprintMaskRef.current = nextMask;
      onChangeCutFootprintMask(nextMask);
    },
    [onChangeCutFootprintMask, selectedCutGridAxisCellCount],
  );

  const beginningCutCellPaint = useCallback(
    (col: number, row: number): void => {
      const isCellSet = checkingWorldBuildingCutFootprintCellSet(
        paintingCutFootprintMaskRef.current,
        col,
        row,
        selectedCutGridAxisCellCount,
      );
      const shouldSetCell = !isCellSet;

      isCutCellPaintingActiveRef.current = true;
      cutCellPaintingShouldSetRef.current = shouldSetCell;
      applyingCutCellPaint(col, row, shouldSetCell);
    },
    [applyingCutCellPaint, selectedCutGridAxisCellCount],
  );

  const continuingCutCellPaint = useCallback(
    (col: number, row: number): void => {
      if (!isCutCellPaintingActiveRef.current) {
        return;
      }

      applyingCutCellPaint(col, row, cutCellPaintingShouldSetRef.current);
    },
    [applyingCutCellPaint],
  );

  const resolvingCutCellFromPointerTarget = useCallback(
    (pointerTarget: EventTarget | null): { col: number; row: number } | null => {
      if (!(pointerTarget instanceof Element)) {
        return null;
      }

      const cutCellElement = pointerTarget.closest(
        `[${RENDERING_WORLD_PLAZA_BUILD_MODE_CUT_CELL_DATA_ATTRIBUTE}]`,
      );

      if (!(cutCellElement instanceof HTMLElement)) {
        return null;
      }

      const col = Number(
        cutCellElement.getAttribute(
          RENDERING_WORLD_PLAZA_BUILD_MODE_CUT_CELL_COL_DATA_ATTRIBUTE,
        ),
      );
      const row = Number(
        cutCellElement.getAttribute(
          RENDERING_WORLD_PLAZA_BUILD_MODE_CUT_CELL_ROW_DATA_ATTRIBUTE,
        ),
      );

      if (!Number.isInteger(col) || !Number.isInteger(row)) {
        return null;
      }

      return { col, row };
    },
    [],
  );

  const handlingCutGridPointerMove = useCallback(
    (pointerEvent: React.PointerEvent<HTMLDivElement>): void => {
      if (!isCutCellPaintingActiveRef.current) {
        return;
      }

      const cutCell = resolvingCutCellFromPointerTarget(
        document.elementFromPoint(pointerEvent.clientX, pointerEvent.clientY),
      );

      if (!cutCell) {
        return;
      }

      continuingCutCellPaint(cutCell.col, cutCell.row);
    },
    [continuingCutCellPaint, resolvingCutCellFromPointerTarget],
  );

  const fillingAllCutCells = useCallback((): void => {
    onChangeCutFootprintMask(
      resolvingWorldBuildingCutFootprintFullMask(selectedCutGridAxisCellCount),
    );
  }, [onChangeCutFootprintMask, selectedCutGridAxisCellCount]);

  const clearingAllCutCells = useCallback((): void => {
    onChangeCutFootprintMask(DEFINING_WORLD_BUILDING_CUT_FOOTPRINT_EMPTY_MASK);
  }, [onChangeCutFootprintMask]);

  return (
    <div className="flex flex-col gap-0.5">
      <div className="flex items-start gap-0.5">
        <p
          className={`${DEFINING_WORLD_BUILDING_SECTION_LABEL_CLASS_NAME} shrink-0 pt-0.5`}
        >
          Cut
        </p>
        <div
          className={DEFINING_WORLD_BUILDING_CUT_GRID_TYPE_BADGE_GRID_CLASS_NAME}
        >
          {DEFINING_WORLD_BUILDING_CUT_GRID_AXIS_CELL_COUNTS.map(
            (axisCellCount) => {
              const isSelected = selectedCutGridAxisCellCount === axisCellCount;

              return (
                <div
                  key={`cut-grid-type-${axisCellCount}`}
                  className={
                    DEFINING_WORLD_BUILDING_CUT_GRID_TYPE_BADGE_CELL_CLASS_NAME
                  }
                >
                  <button
                    type="button"
                    {...{ [DEFINING_WORLD_PLAZA_UI_DATA_ATTRIBUTE]: true }}
                    aria-pressed={isSelected}
                    aria-label={`${axisCellCount} by ${axisCellCount} cut grid`}
                    onClick={() => onChangeCutGridAxisCellCount(axisCellCount)}
                    className={
                      isSelected
                        ? DEFINING_WORLD_BUILDING_CUT_GRID_TYPE_BADGE_BUTTON_SELECTED_CLASS_NAME
                        : DEFINING_WORLD_BUILDING_CUT_GRID_TYPE_BADGE_BUTTON_CLASS_NAME
                    }
                  >
                    {axisCellCount}/{axisCellCount}
                  </button>
                </div>
              );
            },
          )}
        </div>
      </div>

      <div
        className={`${DEFINING_WORLD_BUILDING_CUT_GRID_PAINTER_INTERACTION_CLASS_NAME} ${DEFINING_WORLD_BUILDING_CUT_GRID_CLASS_NAMES_BY_AXIS_CELL_COUNT[selectedCutGridAxisCellCount]}`}
        onPointerMove={handlingCutGridPointerMove}
      >
        {cutAxisIndices.map((row) =>
          cutAxisIndices.map((col) => {
            const isCellSet = checkingWorldBuildingCutFootprintCellSet(
              selectedCutFootprintMask,
              col,
              row,
              selectedCutGridAxisCellCount,
            );

            return (
              <button
                key={`cut-cell-${row}-${col}`}
                type="button"
                {...{
                  [DEFINING_WORLD_PLAZA_UI_DATA_ATTRIBUTE]: true,
                  [RENDERING_WORLD_PLAZA_BUILD_MODE_CUT_CELL_DATA_ATTRIBUTE]: true,
                  [RENDERING_WORLD_PLAZA_BUILD_MODE_CUT_CELL_COL_DATA_ATTRIBUTE]:
                    col,
                  [RENDERING_WORLD_PLAZA_BUILD_MODE_CUT_CELL_ROW_DATA_ATTRIBUTE]:
                    row,
                }}
                aria-pressed={isCellSet}
                aria-label={`Cut cell column ${col + 1} row ${row + 1}`}
                onPointerDown={(pointerEvent) => {
                  pointerEvent.preventDefault();
                  pointerEvent.currentTarget.setPointerCapture(
                    pointerEvent.pointerId,
                  );
                  beginningCutCellPaint(col, row);
                }}
                onPointerUp={(pointerEvent) => {
                  if (
                    pointerEvent.currentTarget.hasPointerCapture(
                      pointerEvent.pointerId,
                    )
                  ) {
                    pointerEvent.currentTarget.releasePointerCapture(
                      pointerEvent.pointerId,
                    );
                  }

                  endingCutCellPaint();
                }}
                onPointerEnter={() => {
                  continuingCutCellPaint(col, row);
                }}
                className={
                  isCellSet
                    ? DEFINING_WORLD_BUILDING_CUT_CELL_BUTTON_SELECTED_CLASS_NAME
                    : DEFINING_WORLD_BUILDING_CUT_CELL_BUTTON_CLASS_NAME
                }
              />
            );
          }),
        )}
      </div>

      <div className="flex gap-0.5">
        <button
          type="button"
          {...{ [DEFINING_WORLD_PLAZA_UI_DATA_ATTRIBUTE]: true }}
          aria-label={RENDERING_WORLD_PLAZA_BUILD_MODE_CUT_FULL_LABEL}
          disabled={isFull}
          onClick={fillingAllCutCells}
          className={DEFINING_WORLD_BUILDING_CUT_ACTION_BUTTON_CLASS_NAME}
        >
          Full
        </button>
        <button
          type="button"
          {...{ [DEFINING_WORLD_PLAZA_UI_DATA_ATTRIBUTE]: true }}
          aria-label={RENDERING_WORLD_PLAZA_BUILD_MODE_CUT_CLEAR_LABEL}
          disabled={isEmpty}
          onClick={clearingAllCutCells}
          className={DEFINING_WORLD_BUILDING_CUT_ACTION_BUTTON_CLASS_NAME}
        >
          Clear
        </button>
      </div>
    </div>
  );
}
