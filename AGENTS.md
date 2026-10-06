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

- 项目是 eFootball 中文工具站，使用 React、TypeScript、Vite、Vinext 适配层和 Tailwind CSS。
- 网站品牌统一使用 `eFLAB`（只有首字母 `e` 小写，其余字母大写）；所有可见文案、页面标题、元数据、Logo 文本、alt/aria 文案都必须保持这一大小写。不要再新增或恢复旧品牌名称或旧 Logo 资源名。密码、localStorage key、事件名等技术标识若已有固定值，必须保持原值，不要为了品牌大小写改动兼容性标识。
- `app/page.tsx` 是首页；`app/styles/`、`app/skills/`、`app/boosters/`、`app/attributes/` 分别负责比赛风格、球员技巧、增能和属性页面。
- `app/data.ts` 保存位置和比赛风格数据；`components/` 保存共用组件；`app/globals.css` 保存全局样式。

## 2. 视觉方向

- 参考 eFootball 官方英文首页的深蓝、荧光黄、洋红和青色视觉气质，保持工具站的信息结构和易读性。
- 沿用 `app/globals.css` 中的 `--background`、`--yellow`、`--attack` 和 `--defense`，不要另起相近配色。
- 选中态和攻防类型不能只依赖颜色，应保留文字、图标或 `aria` 状态。
- 调整页面时兼顾手机和桌面布局，保持筛选、搜索、结果数量和展开内容可读可用。

## 3. 修改约定

### 3.1 基本原则

- 不编辑或提交 `node_modules/`、`.next/`、`.vinext/`、`.wrangler/`、`dist/`、构建缓存和 `.env*` 敏感内容。`node_modules/` 是 npm 安装产物，不是 source of truth；每次正式构建前会删除并通过 `npm ci` 重新安装。

### 3.2 数据来源与生成

- CSV 是结构化数据的唯一来源：比赛风格使用 `csv/player_style.csv`，增能使用 `csv/player_booster.csv`，技巧使用 `csv/player_skill.csv`，技能组合使用 `csv/player_skill_combo.csv`，球员属性使用 `csv/player_ability.csv`。对应的 `app/data.ts`、`app/skills/data.ts`、`app/skills/skill-combos.ts`、`app/boosters/data.ts` 和 `app/attributes/data.ts` 都是构建时生成的临时产物，不需要提交或手工编辑。唯一例外是 `csv/play_skill_rec_by_expert.csv`，它由 `csv/expert/` 下的专家 CSV 归一化生成。
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
- 技巧页面直接使用 `public/skills/` 下固定的 WebP 资源（`01.webp`～`67.webp`），图片不依赖脚本生成或转换。

### 3.6 技能推荐归一化

- `csv/expert/` 是专家推荐的唯一输入目录；文件名以 `nouse-` 开头的专家 CSV 不参与生成。活动专家 CSV 按文件名排序后自动分配数字方案 ID。
- `script/normalize_skill_recommendations.rb` 会校验专家 CSV 必须完整覆盖 `csv/player_skill.csv` 的技能清单，遇到未知技能、重复技能、无法识别的位置列或空产出时立即失败。
- `npm run dev` 和 `npm run build` 会先执行 `npm run normalize:data`，再生成各类 `data.ts`；归一化失败时应停止后续流程。
- 输出为 `csv/play_skill_rec_by_expert.csv`，随后由 `generate_skills_data.rb` 转换为 `app/skills/data.ts`。修改脚本或输入时，校验技能清单、位置映射和输出行数。
- `npm test` 会重新生成数据并执行 `test/data_pipeline_test.rb`，用于校验 CSV、专家推荐、图片和生成链路。

### 3.7 网站访问门禁

- `components/site-access-gate.tsx` 负责首次访问密码校验；正确密码为 `eflab666`，验证通过后仅在当前浏览器的 `localStorage` 中记录解锁状态。
- 门禁包裹整个站点布局，未解锁时不得展示首页、导航或工具页面内容。修改门禁时要同时检查首次加载、错误密码、刷新后状态和无 `localStorage` 环境。
- 这是前端访问门槛，不是服务端安全认证；不要把它描述为保护源代码、接口或敏感数据的安全机制。

### 3.8 技巧与增能使用说明

- 技巧页面的说明必须保持与实际筛选顺序一致：推荐方案 → 位置 → 球员定位 → 推荐度。定制化技能组是将组合内技能加入当前推荐列表；剔除球员已有技能是让用户手动排除已有技能，避免因暂未接入 efhub 而重复推荐。
- 技巧价值只评价技能本身，不包含位置维度；相关文案必须提醒用户结合具体位置、球员定位和使用场景参考。
- 增能页面的说明应解释位置筛选、属性多选和增能价值筛选；属性多选是同时满足所有已选属性，而不是满足任意一个。

## 4. 运行与验证

### 4.1 常规检查

- 使用本地 Node.js 24 和 `package-lock.json` 锁定的 npm 依赖；本地 Node.js 或 npm 不可用时，才使用 workspace dependencies 作为备用运行时。
- 常用命令：`npm run dev`、`npm run lint`、`npm run build`。
- 访问本地站点时，首次打开需要输入访问密码 `eflab666`；验证状态保存在当前浏览器本地存储中。
- `npm run prepare:build` 是正式构建前的完整准备流程：清理可重建缓存、`node_modules/` 和生成产物；按 `package-lock.json` 执行 `npm ci`；再依次执行技能推荐归一化和数据生成。发布用 WebP 已固定保存在 `public/skills/`，构建直接使用这些资源。
- `npm run build` 会自动先执行 `npm run prepare:build`，因此每次正式构建都从全新的依赖和生成产物开始，不复用本地依赖或构建缓存。该流程不删除 `.env*` 或源码 CSV；不要把这些 source of truth 或本地配置加入清理列表。
- 仅修改数据或开发调试时，不需要执行完整清理流程；使用 `npm run normalize:data` 或 `npm run generate:data` 更新对应产物即可。`public/skills/` 下的固定图片资源无需生成。
- 需要单独更新技能推荐归一化结果时，运行 `npm run normalize:data`。
- 修改后运行最相关的检查；涉及交互时检查对应页面。无法验证时说明原因和风险。

### 4.2 Chrome 本地预览

- 只有用户明确要求预览时才启动。项目使用 `.openai/hosting.json`、Vite 和 Vinext 适配层，优先使用项目现有 npm 命令 `npm run dev`。
- 预览前确认 `node_modules/.bin/vite` 存在。依赖缺失时使用 `npm ci`，不得使用 pnpm；不要手工修改 `node_modules/`，需要完整重装时使用 `npm run prepare:build`。
- 在可保留的终端会话中运行 `npm run dev -- --host 127.0.0.1`，等待实际的 `Local` 地址，不重复启动服务或扫描端口。
- 用同一环境对该地址发起一次轻量 HTTP 请求，确认返回非错误状态后，再在 Chrome 中打开该准确地址；请求失败不能视为预览成功。
- 不得留下预览适配配置。若环境限制要求临时修改，启动后立即恢复，并说明临时调整及恢复结果。
- 后续修改复用同一开发服务和同一个 Chrome 标签页；任务完成或用户要求停止时关闭服务。
