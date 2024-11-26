export interface FILTER_CATEGORY_TYPE {
  label: string;
  categoryName: string;
  options: {
    value: string;
    optionName: string;
  }[];
}

export interface categoryPropsType extends FILTER_CATEGORY_TYPE {
  onSelect: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}

export const FIRST_FILTER_CATEGORY: FILTER_CATEGORY_TYPE[] = [
  {
    label: 'postType',
    categoryName: '게시글 종류',
    options: [
      {
        value: 'sell',
        optionName: '팝니다',
      },
      {
        value: 'buy',
        optionName: '삽니다',
      },
    ],
  },
  {
    label: 'postStatus',
    categoryName: '게시글 상태',
    options: [
      {
        value: 'ing',
        optionName: '게시중',
      },
      {
        value: 'buyComplete',
        optionName: '구매완료',
      },
      {
        value: 'sellComplete',
        optionName: '판매완료',
      },
    ],
  },
  {
    label: 'membershipType',
    categoryName: '회원권 타입',
    options: [
      {
        value: 'membership',
        optionName: '회원권',
      },
      {
        value: 'membershipWithPT',
        optionName: '회원권 + PT',
      },
      {
        value: 'PTOnly',
        optionName: 'PT',
      },
    ],
  },
];
export const SECOND_FILTER_CATEGORY: FILTER_CATEGORY_TYPE[] = [
  {
    label: 'membershipDuration',
    categoryName: '회원권 기간',
    options: [
      {
        value: 'months_0_3',
        optionName: '3개월 이하',
      },
      {
        value: 'months_3_6',
        optionName: '3개월 ~ 6개월',
      },
      {
        value: 'months_6_plus',
        optionName: '6개월 이상',
      },
    ],
  },
  {
    label: 'PTCount',
    categoryName: 'PT 횟수',
    options: [
      {
        value: 'PT_0_10',
        optionName: '10회 이하',
      },
      {
        value: 'PT_10_25',
        optionName: '10-25회',
      },
      {
        value: 'PT_25_plus',
        optionName: '25회 이상',
      },
    ],
  },
];
