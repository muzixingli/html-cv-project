# AI 简历智能初筛工作台 (Interactive Demo)

## 📌 快速打开与使用指引

### 方式 1：本地离线免安装直接运行（最推荐）
如果您通过 AI Studio 下载了项目 ZIP 压缩包并解压：
- **请直接双击根目录下的 `demo.html` 或 `双击直接打开_demo.html`**
- （或者进入 `dist/` 文件夹双击 `dist/index.html`）
- **为什么根目录的 `index.html` 点开是空白？**
  - 因为根目录的 `index.html` 是 React 源码工程的开发入口，里面通过 `<script type="module" src="/src/main.tsx">` 引用了未经编译的 TypeScript 代码。浏览器直接双击本地文件（`file://` 协议）无法直接解析 `.tsx` 代码，所以会显示空白。
  - 而 `demo.html` 是通过 `vite-plugin-singlefile` **完全编译内联打包的单文件版本**，已包含全部 React 逻辑、Tailwind 样式、Lucide 图标与演示数据，**双击即可在任何现代浏览器（Chrome / Edge / Safari 等）中流畅交互运行，无需安装任何环境！**

---

### 方式 2：极速免命令行部署到 Netlify（3秒上线）
1. 打开 Netlify 官方的拖拽部署页面：[https://app.netlify.com/drop](https://app.netlify.com/drop)
2. 将解压出来的 **`dist` 文件夹** 直接拖入该网页窗口；
3. Netlify 会立即生成一个专属的公开网址，即可在公网随时访问与分享。

---

### 方式 3：推送到 GitHub 并使用 Netlify 自动构建
1. 将本项目 push 到您的 GitHub 仓库；
2. 在 Netlify 控制台选择 **"Import an existing project"** 绑定该仓库；
3. 项目根目录已内置 `netlify.toml`，Netlify 会自动识别：
   - 构建命令：`npm run build`
   - 发布目录：`dist`
4. 点击 **Deploy** 即可全自动构建上线，后续每次向 GitHub 提交代码都会自动触发更新。

---

### 方式 4：本地开发者模式（Node.js 开发）
如需在本地继续修改代码并进行开发调试：
```bash
# 1. 安装依赖
npm install

# 2. 启动本地开发服务
npm run dev

# 3. 打包生成新的单文件 demo.html
npm run build
```
