// is active faq
type isActiveFaqResponse = ApiResponse<Company>;

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
