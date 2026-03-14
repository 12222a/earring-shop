@echo off
chcp 65001 >nul
echo ==========================================
echo    Vercel 部署快速修复工具
echo ==========================================
echo.
echo 正在打开 Vercel 项目设置页面...
echo.

:: 打开浏览器
start https://vercel.com/12222as-projects/earring-shop/settings

echo 请按以下步骤操作:
echo.
echo 1. 等待页面加载完成
echo.
echo 2. 找到 "Root Directory" 设置项
echo    - 如果该字段有内容（如 earring-shop），请删除内容使其为空
echo    - 如果该字段为空，则无需修改
echo.
echo 3. 点击 "Save" 按钮保存
echo.
echo 4. 点击左侧菜单 "Deployments"
echo.
echo 5. 找到最新的部署记录，点击右侧 "..."
echo.
echo 6. 选择 "Redeploy" 重新部署
echo.
echo ==========================================
echo.
echo 部署成功后，网站将可以通过以下地址访问:
echo https://earring-shop.vercel.app
echo.
echo 按任意键退出...
pause >nul
