#!/usr/bin/env python3
"""
DeutschPath — pre-render every German string into local audio with Piper TTS.

This is the "bundled professional audio" branch of the AudioSource abstraction:
  * reads every episode JSON in src/content/episodes/
  * collects every unique German string (items, dialogue lines, choices)
  * synthesizes each with a German Piper voice (de_DE-thorsten-medium)
  * writes mp3s to public/audio/<hash>.mp3
  * rewrites src/content/audio-manifest.json (text -> file map)

After running this + `npm run build`, the app plays bundled files only —
zero runtime network, zero runtime TTS. If this script was never run,
the app transparently falls back to the Web Speech API (no code change).

Usage:
    npm run audio:setup   # creates .audio-venv with piper-tts + lameenc
    npm run audio         # renders audio + manifest

Voice sourcing (in order):
    1. Hugging Face: rhasspy/piper-voices  de_DE-thorsten-medium
    2. GitHub mirror: smseagle/piper-voices (same files, LFS)
    3. GitHub release mirror: MohamedMakia/Cardy-TTS-Models-To-Download v1.0.0
Piper TTS and the Thorsten voice are MIT-licensed.
"""

from __future__ import annotations

import concurrent.futures as cf
import glob
import hashlib
import json
import os
import sys
import urllib.request

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
EPISODES_GLOB = os.path.join(ROOT, "src", "content", "episodes", "*.json")
AUDIO_DIR = os.path.join(ROOT, "public", "audio")
MANIFEST_PATH = os.path.join(ROOT, "src", "content", "audio-manifest.json")
VOICE_DIR = os.path.expanduser("~/.cache/piper-voices")
VOICE_NAME = "de_DE-thorsten-medium"

HF_URL = (
    "https://huggingface.co/rhasspy/piper-voices/resolve/v1.0.0/"
    "de/de_DE/thorsten/medium/de_DE-thorsten-medium.onnx"
)
HF_JSON_URL = HF_URL + ".json"
GH_RAW_URL = (
    "https://raw.githubusercontent.com/smseagle/piper-voices/main/"
    "de/de_DE/thorsten/medium/de_DE-thorsten-medium.onnx"
)
GH_RELEASE_URL = (
    "https://github.com/MohamedMakia/Cardy-TTS-Models-To-Download/"
    "releases/download/v1.0.0/de_DE-thorsten-medium.onnx"
)


def fetch(url: str, dest: str, min_bytes: int = 1_000_000) -> bool:
    print(f"  trying {url}")
    try:
        req = urllib.request.Request(url, headers={"User-Agent": "deutschpath-build"})
        with urllib.request.urlopen(req, timeout=120) as r, open(dest, "wb") as f:
            total = 0
            while chunk := r.read(1 << 20):
                f.write(chunk)
                total += len(chunk)
        if total < min_bytes:
            print(f"  -> only {total} bytes (likely an LFS pointer / error page)")
            os.remove(dest)
            return False
        print(f"  -> ok ({total/1e6:.1f} MB)")
        return True
    except Exception as e:  # noqa: BLE001 - report any network failure plainly
        print(f"  -> failed: {e}")
        if os.path.exists(dest):
            os.remove(dest)
        return False


def looks_like_onnx(path: str) -> bool:
    try:
        with open(path, "rb") as f:
            return f.read(1) == b"\x08"  # ONNX protobuf starts with field 1 varint
    except OSError:
        return False


def ensure_voice() -> tuple[str, str]:
    onnx = os.path.join(VOICE_DIR, f"{VOICE_NAME}.onnx")
    cfg = onnx + ".json"
    if os.path.exists(onnx) and looks_like_onnx(onnx) and os.path.exists(cfg):
        return onnx, cfg
    if os.path.exists(onnx) and not looks_like_onnx(onnx):
        print("Cached voice file is not a valid ONNX model (stale pointer?) — re-downloading.")
        os.remove(onnx)
    os.makedirs(VOICE_DIR, exist_ok=True)
    print(f"Voice {VOICE_NAME} not cached; downloading…")
    tmp = onnx + ".part"
    for url in (HF_URL, GH_RAW_URL, GH_RELEASE_URL):
        if fetch(url, tmp):
            if not looks_like_onnx(tmp):
                print("  -> not an ONNX model, aborting this source")
                os.remove(tmp)
                continue
            os.replace(tmp, onnx)
            break
    else:
        sys.exit(
            "\nCould not download the Piper voice from any known mirror.\n"
            "This sandbox allows pypi/npm/github-api but blocks the CDNs that host\n"
            "the model bytes (huggingface.co, *.githubusercontent.com).\n"
            "Run this script on an unrestricted network:  npm run audio:setup && npm run audio\n"
        )
    for url in (HF_JSON_URL,):
        if fetch(url, cfg, min_bytes=1000):
            break
    else:
        sys.exit("Could not download the voice config JSON.")
    return onnx, cfg


def collect_german_strings() -> dict[str, None]:
    """Every German string the app can ever speak, exactly as AudioSource looks it up."""
    texts: dict[str, None] = {}
    for path in sorted(glob.glob(EPISODES_GLOB)):
        with open(path, encoding="utf-8") as f:
            data = json.load(f)
        for item in data.get("items", []):
            texts[item.get("speak") or item["german"]] = None
            for alt in item.get("alt", []) or []:
                texts[alt] = None
        for scene in data.get("scenes", []):
            for beat in scene.get("beats", []):
                btype = beat.get("type")
                if btype == "line":
                    texts[beat["text"]] = None
                elif btype == "reading":
                    texts[beat["text"]] = None
                elif btype == "choice":
                    for opt in beat.get("options", []):
                        if opt.get("line"):
                            texts[opt["line"]] = None
    return texts


def text_hash(text: str) -> str:
    return hashlib.sha1(f"{VOICE_NAME}:{text}".encode("utf-8")).hexdigest()[:16]


def main() -> None:
    try:
        import lameenc  # noqa: F401
        from piper import PiperVoice, SynthesisConfig  # noqa: F401
    except ImportError:
        sys.exit("Missing deps. Run:  npm run audio:setup")

    onnx, cfg = ensure_voice()
    texts = collect_german_strings()
    print(f"{len(texts)} unique German strings found.")

    os.makedirs(AUDIO_DIR, exist_ok=True)
    manifest: dict = {"voice": VOICE_NAME, "generatedAt": None, "files": {}}
    if os.path.exists(MANIFEST_PATH):
        with open(MANIFEST_PATH, encoding="utf-8") as f:
            try:
                manifest = json.load(f)
                manifest.setdefault("files", {})
            except Exception:
                pass

    todo = {t: f"{text_hash(t)}.mp3" for t in texts if not os.path.exists(os.path.join(AUDIO_DIR, f"{text_hash(t)}.mp3"))}
    print(f"{len(texts) - len(todo)} already rendered, {len(todo)} to render.")
    if todo:
        voice = PiperVoice.load(onnx, config_path=cfg)
        syn_config = SynthesisConfig(language="de-DE")

        def render(item: tuple[str, str]) -> tuple[str, str, int]:
            text, fname = item
            wav_path = os.path.join(AUDIO_DIR, f"{text_hash(text)}.wav")
            with open(wav_path, "wb") as wav:
                voice.synthesize_wav(text, wav, syn_config=syn_config)
            with open(wav_path, "rb") as f:
                pcm = f.read()
            os.remove(wav_path)
            enc = lameenc.Encoder()
            enc.set_bit_rate(64)
            enc.set_in_sample_rate(22050)
            enc.set_channels(1)
            enc.set_quality(5)
            mp3 = enc.encode(pcm) + enc.flush()
            out = os.path.join(AUDIO_DIR, fname)
            with open(out, "wb") as f:
                f.write(bytes(mp3))
            return text, fname, len(pcm) // 2  # samples ≈ duration at 22.05 kHz

        done = 0
        with cf.ThreadPoolExecutor(max_workers=2) as pool:
            for text, fname, samples in pool.map(render, sorted(todo.items())):
                manifest["files"][text] = fname
                done += 1
                if done % 25 == 0 or done == len(todo):
                    print(f"  rendered {done}/{len(todo)}")

    import datetime

    manifest["generatedAt"] = datetime.datetime.now(datetime.timezone.utc).isoformat()
    with open(MANIFEST_PATH, "w", encoding="utf-8") as f:
        json.dump(manifest, f, ensure_ascii=False, indent=2)
    total = len(manifest["files"])
    print(f"Manifest written: {total} files -> {MANIFEST_PATH}")
    print("Now run:  npm run build   (the service worker will precache all audio)")


if __name__ == "__main__":
    main()
