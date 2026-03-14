#!/usr/bin/env bash
set -euo pipefail

# Keep WSL from accidentally picking Windows-side Node/npm binaries.
export PATH=/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin

HOST_IP="$(ip route | awk '/default/ { print $3; exit }')"
PROXY="http://${HOST_IP}:17890"

export HTTP_PROXY="$PROXY"
export HTTPS_PROXY="$PROXY"
export ALL_PROXY="$PROXY"
export DEBIAN_FRONTEND=noninteractive

cat >/etc/apt/apt.conf.d/99codex-proxy <<EOF
Acquire::http::Proxy "${PROXY}";
Acquire::https::Proxy "${PROXY}";
EOF

cat >/etc/apt/sources.list.d/ubuntu.sources <<'EOF'
Types: deb
URIs: https://mirrors.tuna.tsinghua.edu.cn/ubuntu
Suites: noble noble-updates noble-backports
Components: main universe restricted multiverse
Signed-By: /usr/share/keyrings/ubuntu-archive-keyring.gpg

Types: deb
URIs: https://mirrors.tuna.tsinghua.edu.cn/ubuntu
Suites: noble-security
Components: main universe restricted multiverse
Signed-By: /usr/share/keyrings/ubuntu-archive-keyring.gpg
EOF

apt-get update
apt-get install -y curl ca-certificates git

NODE_VERSION="v24.14.0"
NODE_DIR="/opt/node-${NODE_VERSION}-linux-x64"
NODE_TARBALL_URL="https://mirrors.tuna.tsinghua.edu.cn/nodejs-release/${NODE_VERSION}/node-${NODE_VERSION}-linux-x64.tar.xz"

if [ ! -x "${NODE_DIR}/bin/node" ]; then
  curl -fsSL "${NODE_TARBALL_URL}" -o /tmp/node.tar.xz
  rm -rf "${NODE_DIR}"
  mkdir -p /opt
  tar -xJf /tmp/node.tar.xz -C /opt
fi

ln -sf "${NODE_DIR}/bin/node" /usr/local/bin/node
ln -sf "${NODE_DIR}/bin/npm" /usr/local/bin/npm
ln -sf "${NODE_DIR}/bin/npx" /usr/local/bin/npx
if [ -x "${NODE_DIR}/bin/corepack" ]; then
  ln -sf "${NODE_DIR}/bin/corepack" /usr/local/bin/corepack
fi

curl -fsSL https://openclaw.ai/install.sh -o /tmp/openclaw-install.sh
bash /tmp/openclaw-install.sh --no-prompt --no-onboard

if [ -f /root/.bashrc ]; then
  # shellcheck disable=SC1091
  source /root/.bashrc
fi

command -v openclaw || true
openclaw doctor --non-interactive || true
