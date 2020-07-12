export enum MariaAction {
  PROCESS_NUMBERS = 1,
  REMOVE_LINKS = 2,
  FETCH_NUMBER_DETAIL = 3,
  POST_MAL_SERIES = 4,
  DOWNLOAD_GALLERY = 5,
  DOWNLOAD_GALLERY_STATUS = 6
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
  `
};

export enum CalculatorMode {
  DaysBetween = 'DaysBetween',
  DaysFrom = 'DaysFrom'
}
