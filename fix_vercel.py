#!/usr/bin/env python3
"""
Vercel 部署修复脚本
用于自动修改 Root Directory 设置并重新部署
"""

import os
import sys
import json
import urllib.request
import urllib.error

# 配置
PROJECT_ID = "earring-shop"
TEAM_ID = "12222as-projects"
GITHUB_REPO = "12222a/earring-shop"

def get_token():
    """获取 Vercel Token"""
    token = os.environ.get('VERCEL_TOKEN')
    if not token:
        print("=" * 50)
        print("错误: 未提供 Vercel Token")
        print("=" * 50)
        print()
        print("请按以下步骤获取 Token:")
        print("1. 在浏览器中访问: https://vercel.com/account/tokens")
        print("2. 点击 'Create Token'")
        print("3. 输入名称如 'deploy-token'")
        print("4. 点击 'Create'")
        print("5. 复制生成的 token")
        print()
        print("然后运行:")
        print(f"  export VERCEL_TOKEN='你的token'")
        print(f"  python {sys.argv[0]}")
        print()
        print("或者在 Windows PowerShell 中:")
        print("  $env:VERCEL_TOKEN = '你的token'")
        print(f"  python {sys.argv[0]}")
        sys.exit(1)
    return token

def api_request(url, token, method="GET", data=None):
    """发送 API 请求"""
    headers = {
        "Authorization": f"Bearer {token}",
        "Content-Type": "application/json"
    }

    req = urllib.request.Request(url, headers=headers, method=method)
    if data:
        req.data = json.dumps(data).encode('utf-8')

    try:
        with urllib.request.urlopen(req) as response:
            return json.loads(response.read().decode('utf-8'))
    except urllib.error.HTTPError as e:
        error_body = e.read().decode('utf-8')
        print(f"API 错误: {e.code}")
        print(f"响应: {error_body}")
        return None
    except Exception as e:
        print(f"请求错误: {e}")
        return None

def main():
    print("=" * 50)
    print("   Vercel 部署修复工具")
    print("=" * 50)
    print()

    # 步骤 1: 获取 Token
    print("[步骤 1/3] 验证 Vercel Token...")
    token = get_token()

    # 验证 Token
    user_info = api_request("https://api.vercel.com/v2/user", token)
    if not user_info:
        print("  错误: Token 无效或已过期")
        sys.exit(1)
    print(f"  登录用户: {user_info.get('user', {}).get('username', 'unknown')}")

    # 步骤 2: 获取项目信息
    print()
    print("[步骤 2/3] 获取项目信息...")

    project_url = f"https://api.vercel.com/v9/projects/{PROJECT_ID}?teamId={TEAM_ID}"
    project = api_request(project_url, token)

    if not project:
        print("  错误: 无法获取项目信息")
        print("  请检查项目 ID 和 Team ID 是否正确")
        sys.exit(1)

    print(f"  项目名称: {project.get('name')}")
    print(f"  当前 Root Directory: {project.get('rootDirectory', '(空)')}")

    # 步骤 3: 更新 Root Directory
    print()
    print("[步骤 3/3] 更新项目设置...")

    update_url = f"https://api.vercel.com/v9/projects/{PROJECT_ID}?teamId={TEAM_ID}"
    update_data = {"rootDirectory": None}

    updated_project = api_request(update_url, token, method="PATCH", data=update_data)

    if not updated_project:
        print("  错误: 无法更新项目设置")
        sys.exit(1)

    print(f"  Root Directory 已更新为: {updated_project.get('rootDirectory', '(空)')}")

    print()
    print("=" * 50)
    print("   项目设置已修复!")
    print("=" * 50)
    print()
    print("下一步:")
    print(f"1. 访问 https://vercel.com/{TEAM_ID}/{PROJECT_ID}")
    print("2. 点击 'Redeploy' 按钮重新部署")
    print()
    print("或者运行以下命令进行部署:")
    print(f"  vercel --token {token[:10]}... --prod")
    print()

    # 尝试触发重新部署
    print("正在尝试触发重新部署...")
    deploy_url = "https://api.vercel.com/v13/deployments"
    deploy_data = {
        "name": PROJECT_ID,
        "project": PROJECT_ID,
        "target": "production",
        "gitSource": {
            "type": "github",
            "repoId": 12345678,  # 需要替换为实际的 repo ID
            "ref": "master"
        }
    }

    deployment = api_request(deploy_url, token, method="POST", data=deploy_data)

    if deployment:
        print(f"  部署已触发!")
        print(f"  部署 URL: {deployment.get('url')}")
    else:
        print("  警告: 无法自动触发部署")
        print("  请手动在 Vercel 控制台点击 Redeploy")

    print()
    input("按 Enter 退出...")

if __name__ == "__main__":
    main()
