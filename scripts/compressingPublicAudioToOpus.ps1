# Compress shipped public/ audio to low-bitrate Opus-in-OGG.
# Usage: .\scripts\compressingPublicAudioToOpus.ps1 [-WhatIf] [-SkipDelete]
param(
  [switch]$WhatIf,
  [switch]$SkipDelete
)

$ErrorActionPreference = 'Stop'

$repoRoot = Resolve-Path (Join-Path $PSScriptRoot '..')
$publicDir = Join-Path $repoRoot 'public'
$mastersDir = Join-Path $repoRoot 'assets\source\audio-masters'

$loopPathPrefixes = @(
  'environment\ambience',
  'environment\music',
  'fire\sfx'
)

function Test-LoopAudioPath {
  param([string]$RelativePath)
  $normalized = $RelativePath -replace '/', '\'
  foreach ($prefix in $loopPathPrefixes) {
    if ($normalized.StartsWith($prefix, [System.StringComparison]::OrdinalIgnoreCase)) {
      return $true
    }
  }
  return $false
}

function Get-FfmpegPath {
  $cmd = Get-Command ffmpeg -ErrorAction SilentlyContinue
  if ($cmd) { return $cmd.Source }

  $machinePath = [System.Environment]::GetEnvironmentVariable('Path', 'Machine')
  $userPath = [System.Environment]::GetEnvironmentVariable('Path', 'User')
  $env:Path = "$machinePath;$userPath"
  $cmd = Get-Command ffmpeg -ErrorAction SilentlyContinue
  if ($cmd) { return $cmd.Source }

  throw 'ffmpeg not found on PATH. Install with: winget install Gyan.FFmpeg'
}

$ffmpeg = Get-FfmpegPath
Write-Host "Using ffmpeg: $ffmpeg"

if (-not (Test-Path $publicDir)) {
  throw "public directory not found: $publicDir"
}

$audioFiles = Get-ChildItem -Path $publicDir -Recurse -File -Include *.wav, *.mp3, *.ogg
if ($audioFiles.Count -eq 0) {
  Write-Host 'No audio files found under public/.'
  exit 0
}

$beforeBytes = ($audioFiles | Measure-Object Length -Sum).Sum
Write-Host "Found $($audioFiles.Count) audio files ($([math]::Round($beforeBytes / 1MB, 2)) MB)"

$encoded = 0
$skipped = 0
$failed = 0
$deleted = @()

foreach ($file in $audioFiles) {
  $relativePath = $file.FullName.Substring($publicDir.Length + 1)
  $relativeDir = Split-Path $relativePath -Parent
  $baseName = [System.IO.Path]::GetFileNameWithoutExtension($file.Name)
  $outDir = if ([string]::IsNullOrEmpty($relativeDir)) { $publicDir } else { Join-Path $publicDir $relativeDir }
  $outOgg = Join-Path $outDir "$baseName.ogg"

  $isLoop = Test-LoopAudioPath $relativePath
  $bitrate = if ($isLoop) { '48k' } else { '24k' }
  $kind = if ($isLoop) { 'loop' } else { 'sfx' }

  if ($file.Extension -eq '.wav') {
    $masterPath = if ([string]::IsNullOrEmpty($relativeDir)) {
      Join-Path $mastersDir $file.Name
    } else {
      Join-Path (Join-Path $mastersDir $relativeDir) $file.Name
    }

    if (-not (Test-Path $masterPath)) {
      if ($WhatIf) {
        Write-Host "[whatif] copy master: $relativePath"
      } else {
        $masterParent = Split-Path $masterPath -Parent
        New-Item -ItemType Directory -Force -Path $masterParent | Out-Null
        Copy-Item -LiteralPath $file.FullName -Destination $masterPath
      }
    }
  }

  if ($file.Extension -eq '.ogg' -and $file.FullName -eq $outOgg) {
    # Already shipped as .ogg; skip unless caller forces a full re-encode pass.
    Write-Host "skip (already ogg): $relativePath"
    $skipped++
    continue
  }

  if ((Test-Path $outOgg) -and $outOgg -ne $file.FullName) {
    $outInfo = Get-Item -LiteralPath $outOgg
    if ($outInfo.LastWriteTimeUtc -ge $file.LastWriteTimeUtc) {
      Write-Host "skip (up to date): $relativePath -> $baseName.ogg"
      $skipped++
      continue
    }
  }

  if ($file.Extension -eq '.ogg' -and $file.FullName -eq $outOgg) {
    $tempOut = Join-Path $outDir "$baseName.tmp.ogg"
    $encodeTarget = $tempOut
  } else {
    $encodeTarget = $outOgg
  }

  Write-Host "encode [$kind @ $bitrate]: $relativePath -> $baseName.ogg"

  if ($WhatIf) {
    $encoded++
    continue
  }

  $ffmpegArgs = @(
    '-y',
    '-i', $file.FullName,
    '-c:a', 'libopus',
    '-b:a', $bitrate,
    '-ac', '1',
    '-ar', '24000',
    $encodeTarget
  )

  $prevErrorAction = $ErrorActionPreference
  $ErrorActionPreference = 'Continue'
  try {
    & $ffmpeg @ffmpegArgs *> $null
    $exitCode = $LASTEXITCODE
  } finally {
    $ErrorActionPreference = $prevErrorAction
  }

  if ($exitCode -ne 0) {
    Write-Warning "ffmpeg failed: $relativePath"
    if (Test-Path $encodeTarget) { Remove-Item -LiteralPath $encodeTarget -Force }
    $failed++
    continue
  }

  if ($file.Extension -eq '.ogg' -and $file.FullName -eq $outOgg) {
    Move-Item -LiteralPath $encodeTarget -Destination $outOgg -Force
  }

  $encoded++

  if (-not $SkipDelete -and $file.Extension -in '.wav', '.mp3') {
    Remove-Item -LiteralPath $file.FullName -Force
    $deleted += $relativePath
  }
}

$remaining = Get-ChildItem -Path $publicDir -Recurse -File -Include *.wav, *.mp3, *.ogg -ErrorAction SilentlyContinue
$afterBytes = ($remaining | Measure-Object Length -Sum).Sum

Write-Host ''
Write-Host "Encoded: $encoded"
Write-Host "Skipped: $skipped"
Write-Host "Failed: $failed"
Write-Host "Deleted sources: $($deleted.Count)"
Write-Host "Before: $([math]::Round($beforeBytes / 1MB, 2)) MB"
Write-Host "After:  $([math]::Round($afterBytes / 1MB, 2)) MB"

if ($failed -gt 0) {
  exit 1
}
