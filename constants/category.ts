export interface FILTER_CATEGORY_TYPE {
  label:
    | "postType"
    | "postStatus"
    | "membershipType"
    | "membershipDuration"
    | "PTCount";
  categoryName: string;
  options: {
    value: string;
    optionName: string;
  }[];
}

export interface categoryPropsType extends FILTER_CATEGORY_TYPE {
  onSelect: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  value?: string;
  onInit?: (key: string, value: string) => void;
}

export const FIRST_FILTER_CATEGORY: FILTER_CATEGORY_TYPE[] = [
  {
    label: "postType",
    categoryName: "게시글 종류",
    options: [
      {
        value: "SELL",
        optionName: "팝니다",
      },
      {
        value: "BUY",
        optionName: "삽니다",
      },
    ],
  },

  {
    label: "membershipType",
    categoryName: "회원권 타입",
    options: [
      {
        value: "MEMBERSHIP_ONLY",
        optionName: "회원권",
      },
      {
        value: "MEMBERSHIP_WITH_PT",
        optionName: "회원권 + PT",
      },
      {
        value: "PT_ONLY",
        optionName: "PT",
      },
    ],
  },
];
export const SECOND_FILTER_CATEGORY: FILTER_CATEGORY_TYPE[] = [
  {
    label: "membershipDuration",
    categoryName: "회원권 기간",
    options: [
      {
        value: "months_0_3",
        optionName: "3개월 이하",
      },
      {
        value: "months_3_6",
        optionName: "3개월 ~ 6개월",
      },
      {
        value: "months_6_plus",
        optionName: "6개월 이상",
      },
    ],
  },
  {
    label: "postStatus",
    categoryName: "게시글 상태",
    options: [
      {
        value: "POSTING",
        optionName: "게시중",
      },
      {
        value: "SALE_COMPLETED",
        optionName: "판매완료",
      },
      {
        value: "PURCHASE_COMPLETED",
        optionName: "구매 완료",
      },
    ],
  },
  {
    label: "PTCount",
    categoryName: "PT 횟수",
    options: [
      {
        value: "PT_0_10",
        optionName: "10회 이하",
      },
      {
        value: "PT_10_25",
        optionName: "10-25회",
      },
      {
        value: "PT_25_plus",
        optionName: "25회 이상",
      },
    ],
  },
];
