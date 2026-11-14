# คู่มือทำแลป (ฉบับย่อ) — Jest · API Testing · MVC · Cookies

เฉพาะขั้นตอน: **คำสั่ง → ไฟล์ที่ต้องสร้าง → รัน → ✅ จุดเช็ค** · โค้ดเต็มของทุกไฟล์อยู่ใน `tested-code.zip` (โฟลเดอร์ระบุไว้แต่ละแลป) และในเล่มสรุป · คำสั่งพิมพ์ใน PowerShell (VS Code กด Ctrl+`)

## 0. เตรียมเครื่อง (ครั้งเดียว)

- ติดตั้ง **Node.js LTS**, **VS Code** + extension **Live Server** และ **REST Client**, **Docker Desktop** (แลป 3), **Git Bash** (curl แลป 4), บัญชี **GitHub** + **Postman** เว็บ (แลป 2)
- เช็ค: `node -v` (v22+) · `npm -v` · `docker -v`
- ถ้าขึ้น `npm.ps1 cannot be loaded` → `Set-ExecutionPolicy -Scope CurrentUser RemoteSigned` แล้วเปิด terminal ใหม่
- 1 แลป = 1 โฟลเดอร์ · ทุก server ใช้ port 3000 → หยุดตัวเก่าด้วย Ctrl+C ก่อนรันตัวใหม่

## โครงสร้าง `tested-code.zip` — แต่ละโฟลเดอร์คืออะไร

แต่ละโฟลเดอร์คือ 1 โปรเจคที่รันได้เลย (มี `package.json` ในตัว) — ก่อนรันโปรเจคที่ใช้ express/bcrypt/ejs ให้ `cd` เข้าโฟลเดอร์แล้ว `npm install` ก่อนหนึ่งครั้ง

| โฟลเดอร์ | ใช้ทำอะไร |
|---|---|
| `jest-lab/` | แลป 1 ครบทุกไฟล์ (ฟังก์ชัน + เทส) รัน `npm install` แล้ว `npm test` |
| `postman/` | แลป 2 — ไฟล์ Collection ของ Postman + ตัวรัน newman |
| `mvc-lab/` | แลป 3 **ฉบับสมบูรณ์** (MVC ครบชั้น + EJS + CSS) = ปลายทางของ Step 1–6 |
| `steps/mvc0/` `steps/mvc2/` `steps/mvc-step3/` | แลป 3 โค้ดระหว่างทาง Step 0 / Step 2 / Step 3 (ไว้เทียบว่าแต่ละ Step หน้าตาเป็นยังไง) |
| `steps/ch0/` | ตัวอย่าง Express server ขั้นต่ำ (พื้นฐานภาค 0) |
| `steps/p2/` | แลป 4 Project II โค้ดระหว่างทาง (server เวอร์ชัน 1 และ 2) |
| `ejs-demo/` | แลป 3 ตัวอย่าง EJS tags ทุกแบบ (`<%= %>`, `<% %>`, `<%- %>`, include) |
| `cookies-p1/` | แลป 4 Project I ฉบับสมบูรณ์ (Session Cookie + Role + Logout) |
| `cookies-p2/` | แลป 4 Project II ฉบับสมบูรณ์ (เก็บรหัสด้วย bcrypt) |
| `exercises/jest/` | โจทย์ประยุกต์แลป 1 (isPalindrome / calculateBMI / calculateShipping) + เฉลย |
| `exercises/mvc/` | โจทย์ประยุกต์แลป 3 (404 / soft-deleted / หน้ารายละเอียด) = `mvc-lab` + ข้อที่ทำเพิ่ม |
| `exercises/cookies/` | โจทย์ประยุกต์แลป 4 ข้อ 1 (เพิ่ม Student + `/me` + `/lecturerData` + cookie 1 นาที) |
| `exercises/auth-full/` | โจทย์ประยุกต์แลป 4 ข้อ 2 (มัดรวม Project I+II: bcrypt + session + middleware) |

**ไฟล์แต่ละชนิดทำหน้าที่อะไร**

| ไฟล์ | หน้าที่ |
|---|---|
| `package.json` | ข้อมูลโปรเจค + รายชื่อ package + คำสั่ง (`npm test` / `start` / `dev`) |
| `.env` | ค่าเชื่อมต่อฐานข้อมูล (host, user, password, db name) — มีในโปรเจค MVC |
| `docker-compose.yml` | สั่งเปิด MySQL ใน Docker พร้อม port 3306 + รัน `init.sql` อัตโนมัติ |
| `init.sql` | สร้าง database + ตาราง `products` + ข้อมูลตัวอย่าง (ขึ้นต้น `SET NAMES utf8mb4;` กันภาษาไทยเพี้ยน) |
| `xxx.js` (Jest) | ฟังก์ชันที่จะทดสอบ — ต้องมี `module.exports` |
| `xxx.test.js` | ชุดเทส (Test Suite) ของฟังก์ชันนั้น — Jest หาไฟล์ลงท้าย `.test.js` เอง |
| `index.js` / `server.js` | จุดเริ่มของ server — ตั้งค่า express, เชื่อม middleware, เปิด port 3000 |
| `request.rest` | ชุด HTTP request สำหรับกด Send ด้วย extension REST Client (แทนการเปิดหน้าเว็บ) |
| `learn.js` (แลป 4) | ไฟล์ทดลอง bcrypt (hash + compare) รันเดี่ยว ๆ ด้วย `node learn.js` |

**โครงสร้างในโปรเจค MVC (`mvc-lab/`, `exercises/mvc/`)**

| โฟลเดอร์/ไฟล์ | หน้าที่ (MVC) |
|---|---|
| `configs/db.js` | เชื่อม MySQL ด้วย mysql2 แล้ว `module.exports` connection ให้ไฟล์อื่นใช้ร่วมกัน |
| `models/productModel.js` | **Model** — รวม SQL ทั้งหมด (query/insert/update/soft delete) แต่ละเมธอดรับ callback |
| `controllers/productController.js` | **Controller** — รับ request → เรียก Model → ส่ง JSON/หน้าเว็บกลับ (ไม่มี SQL) |
| `routes/productRoutes.js` | จับคู่ URL ของ API (`/api/...`) → เมธอดใน Controller |
| `routes/webRoutes.js` | จับคู่ URL ของหน้าเว็บ (`/`, `/products/:id`) → เมธอดที่ `res.render` |
| `views/products.ejs` | **View** — หน้าตาเว็บ (EJS) วนแสดงการ์ดสินค้า |
| `views/product-detail.ejs` | View หน้ารายละเอียดสินค้า (เฉพาะ `exercises/mvc/`) |
| `public/css/products.css` | ไฟล์ CSS ที่เสิร์ฟผ่าน `express.static('public')` |

**โครงสร้างในโปรเจค Cookies**

| ไฟล์ | หน้าที่ |
|---|---|
| `cookies-p1/index.html` | หน้าเว็บ Project I — ปุ่ม Login (Admin/Lecturer/Student) + Access + Logout |
| `cookies-p1/client.js` | โค้ดฝั่ง browser — `fetch` ไป API พร้อม `credentials:"include"` (แนบ cookie) |
| `cookies-p1/server.js` | API Project I — login สร้าง `sessionId` + Set-Cookie, ตรวจ role (401/403), logout |
| `cookies-p2/server.js` | API Project II — POST /users เก็บ bcrypt hash, POST /users/login เทียบรหัส |
| `cookies-p2/request.rest` | ชุด request ทดสอบ Project II (get/create/login) |

## แลป 1 · Unit Testing with Jest (zip: `jest-lab/`)

```powershell
mkdir my-testing; cd my-testing
npm init -y
npm install -D jest
npm pkg set scripts.test=jest     # = แก้ "test": "jest" ใน package.json
code .
```
✅ `npm test` → `No tests found, exiting with code 1` (ยังไม่มีไฟล์เทส = ปกติ)

สร้างไฟล์ทีละคู่ (`xxx.js` ต้องมี `module.exports`, `xxx.test.js` ต้อง `require("./xxx")`) แล้วรัน `npm test` ทุกครั้ง:

| ขั้น | ไฟล์ที่สร้าง | ✅ ผลรวมหลัง `npm test` |
|---|---|---|
| 1 เทสแรก | `sum.js` + `sum.test.js` | `Tests: 3 passed, 3 total` |
| 2 AAA Pattern | `calculateDiscount.js` + `.test.js` | `Test Suites: 2 passed` · `Tests: 5 passed` |
| 3 describe() | `validateUsername.js` + `.test.js` | `Tests: 15 passed` |
| 4 Boundary | `validatePassword.js` + `.test.js` | `Tests: 23 passed` |
| 5 Exercise สไลด์ (5 features) | `features.js` + `features.test.js` | `Test Suites: 5 passed` · `Tests: 54 passed` |
| 6 โจทย์ประยุกต์ (copy จาก `exercises/jest/`) | `exercises.js` + `.test.js` | `npx jest exercises` → `Tests: 12 passed` |

ทดลองบั๊ก Code I: แก้ `validatePassword.js` เป็น `password.length > 8` → `npx jest validatePassword` ต้อง FAIL เคส "8 chars" → แก้กลับเป็น `>=`

คำสั่งอื่น: `npx jest sum` (เฉพาะไฟล์) · `npx jest --verbose` (แสดงชื่อทุก test ไว้ทำตารางสรุป) · `npx jest --coverage` (% coverage) · `npx jest --watchAll` (รันใหม่เมื่อแก้ไฟล์)

## แลป 2 · API Testing (Postman) (zip: `postman/`)

**2.1 curl** (PowerShell ต้องพิมพ์ `curl.exe`):
```powershell
curl.exe -H "Accept: application/json" https://icanhazdadjoke.com/
curl.exe -H "Accept: text/plain" https://icanhazdadjoke.com/
```
✅ แบบแรกได้ JSON `{"id":...,"joke":...,"status":200}` · แบบสองได้ข้อความล้วน

**2.2 Postman** (https://web.postman.co → New → HTTP):
1. REST: GET `https://api.mathjs.org/v4/?expr=2*(7-3)` → ✅ `8`
2. SOAP: POST `http://webservices.oorsprong.org/websamples.countryinfo/CountryInfoService.wso` · Header `Content-Type: application/soap+xml` · Body raw XML `ListOfCountryNamesByName` (ดูเล่มสรุป 2.1) → ✅ XML รายชื่อประเทศ
3. GraphQL: POST `https://countries.trevorblades.com/graphql` · Body → GraphQL `query { country(code: "TH") { name capital currency } }` → ✅ ข้อมูลไทยเฉพาะ field ที่ขอ

**2.3 เปิด ToDo App บน Codespaces**
1. https://github.com/djwester/todo-list-testing → Code → Codespaces → **Create codespace on main**
2. Terminal: `make run-dev` → ✅ `Uvicorn running on http://127.0.0.1:8000`
3. popup → **Make Public** (หรือแท็บ Ports → คลิกขวา 8000 → Port Visibility → Public)
4. copy Forwarded Address = `<base-url>` → Postman สร้างตัวแปร `baseUrl` (URL เปลี่ยนทุกครั้งที่เปิด Codespace ใหม่)
5. เปิด `<base-url>` → Continue → ✅ เห็นหน้า ToDo App · F12 → Network → กด Add → request `tasks` = POST 201 (ใช้เป็นสูตรใน Postman)

**2.4 ส่ง request (user: `user1`, `user2`, `admin`, `anonymous` รหัส `12345`)**

| Request | ตั้งค่า | ✅ ผล |
|---|---|---|
| POST `{{baseUrl}}/tasks` | Body raw JSON `{"description":"Learn Coding","status":"Draft","created_by":"anonymous"}` | 201 + `id` |
| GET `{{baseUrl}}/tasks/2` | – | task ที่สร้าง |
| PUT `{{baseUrl}}/tasks/2` | JSON status `"In Progress"` (สะกดตรงเป๊ะ; อื่นได้ 422) | 200 · ใส่ `"id":100` ใน body id ก็ไม่เปลี่ยน |
| DELETE `{{baseUrl}}/tasks/2` | ไม่มี token | 401 `Not authenticated` |
| POST `{{baseUrl}}/token` | Body **x-www-form-urlencoded** `username=user1`, `password=12345` | `access_token` (ส่ง JSON = 422) |
| GET `{{baseUrl}}/user/me` | Authorization → **Bearer Token** = access_token | `{"username":"user1"}` |
| GET `/tasks?status=In%20Progress` · `/tasks?search=Keep` · `/user` · `/user/user1` | Params / Bearer | ตามตาราง Testing GET calls ในสไลด์ |
| PUT `/user/user2` ด้วย token user1 | Bearer user1 | 403 not authorized |
| GET `https://postman-echo.com/basic-auth` | Authorization → Basic `postman` / `password` | `{"authenticated":true}` · header `Basic cG9zdG1hbjpwYXNzd29yZA==` ถอด base64 ได้ `postman:password` |

`<base-url>/docs` = Swagger ดูทุก endpoint (API Discovery)

**2.5 Assignment — Break the API (หา 500):** PUT `{{baseUrl}}/tasks/99999` body `{"description":"x","status":"Draft"}` → ✅ **500 Internal Server Error** → แคปหน้าจอส่ง

**2.6 Test Script อัตโนมัติ:** Import `postman/todo.postman_collection.json` → Collection Variables `baseUrl` → Run collection (หรือ CLI):
```powershell
cd postman
npm install
npx newman run todo.postman_collection.json --env-var baseUrl=<base-url>
```
✅ `requests 11 / failed 0` · `assertions 15 / failed 0`

## แลป 3 · MVC + EJS (zip: `mvc-lab/` = ฉบับสมบูรณ์, `steps/` = โค้ดระหว่างทาง)

**3.1 Step 0 — โปรเจคตั้งต้น + ฐานข้อมูล**
```powershell
mkdir product-api; cd product-api
npm init -y
npm install express mysql2 dotenv
```
สร้าง `docker-compose.yml`, `init.sql`, `.env` (copy จาก `mvc-lab/`) และ `index.js` (copy จาก `steps/mvc0/`) แล้ว:
```powershell
docker compose up -d
docker compose logs -f db     # รอ "ready for connections ... port: 3306" แล้ว Ctrl+C
node index.js
```
✅ `🚀 Server is running at http://localhost:3000` + `✅ Connected to MySQL` · เปิด `http://localhost:3000/products` ได้ JSON 3 ชิ้น
(ไม่ใช้ Docker: XAMPP → phpMyAdmin → SQL → วาง `init.sql` → Go แล้วแก้ `.env` ให้ตรง)

**3.2 แยกเป็น MVC ทีละ Step** (หลังแต่ละ Step: Ctrl+C → `node index.js` → เช็คผล)

| Step | ทำ | ไฟล์ (zip) | ✅ เช็ค |
|---|---|---|---|
| 1 Config | `mkdir configs, controllers, models, public\css, routes, views` · ย้ายโค้ดเชื่อม DB | `configs/db.js` (`module.exports = db`) + index.js `require('./configs/db')` | `/products/search/Key` → Mechanical Keyboard RGB |
| 2 Routes | ย้าย route ไป router · index.js `app.use('/api', productRoutes)` | `steps/mvc2/routes/productRoutes.js`, `steps/mvc2/index.js` | `/api/products` → JSON · `/products` → `Cannot GET` (ถูก) |
| 3 Controller | ย้าย `(req,res)=>{}` ไปเป็นเมธอด · route ส่งชื่อฟังก์ชัน (ไม่มีวงเล็บ) | `steps/mvc-step3/controllers/`, `mvc-lab/routes/productRoutes.js` | `/api/products` ยังเหมือนเดิม |
| 4 Model + uuid | `npm install uuid` · SQL ทั้งหมดไป Model · Controller เรียก Model | `models/productModel.js`, `controllers/productController.js`, `request.rest` | ดูตาราง request.rest ด้านล่าง |
| 5 View EJS | `npm install ejs` · `app.set('view engine','ejs')` · `res.render('products', {products})` | `routes/webRoutes.js`, `views/products.ejs` | `http://localhost:3000/` → 🛍️ Product List + การ์ดสินค้า |
| 6 Static CSS | ย้าย `<style>` ไป `public/css/products.css` · `app.use(express.static('public'))` · `href="/css/products.css"` | `public/css/products.css`, `views/products.ejs`, `index.js` | หน้าเหมือนเดิม + `/css/products.css` เปิดได้ |

✅ **request.rest** (กด Send Request ทีละอัน): GET all → 3 ชิ้น · GET `/api/products/1` → เสื้อยืด · search `Key` → keyboard · POST สร้าง → 201 + uuid · POST ไม่มี price → **400** · PUT → updated · DELETE → soft-deleted (หายจาก GET all) · PUT `/restore/:id` → กลับมา

**3.3 โจทย์ประยุกต์ (zip: `exercises/mvc/`):** id ไม่พบ → 404 · `GET /api/products/deleted` (route ต้องอยู่ **ก่อน** `/products/:id`) · หน้า `/products/:id` (`product-detail.ejs`)
✅ `GET /api/products/999` → 404 `{"error":"Product not found"}` · DELETE 3 แล้ว `/api/products/deleted` เห็นสินค้า 3 · `/products/1` แสดงรายละเอียด
EJS tags ทุกแบบ: zip `ejs-demo/` → `npm install` → `node index.js` → เปิด `http://localhost:3000` (Ctrl+U ดู source)

## แลป 4 · Cookies (zip: `cookies-p1/`, `cookies-p2/`)

**4.1 ขโมย session:** https://the-internet.herokuapp.com/login → `tomsmith` / `SuperSecretPassword!` → F12 → Application → Cookies → copy ค่า `rack.session` → เปิด Incognito (Ctrl+Shift+N) → เพิ่ม cookie `rack.session` = ค่าที่ copy → เปิด `/secure` → ✅ เข้า Secure Area ได้โดยไม่ใส่รหัส (Session Hijacking)

**4.2 Project I — Session Cookie + Role**
```powershell
mkdir cookies-project1; cd cookies-project1
npm init -y
npm install express cors cookie-parser
```
สร้าง `index.html`, `client.js`, `server.js` (copy จาก `cookies-p1/`) → `node server.js` → คลิกขวา `index.html` → **Open with Live Server** (ต้องเป็น `http://127.0.0.1:5500` ตรงกับ origin ใน cors)

| กดปุ่ม | ✅ ผล |
|---|---|
| Access Admin-Only Data (ยังไม่ login) | `Unauthorized` |
| Login as Admin → Access | `Authed as Admin` → `Authorized: ...` |
| Login as Lecturer → Access | `Forbidden` |
| Login as Admin → Login as Student → Access | `Unauthorized` (โค้ดสไลด์ได้ `Authorized` = บั๊ก แก้ด้วย `SESSIONS.delete` + `clearCookie` ในก้อน `if (user == null)`) |
| Logout → Access | `Logged out` → `Unauthorized` |

✅ F12 → Application → Cookies → `http://localhost:3000` → `sessionId` (HttpOnly ✓ Secure ✓ SameSite None) · `document.cookie` ใน Console ได้ `''`

**4.3 Project II — bcrypt + REST Client** (หยุด Project I ก่อน)
```powershell
mkdir password-login; cd password-login
npm init -y
npm i express bcrypt
npm i --save-dev nodemon          # ขีดสั้น 2 ตัว (สไลด์พิมพ์ –save-dev ผิด)
npm pkg set scripts.start="node server.js" scripts.dev="node --watch server.js"
```
สร้าง `server.js`, `request.rest`, `learn.js` (copy จาก `cookies-p2/`) แล้ว:
- `node learn.js` → ✅ hash 2 ค่าขึ้นต้น `$2b$10$` แต่ไม่เหมือนกัน → `false` → compare `true`, `true`, `false`
- `npm run dev` → ใน `request.rest` Send ตามลำดับ → ✅ GET users `[]` → Create user `201` (terminal พิมพ์ salt + hash) → GET users เห็น `$2b$10$...` → Login `Success` · password ผิด `Not Allowed` · ชื่อไม่มี `400 Cannot find user`

**4.4 โจทย์ประยุกต์ (zip: `exercises/cookies/`, `exercises/auth-full/`)** — เข้าโฟลเดอร์ → `npm install` → `node server.js` (auth-full ใช้ `npm start`) → ทดสอบด้วย curl ใน **Git Bash**:
```bash
curl -c jar.txt -b jar.txt -X POST localhost:3000/login -H "Content-Type: application/json" -d '{"username":"Student"}' -i
curl -b jar.txt localhost:3000/me
curl -b jar.txt localhost:3000/lecturerData
```
✅ (exercises/cookies) `Set-Cookie: ...Max-Age=60...` · `/me` → `{"id":3,"username":"Student","role":"Student"}` · `/lecturerData` → `Forbidden`
✅ (exercises/auth-full: POST `/users` → POST `/users/login` → GET `/profile`, `/admin`) สมัคร → `Created` · `/profile` ก่อน login `Unauthorized` · login `Success` · `/profile` ได้ข้อมูล · `/admin` (Student) `Forbidden`

## ปัญหาที่เจอบ่อย

| อาการ | วิธีแก้ |
|---|---|
| `EADDRINUSE :::3000` | server ตัวเก่ายังรัน → Ctrl+C ใน terminal นั้น |
| Jest `No tests found` / `xxx is not a function` | ชื่อไฟล์ต้องลงท้าย `.test.js` / ลืม `module.exports` |
| `Cannot find module '../config/db'` | ชื่อโฟลเดอร์คือ `configs` ใช้ `../configs/db` |
| `ECONNREFUSED 127.0.0.1:3306` / `Access denied` | DB ยังไม่พร้อม → รอ `ready for connections` / `.env` ไม่ตรง docker-compose |
| ภาษาไทยเพี้ยน | `init.sql` ต้องมี `SET NAMES utf8mb4;` → `docker compose down -v` แล้ว `up -d` |
| `Failed to lookup view` / CSS ไม่ขึ้น | ejs ต้องอยู่ใน `views/` / ลืม `express.static('public')` หรือ href มี `/public` |
| `blocked by CORS policy` | เปิดหน้าด้วย Live Server ที่ `127.0.0.1:5500` ให้ตรง origin |
| login แล้วยัง `Unauthorized` | fetch ขาด `credentials: "include"` |
| `ERR_HTTP_HEADERS_SENT` | ลืม `return` หลัง `res.sendStatus(...)` |
| `Missing script: "dev"` | ยังไม่ได้ตั้ง scripts ใน package.json |
| Postman ต่อ Codespaces ไม่ได้ / 422 | Port ต้อง Public + อัปเดต `baseUrl` / body ผิดรูปแบบ (ดู `detail`) |