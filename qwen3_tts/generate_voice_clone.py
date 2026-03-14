import argparse
from pathlib import Path

import soundfile as sf
import torch
from qwen_tts import Qwen3TTSModel


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Generate speech with Qwen3-TTS-12Hz-0.6B-Base.")
    parser.add_argument(
        "--model",
        default="Qwen/Qwen3-TTS-12Hz-0.6B-Base",
        help="Hugging Face model id or local model path.",
    )
    parser.add_argument(
        "--ref-audio",
        required=True,
        help="Reference WAV path for voice cloning.",
    )
    parser.add_argument(
        "--ref-text",
        default=None,
        help="Transcript for the reference audio. Required unless --xvector-only is used.",
    )
    parser.add_argument(
        "--text",
        required=True,
        help="Target text to synthesize.",
    )
    parser.add_argument(
        "--language",
        default="Auto",
        help="Language name accepted by the model. Auto is the safest default.",
    )
    parser.add_argument(
        "--output",
        required=True,
        help="Output WAV path.",
    )
    parser.add_argument(
        "--device",
        default="cuda:0",
        help="Device map value passed to from_pretrained, for example cuda:0 or cpu.",
    )
    parser.add_argument(
        "--dtype",
        default="bfloat16",
        choices=["float16", "bfloat16", "float32"],
        help="Torch dtype used when loading the model.",
    )
    parser.add_argument(
        "--xvector-only",
        action="store_true",
        help="Use speaker embedding only and skip reference transcript conditioning.",
    )
    parser.add_argument(
        "--max-new-tokens",
        type=int,
        default=1024,
        help="Maximum codec tokens generated for the new audio.",
    )
    parser.add_argument(
        "--flash-attn",
        action="store_true",
        help="Enable FlashAttention-2. Leave off unless it is installed.",
    )
    return parser.parse_args()


def resolve_dtype(name: str) -> torch.dtype:
    mapping = {
        "float16": torch.float16,
        "bfloat16": torch.bfloat16,
        "float32": torch.float32,
    }
    return mapping[name]


def main() -> int:
    args = parse_args()

    if not args.xvector_only and not args.ref_text:
        raise SystemExit("--ref-text is required unless --xvector-only is set.")

    output_path = Path(args.output)
    output_path.parent.mkdir(parents=True, exist_ok=True)

    print(f"Loading model: {args.model}")
    model = Qwen3TTSModel.from_pretrained(
        args.model,
        device_map=args.device,
        dtype=resolve_dtype(args.dtype),
        attn_implementation="flash_attention_2" if args.flash_attn else None,
    )

    print("Generating audio...")
    wavs, sample_rate = model.generate_voice_clone(
        text=args.text,
        language=args.language,
        ref_audio=args.ref_audio,
        ref_text=args.ref_text,
        x_vector_only_mode=args.xvector_only,
        max_new_tokens=args.max_new_tokens,
    )

    sf.write(output_path, wavs[0], sample_rate)
    print(f"Saved to: {output_path}")
    print(f"Sample rate: {sample_rate}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
