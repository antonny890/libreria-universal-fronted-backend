-- Libreria Universal - esquema para MySQL Workbench.
-- Ejecutar completo desde MySQL Workbench. No elimina bases ni tablas existentes.

CREATE DATABASE IF NOT EXISTS `libreriauniversal`
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE `libreriauniversal`;

SET NAMES utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `migrations` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `migration` varchar(255) NOT NULL,
  `batch` int NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `users` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `email_verified_at` timestamp NULL DEFAULT NULL,
  `password` varchar(255) NOT NULL,
  `remember_token` varchar(100) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `phone` varchar(40) DEFAULT NULL,
  `role` varchar(20) NOT NULL DEFAULT 'client',
  `member_since` varchar(80) DEFAULT NULL,
  `loyalty_points` int unsigned NOT NULL DEFAULT 0,
  `favorite_genre` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `users_email_unique` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `password_reset_tokens` (
  `email` varchar(255) NOT NULL,
  `token` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `failed_jobs` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `uuid` varchar(255) NOT NULL,
  `connection` text NOT NULL,
  `queue` text NOT NULL,
  `payload` longtext NOT NULL,
  `exception` longtext NOT NULL,
  `failed_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `failed_jobs_uuid_unique` (`uuid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `personal_access_tokens` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `tokenable_type` varchar(255) NOT NULL,
  `tokenable_id` bigint unsigned NOT NULL,
  `name` varchar(255) NOT NULL,
  `token` varchar(64) NOT NULL,
  `abilities` text DEFAULT NULL,
  `last_used_at` timestamp NULL DEFAULT NULL,
  `expires_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `personal_access_tokens_token_unique` (`token`),
  KEY `personal_access_tokens_tokenable_type_tokenable_id_index` (`tokenable_type`, `tokenable_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `libros` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `titulo` varchar(255) NOT NULL,
  `autor` varchar(255) NOT NULL,
  `isbn` varchar(255) NOT NULL,
  `descripcion` text DEFAULT NULL,
  `categoria` varchar(255) DEFAULT NULL,
  `stock` int unsigned NOT NULL DEFAULT 0,
  `copias_disponibles` int unsigned NOT NULL DEFAULT 0,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `precio` decimal(10,2) NOT NULL DEFAULT 0.00,
  `precio_original` decimal(10,2) DEFAULT NULL,
  `imagen_url` longtext DEFAULT NULL,
  `tema_portada` varchar(32) DEFAULT NULL,
  `valoracion` decimal(3,2) NOT NULL DEFAULT 5.00,
  `numero_resenas` int unsigned NOT NULL DEFAULT 0,
  `paginas` int unsigned NOT NULL DEFAULT 1,
  `editorial` varchar(255) NOT NULL DEFAULT 'Editorial Universal',
  `anio` smallint unsigned NOT NULL DEFAULT 2026,
  `destacado` tinyint(1) NOT NULL DEFAULT 0,
  `mas_vendido` tinyint(1) NOT NULL DEFAULT 0,
  PRIMARY KEY (`id`),
  UNIQUE KEY `libros_isbn_unique` (`isbn`),
  KEY `libros_categoria_index` (`categoria`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `prestamos` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `user_id` bigint unsigned NOT NULL,
  `libro_id` bigint unsigned NOT NULL,
  `fecha_prestamo` date NOT NULL,
  `fecha_devolucion` date DEFAULT NULL,
  `estado` enum('pendiente','activo','devuelto','atrasado') NOT NULL DEFAULT 'activo',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `prestamos_user_id_foreign` (`user_id`),
  KEY `prestamos_libro_id_foreign` (`libro_id`),
  CONSTRAINT `prestamos_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `prestamos_libro_id_foreign` FOREIGN KEY (`libro_id`) REFERENCES `libros` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `categorias` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `nombre` varchar(255) NOT NULL,
  `descripcion` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `categorias_nombre_unique` (`nombre`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `pedidos` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `numero_pedido` varchar(24) NOT NULL,
  `user_id` bigint unsigned NOT NULL,
  `subtotal` decimal(10,2) NOT NULL,
  `descuento` decimal(10,2) NOT NULL DEFAULT 0.00,
  `envio` decimal(10,2) NOT NULL DEFAULT 0.00,
  `total` decimal(10,2) NOT NULL,
  `estado` varchar(30) NOT NULL DEFAULT 'Procesando',
  `nombre_cliente` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `direccion` varchar(255) NOT NULL,
  `ciudad` varchar(255) NOT NULL,
  `metodo_pago` varchar(30) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `pedidos_numero_pedido_unique` (`numero_pedido`),
  KEY `pedidos_user_id_foreign` (`user_id`),
  CONSTRAINT `pedidos_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `pedido_items` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `pedido_id` bigint unsigned NOT NULL,
  `libro_id` bigint unsigned NOT NULL,
  `titulo_libro` varchar(255) NOT NULL,
  `autor` varchar(255) NOT NULL,
  `imagen_url` text DEFAULT NULL,
  `cantidad` int unsigned NOT NULL,
  `precio` decimal(10,2) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `pedido_items_pedido_id_foreign` (`pedido_id`),
  KEY `pedido_items_libro_id_foreign` (`libro_id`),
  CONSTRAINT `pedido_items_pedido_id_foreign` FOREIGN KEY (`pedido_id`) REFERENCES `pedidos` (`id`) ON DELETE CASCADE,
  CONSTRAINT `pedido_items_libro_id_foreign` FOREIGN KEY (`libro_id`) REFERENCES `libros` (`id`) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Marca las migraciones aplicadas para que Laravel no intente recrear estas tablas.
INSERT INTO `migrations` (`migration`, `batch`)
SELECT '2014_10_12_000000_create_users_table', 1
WHERE NOT EXISTS (SELECT 1 FROM `migrations` WHERE `migration` = '2014_10_12_000000_create_users_table');
INSERT INTO `migrations` (`migration`, `batch`)
SELECT '2014_10_12_100000_create_password_reset_tokens_table', 1
WHERE NOT EXISTS (SELECT 1 FROM `migrations` WHERE `migration` = '2014_10_12_100000_create_password_reset_tokens_table');
INSERT INTO `migrations` (`migration`, `batch`)
SELECT '2019_08_19_000000_create_failed_jobs_table', 1
WHERE NOT EXISTS (SELECT 1 FROM `migrations` WHERE `migration` = '2019_08_19_000000_create_failed_jobs_table');
INSERT INTO `migrations` (`migration`, `batch`)
SELECT '2019_12_14_000001_create_personal_access_tokens_table', 1
WHERE NOT EXISTS (SELECT 1 FROM `migrations` WHERE `migration` = '2019_12_14_000001_create_personal_access_tokens_table');
INSERT INTO `migrations` (`migration`, `batch`)
SELECT '2026_10_03_010346_create_libros_table', 2
WHERE NOT EXISTS (SELECT 1 FROM `migrations` WHERE `migration` = '2026_10_03_010346_create_libros_table');
INSERT INTO `migrations` (`migration`, `batch`)
SELECT '2026_10_03_010351_create_prestamos_table', 2
WHERE NOT EXISTS (SELECT 1 FROM `migrations` WHERE `migration` = '2026_10_03_010351_create_prestamos_table');
INSERT INTO `migrations` (`migration`, `batch`)
SELECT '2026_10_03_020000_add_commerce_fields_to_libros_table', 2
WHERE NOT EXISTS (SELECT 1 FROM `migrations` WHERE `migration` = '2026_10_03_020000_add_commerce_fields_to_libros_table');
INSERT INTO `migrations` (`migration`, `batch`)
SELECT '2026_10_03_020100_create_categorias_table', 2
WHERE NOT EXISTS (SELECT 1 FROM `migrations` WHERE `migration` = '2026_10_03_020100_create_categorias_table');
INSERT INTO `migrations` (`migration`, `batch`)
SELECT '2026_10_03_020200_add_profile_fields_to_users_table', 2
WHERE NOT EXISTS (SELECT 1 FROM `migrations` WHERE `migration` = '2026_10_03_020200_add_profile_fields_to_users_table');
INSERT INTO `migrations` (`migration`, `batch`)
SELECT '2026_10_03_020300_create_pedidos_tables', 2
WHERE NOT EXISTS (SELECT 1 FROM `migrations` WHERE `migration` = '2026_10_03_020300_create_pedidos_tables');

INSERT IGNORE INTO `categorias` (`nombre`, `descripcion`, `created_at`, `updated_at`) VALUES
('Novelas', 'Narrativa, ficción y realismo mágico', NOW(), NOW()),
('Filosofía', 'Pensamiento clásico y contemporáneo', NOW(), NOW()),
('Ciencia', 'Divulgación científica y exploración', NOW(), NOW()),
('Historia', 'Civilizaciones y relatos de la humanidad', NOW(), NOW()),
('Matemáticas', 'Lógica y enigmas numéricos', NOW(), NOW()),
('Manga', 'Cómic japonés clásico y moderno', NOW(), NOW()),
('Cómics', 'Novela gráfica y narrativa visual', NOW(), NOW()),
('Arte', 'Historia del arte, estética y arquitectura', NOW(), NOW()),
('Poesía', 'Lírica universal y antologías', NOW(), NOW());

INSERT IGNORE INTO `libros` (
  `titulo`, `autor`, `isbn`, `descripcion`, `categoria`, `stock`, `copias_disponibles`,
  `precio`, `precio_original`, `imagen_url`, `tema_portada`, `valoracion`, `numero_resenas`,
  `paginas`, `editorial`, `anio`, `destacado`, `mas_vendido`, `created_at`, `updated_at`
) VALUES
('Cien Años de Soledad', 'Gabriel García Márquez', '978-0307474728', 'La historia de siete generaciones de la familia Buendía en el mítico pueblo de Macondo.', 'Novelas', 18, 18, 24.50, 28.00, '/src/assets/images/book_cien_anos_soledad_1790638655794.jpg', 'emerald', 4.90, 384, 471, 'Editorial Sudamericana', 1967, 1, 1, NOW(), NOW()),
('Cosmos', 'Carl Sagan', '978-8408169734', 'Una travesía científica y poética por el universo y nuestro lugar en él.', 'Ciencia', 12, 12, 29.90, 34.00, '/src/assets/images/book_cosmos_astronomia_1790638666212.jpg', 'navy', 4.90, 295, 384, 'Planeta Divulgación', 1980, 1, 1, NOW(), NOW()),
('Meditaciones', 'Marco Aurelio', '978-8424938239', 'Reflexiones estoicas sobre templanza, deber y serenidad.', 'Filosofía', 25, 25, 19.00, NULL, '/src/assets/images/book_filosofia_clasica_1790638673844.jpg', 'terracotta', 4.80, 420, 224, 'Gredos Clásicos', 180, 1, 1, NOW(), NOW()),
('El Hombre que Calculaba', 'Malba Tahan', '978-9501524345', 'Una aventura literaria de ingenio y problemas matemáticos en los caminos de Bagdad.', 'Matemáticas', 14, 14, 18.50, 22.00, NULL, 'amber', 4.70, 168, 288, 'Vergara Ediciones', 1938, 0, 1, NOW(), NOW()),
('Sapiens: De animales a dioses', 'Yuval Noah Harari', '978-8499926223', 'Una mirada a las revoluciones cognitiva, agrícola y científica que transformaron nuestra especie.', 'Historia', 20, 20, 26.00, NULL, NULL, 'slate', 4.80, 512, 496, 'Debate', 2014, 0, 1, NOW(), NOW()),
('Berserk (Edición Deluxe Vol. 1)', 'Kentaro Miura', '978-1506711980', 'La obra de fantasía oscura que sigue el viaje de Guts, el Espadachín Negro.', 'Manga', 8, 8, 49.90, 55.00, NULL, 'crimson', 5.00, 620, 696, 'Dark Horse / Panini', 2019, 1, 1, NOW(), NOW()),
('Historia del Arte', 'E.H. Gombrich', '978-0714898704', 'Un recorrido introductorio por las creaciones visuales, desde las pinturas rupestres hasta las vanguardias.', 'Arte', 9, 9, 45.00, NULL, NULL, 'amber', 4.90, 230, 688, 'Phaidon Press', 1950, 0, 0, NOW(), NOW()),
('Maus: Relato de un Superviviente', 'Art Spiegelman', '978-8439720713', 'Novela gráfica sobre el Holocausto y la relación entre un historietista y su padre superviviente.', 'Cómics', 15, 15, 23.50, NULL, NULL, 'slate', 4.90, 310, 296, 'Reservoir Books', 1991, 0, 0, NOW(), NOW()),
('Don Quijote de la Mancha', 'Miguel de Cervantes', '978-8420412146', 'Las andanzas del ingenioso hidalgo Alonso Quijano y su escudero Sancho Panza.', 'Novelas', 22, 22, 22.00, 25.00, NULL, 'terracotta', 4.90, 440, 1056, 'Real Academia Española', 1605, 0, 0, NOW(), NOW()),
('Así habló Zaratustra', 'Friedrich Nietzsche', '978-8420655383', 'Poema filosófico sobre la voluntad de poder, el eterno retorno y el Superhombre.', 'Filosofía', 11, 11, 21.00, NULL, NULL, 'navy', 4.60, 195, 432, 'Alianza Editorial', 1883, 0, 0, NOW(), NOW()),
('Breve Historia del Tiempo', 'Stephen Hawking', '978-8498922240', 'Una introducción a los agujeros negros, la flecha del tiempo y el origen del espacio-tiempo.', 'Ciencia', 16, 16, 20.50, NULL, NULL, 'navy', 4.70, 380, 256, 'Crítica', 1988, 0, 1, NOW(), NOW()),
('Antología Poética', 'Federico García Lorca', '978-8437604473', 'Selección de la lírica de Lorca, del Romancero gitano a Poeta en Nueva York.', 'Poesía', 14, 14, 17.00, NULL, NULL, 'emerald', 4.90, 140, 320, 'Cátedra', 1936, 0, 0, NOW(), NOW());