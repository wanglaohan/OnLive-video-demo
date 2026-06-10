/*
 * @Author: jiansuiwang@rastar.com
 * @Date: 2026-05-03 22:44:46
 * @LastEditors: jiansuiwang@rastar.com
 * @LastEditTime: 2026-05-03 22:48:05
 * @FilePath: \onLiveVideo\src\data\dramas.ts
 */
export interface Drama {
  id: string
  title: string
  description: string
  episodes: string
  episodeCount: number
  tag?: string
  tags: string[]
  img: string
}

export const dramas: Drama[] = [
  {
    id: 'drama1',
    title: "家人受辱 我摊牌了战将身份",
    description: "退伍战将回归都市，为守护家人，不再隐忍。面对权贵的欺压与仇敌的暗算，他一人横扫千军，让所有看不起他的人付出代价。从此，整个都市都流传着他的传说。",
    episodes: "5 Ep",
    episodeCount: 5,
    tag: "HOT",
    tags: ["都市", "战神", "爽文"],
    img: "https://pub-3ba80cafa6fa4508a3e49ed1e2130af8.r2.dev/drama1/index.webp",
  },
  {
    id: 'drama2',
    title: "怀不上三胞胎后 我被村霸宠上天",
    description: "她是被全村嘲笑的可怜媳妇，因为怀不上孩子受尽冷眼。直到那个被称为村霸的男人闯进她的生活，用霸道又温柔的方式，让她明白什么叫做被宠上天。",
    episodes: "5 Ep",
    episodeCount: 5,
    tag: "HOT",
    tags: ["甜宠", "乡村", "逆袭"],
    img: "https://pub-3ba80cafa6fa4508a3e49ed1e2130af8.r2.dev/drama2/index.webp",
  },
  {
    id: '101',
    title: "The CEO's Revenge",
    description: "Betrayed by his own family and left for dead, Julian Thorne returns to the city five years later with a new identity and endless wealth. His target? The woman who orchestrated his downfall, and the empire she stole from him.",
    episodes: "99 Ep",
    episodeCount: 99,
    tag: "HOT",
    tags: ["New", "Thriller", "Romance"],
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuBb8RyumTVDUJvcmjP0wgebBzunDnPghx0negmgG1PxgledFBBUs8I3utvgIMVtDtrqmlm4MQYIdEH5zcnIxN1dD636ypvRqdl9ATwAKbqc9JXkxnRxram2U94VBpfe4zkvmz-mydXqpBu46TF0m6hiOoEemcyRWuntMbT56J-ooluI0cisGyVmT2K9jON-XgAwM2cSt99886h37vIHnZhiVESOLxY68ki5L-Ov_Orogk4Ww-iHr4HvIPP3IGuavppuaUs-mfrC1Rs",
  },
  {
    id: '102',
    title: "Shadow Heir",
    description: "The illegitimate son of a crime family returns to claim his place at the top. With enemies lurking in every shadow, he must use wit and force to survive the deadly game of succession.",
    episodes: "45 Ep",
    episodeCount: 45,
    tags: ["Action", "Crime", "Drama"],
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuADkiOuT5GbFojhcxqwBBT4aTgzR3N5tOp4mg09PbGnEm3T2Czxsi83UAOTOHDeLazlL0AgLSE113qarNOZj40ca7sMzQOl4BAtrNY7ywYWzKc6TAgYSH7kZzklgNd6qpXk-P21lzqoT4bpSbfNLyxu1NopQDp05LjJSlz8UyM-9QPiOmprFqZjdkpZDn7PTlU9koEREJ3B-q_pmqR-ZOpRBryzPpijxz7D4Qoyb1HK4LGX7fguLQeAp6HoodZlbG8Oq7Afp5ZArm0",
  },
  {
    id: '103',
    title: "Tears of a Billionaire",
    description: "A wealthy tycoon discovers that his fortune means nothing when love and family are at stake. In a world of luxury and betrayal, he must choose between his empire and his heart.",
    episodes: "120 Ep",
    episodeCount: 120,
    tags: ["Romance", "Drama", "Family"],
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuDXfgTBXeM4lJyNRg5jjHdFlEDYxnuUQ9QjPeGBGplV3yoN9myJkUQoorgyRi7RILXoIyrn-an_KHtBETCKISc-0lcbndI4ymctpqu_uZZaXpt-i5t9dv3-rnwb_vJVttnHPhIflZ6FTPrrTsdFnEn39SYw53KSNfdL4jRYAhO2WriZ0x8CulbLDvtsvLVeKEDN4feCXHKI39yfrIb3nKodCY_eXtBZTMPud-ELoSD8ObfEmg0Md6w1_HZ8uTjWyEkZP7dyLZYinWw",
  },
]

export const dramaMap = new Map<string, Drama>(dramas.map((d) => [d.id, d]))
