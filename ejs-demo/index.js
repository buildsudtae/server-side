const express = require('express');
const app = express();

app.set('view engine', 'ejs'); // ค่า default ของโฟลเดอร์ views คือ ./views

app.get('/', (req, res) => {
  res.render('index', {
    title: 'หน้าแรก',
    user: { name: 'สมชาย' },
    products: ['สินค้า A', 'สินค้า B'],
    loggedIn: true,
    age: 20,
    htmlContent: '<strong>ข้อความตัวหนา</strong>',
  });
});

app.listen(3000, () => console.log('http://localhost:3000'));
