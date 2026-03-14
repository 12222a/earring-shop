from pathlib import Path
from huggingface_hub import snapshot_download


LOCAL_DIR = Path(r"C:\Users\Administrator\.lmstudio\models\lmstudio-community\Qwen3.5-9B-GGUF")


def main() -> None:
    LOCAL_DIR.mkdir(parents=True, exist_ok=True)
    print(f"Downloading into: {LOCAL_DIR}", flush=True)
    path = snapshot_download(
        repo_id="lmstudio-community/Qwen3.5-9B-GGUF",
        allow_patterns=[
            "Qwen3.5-9B-Q4_K_M.gguf",
            "mmproj-Qwen3.5-9B-BF16.gguf",
            "README.md",
        ],
        local_dir=str(LOCAL_DIR),
        local_dir_use_symlinks=False,
        resume_download=True,
    )
    print(f"Done: {path}", flush=True)


if __name__ == "__main__":
    main()
