npm run docs:build

cd docs/.vuepress/dist/

git init
git add --all
git commit -m "deploy"
git branch -M gh-pages
git push -f git@github.com:ianping/ianping.github.io.git gh-pages

# 脚本执行完毕后，不自动退出
cmd /k dir