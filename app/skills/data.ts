// 内容摘自仓库根目录“实况足球球员技巧.xlsx”；分类严格对应“技巧类型”列。
export const skillCategories = [
  { id: 'all', label: '全部', nameEn: 'All' },
  { id: 'Dribbling', label: '盘带', nameEn: 'Dribbling' },
  { id: 'Shooting', label: '射门', nameEn: 'Shooting' },
  { id: 'Passing', label: '传球', nameEn: 'Passing' },
  { id: 'Defending', label: '防守', nameEn: 'Defending' },
  { id: 'Other', label: '其他', nameEn: 'Other' },
  { id: 'Premium', label: '付费技能', nameEn: 'Premium' },
] as const;

export type SkillCategory = Exclude<(typeof skillCategories)[number]['id'], 'all'>;

export type PlayerSkill = {
  id: number;
  nameZh: string;
  nameEn: string;
  description: string;
  descriptionEn: string;
  categories: SkillCategory[];
  image: string;
};

export const playerSkills: PlayerSkill[] = [
  {
    "id": 1,
    "nameZh": "剪刀脚假动作",
    "nameEn": "Scissors Feint",
    "description": "输入假动作指令时执行剪刀脚假动作。",
    "descriptionEn": "Performs a Scissors Feint when entering a feint command.",
    "categories": [
      "Dribbling"
    ],
    "image": "/skills/01.png"
  },
  {
    "id": 2,
    "nameZh": "两次触球",
    "nameEn": "Double Touch",
    "description": "输入假动作指令时执行两次触球。",
    "descriptionEn": "Performs a Double Touch when entering a feint command.",
    "categories": [
      "Dribbling"
    ],
    "image": "/skills/02.png"
  },
  {
    "id": 3,
    "nameZh": "牛摆尾",
    "nameEn": "Flip Flap",
    "description": "输入假动作指令时执行牛摆尾。",
    "descriptionEn": "Performs a Flip Flap when entering a feint command.",
    "categories": [
      "Dribbling"
    ],
    "image": "/skills/03.png"
  },
  {
    "id": 4,
    "nameZh": "马赛回旋",
    "nameEn": "Marseille Turn",
    "description": "输入假动作指令时执行马赛回旋。",
    "descriptionEn": "Performs a Marseille Turn when entering a feint command.",
    "categories": [
      "Dribbling"
    ],
    "image": "/skills/04.png"
  },
  {
    "id": 5,
    "nameZh": "挑球过顶",
    "nameEn": "Sombrero",
    "description": "提升挑球过顶和彩虹过人的精准度；接地面传球时也可施展挑球过顶。",
    "descriptionEn": "Increases the accuracy of Sombrero and Rainbow Flick. Also allows the player to perform a Sombrero when receiving a Low Pass.",
    "categories": [
      "Dribbling"
    ],
    "image": "/skills/05.png"
  },
  {
    "id": 6,
    "nameZh": "脚后跟磕球变向",
    "nameEn": "Chop Turn",
    "description": "输入假动作指令时执行脚后跟磕球变向。",
    "descriptionEn": "Performs a Chop Turn when entering a feint command.",
    "categories": [
      "Dribbling"
    ],
    "image": "/skills/06.png"
  },
  {
    "id": 7,
    "nameZh": "向后切球并转身",
    "nameEn": "Cut Behind & Turn",
    "description": "执行向后切球；大角度转身时还会使用特殊停球动作。",
    "descriptionEn": "Performs a Cut Behind. When turning at a wide angle, also uses a special trapping motion.",
    "categories": [
      "Dribbling"
    ],
    "image": "/skills/07.png"
  },
  {
    "id": 8,
    "nameZh": "磕球过人",
    "nameEn": "Scotch Move",
    "description": "输入假动作指令时执行磕球过人。",
    "descriptionEn": "Performs a Scotch Move when entering a feint command.",
    "categories": [
      "Dribbling"
    ],
    "image": "/skills/08.png"
  },
  {
    "id": 9,
    "nameZh": "后脚磕球变向",
    "nameEn": "Tap Trick",
    "description": "输入假动作指令时执行后脚磕球变向假动作。",
    "descriptionEn": "Performs a Tap Trick feint when entering a feint command.",
    "categories": [
      "Premium"
    ],
    "image": "/skills/09.png"
  },
  {
    "id": 10,
    "nameZh": "足底控球",
    "nameEn": "Sole Control",
    "description": "使球员在做假动作和转身时更多地用脚掌控球。",
    "descriptionEn": "Enables the player to control the ball more using the soles of his feet when executing feints and turns.",
    "categories": [
      "Dribbling"
    ],
    "image": "/skills/10.png"
  },
  {
    "id": 11,
    "nameZh": "旋风盘带",
    "nameEn": "Momentum Dribbling",
    "description": "提高球员在进攻三区的盘球能力。",
    "descriptionEn": "Improves player's dribbling abilities in the attacking third (deep in opposition territory).",
    "categories": [
      "Premium"
    ],
    "image": "/skills/11.png"
  },
  {
    "id": 12,
    "nameZh": "瞬间加速",
    "nameEn": "Acceleration Burst",
    "description": "可在静止或缓慢移动时快速施展锐钻触球，也可能触发特殊锐钻触球动作。",
    "descriptionEn": "Enables the player to perform a quick Sharp Touch while stationary or moving slowly. Special Sharp Touch motions may also be triggered.",
    "categories": [
      "Premium"
    ],
    "image": "/skills/12.png"
  },
  {
    "id": 13,
    "nameZh": "磁力脚",
    "nameEn": "Magnetic Feet",
    "description": "控球时，根据 5 米范围内对手人数（最多 4 人）提高控球能力。",
    "descriptionEn": "When in possession of the ball, increases the player's ability to keep it based on the number of opponents within 5 metres (4 opponents max).",
    "categories": [
      "Premium"
    ],
    "image": "/skills/13.png"
  },
  {
    "id": 14,
    "nameZh": "头球",
    "nameEn": "Heading",
    "description": "提高头球精准度和砸地头球的频度。",
    "descriptionEn": "Improves the accuracy of headers as well as the frequency of downward headers.",
    "categories": [
      "Other"
    ],
    "image": "/skills/14.png"
  },
  {
    "id": 15,
    "nameZh": "炮弹式头球",
    "nameEn": "Bullet Header",
    "description": "可完成势大力沉的头球攻门，姿势不自然或失去平衡时也更容易完成。",
    "descriptionEn": "Enables the player to head the ball sharply towards goal, shooting with power and accuracy even from awkward positions or when off balance.",
    "categories": [
      "Premium"
    ],
    "image": "/skills/15.png"
  },
  {
    "id": 16,
    "nameZh": "远距离弧线球",
    "nameEn": "Long-range Curler",
    "description": "远距离施展大弧度且精准的控制射门。",
    "descriptionEn": "Performs a sharp, accurate Controlled Shot with a heavy curl that often hits the target even from a long distance.",
    "categories": [
      "Shooting"
    ],
    "image": "/skills/16.png"
  },
  {
    "id": 17,
    "nameZh": "弧线落叶射门",
    "nameEn": "Blitz Curler",
    "description": "力量槽至少 50% 时，可施展带强烈上旋的控制射门。",
    "descriptionEn": "Performs a Controlled Shot with heavy topspin while the Power Gauge is at least 50% full.",
    "categories": [
      "Premium"
    ],
    "image": "/skills/17.png"
  },
  {
    "id": 18,
    "nameZh": "吊射控制",
    "nameEn": "Chip Shot Control",
    "description": "高速移动时也能精准吊射。",
    "descriptionEn": "Performs an accurate Chip Shot, even when moving at high speed.",
    "categories": [
      "Shooting"
    ],
    "image": "/skills/18.png"
  },
  {
    "id": 19,
    "nameZh": "落叶球射门",
    "nameEn": "Knuckle Shot",
    "description": "力量槽达到 50%–65% 时，以惊人射门指令踢出电梯球；也适合任意球。",
    "descriptionEn": "Performs a Knuckle Shot when entering a Stunning Shot command while the Power Gauge is 50-65% full. A good free kick option.",
    "categories": [
      "Shooting"
    ],
    "image": "/skills/19.png"
  },
  {
    "id": 20,
    "nameZh": "急坠射门",
    "nameEn": "Dipping Shot",
    "description": "力量槽达到 20%–50% 时，以惊人射门指令踢出急坠射门。",
    "descriptionEn": "Performs a Dipping Shot when entering a Stunning Shot command while the Power Gauge is 20-50% full.",
    "categories": [
      "Shooting"
    ],
    "image": "/skills/20.png"
  },
  {
    "id": 21,
    "nameZh": "急升射门",
    "nameEn": "Rising Shot",
    "description": "力量槽达到 65%–95% 时，以惊人射门指令踢出上升射门。",
    "descriptionEn": "Performs a Rising Shot when entering a Stunning Shot command while the Power Gauge is 65-95% full.",
    "categories": [
      "Shooting"
    ],
    "image": "/skills/21.png"
  },
  {
    "id": 22,
    "nameZh": "远射",
    "nameEn": "Long-range Shooting",
    "description": "从禁区外射出更容易命中目标的远射。",
    "descriptionEn": "Performs a Long-range Shot from outside the box that often hits the target.",
    "categories": [
      "Shooting"
    ],
    "image": "/skills/22.png"
  },
  {
    "id": 23,
    "nameZh": "掠地瞬击",
    "nameEn": "Low Screamer",
    "description": "力量槽低于 50% 的惊人射门球速提升，且不会出现急坠射门。",
    "descriptionEn": "Performing a Stunning Shot while the Power Gauge is under 50% full will increase the speed of the shot. A Dipping Shot will not occur.",
    "categories": [
      "Premium"
    ],
    "image": "/skills/23.png"
  },
  {
    "id": 24,
    "nameZh": "瞬发射门",
    "nameEn": "Snap Strike",
    "description": "缩短惊人射门的出脚时间。",
    "descriptionEn": "Takes less time to kick the ball when making a Stunning Shot.",
    "categories": [
      "Premium"
    ],
    "image": "/skills/24.png"
  },
  {
    "id": 25,
    "nameZh": "杂技般进球",
    "nameEn": "Acrobatic Finishing",
    "description": "在不自然姿势或失去平衡时也能找到射门机会。",
    "descriptionEn": "Enables the player to find a finish even from awkward positions or when off balance.",
    "categories": [
      "Shooting"
    ],
    "image": "/skills/25.png"
  },
  {
    "id": 26,
    "nameZh": "脚跟绝技",
    "nameEn": "Heel Trick",
    "description": "在不自然姿势或失去平衡时也能用脚后跟传球或射门。",
    "descriptionEn": "Enables the player to pass and shoot using the heel, even from awkward positions or when off balance.",
    "categories": [
      "Passing"
    ],
    "image": "/skills/26.png"
  },
  {
    "id": 27,
    "nameZh": "一脚射门",
    "nameEn": "First-time Shot",
    "description": "提高第一时间射门的技术和精准度。",
    "descriptionEn": "Improves technique and precision when taking first- time shots.",
    "categories": [
      "Shooting"
    ],
    "image": "/skills/27.png"
  },
  {
    "id": 28,
    "nameZh": "无定型射门",
    "nameEn": "Phenomenal Finishing",
    "description": "提高不自然身体姿势下射门的力量和精准度。",
    "descriptionEn": "Increases the power and accuracy of finishing shots attempted from unorthodox body positions.",
    "categories": [
      "Premium"
    ],
    "image": "/skills/28.png"
  },
  {
    "id": 29,
    "nameZh": "百折不挠",
    "nameEn": "Willpower",
    "description": "每次射门可提升射门能力，最多累积 8 次。",
    "descriptionEn": "Improves player's shooting abilities whenever they take a shot, up to a maximum of 8 times.",
    "categories": [
      "Premium"
    ],
    "image": "/skills/29.png"
  },
  {
    "id": 30,
    "nameZh": "一脚传球",
    "nameEn": "One-touch Pass",
    "description": "提高一脚传球的技术和精准度。",
    "descriptionEn": "Improves technique and precision when executing one- touch passes.",
    "categories": [
      "Passing"
    ],
    "image": "/skills/30.png"
  },
  {
    "id": 31,
    "nameZh": "直传球",
    "nameEn": "Through Passing",
    "description": "可传出轨迹合适的直塞球，并提高整体直塞精准度。",
    "descriptionEn": "Enables the player to make through passes with the appropriate trajectory. Also improves the overall accuracy of through passes.",
    "categories": [
      "Passing"
    ],
    "image": "/skills/31.png"
  },
  {
    "id": 32,
    "nameZh": "精准长传",
    "nameEn": "Weighted Pass",
    "description": "向前方踢出带强烈后旋的精准高空传球或挑传直塞。",
    "descriptionEn": "Performs an accurate Lofted Pass or Chipped Through Ball with heavy backspin to a forward area.",
    "categories": [
      "Passing",
      "Defending"
    ],
    "image": "/skills/32.png"
  },
  {
    "id": 33,
    "nameZh": "精确横传球",
    "nameEn": "Pinpoint Crossing",
    "description": "踢出带明显弧线的快速精准传中。",
    "descriptionEn": "Performs a sharp, accurate cross with a heavy curl.",
    "categories": [
      "Passing"
    ],
    "image": "/skills/33.png"
  },
  {
    "id": 34,
    "nameZh": "急坠传中",
    "nameEn": "Edged Crossing",
    "description": "踢出垂直旋转且急速下坠的传中球。",
    "descriptionEn": "Enables the player to put in vertically rotating crosses that fall sharply.",
    "categories": [
      "Premium"
    ],
    "image": "/skills/34.png"
  },
  {
    "id": 35,
    "nameZh": "外脚背弧线球",
    "nameEn": "Outside Curler",
    "description": "用较强脚的外侧踢出精准的旋转射门或传球，远距离也适用。",
    "descriptionEn": "Performs a precise spinning shot or pass with the outside of the boot, even from range, using the stronger foot for accuracy.",
    "categories": [
      "Passing"
    ],
    "image": "/skills/35.png"
  },
  {
    "id": 36,
    "nameZh": "插花脚",
    "nameEn": "Rabona",
    "description": "用较强脚施展出其不意的插花脚，扰乱防守节奏。",
    "descriptionEn": "Performs a Rabona to disrupt the defence's timing with a surprise kick, using the stronger foot for accuracy.",
    "categories": [
      "Passing"
    ],
    "image": "/skills/36.png"
  },
  {
    "id": 37,
    "nameZh": "不看球员传球",
    "nameEn": "No Look Pass",
    "description": "以视线迷惑对手，送出意想不到的传球。",
    "descriptionEn": "Enables the player to play unexpected passes and confuse the opponent with his lines of sight.",
    "categories": [
      "Passing"
    ],
    "image": "/skills/37.png"
  },
  {
    "id": 38,
    "nameZh": "翻盘传球",
    "nameEn": "Game-changing Pass",
    "description": "下半场球队平局或落后时，提高传球能力。",
    "descriptionEn": "Improves player's passing abilities after the second half kick-off, under the circumstances that the team is either drawing or losing.",
    "categories": [
      "Premium"
    ],
    "image": "/skills/38.png"
  },
  {
    "id": 39,
    "nameZh": "到位传球",
    "nameEn": "Visionary Pass",
    "description": "提高接球队友的一脚传球、直接射门和停球精准度。",
    "descriptionEn": "Increases the accuracy of one-touch passes, first-time shots and traps performed by players who receive passes from the holder of this Player Skill.",
    "categories": [
      "Premium"
    ],
    "image": "/skills/39.png"
  },
  {
    "id": 40,
    "nameZh": "无定型传球",
    "nameEn": "Phenomenal Pass",
    "description": "提高不自然身体姿势下传球的力量和精准度。",
    "descriptionEn": "Increases the power and accuracy of passes attempted from unorthodox body positions.",
    "categories": [
      "Premium"
    ],
    "image": "/skills/40.png"
  },
  {
    "id": 41,
    "nameZh": "低空传球",
    "nameEn": "Low Lofted Pass",
    "description": "踢出低轨迹、距离远且精准的高空传球。",
    "descriptionEn": "Enables the player to hit long and accurate Lofted Passes with a low trajectory.",
    "categories": [
      "Passing"
    ],
    "image": "/skills/41.png"
  },
  {
    "id": 42,
    "nameZh": "守门员低弹道凌空球",
    "nameEn": "GK Low Punt",
    "description": "守门员可踢出精准的低弹道凌空球。",
    "descriptionEn": "Enables the player to take accurate punt kicks with a low trajectory.",
    "categories": [
      "Premium"
    ],
    "image": "/skills/42.png"
  },
  {
    "id": 43,
    "nameZh": "守门员高弹道凌空球",
    "nameEn": "GK High Punt",
    "description": "守门员可踢出长距离高轨迹开球，深入对方半场。",
    "descriptionEn": "Enables goalkeepers to take long, high punt kicks that end up deep in opposition territory.",
    "categories": [
      "Premium"
    ],
    "image": "/skills/43.png"
  },
  {
    "id": 44,
    "nameZh": "长距离投掷",
    "nameEn": "Long Throw",
    "description": "增加界外球投掷距离。",
    "descriptionEn": "Improves the range of long throws.",
    "categories": [
      "Other"
    ],
    "image": "/skills/44.png"
  },
  {
    "id": 45,
    "nameZh": "守门员长距离投掷",
    "nameEn": "GK Long Throw",
    "description": "增加守门员手抛球距离。",
    "descriptionEn": "Improves the range on throws by the goalkeeper.",
    "categories": [
      "Premium"
    ],
    "image": "/skills/45.png"
  },
  {
    "id": 46,
    "nameZh": "点球专家",
    "nameEn": "Penalty Specialist",
    "description": "提高主罚点球的精准度。",
    "descriptionEn": "Enables the player to take higher accuracy penalty kicks.",
    "categories": [
      "Shooting",
      "Other"
    ],
    "image": "/skills/46.png"
  },
  {
    "id": 47,
    "nameZh": "守门员扑点球",
    "nameEn": "GK Penalty Saver",
    "description": "提高守门员应对点球时的反应。",
    "descriptionEn": "Enables the player to have better goalkeeping reactions against penalty kicks.",
    "categories": [
      "Premium"
    ],
    "image": "/skills/47.png"
  },
  {
    "id": 48,
    "nameZh": "守门员指挥防守",
    "nameEn": "GK Directing Defence",
    "description": "提高己方腹地后卫的防守能力。",
    "descriptionEn": "Goalkeeper Skill that improves the defensive abilities of your DF players positioned deep in your own territory.",
    "categories": [
      "Premium"
    ],
    "image": "/skills/48.png"
  },
  {
    "id": 49,
    "nameZh": "门神战吼",
    "nameEn": "GK Spirit Roar",
    "description": "下半场领先时，提高己方后卫的身体能力。",
    "descriptionEn": "Goalkeeper Skill that improves the physical abilities of your DF players when leading after half-time.",
    "categories": [
      "Premium"
    ],
    "image": "/skills/49.png"
  },
  {
    "id": 50,
    "nameZh": "假摔",
    "nameEn": "Gamesmanship",
    "description": "控球时更容易赢得犯规。",
    "descriptionEn": "Wins fouls more easily when in possession of the ball.",
    "categories": [
      "Other"
    ],
    "image": "/skills/50.png"
  },
  {
    "id": 51,
    "nameZh": "盯人",
    "nameEn": "Man Marking",
    "description": "快速反应对手动作，施加紧密盯防。",
    "descriptionEn": "Reacts quickly to an opponent's movements and applies tight marking that is hard to shake.",
    "categories": [
      "Defending"
    ],
    "image": "/skills/51.png"
  },
  {
    "id": 52,
    "nameZh": "压迫",
    "nameEn": "Track Back",
    "description": "从前线开始积极压迫对方持球球员。",
    "descriptionEn": "Enables the player to aggressively apply pressure to the opposition ballholder all the way from the frontlines.",
    "categories": [
      "Defending"
    ],
    "image": "/skills/52.png"
  },
  {
    "id": 53,
    "nameZh": "截球",
    "nameEn": "Interception",
    "description": "更快地对传球作出反应，提高拦截成功率。",
    "descriptionEn": "Reacts quickly to passes and intercepts them at a higher rate.",
    "categories": [
      "Defending"
    ],
    "image": "/skills/53.png"
  },
  {
    "id": 54,
    "nameZh": "封堵",
    "nameEn": "Blocker",
    "description": "更快封堵传球和射门，并减少反弹球。",
    "descriptionEn": "Reacts quickly to kicks by blocking passes and shots at a high rate, and also limits the amount of rebound.",
    "categories": [
      "Defending"
    ],
    "image": "/skills/54.png"
  },
  {
    "id": 55,
    "nameZh": "空中优势",
    "nameEn": "Aerial Superiority",
    "description": "空中争抢更占优势，更容易保持头球精准度。",
    "descriptionEn": "Gains an advantage during mid-air battles and maintains heading accuracy more easily.",
    "categories": [
      "Defending",
      "Other"
    ],
    "image": "/skills/55.png"
  },
  {
    "id": 56,
    "nameZh": "飞身铲球",
    "nameEn": "Sliding Tackle",
    "description": "提高滑铲的精准度和速度，更容易赢得球权。",
    "descriptionEn": "Performs a Sliding Tackle with greater accuracy and speed, and wins the ball more easily.",
    "categories": [
      "Defending"
    ],
    "image": "/skills/56.png"
  },
  {
    "id": 57,
    "nameZh": "伸脚抢截",
    "nameEn": "Long-reach Tackle",
    "description": "静止或缓慢移动时，更频繁地对较远对手施展站立抢断。",
    "descriptionEn": "Increases the frequency of standing tackles, even against far away opponents, while stationary or moving slowly.",
    "categories": [
      "Premium"
    ],
    "image": "/skills/57.png"
  },
  {
    "id": 58,
    "nameZh": "后防领袖",
    "nameEn": "Fortress",
    "description": "下半场领先时提高防守能力。",
    "descriptionEn": "Improves player's defensive abilities after the second half mark, as long as the team has a goal advantage.",
    "categories": [
      "Premium"
    ],
    "image": "/skills/58.png"
  },
  {
    "id": 59,
    "nameZh": "杂技般解围",
    "nameEn": "Acrobatic Clearance",
    "description": "即使姿势不自然，也能用脚解围。",
    "descriptionEn": "Enables the player to clear the ball using his feet, even from awkward positions.",
    "categories": [
      "Defending"
    ],
    "image": "/skills/59.png"
  },
  {
    "id": 60,
    "nameZh": "空中堡垒",
    "nameEn": "Aerial Fort",
    "description": "在己方禁区内提高空中对抗能力。",
    "descriptionEn": "Improves player's abilities regarding aerial duels when positioned inside his own penalty box.",
    "categories": [
      "Premium"
    ],
    "image": "/skills/60.png"
  },
  {
    "id": 61,
    "nameZh": "紧急回防",
    "nameEn": "Shadow Hunt",
    "description": "担任后腰或后卫、对手传球打身后时，提高速度相关能力。",
    "descriptionEn": "Increases speed-related abilities when this player is a DMF, RB, LB or CB and an opponent's pass is played behind them.",
    "categories": [
      "Premium"
    ],
    "image": "/skills/61.png"
  },
  {
    "id": 62,
    "nameZh": "队长",
    "nameEn": "Captaincy",
    "description": "成为场上队伍精神支柱，减轻全队疲劳影响。",
    "descriptionEn": "Become the team's inspiration on the pitch, reducing the effects of fatigue for the entire team.",
    "categories": [
      "Other"
    ],
    "image": "/skills/62.png"
  },
  {
    "id": 63,
    "nameZh": "进攻号手",
    "nameEn": "Attack Trigger",
    "description": "持球时提高其他队友的进攻意识。",
    "descriptionEn": "Increases all other teammates' Attacking Awareness when this player has control of the ball.",
    "categories": [
      "Premium"
    ],
    "image": "/skills/63.png"
  },
  {
    "id": 64,
    "nameZh": "超级候补",
    "nameEn": "Super-sub",
    "description": "下半场替补登场时提高球员能力。",
    "descriptionEn": "Improves player's abilities when introduced after the second half mark.",
    "categories": [
      "Other"
    ],
    "image": "/skills/64.png"
  },
  {
    "id": 65,
    "nameZh": "战斗精神",
    "nameEn": "Fighting Spirit",
    "description": "受到对手压迫时较少损失踢球或头球精准度，也较少受疲劳影响。",
    "descriptionEn": "Rarely loses kicking or heading accuracy when pressured by an opponent, and is less affected by fatigue.",
    "categories": [
      "Other"
    ],
    "image": "/skills/65.png"
  },
  {
    "id": 66,
    "nameZh": "进攻提速",
    "nameEn": "Attacking Surge",
    "description": "位于进攻半场且队友持球时，提高速度相关能力。",
    "descriptionEn": "Increases speed-related abilities when this player is in the attacking half and a teammate has the ball.",
    "categories": [
      "Premium"
    ],
    "image": "/skills/66.png"
  }
];
