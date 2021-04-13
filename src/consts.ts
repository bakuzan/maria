export enum MariaAction {
  PROCESS_NUMBERS = 1,
  REMOVE_LINKS = 2,
  FETCH_NUMBER_DETAIL = 3,
  POST_MAL_SERIES = 4,
  DOWNLOAD_GALLERY = 5,
  DOWNLOAD_GALLERY_STATUS = 6,
  OPEN_IN_ERZA = 7
}

export enum PageAction {
  GET_GALLERY = 1,
  GET_GALLERY_NAME = 2,
  GET_LINK_NAME = 3,
  GET_PAGE_RSS_FEED = 4
}

export const PROXY_URL = 'https://proxy.duckduckgo.com/iu/?u=';
export const BASE_LINK_URL = 'https://nhentai.net/g/';
export const BASE_JURI_URL = 'http://localhost:9000/juri';
export const BASE_ERZA_URL = 'http://localhost:9003/';
export const BASE_IMAGE_URL =
  'https://t.nhentai.net/galleries/{id}/cover.{ext}';

export const extensionType = {
  p: 'png',
  j: 'jpg'
};

export const monthNames = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec'
];

export const excludedTags = ['seinen', 'shoujo', 'josei', 'shounen', 'kids'];

export const erzaGQL = {
  anime: `
  mutation MariaAnimePost($payload: AnimeCreateInput!) {
    erzaResponse: animeCreate(payload: $payload) {
      success
      errorMessages
      data {
        id
        title
      }
    }
  }
  `,
  animeExists: `
  query MariaAnimeExists($malId: Int) {
    erzaResponse: animeExists(malId: $malId) {
      exists
      id
    }
  }
  `,
  manga: `
  mutation MariaMangaPost($payload: MangaCreateInput!) {
    erzaResponse: mangaCreate(payload: $payload) {
      success
      errorMessages
      data {
        id
        title
      }
    }
  }
  `,
  mangaExists: `
  query MariaMangaExists($malId: Int) {
    erzaResponse: mangaExists(malId: $malId) {
      exists
      id
    }
  }
  `
};

export enum CalculatorMode {
  DaysBetween = 'DaysBetween',
  DaysFrom = 'DaysFrom'
}

export const LoaderHTML = `
  <div id="mariaLoader" class="maria-loading">
    <div class="maria-loading__box">
      <div class="maria-loading__orb"></div>
      <div class="maria-loading__orb"></div>
      <div class="maria-loading__orb"></div>
    </div>
  </div>
`;

export const LoaderHTMLMini = LoaderHTML.replace(
  'maria-loading',
  'maria-loading maria-loading--mini'
).replace('id="mariaLoader"', '');

export enum MariaAssetFileNames {
  Greeting = 'greeting.mp3',
  GoodMorning = 'good-morning.mp3',
  HelpYou = 'ill-help-you.mp3',
  GoodDay = 'im-sure-itll-be-a-good-day.mp3',
  Lovely = 'its-lovely.mp3',
  Preparations = 'preparations-complete.mp3',
  UseAsYouLike = 'use-as-you-like.mp3'
}
