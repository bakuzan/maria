interface Tag {
  name: string;
  type: string;
}

export interface TooltipContent {
  media_id: string;
  title: { english: string };
  tags: Tag[];
  images: {
    cover: { t: string };
  };
}
