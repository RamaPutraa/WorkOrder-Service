// is active faq
type isActiveFaqResponse = ApiResponse<Company>;

// Unified FAQ item (TEXT or PDF)
type FaqItem = {
	id: number;
	title: string;
	content: string;
	type: "TEXT" | "PDF";
	file_url: string | null;
	mime_type: string | null;
	size: number | null;
	created_at: string;
};
type FaqListResponse = ApiResponse<FaqItem[]>;

// upload text
type FaqTextResponse = ApiResponse<FaqItem>;
type FaqTextRequest = {
	title: string;
	content: string;
};

// upload file
type FaqFileResponse = ApiResponse<FaqFile>;
type FaqFileRequest = {
	title: string;
	file: File;
};

// delete FAQ
type FaqDeleteResponse = ApiResponse<null>;

type AIContent = {
	answer: string;
};
type AIResponse = ApiResponse<AIContent>;

type AIRequest = {
	companyId: string;
	question: string;
};
