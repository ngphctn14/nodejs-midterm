import { faker } from "@faker-js/faker/locale/vi";
import prisma from "./prisma.js";

const categories = ["general-feedback", "bug-report", "feature-request", "other"];
const statuses = ["pending", "approved", "rejected"];

const LENGTH = 70000;

const messages = [
  "Trang web rất dễ sử dụng, mình rất thích!",
  "Mình gặp lỗi khi gửi biểu mẫu, mong đội ngũ kiểm tra lại.",
  "Có thể thêm tính năng tải xuống báo cáo không?",
  "Cảm ơn vì đã hỗ trợ mình rất nhanh chóng.",
  "Mình thấy tốc độ tải trang hơi chậm.",
  "Giao diện đẹp và dễ nhìn, rất chuyên nghiệp.",
  "Mong có thêm phần hướng dẫn chi tiết hơn.",
  "Mình muốn đề xuất thêm mục phản hồi trực tiếp với admin.",
  "Hệ thống hoạt động ổn định, rất hài lòng!",
  "Khi đăng nhập, thỉnh thoảng bị lỗi 500.",
];

async function main() {
  console.log("🧨 Đang xóa dữ liệu cũ...");
  await prisma.feedback.deleteMany();

  const feedbacks = Array.from({ length: LENGTH }).map(() => ({
    name: faker.person.fullName(),
    email: faker.internet.email(),
    category: faker.helpers.arrayElement(categories),
    message: faker.helpers.arrayElement(messages),
    status: faker.helpers.arrayElement(statuses),
    createdAt: faker.date.recent({ days: 14 }),
  }));

  console.log("🌱 Đang thêm dữ liệu mẫu...");
  await prisma.feedback.createMany({ data: feedbacks });

  console.log(`✅ Đã seed thành công ${LENGTH} feedback!`);
}

main()
  .catch((err) => {
    console.error("❌ Lỗi khi seed dữ liệu:", err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

