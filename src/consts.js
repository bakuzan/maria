export const PROCESS_NUMBERS = 1;
export const REMOVE_LINKS = 2;
export const FETCH_NUMBER_DETAIL = 3;
export const POST_MAL_SERIES = 4;

export const BASE_LINK_URL = 'https://nhentai.net/g/';
export const BASE_IMAGE_URL =
  'https://t.nhentai.net/galleries/{id}/cover.{ext}';
export const PROXY_URL = 'https://proxy.duckduckgo.com/iu/?u=';

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

export const excludedTags = ['seinen', 'shoujo', 'josei', 'shounen'];

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
