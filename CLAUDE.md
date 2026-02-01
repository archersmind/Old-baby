# CLAUDE.md

## Project Overview

Old-Baby (老宝贝护理) — 微信小程序，为老年犬提供健康管理和个性化食谱推荐。

## Tech Stack

- **平台:** 微信小程序（原生框架）
- **语言:** JavaScript (ES6+), WXML, WXSS
- **数据存储:** 微信本地存储 API（无后端/无云服务）
- **构建工具:** 微信开发者工具（无 package.json / 无 npm）

## Project Structure

```
├── app.js / app.json / app.wxss   # 应用入口与全局配置
├── custom-tab-bar/                # 自定义底部导航栏组件
├── pages/
│   ├── index/                     # 首页 - 宠物列表
│   ├── pet-profile/               # 宠物档案 - 基本信息录入
│   ├── health-info/               # 健康信息 - 疾病/过敏/用药
│   ├── recipe-list/               # 食谱列表 - 智能推荐与搜索
│   ├── recipe-detail/             # 食谱详情 - 食材/步骤/营养
│   └── my/                        # 我的 - 用户设置
├── utils/
│   ├── storage.js                 # 本地存储 CRUD 封装
│   ├── recommend.js               # 食谱推荐评分算法
│   └── util.js                    # 通用工具函数
├── data/
│   ├── recipes.json               # 10+ 自制食谱
│   ├── breeds.json                # 30+ 犬种数据
│   ├── diseases.json              # ~25 老年犬常见疾病
│   └── allergens.json             # 常见过敏原
└── images/                        # 图片资源
```

## Development

1. 打开**微信开发者工具**
2. 导入项目目录 `/Old-baby`
3. AppID 使用测试号 `wx0000000000000000` 或替换为真实 AppID
4. 点击「编译」即可在模拟器中运行

无需 `npm install`，项目无外部依赖。

## Architecture

三层架构：

- **表现层 (Pages):** 6 个页面，通过 WXML/WXSS 渲染 UI
- **业务逻辑层 (Utils):** storage.js 管理数据持久化，recommend.js 实现推荐算法
- **数据层 (Data):** 静态 JSON 文件提供食谱、犬种、疾病、过敏原数据

所有数据存储在设备本地，无网络请求，无云同步。

## Key Conventions

- 页面路由在 `app.json` 的 `pages` 数组中注册
- TabBar 使用自定义组件 (`custom-tab-bar/`)，含三个标签：我的宝贝 / 食谱 / 我的
- 主题色为 `#4A7C59`（绿色），背景色为 `#F5F1E8`
- 宠物 ID 格式：`pet_[timestamp]_[random]`
- 存储 key：`pets`（宠物数组）、`currentPetId`（当前选中）、`userInfo`（用户信息）

## Recommendation Algorithm

`utils/recommend.js` 中的评分逻辑：
1. 排除含宠物过敏原的食谱（`avoidFor` 字段）
2. 疾病匹配 +10 分/个（`suitableFor` 字段）
3. 健康宠物通用食谱 +5 分
4. 简单难度 +2 分
5. 按总分降序返回

## Common Tasks

- **添加新页面:** 创建页面目录 → 在 `app.json` 的 `pages` 中注册
- **添加新食谱:** 在 `data/recipes.json` 中追加，遵循现有数据结构
- **添加新疾病:** 在 `data/diseases.json` 中追加，分类字段为 `category`
- **修改导航栏:** 编辑 `custom-tab-bar/index.js` 和 `app.json` 的 `tabBar`
