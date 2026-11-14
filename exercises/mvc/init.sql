SET NAMES utf8mb4;
CREATE DATABASE IF NOT EXISTS product_db
  CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE product_db;

DROP TABLE IF EXISTS products;
CREATE TABLE products (
  id           VARCHAR(36)   NOT NULL PRIMARY KEY,
  name         VARCHAR(255)  NOT NULL,
  price        DECIMAL(10,2) NOT NULL,
  discount     DECIMAL(10,2) NULL,
  review_count INT           NULL,
  image_url    VARCHAR(500)  NULL,
  is_deleted   TINYINT(1)    NOT NULL DEFAULT 0
);

INSERT INTO products (id, name, price, discount, review_count, image_url) VALUES
('1', 'เสื้อยืดคอกลมสีขาว', 299.00, 50.00, 125, 'https://picsum.photos/seed/tshirt/400'),
('2', 'USB-C Fast Charger 65W', 890.00, 100.00, 58, 'https://picsum.photos/seed/charger/400'),
('3', 'Mechanical Keyboard RGB', 2590.00, NULL, 33, 'https://picsum.photos/seed/keyboard/400');
