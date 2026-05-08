export interface FAQData {
  id: string;
  question: string;
  keywords?: string[];
}

export interface ChatMessage {
  id: string;
  sender: 'ai' | 'user';
  text: string;
  isButtonList?: boolean;
  buttons?: FAQData[];
}

export interface FaqChatbotProps {
  /**
   * Title displayed in the chat header (e.g. company name)
   */
  title?: string;

  companyId: string;
  
  /**
   * List of FAQs to be displayed initially
   */
  faqs?: FAQData[];

  /**
   * Current user's role, optional for styling/behavioral tweaks
   */
  role?: 'client' | 'staff' | 'owner' | 'admin';
}
