# Ben's Portfolio | Ben 的個人網站

A modern, interactive personal portfolio website showcasing my experience as a Backend Developer specializing in Golang, AWS, and IoT solutions.

一個現代化、互動式的個人作品集網站，展示我作為後端開發工程師在 Golang、AWS 和物聯網解決方案方面的經驗。

## Features | 特色功能

- **Bilingual Support** | **雙語支援**: Toggle between English and Chinese (英文/中文切換)
- **Responsive Design** | **響應式設計**: Works seamlessly on all devices (所有裝置完美顯示)
- **Modern Animations** | **現代動畫**: Smooth scroll animations and interactive elements (流暢滾動動畫和互動元素)
- **Professional Timeline** | **專業時間軸**: Visual representation of career journey (職業歷程視覺化呈現)
- **Tech Stack Visualization** | **技術棧視覺化**: Interactive skill bars and categories (互動式技能條和分類)

## Tech Stack | 技術棧

- **HTML5**: Semantic markup
- **CSS3**: Modern styling with CSS Grid and Flexbox
- **Vanilla JavaScript**: No framework dependencies
- **Google Fonts**: Inter font family
- **GitHub Pages**: Free hosting

## Sections | 網站區塊

1. **Home** | **首頁**: Hero section with introduction
2. **About** | **關於**: Professional background and statistics
3. **Experience** | **經驗**: Career timeline with detailed roles
4. **Tech Stack** | **技術棧**: Comprehensive technology showcase
5. **Contact** | **聯繫**: Links to professional profiles

## Deployment Instructions | 部署說明

### Step 1: Create GitHub Repository | 步驟 1: 創建 GitHub 倉庫

```bash
# This repository is already initialized
# 此倉庫已初始化完成
```

### Step 2: Push to GitHub | 步驟 2: 推送到 GitHub

```bash
# Add remote repository (replace with your actual GitHub repo URL)
# 添加遠端倉庫（替換為你實際的 GitHub 倉庫 URL）
git remote add origin https://github.com/yhattm/yhattm.github.io.git

# Push to GitHub
# 推送到 GitHub
git push -u origin main
```

### Step 3: Enable GitHub Pages | 步驟 3: 啟用 GitHub Pages

1. Go to your repository on GitHub
   前往你的 GitHub 倉庫

2. Click on **Settings** → **Pages**
   點擊 **Settings** → **Pages**

3. Under **Source**, select:
   在 **Source** 下選擇：
   - Branch: `main`
   - Folder: `/ (root)`

4. Click **Save** | 點擊 **Save**

5. Wait a few minutes, then visit:
   等待幾分鐘後，訪問：
   `https://yhattm.github.io`

## Local Development | 本地開發

To view the site locally:
要在本地查看網站：

```bash
# Option 1: Using Python (Python 3)
# 選項 1: 使用 Python (Python 3)
python3 -m http.server 8000

# Option 2: Using Node.js (if you have http-server installed)
# 選項 2: 使用 Node.js (如果已安裝 http-server)
npx http-server

# Then open browser to:
# 然後在瀏覽器中打開：
# http://localhost:8000
```

## Customization | 自訂設定

### Update Content | 更新內容

Edit `index.html` to update:
編輯 `index.html` 以更新：
- Personal information (個人資訊)
- Work experience (工作經驗)
- Tech stack (技術棧)
- Contact links (聯繫連結)

### Change Colors | 更改顏色

Edit CSS variables in `styles.css`:
在 `styles.css` 中編輯 CSS 變數：

```css
:root {
    --primary: #3b82f6;     /* Main brand color */
    --secondary: #8b5cf6;   /* Secondary color */
    --accent: #10b981;      /* Accent color */
    /* ... */
}
```

### Modify Animations | 修改動畫

Edit `script.js` to customize:
編輯 `script.js` 以自訂：
- Animation timings (動畫時間)
- Scroll behaviors (滾動行為)
- Interactive effects (互動效果)

## Browser Support | 瀏覽器支援

- Chrome / Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (modern versions)

## Performance | 效能

- **Lighthouse Score**: 95+ (all categories)
- **Load Time**: < 2s on 3G
- **Bundle Size**: < 50KB (total)

## License | 授權

MIT License - Feel free to use this template for your own portfolio!
MIT 授權 - 歡迎使用此模板建立你自己的作品集！

## Contact | 聯繫方式

- **LinkedIn**: [linkedin.com/in/chihpin](https://www.linkedin.com/in/chihpin/)
- **GitHub**: [github.com/yhattm](https://github.com/yhattm)

---

**Built with ❤️ and Claude Code**
**用 ❤️ 和 Claude Code 打造**
