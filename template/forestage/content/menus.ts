export interface Menu {
  name: string
  link?: string
  img?: string
  children?: Menu[]
}
export const menus: Menu[] = [
  {
    name: '作品',
    link: '/',
    img: 'https://picsum.photos/299/399?random=1',
    children: [
      {
        name: '分類',
        children: [
          {
            name: 'Web',
            link: '/',
          },
          {
            name: 'API',
            link: '/',
          },
          {
            name: 'LineBot',
            link: '/',
          },
        ]
      },
      {
        name: '分類',
        children: [
          {
            name: 'Web',
            link: '/',
          },
          {
            name: 'API',
            link: '/',
          },
          {
            name: 'LineBot',
            link: '/',
          },
        ]
      },
    ]
  },
  {
    name: '測試',
    link: '/',
    img: 'https://picsum.photos/299/399?random=1',
    children: [
      {
        name: '測試',
        children: [
          {
            name: '測試1',
            link: '/',
          },
          {
            name: '測試2',
            link: '/',
          },
          {
            name: '測試3',
            link: '/',
          },
          {
            name: '測試3',
            link: '/',
          },
          {
            name: '測試3',
            link: '/',
          },
          {
            name: '測試3',
            link: '/',
          },
          {
            name: '測試3',
            link: '/',
          },
          {
            name: '測試3',
            link: '/',
          },
          {
            name: '測試3',
            link: '/',
          },
        ]
      },
      {
        name: '測試',
        children: [
          {
            name: '測試1',
            link: '/',
          },
          {
            name: '測試2',
            link: '/',
          },
          {
            name: '測試3',
            link: '/',
          },
          {
            name: '測試3',
            link: '/',
          },
          {
            name: '測試3',
            link: '/',
          },
          {
            name: '測試3',
            link: '/',
          },
          {
            name: '測試3',
            link: '/',
          },
          {
            name: '測試3',
            link: '/',
          },
          {
            name: '測試3',
            link: '/',
          },
        ]
      },
    ]
  },
  {
    name: '作品',
    link: '/',
    img: 'https://picsum.photos/299/399?random=1',
    children: [
      {
        name: '分類',
        children: [
          {
            name: 'Web',
            link: '/',
          },
          {
            name: 'API',
            link: '/',
          },
          {
            name: 'LineBot',
            link: '/',
          },
        ]
      },
    ]
  },
  {
    name: '文章',
    link: '/',
  },
  {
    name: 'Music',
    link: '/',
  },
]
