import { GoogleGenerativeAI } from "@google/generative-ai";

export interface GeminiPriceResult {
  recommendedPrice: number;
  rangeMin: number;
  rangeMax: number;
  complexity: string;
  complexityDesc: string;
  complexityPercent: number;
  demand: string;
  demandDesc: string;
  distance: number;
  distanceDesc: string;
  marketTrend: { day: string; price: number; isToday?: boolean }[];
  jobTitle: string;
  location: string;
  reasoning?: string;
}

export async function getGeminiSmartPrice(
  jobTitle: string,
  jobDesc?: string,
  location?: string
): Promise<GeminiPriceResult> {
  const apiKey = process.env.EXPO_PUBLIC_GEMINI_API_KEY || "";

  const defaultResult: GeminiPriceResult = {
    recommendedPrice: 250000,
    rangeMin: 200000,
    rangeMax: 300000,
    complexity: "Trung bình",
    complexityDesc: "Yêu cầu kiểm tra kỹ thuật tiêu chuẩn và dụng cụ cơ bản.",
    complexityPercent: 60,
    demand: "Cao",
    demandDesc: "Nhu cầu dịch vụ tại khu vực đang tăng nhẹ.",
    distance: 3.2,
    distanceDesc: "Bán kính di chuyển trung bình của các thợ trong khu vực.",
    marketTrend: [
      { day: "T2", price: 230000 },
      { day: "T3", price: 240000 },
      { day: "T4", price: 230000 },
      { day: "Hnay", price: 250000, isToday: true },
      { day: "T6", price: 270000 },
      { day: "T7", price: 290000 },
      { day: "CN", price: 280000 },
    ],
    jobTitle: jobTitle || "Công việc chung",
    location: location || "TP. Hồ Chí Minh",
  };

  if (!apiKey) {
    console.warn("EXPO_PUBLIC_GEMINI_API_KEY không được tìm thấy trong .env.");
    return defaultResult;
  }

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });

    const prompt = `Bạn là chuyên gia định giá dịch vụ và thợ sửa chữa/giúp việc tại Việt Nam cho ứng dụng TaskLy.
Hãy phân tích và đề xuất mức giá hợp lý bằng Việt Nam Đồng (VND) cho công việc sau:
- Tên công việc: "${jobTitle || "Dịch vụ chung"}"
- Mô tả chi tiết: "${jobDesc || "Không có mô tả"}"
- Địa điểm: "${location || "TP. Hồ Chí Minh"}"

Trả về KẾT QUẢ DUY NHẤT LÀ MỘT CHUỖI JSON HỢP LỆ (không kèm bất kỳ văn bản giải thích nào khác bên ngoài JSON) theo cấu trúc chính xác sau:
{
  "recommendedPrice": 250000,
  "rangeMin": 200000,
  "rangeMax": 300000,
  "complexity": "Trung bình",
  "complexityDesc": "Mô tả độ phức tạp ngắn gọn 1 câu",
  "complexityPercent": 60,
  "demand": "Cao",
  "demandDesc": "Mô tả nhu cầu ngắn gọn 1 câu",
  "distance": 3.2,
  "distanceDesc": "Khoảng cách thợ di chuyển trung bình",
  "marketTrend": [
    { "day": "T2", "price": 230000 },
    { "day": "T3", "price": 240000 },
    { "day": "T4", "price": 230000 },
    { "day": "Hnay", "price": 250000, "isToday": true },
    { "day": "T6", "price": 270000 },
    { "day": "T7", "price": 290000 },
    { "day": "CN", "price": 280000 }
  ]
}

Lưu ý:
1. Giá (recommendedPrice, rangeMin, rangeMax) phải là số nguyên đại diện cho VNĐ (VD: 250000, 150000, 500000). Giá khuyến nghị nằm giữa rangeMin và rangeMax.
2. complexityPercent là số nguyên từ 10 đến 100.
3. Tất cả thông tin bằng tiếng Việt chuyên nghiệp, sát với thị trường thực tế.`;

    const response = await model.generateContent(prompt);
    const text = response.response.text();

    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error("Không thể trích xuất JSON từ kết quả Gemini.");
    }

    const parsed = JSON.parse(jsonMatch[0]);

    return {
      recommendedPrice: Number(parsed.recommendedPrice) || defaultResult.recommendedPrice,
      rangeMin: Number(parsed.rangeMin) || defaultResult.rangeMin,
      rangeMax: Number(parsed.rangeMax) || defaultResult.rangeMax,
      complexity: parsed.complexity || defaultResult.complexity,
      complexityDesc: parsed.complexityDesc || defaultResult.complexityDesc,
      complexityPercent: Number(parsed.complexityPercent) || defaultResult.complexityPercent,
      demand: parsed.demand || defaultResult.demand,
      demandDesc: parsed.demandDesc || defaultResult.demandDesc,
      distance: Number(parsed.distance) || defaultResult.distance,
      distanceDesc: parsed.distanceDesc || defaultResult.distanceDesc,
      marketTrend: Array.isArray(parsed.marketTrend) ? parsed.marketTrend : defaultResult.marketTrend,
      jobTitle: jobTitle || defaultResult.jobTitle,
      location: location || defaultResult.location,
    };
  } catch (error) {
    console.error("Gemini Smart Price API Error:", error);
    return defaultResult;
  }
}
