export interface QuizQuestion {
  question: string;
  options: string[];
  answer: string;
  hint?: string; // 💡 optional hint
}

export interface QuizSchema {
  type: string;
  items: {
    type: string;
    properties: {
      question: {
        title: string;
        type: string;
        description: string;
      };
      options: {
        title: string;
        type: string;
        items: { type: string };
        description: string;
      };
      answer: {
        title: string;
        type: string;
        description: string;
      };
      hint: {
        title: string;
        type: string;
        description: string;
      };
    };
    required: string[];
  };
}
