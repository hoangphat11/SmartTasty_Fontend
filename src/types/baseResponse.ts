export type SuccessResponse = {
  status: "success";
  data: unknown;
};

export type PaginatedSuccessResponse = SuccessResponse & {
  pagination: {
    current_page: number;
    per_page: number;
    total: number;
  };
};

export type ErrorResponse = {
  // the semantic error string, could be used to be displayed into UI
  message: string;
  // any custom data to describe for further error's information
  data: unknown;
  status: "error";
  code: number;
};
