// is active faq
type isActiveFaqResponse = ApiResponse<Company>;

// Unified FAQ item (TEXT or PDF)
type FaqItem = {
	id: number;
	title: string;
	content: string;
	type: "TEXT" | "PDF";
	file_url?: string | null;
	nime_type?: string | null;
	size?: number | null;
	created_at: string;
};

type FaqListResponse = ApiResponse<FaqItem[]>;

// upload text
type FaqText = {
	id: number;
	title: string;
	content: string;
	type: "TEXT";
	fileurl: null;
	nimeType: null;
	size: null;
	created_at: string;
};
type FaqTextResponse = ApiResponse<FaqText>;
type FaqTextRequest = {
	title: string;
	content: string;
};

// upload file
type FaqFile = {
	id: number;
	title: string;
	content: string;
	type: "PDF";
	file_url: string;
	nime_type: "application/pdf";
	size: number;
	created_at: string;
};
type FaqFileResponse = ApiResponse<FaqFile>;

type FaqFileRequest = {
	title: string;
	file: File;
};

// delete FAQ
type FaqDeleteResponse = ApiResponse<null>;
