# Proposal: Add Taipei MRT Fare Finder Tool

## Overview

Add a new interactive tool to the menu that allows users to explore Taipei MRT fare information. Users select a starting station and see real-time fare calculations displayed on an interactive map for all stations, providing immediate visual reference for trip planning.

新增一個互動式台北捷運票價查詢工具到選單。使用者選擇起點站後，可在互動地圖上看到所有站點的即時票價計算，提供直觀的行程規劃參考。

## Motivation

**Problem / 問題**:
- Current tools application lacks practical utilities for local commuters
- No easy way to visualize MRT fare information with geographic context
- Users need to leave the application to check MRT fares
- 目前的工具應用缺乏對本地通勤者有用的實用工具
- 沒有簡單方式結合地理位置視覺化捷運票價資訊
- 使用者需要離開應用程式才能查詢捷運票價

**Benefits / 效益**:
- Provides practical, daily-use utility for Taipei residents and visitors
- Enhances the tools application with location-based features
- Demonstrates Vue 3 + TypeScript integration with mapping libraries
- No external API dependency - works offline
- 為台北居民和遊客提供實用的日常工具
- 以地理位置功能增強工具應用
- 展示 Vue 3 + TypeScript 與地圖庫的整合
- 無外部 API 依賴 - 可離線使用

## Scope

### In Scope
- New "MRT Fare Finder" view accessible from navigation menu
- Static JSON data file with all Taipei MRT stations (coordinates, names in EN/ZH)
- Static JSON data file with fare matrix for all station pairs
- Interactive Leaflet.js map displaying MRT stations
- Station selection UI (dropdown or map click)
- Real-time fare display on map markers when origin station is selected
- Bilingual support (English and Traditional Chinese)
- Responsive design for mobile and desktop
- 新的「捷運票價查詢」視圖可從導航選單存取
- 包含所有台北捷運站的靜態 JSON 資料檔案（座標、中英文站名）
- 包含所有站點對票價矩陣的靜態 JSON 資料檔案
- 使用 Leaflet.js 的互動地圖顯示捷運站
- 站點選擇 UI（下拉選單或地圖點擊）
- 選擇起點站後即時在地圖標記上顯示票價
- 雙語支援（英文和繁體中文）
- 響應式設計支援行動裝置和桌面

### Out of Scope
- Real-time train schedules or arrival information
- Route planning with transfers
- Integration with Taipei MRT official APIs
- Payment or ticketing functionality
- Travel time calculations
- Historical fare data or price trends
- 即時列車時刻表或到站資訊
- 含轉乘的路線規劃
- 與台北捷運官方 API 整合
- 支付或購票功能
- 行程時間計算
- 歷史票價資料或價格趨勢

## Alternatives Considered

### Alternative 1: Google Maps Embedded Map
**Pros**: Familiar UI, high-quality maps, built-in directions
**Cons**: Requires API key (potential costs), less customization, external dependency

**優點**：熟悉的 UI、高品質地圖、內建路線規劃
**缺點**：需要 API key（可能產生費用）、客製化程度較低、外部依賴

**Decision**: Rejected. Leaflet.js provides sufficient mapping capabilities without API costs or external dependencies.
**決定**：拒絕。Leaflet.js 提供足夠的地圖功能，無需 API 費用或外部依賴。

### Alternative 2: External API Integration
**Pros**: Auto-updated fare data, potentially more accurate
**Cons**: Network dependency, API rate limits, maintenance overhead, less reliable

**優點**：自動更新的票價資料、可能更準確
**缺點**：網路依賴、API 速率限制、維護開銷、可靠性較低

**Decision**: Rejected. Static data provides better reliability and offline support. MRT fares change infrequently.
**決定**：拒絕。靜態資料提供更好的可靠性和離線支援。捷運票價變動不頻繁。

### Alternative 3: Fare Table without Map
**Pros**: Simpler implementation, faster development
**Cons**: Less intuitive, no geographic context, poor UX for exploration

**優點**：實作較簡單、開發較快
**缺點**：較不直觀、缺乏地理位置參考、探索性 UX 較差

**Decision**: Rejected. Map visualization provides significant UX value for geographic context.
**決定**：拒絕。地圖視覺化為地理位置參考提供顯著的 UX 價值。

## Implementation Approach

### High-Level Strategy
1. **Data Preparation**: Create static JSON files with MRT station data and fare matrix
2. **Map Integration**: Integrate Leaflet.js with Vue 3 using composition API
3. **UI Components**: Build station selector and fare display components
4. **State Management**: Use Vue reactive state for selected origin and calculated fares
5. **Internationalization**: Add translations for all UI text
6. **Testing**: Unit tests for fare calculation logic, E2E tests for user workflows

### 高階策略
1. **資料準備**：建立包含捷運站資料和票價矩陣的靜態 JSON 檔案
2. **地圖整合**：使用組合式 API 整合 Leaflet.js 與 Vue 3
3. **UI 元件**：建構站點選擇器和票價顯示元件
4. **狀態管理**：使用 Vue 響應式狀態管理選定起點和計算的票價
5. **國際化**：為所有 UI 文字新增翻譯
6. **測試**：票價計算邏輯的單元測試、使用者工作流程的 E2E 測試

### Key Technical Decisions

**Mapping Library: Leaflet.js**
- Lightweight (~42KB gzipped)
- Excellent Vue 3 integration options
- No API key required
- Highly customizable marker styling
- Mobile-friendly touch interactions

**Data Structure: Flat fare matrix**
```json
{
  "fares": {
    "station1-station2": 20,
    "station1-station3": 25,
    ...
  }
}
```
- O(1) lookup performance
- Easy to maintain and update
- Bidirectional lookup (A→B same as B→A)

**地圖庫：Leaflet.js**
- 輕量（~42KB gzipped）
- 優秀的 Vue 3 整合選項
- 無需 API key
- 高度可客製化的標記樣式
- 行動裝置友善的觸控互動

**資料結構：扁平票價矩陣**
- O(1) 查詢效能
- 易於維護和更新
- 雙向查詢（A→B 等同於 B→A）

## Success Criteria

- [ ] User can navigate to "MRT Fare Finder" from main navigation menu
- [ ] User can select an origin station from dropdown or by clicking map marker
- [ ] All other station markers display fare from selected origin
- [ ] Map displays all Taipei MRT stations with correct coordinates
- [ ] Fare information is accurate and matches official Taipei MRT fares
- [ ] UI is fully bilingual (English + Traditional Chinese)
- [ ] Page is responsive and usable on mobile devices
- [ ] Application works offline after initial load
- [ ] Unit tests cover fare calculation logic
- [ ] E2E tests verify core user workflows

## Related Changes

- **Depends on**: navigation-system (existing) - for adding new menu item
- **Relates to**: tools-home-page (existing) - follows same tools application pattern
- **Relates to**: bilingual-support (existing) - reuses i18n infrastructure

## Questions and Open Issues

1. **Station Data Completeness**: Should we include future MRT extensions (e.g., planned lines)?
   - **Resolution**: Start with currently operational lines only. Add new lines when they open.

2. **Fare Calculation Logic**: How to handle special fares (student, senior, disability discounts)?
   - **Resolution**: Show only standard adult fares. Add disclaimer about special fares.

3. **Map Default View**: What should be the default map center and zoom level?
   - **Resolution**: Center on Taipei Main Station (台北車站) with zoom showing entire MRT network.

4. **Mobile UX**: Should mobile users use dropdown only, or allow map interaction?
   - **Resolution**: Support both. Dropdown is primary on mobile, but map markers remain clickable.

---

**Author**: Ben (Backend Developer)
**Date**: 2025-11-02
**Status**: Proposed (awaiting validation)