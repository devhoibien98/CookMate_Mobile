import { GoogleGenerativeAI } from "@google/generative-ai";

// API Key của bạn
const API_KEY = "AIzaSyCJQjMf1a_VVrOWAqQ2z0Jdlgs-v06Osnk";

// Khởi tạo Google AI
const genAI = new GoogleGenerativeAI(API_KEY);

export interface AIMessage {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

export interface RecipeSuggestion {
  name: string;
  ingredients: string[];
  cookingTime: string;
  difficulty: "Easy" | "Medium" | "Hard";
  instructions: string[];
}

class AIService {
  private model = genAI.getGenerativeModel({ model: "gemini-pro" });

  // Chat với AI assistant
  async chatWithAI(message: string): Promise<string> {
    try {
      const prompt = `Bạn là một AI assistant chuyên về nấu ăn và công thức nấu ăn. Hãy trả lời câu hỏi sau một cách hữu ích và thân thiện: ${message}`;

      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      return response.text();
    } catch (error) {
      console.error("Error in AI chat:", error);
      throw new Error("Không thể kết nối với AI assistant. Vui lòng thử lại.");
    }
  }

  // Đề xuất công thức dựa trên nguyên liệu
  async suggestRecipeFromIngredients(
    ingredients: string[]
  ): Promise<RecipeSuggestion> {
    try {
      const prompt = `Dựa trên các nguyên liệu sau: ${ingredients.join(", ")}, 
      hãy đề xuất một công thức nấu ăn phù hợp. 
      Trả lời theo định dạng JSON với các trường:
      {
        "name": "tên món ăn",
        "ingredients": ["danh sách nguyên liệu cần thiết"],
        "cookingTime": "thời gian nấu",
        "difficulty": "Easy/Medium/Hard",
        "instructions": ["từng bước nấu ăn"]
      }`;

      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      // Parse JSON response
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }

      throw new Error("Không thể parse phản hồi từ AI");
    } catch (error) {
      console.error("Error in recipe suggestion:", error);
      throw new Error("Không thể tạo đề xuất công thức. Vui lòng thử lại.");
    }
  }

  // Phân tích dinh dưỡng của món ăn
  async analyzeNutrition(
    recipeName: string,
    ingredients: string[]
  ): Promise<string> {
    try {
      const prompt = `Hãy phân tích thông tin dinh dưỡng của món "${recipeName}" với các nguyên liệu: ${ingredients.join(
        ", "
      )}. 
      Bao gồm calories, protein, carbs, fat và các vitamin/khoáng chất chính.`;

      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      return response.text();
    } catch (error) {
      console.error("Error in nutrition analysis:", error);
      throw new Error("Không thể phân tích dinh dưỡng. Vui lòng thử lại.");
    }
  }

  // Tư vấn thay thế nguyên liệu
  async suggestIngredientSubstitutes(ingredient: string): Promise<string[]> {
    try {
      const prompt = `Hãy đề xuất 3-5 nguyên liệu có thể thay thế cho "${ingredient}" trong nấu ăn. 
      Trả lời dưới dạng danh sách, mỗi mục trên một dòng.`;

      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      return text
        .split("\n")
        .filter((line) => line.trim())
        .map((line) => line.replace(/^[-*]\s*/, "").trim())
        .slice(0, 5);
    } catch (error) {
      console.error("Error in ingredient substitution:", error);
      throw new Error(
        "Không thể đề xuất nguyên liệu thay thế. Vui lòng thử lại."
      );
    }
  }

  // Tư vấn kỹ thuật nấu ăn
  async getCookingTips(technique: string): Promise<string> {
    try {
      const prompt = `Hãy chia sẻ các mẹo và kỹ thuật nấu ăn về "${technique}". 
      Bao gồm cách thực hiện đúng cách và những lưu ý quan trọng.`;

      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      return response.text();
    } catch (error) {
      console.error("Error in cooking tips:", error);
      throw new Error("Không thể lấy mẹo nấu ăn. Vui lòng thử lại.");
    }
  }
}

export default new AIService();
