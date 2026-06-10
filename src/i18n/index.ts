import { createI18n } from 'vue-i18n';

const messages = {
  en: {
    nav: {
      home: 'Home',
      forYou: 'For You',
      myList: 'My List',
      profile: 'Profile',
    },
    home: {
      popular: 'Popular',
      original: 'Original+',
      female: 'Female',
      male: 'Male',
      revenge: 'Revenge',
      exclusive: 'Exclusive Originals',
      trending: 'Trending Now',
      viewAll: 'View All',
    },
    player: {
      unlock: 'Unlock Next Episode',
      original: 'Original',
      lastEpisode: 'This is the last episode',
      firstEpisode: 'This is the first episode',
    },
    common: {
      playNow: 'Play Now',
      hd: 'HD',
    }
  },
  zh: {
    nav: {
      home: '首页',
      forYou: '推荐',
      myList: '剧单',
      profile: '我的',
    },
    home: {
      popular: '热门',
      original: '独家',
      female: '女频',
      male: '男频',
      revenge: '复仇',
      exclusive: '官方独家',
      trending: '正在热播',
      viewAll: '全部',
    },
    player: {
      unlock: '解锁下一集',
      original: '独家',
      lastEpisode: '已经是最后一集',
      firstEpisode: '已经是第一集',
    },
    common: {
      playNow: '立即播放',
      hd: '高清',
    }
  }
};

const i18n = createI18n({
  legacy: false,
  locale: 'en',
  fallbackLocale: 'en',
  messages,
});

export default i18n;
