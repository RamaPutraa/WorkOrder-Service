import { type FAQData } from "./faq-chatbot.types";

export const MOCK_FAQS: FAQData[] = [
	{
		id: "faq-1",
		question: "Bagaimana cara mereset password?",
		keywords: ["password", "sandi", "lupa", "reset"],
	},
	{
		id: "faq-2",
		question: "Di mana saya bisa melihat riwayat service?",
		keywords: ["riwayat", "history", "service", "pesanan"],
	},
	{
		id: "faq-3",
		question: "Bagaimana cara komplain teknisi?",
		keywords: ["komplain", "teknisi", "masalah", "buruk"],
	},
	{
		id: "faq-4",
		question: "Berapa lama masa garansi?",
		keywords: ["garansi", "lama", "waktu", "klaim"],
	},
];

export const MOCK_AI_RESPONSE = (message: string): string => {
	const lowerMessage = message.toLowerCase();

	if (lowerMessage.includes("password") || lowerMessage.includes("sandi")) {
		return "Untuk mereset password, Anda dapat masuk ke menu *Pengaturan Profil* lalu klik tombol *Reset Password*. Link akan dikirimkan ke email Anda yang terdaftar.";
	}

	if (lowerMessage.includes("riwayat") || lowerMessage.includes("history")) {
		return "Riwayat service Anda dapat dilihat pada tab *Riwayat (History)* di sidebar sebelah kiri pada dashboard Anda.";
	}

	if (lowerMessage.includes("garansi")) {
		return "Masa garansi default kami adalah 30 hari sejak pengerjaan selesai. Anda bisa melihat detail garansi pada halaman detail invoice service.";
	}

	if (lowerMessage.includes("komplain") || lowerMessage.includes("teknisi")) {
		return "Apabila Anda tidak puas dengan teknisi kami, silakan menekan tombol *Ajukan Komplain* pada halaman Detail Service, dan sebutkan alasannya. Tim kami akan segera menindaklanjuti.";
	}

	// Fallback response for keyword detection
	return "Maaf, saya tidak menemukan informasi terkait pertanyaan Anda di database dokumen kami saat ini. Silakan coba gunakan kata kunci lain atau tanyakan hal yang berbeda.";
};
