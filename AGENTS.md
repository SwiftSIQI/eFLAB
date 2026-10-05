# 个性化

- 中文回复，言简意赅，巧用 Emoji，称呼我“🤖Boss”。

# 做事要求

- 关键歧义会改变方案时先询问，否则直接执行。
- 优先最小合理改动，只处理当前任务涉及的文件。
- 修改后运行最相关的验证；无法验证时说明原因和风险。
- 分析或审查未发现可行动问题时，在结论前添加 `✅OK`。

# 路由规则

- 未经要求，不启动模拟器或真机测试。
- 复杂关系难以用文字说明时，使用 `Visualize`。

## 1. 项目概况

- 项目是 eFootball 中文工具站，使用 React、TypeScript、Vinext、Vite 和 Tailwind CSS。
- `app/page.tsx` 是首页；`app/styles/`、`app/skills/`、`app/boosters/`、`app/attributes/` 分别负责比赛风格、球员技巧、增能和属性页面。
- `app/data.ts` 保存位置和比赛风格数据；`components/` 保存共用组件；`app/globals.css` 保存全局样式。

## 2. 视觉方向

- 参考 eFootball 官方英文首页的深蓝、荧光黄、洋红和青色视觉气质，保持工具站的信息结构和易读性。
- 沿用 `app/globals.css` 中的 `--background`、`--yellow`、`--attack` 和 `--defense`，不要另起相近配色。
- 选中态和攻防类型不能只依赖颜色，应保留文字、图标或 `aria` 状态。
- 调整页面时兼顾手机和桌面布局，保持筛选、搜索、结果数量和展开内容可读可用。

## 3. 修改约定

### 3.1 基本原则

- 不编辑或提交 `node_modules/`、`.next/`、`.vinext/`、`.wrangler/`、`dist/` 和 `.env*` 敏感内容。

### 3.2 数据来源与生成

- CSV 是结构化数据的唯一来源：比赛风格使用 `csv/player_style.csv`，增能使用 `csv/player_booster.csv`，技巧使用 `csv/player_skill.csv`，球员属性使用 `csv/player_ability.csv`。`app/data.ts`、`app/skills/data.ts`、`app/boosters/data.ts` 和 `app/attributes/data.ts` 都是构建时生成的临时产物，不需要提交或手工编辑。
- 主数据 CSV 第一列统一为连续唯一的 `序号`，直接作为对应 `data.ts` 的 `id`，不得生成英文 slug ID；技能组合 CSV 的序号同样必须与技巧 CSV 对齐。
- 五个生成脚本位于 `script/`：`generate_playing_styles_data.rb`、`generate_boosters_data.rb`、`generate_skills_data.rb`、`generate_attributes_data.rb` 和 `generate_skill_combo_data.rb`。修改数据时先改 CSV，再运行对应脚本；`npm run dev` 和 `npm run build` 会自动生成，禁止直接编辑生成的 `data.ts`。
- CSV 字段名含 `-中文` 或 `-英文` 时，修改一侧要提醒用户是否同步修改另一侧。

### 3.3 通用位置与筛选

- 左右位置组合只能使用 `LWF/RWF`、`RWF/LWF`、`LMF/RMF`、`RMF/LMF`、`LB/RB` 或 `RB/LB`，禁止使用 `L/RWF`、`R/LWF`、`L/RMF`、`R/LMF`、`L/RB`、`R/LB`。
- 修改筛选逻辑时，检查球场位置、位置标签、攻防切换、搜索和结果数量是否一致。

### 3.4 比赛风格

- 核对序号、中英文名称、说明、攻防类型和生效位置。生效位置可用 `/` 连接，但拆分后每个位置都必须存在于 `app/data.ts` 的 `positions` 列表。
- `全能中场` 和 `靠山` 可分别存在于进攻型与防守型记录中，不能只按名称判断重复。

### 3.5 球员技巧

- `csv/player_skill.csv` 是技巧名称、描述和分类的唯一来源，不得添加其中不存在的技能或分类。
- 技巧分类允许重叠，以 CSV 的“技巧类型-中文”和“技巧类型-英文”为准。
- 遇到别名、缩写或组合简称时，查阅 `csv/player_skill.csv` 和 `csv/player_skill_combo.csv`。网页数据和代码使用 CSV 标准名称；无法对应时，先询问标准技能及是否需要补充映射。
- 技巧图片位于 `public/skills/`，按序号使用 `01.webp`～`67.webp`；原始高清资源已移出本工程，不参与构建和发布。

### 3.6 技能推荐归一化

- `csv/expert/` 是专家推荐的唯一输入目录；文件名以 `nouse-` 开头的专家 CSV 不参与生成。活动专家 CSV 按文件名排序后自动分配数字方案 ID。
- `script/normalize_skill_recommendations.rb` 会校验专家 CSV 必须完整覆盖 `csv/player_skill.csv` 的技能清单，遇到未知技能、重复技能、无法识别的位置列或空产出时立即失败。
- `npm run dev` 和 `npm run build` 会先执行 `npm run normalize:data`，再生成各类 `data.ts`；归一化失败时应停止后续流程。
- 输出为 `csv/play_skill_rec_by_expert.csv`，随后由 `generate_skills_data.rb` 转换为 `app/skills/data.ts`。修改脚本或输入时，校验技能清单、位置映射和输出行数。
- `npm test` 会重新生成数据并执行 `test/data_pipeline_test.rb`，用于校验 CSV、专家推荐、图片和生成链路。

## 4. 运行与验证

### 4.1 常规检查

- 使用本地 Node.js 24 和 `package-lock.json` 锁定的 npm 依赖；本地 Node.js 或 npm 不可用时，才使用 workspace dependencies 作为备用运行时。
- 常用命令：`npm run dev`、`npm run lint`、`npm run build`。
- `npm run dev` 和 `npm run build` 会自动依次执行技能推荐归一化和四类数据生成。
- 需要单独更新技能推荐归一化结果时，运行 `npm run normalize:data`。
- 修改后运行最相关的检查；涉及交互时检查对应页面。无法验证时说明原因和风险。

### 4.2 Chrome 本地预览

- 只有用户明确要求预览时才启动。项目使用 `.openai/hosting.json` 和 Vinext，优先使用 `node_modules/.bin/vinext` 与项目现有 npm 命令。
- 预览前确认 `node_modules/.bin/vinext` 存在。依赖缺失时使用 `npm ci`，不得使用 pnpm；除非用户明确要求，否则不要手工修改或删除 `node_modules/`。
- 在可保留的终端会话中运行 `npm run dev -- --host 127.0.0.1`，等待实际的 `Local` 地址，不重复启动服务或扫描端口。
- 用同一环境对该地址发起一次轻量 HTTP 请求，确认返回非错误状态后，再在 Chrome 中打开该准确地址；请求失败不能视为预览成功。
- 不得留下预览适配配置。若环境限制要求临时修改，启动后立即恢复，并说明临时调整及恢复结果。
- 后续修改复用同一开发服务和同一个 Chrome 标签页；任务完成或用户要求停止时关闭服务。
