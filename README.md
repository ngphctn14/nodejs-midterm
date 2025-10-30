# NodeJS Midterm Project

## 1. Clone project về máy

Trước tiên, hãy tải project từ GitHub:

```bash
git clone https://github.com/ngphctn14/nodejs-midterm.git
```

Sau khi clone xong, di chuyển vào thư mục project:

```bash
cd nodejs-midterm
```

---

## 2. Cấu hình môi trường

Trước khi chạy, **đảm bảo file `.env.docker`** có trong thư mục `backend` với nội dung như sau:

```env
DATABASE_URL=postgresql://postgres:postgres@db:5432/feedback_hub?schema=public
REDIS_URL=redis://redis:6379

PORT=5000
```

---

## 3. Chạy dự án bằng Docker

### Cách 1: Docker Compose

Sử dụng lệnh sau để khởi chạy toàn bộ các service:

```bash
docker compose up -d
```

Lệnh này sẽ:
- Tạo container cho PostgreSQL, Redis, Backend, Frontend, và Nginx Load Balancer
- Chạy nền (`-d`) để không chiếm terminal

---

### Cách 2: Docker Swarm (triển khai dạng cluster)

Nếu bạn muốn chạy ở chế độ **Swarm**, làm theo các bước sau:

1. Khởi tạo Docker Swarm (chỉ cần làm **1 lần**):
   ```bash
   docker swarm init
   ```

2. Triển khai stack:
   ```bash
   docker stack deploy -c .\docker-compose.swarm.yml <tên-tùy-ý>
   ```

   Ví dụ:
   ```bash
   docker stack deploy -c .\docker-compose.swarm.yml feedback-app
   ```

---

## 4. Truy cập ứng dụng

Sau khi các container đã chạy thành công, mở trình duyệt và truy cập địa chỉ:

```
http://localhost:5173/
```