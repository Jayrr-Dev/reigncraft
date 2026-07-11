"""
Trim long multi-call wildlife vocal beds to short one-shots.

Usage:
  python scripts/trimmingLongWildlifeVocalBeds.py
"""

from __future__ import annotations

import math
import os
import shutil
import struct
import subprocess
import tempfile
import wave
from pathlib import Path

REPO = Path(__file__).resolve().parents[1]
MASTERS = REPO / "assets" / "source" / "audio-masters" / "creatures" / "sfx" / "vocals"
PUBLIC = REPO / "public" / "creatures" / "sfx" / "vocals"

# (relative path without extension, target one-shot seconds)
TARGETS: list[tuple[str, float]] = [
    ("farm-animal/dog-bark-01", 2.0),
    ("farm-animal/dog-bark-02", 2.0),
    ("farm-animal/sheep-baa-02", 2.0),
    ("farm-animal/chicken-cluck-01", 1.8),
    ("farm-animal/chicken-cluck-02", 1.8),
    ("farm-animal/chicken-cluck-03", 1.8),
    ("farm-animal/chicken-cluck-04", 1.8),
    ("farm-animal/goat-bleat-01", 2.0),
    ("farm-animal/donkey-bray-01", 2.2),
    ("farm-animal/donkey-bray-02", 2.2),
    ("farm-animal/wolf-howl-01", 3.5),
    ("farm-animal/tiger-growl-01", 2.5),
    ("pixabay-wild/hippo-grunt-01", 2.2),
    ("pixabay-wild/hippo-grunt-02", 2.2),
    ("pixabay-wild/zebra-whinny-01", 2.2),
    ("pixabay-wild/tiger-roar-light-01", 2.5),
    ("pixabay-wild/hyena-laugh-hd-01", 2.2),
    ("pixabay-wild/rhino-vocal-01", 2.2),
    ("pixabay-wild/deer-fawn-bleat-01", 2.0),
    ("pixabay-wild/tiger-growl-01", 2.5),
    ("pixabay-wild/crocodile-growl-01", 2.2),
    ("beast/beast-bellow-05", 2.5),
]


def resolving_ffmpeg() -> str:
    from_env = os.environ.get("FFMPEG")
    if from_env:
        return from_env
    which = shutil.which("ffmpeg")
    if which:
        return which
    raise RuntimeError("ffmpeg not found on PATH")


def loading_mono(path: Path) -> tuple[list[float], int]:
    with wave.open(str(path), "rb") as handle:
        channel_count = handle.getnchannels()
        sample_width = handle.getsampwidth()
        sample_rate = handle.getframerate()
        frame_count = handle.getnframes()
        frames = handle.readframes(frame_count)

    if sample_width != 2:
        raise RuntimeError(f"unsupported sampwidth {sample_width} for {path}")

    samples = struct.unpack("<" + str(len(frames) // 2) + "h", frames)
    if channel_count == 2:
        mono = [
            (samples[index] + samples[index + 1]) / 2
            for index in range(0, len(samples), 2)
        ]
    else:
        mono = list(samples)
    return mono, sample_rate


def finding_best_window(
    mono: list[float], sample_rate: int, target_seconds: float
) -> tuple[float, float]:
    window = max(1, int(sample_rate * 0.1))
    target = int(sample_rate * target_seconds)
    if len(mono) <= target:
        return 0.0, len(mono) / sample_rate

    best_score = -1.0
    best_start = 0.0
    step = window
    for index in range(0, len(mono) - target, step):
        chunk = mono[index : index + target]
        sub_rms: list[float] = []
        for sub_index in range(0, len(chunk) - window, window):
            sub_chunk = chunk[sub_index : sub_index + window]
            sub_rms.append(
                math.sqrt(sum(sample * sample for sample in sub_chunk) / len(sub_chunk))
                / 32768
            )
        if not sub_rms:
            continue
        score = max(sub_rms) * 0.7 + (sum(sub_rms) / len(sub_rms)) * 0.3
        if score > best_score:
            best_score = score
            best_start = index / sample_rate

    return best_start, target_seconds


def running_ffmpeg(ffmpeg: str, args: list[str]) -> None:
    result = subprocess.run(
        [ffmpeg, *args], capture_output=True, text=True, check=False
    )
    if result.returncode != 0:
        raise RuntimeError(result.stderr[-800:] or result.stdout[-800:])


def main() -> None:
    ffmpeg = resolving_ffmpeg()
    temp_root = Path(tempfile.mkdtemp(prefix="reigncraft-vocal-trim-"))
    print(f"tmp={temp_root}")

    for relative_path, target_seconds in TARGETS:
        master_wav = MASTERS / f"{relative_path}.wav"
        public_ogg = PUBLIC / f"{relative_path}.ogg"
        if not master_wav.exists() and not public_ogg.exists():
            print(f"SKIP missing {relative_path}")
            continue

        safe_name = relative_path.replace("/", "__")
        analysis_wav = temp_root / f"{safe_name}_src.wav"
        source_input = master_wav if master_wav.exists() else public_ogg
        running_ffmpeg(
            ffmpeg,
            [
                "-y",
                "-i",
                str(source_input),
                "-ac",
                "2",
                "-ar",
                "44100",
                "-c:a",
                "pcm_s16le",
                str(analysis_wav),
            ],
        )

        mono, sample_rate = loading_mono(analysis_wav)
        start_seconds, duration_seconds = finding_best_window(
            mono, sample_rate, target_seconds
        )
        start_seconds = max(0.0, start_seconds - 0.05)
        print(
            f"{relative_path}: start={start_seconds:.2f}s dur={duration_seconds:.2f}s "
            f"(from {len(mono) / sample_rate:.1f}s)"
        )

        trimmed_wav = temp_root / f"{safe_name}_trim.wav"
        trimmed_ogg = temp_root / f"{safe_name}_trim.ogg"
        running_ffmpeg(
            ffmpeg,
            [
                "-y",
                "-ss",
                f"{start_seconds:.3f}",
                "-t",
                f"{duration_seconds:.3f}",
                "-i",
                str(analysis_wav),
                "-c:a",
                "pcm_s16le",
                str(trimmed_wav),
            ],
        )
        running_ffmpeg(
            ffmpeg,
            [
                "-y",
                "-i",
                str(trimmed_wav),
                "-c:a",
                "libopus",
                "-b:a",
                "24k",
                str(trimmed_ogg),
            ],
        )

        master_wav.parent.mkdir(parents=True, exist_ok=True)
        public_ogg.parent.mkdir(parents=True, exist_ok=True)
        shutil.copyfile(trimmed_wav, master_wav)
        shutil.copyfile(trimmed_ogg, public_ogg)

    print("DONE")


if __name__ == "__main__":
    main()
