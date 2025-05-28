-- Adminer 5.3.0 PostgreSQL 17.5 dump

\connect "libreria";

DROP TABLE IF EXISTS "alembic_version";
CREATE TABLE "public"."alembic_version" (
    "version_num" character varying(32) NOT NULL,
    CONSTRAINT "alembic_version_pkc" PRIMARY KEY ("version_num")
)
WITH (oids = false);

INSERT INTO "alembic_version" ("version_num") VALUES
('a47c170d0759');

DROP TABLE IF EXISTS "books";
CREATE TABLE "public"."books" (
    "id" uuid NOT NULL,
    "title" text NOT NULL,
    "author" text NOT NULL,
    "description" text,
    "price" numeric(10,2) NOT NULL,
    "stock" integer NOT NULL,
    "category_id" uuid,
    "cover_url" text,
    "file_url" text,
    "created_at" timestamp,
    CONSTRAINT "books_pkey" PRIMARY KEY ("id")
)
WITH (oids = false);

INSERT INTO "books" ("id", "title", "author", "description", "price", "stock", "category_id", "cover_url", "file_url", "created_at") VALUES
('d3050bdf-fd1e-447d-b2c0-f8eca52947ec',	'Orgullo y prejuicio',	'Jane Austen',	'Historia de amor e ironía sobre clases sociales en la Inglaterra del siglo XIX.',	8.99,	0,	'f70e247f-230a-42c5-bca1-ea8290892863',	'https://www.penguinlibros.com/co/2492523/orgullo-y-prejuicio.jpg',	'https://bucket-libreria.s3.amazonaws.com/orgullo_y_prejuicio.pdf?AWSAccessKeyId=ASIA3NXLYUWKXWMKGDDE&Signature=tjkM1OUbVWRxMJaHwBJ%2FdvPzZbo%3D&x-amz-security-token=IQoJb3JpZ2luX2VjEKX%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLWVhc3QtMSJGMEQCIAyAy5SI2yLoInxW1xyaMQi42wSUqffp7pm331TI2JRfAiBPW6qSRx82VQxDCVolD6F32ZM5wMBsVbExYLqLGTi9JCr4AghuEAAaDDc4NTM5OTcxOTMxNyIMmYs2e%2FgSZNBn8cZSKtUCiMok9SERGirTNTXg5P5CcDDGRHCER55LQ2kBx7UsYLgsUtimeq3ce7teLJjUTI%2BYXtH%2FqKTiwF35Xjt8SEgL58eruBJJ93Wp2JpNztEDK5o81KvSRE%2FL%2BU813zJm9LnEAwgkSy%2BLgKQBw0S4uDW75HhBraQiIx9m%2B8nvLDjytjvdaHJ6pWHsVDQasoLf8mzHrCkBXGGiHPhHLH%2FAsWSWfQtdp5H1sNPtiosHPx3%2B5tzhuVfATt0EIZmKHES%2FCu5Y%2BqnISKlZZI1AZ3f3CuRP1%2FfAcQqQ8QBTFPcmcloM69TbqEs0Tp%2Boof1kwnEzOmcqLyhurnOI8Y4cQCOXEvIzFspzZkOXCYoSB24xZxeTU6yKPRzjyY36gAzx1dHrdaG1GkGNSbaUphIyfgk22Lc5j20L90xHp2ja2qAyRcPNjBn158omut3TwfmWgIjJtnXvhQR6v3kwvqLawQY6nwF4s2XkiJDlBpc7WB4%2FOObNvtgRwuJm3W0amKun7xmaWAh%2BB6P7LrhCs88IEBMogY8WZ6Kbmu04jxr%2BC24j3P0gmp0BXV30G0R%2FL7LtyvTBWcT%2FfSuhvErRH71K9iG1Cd8AIDQelBAZc0AmqpC6yHvSDiY%2BoXqhrcu0FFsz5F87Y8HhKfGXQtDqFIVitGxS1bWi8PUo5jXWdThJR9%2BPgPw%3D&Expires=1749011390',	'2025-05-28 04:29:53.814029'),
('c258b796-c2c0-4641-a76d-573bf247db79',	'Las maquiavélicas historias del Monichu',	'Monichu',	'Historias de un monichu, mi consejo: No las lean. )',	15.99,	10,	'24b03b4f-de60-45cc-8be7-910aee0140bb',	'https://blog.trepcom.com/wp-content/uploads/2018/05/mono-maquina-de-escribir.gif',	'https://bucket-libreria.s3.amazonaws.com/Maquiavelico.pdf?AWSAccessKeyId=ASIA3NXLYUWK76XF5SMV&Signature=g3oDOz%2FcgSTt9fyRMhS7iU2%2FXTA%3D&x-amz-security-token=IQoJb3JpZ2luX2VjEKX%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLWVhc3QtMSJGMEQCIHxG0oitIAuK50%2FfuJdRbdhWd6d8k0lKk%2FBRJhmT2jhsAiA2mDsOvXAuTYviQY4MkmhnRxtB7Q7BY%2FQ8HttmppYeJCr4AghuEAAaDDc4NTM5OTcxOTMxNyIMBcp15tStHAnYq0r%2BKtUCa%2BDVTO25dCA05zA04D0oskngusHDXJj9ljRm%2FjUrV7fxU6H0rS4YAV%2BhuGgSqC%2FNBnrhA7tuJTX6eaqd16aXL%2FVqcR4uM%2FshjYhVZ0ljRfkfZaPVjBUknMnGU%2BRRTiijIEJhkyfhKS0LovmyFsUUUA280SvqZsOrh8xIjJUDegfAyPpuuGjNFmEd4mcjNsAuCzVcm1F%2Bmqf%2Fxu9YJpxYLCErhtdzR0Awdfmg%2F2daI4dbCzsOE6GG2eW9EAdoSVmBoMRh9lj6eyCcxnyD42lQyHVSx7MqahUmZGT5pEkHzhEMYt2mxrG4oFJ%2BlEhk6G1mHbpqcU36b7VIa0zq7eEV7Xm1kdsDDHxOzr0lrSPmAi0jb%2Btuq0AqJ3wHXEzQ1ov537XVLA2v9IJ5k71D80OCEf6OEKUJDEGPJwg2V6eyoTGM8ErZxWYuARfsMy2RcEug2XyH4kUw4qzawQY6nwEOZlZTPgzUIVkyn6TTC8qPHY2M%2Bob5YG4Nd8Kg4D0wQZ99SaiMpBJlaIGDa3VBnvnQMeq%2FHWBUXodPhzUOKL4VUUQNO%2Bu7OEVpoPZSPnr%2F96LcMnJsA4DQftomv%2F3AvPL0Fx9jo2O%2BPOsdmhaMAK98Fu7kOyBeB666vRyozpelzLng9ufRHV2wfgp3zLWsqSoB94do2EmN6jY41xO8q6E%3D&Expires=1749012774',	'2025-05-19 19:45:45.478617'),
('5149b888-7279-4ba5-aa46-7d1fef37759c',	'Crónica de una muerte anunciada',	'Gabriel García Márquez',	'La historia de un asesinato anunciado por todos menos prevenido por la víctima.',	15.98,	0,	'b2542f8b-1407-4156-9bb9-19e167ba7191',	'https://images.cdn2.buscalibre.com/fit-in/360x360/13/97/1397a4f28df5ed21f99177884f3276bd.jpg',	'https://bucket-libreria.s3.amazonaws.com/Cronica_de_una_Muerte_Anunciada.pdf?AWSAccessKeyId=ASIA3NXLYUWK34VVW3KN&Signature=trEQf2KhxgL%2FW6XnkAjnROUjKuA%3D&x-amz-security-token=IQoJb3JpZ2luX2VjEKb%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLWVhc3QtMSJHMEUCID%2B1WOMoFsuUJTusIXJSuUl1%2FfuIc%2F2pNeR9A%2FbnzOU9AiEA06I6PXrLyDS2RPYeP6P6j%2B%2FPcqfWjBKjfWzzpYXAIBQq%2BAIIbhAAGgw3ODUzOTk3MTkzMTciDMIHGBkypclLGLYGmSrVAk2MtjpQ1AcYwmuAiIl5dilsc6AmAityCxK5u5uPobpVXEW7ocZAfB%2BadSQ9%2FUKjZGLY1ALkLIxPZmP3RDKaiYDB8tGydQBdT4eireiDImg8dWRg1sObaxTXcqcDTq5SnkyYrCzAcVkjup%2Bp2LtNqof5alK2rGQr1I%2FDzn%2BakjWlhC7jNXNFzdx9gSitsIXK%2Bi5lgpz%2BHTgW0H3QvjgRYGbDPqPS8Wa6kg%2FwIpbJNHQ26O294BlN%2BxfyNkFSnDeAYqbzZQv3RQm05YM%2BeP4NRUiyOvc09ewg6fqmkMmikT2Rcjj9ciFBBMAwmUtyO0ebdUKM%2FfzNSCMaMheAhonqDnsBKiV5zCfAgVHUpH6Fr2FX1Qt5l%2ByDPsOW709vR2l3pvI7zYfq77kY29dinSdfvWSMNI%2F74z0RruKjt6oUVal3aZNn6PrMcEx4XerLQFBIlQWJyLdlMMez2sEGOp4BgTp3SxyQHBHjn5lo5nIZf8B%2Bmzsil4MWpSR0Y2Bxpiybf0SIL%2Fmf3X80G3qg0DOfQpKntcVM2LWN%2Fe4urkqFAyl9P3ndHzWA4IjIzPNBG35Da7sQc1QrOw5Jnvor%2BoFGuUnl%2BGRTzYf1L0QLIzmH4ekG9Ko7L1xbrHET630QI00lDkvUqu3Ysx0KOr%2BFQ2M%2Fzh8mbFS0leAD0hU40mg%3D&Expires=1749013575',	'2025-05-28 05:04:14.198526'),
('82a8d634-b4cf-42e1-8738-882340324240',	'La sombra del viento',	'Carlos Ruiz Zafón',	'Un joven descubre un libro que cambiará su vida en la Barcelona de la posguerra.',	7.99,	0,	'c3640a9f-3176-4dca-a7b0-ad60256d0c2a',	'https://images.cdn2.buscalibre.com/fit-in/360x360/4a/f8/4af862174ba709db62744f988c62e3b6.jpg',	'https://bucket-libreria.s3.amazonaws.com/La_sombra_del_viento.pdf?AWSAccessKeyId=ASIA3NXLYUWK22YWFBV3&Signature=5di7UPsusSVkFGzTjzl6xDkanBI%3D&x-amz-security-token=IQoJb3JpZ2luX2VjEKX%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLWVhc3QtMSJHMEUCIQD87dIWhJjR5KEhvFRCJUOVCWkvIbfXC6Kvr0SiPIXkRgIgHhSCXillWHFUfuEZrEp%2F8fX%2BSmCi2wYbyGKA24jNgTIq%2BAIIbRAAGgw3ODUzOTk3MTkzMTciDGeZ%2BkpJ9Jri2q1WhyrVAvqkJxRl8v8PisF2e3cQm%2BbRGY4Vwt%2FkS4NFCzRqNLu5nwmCoh5Dt1XTM%2F60RmJil4KiG4f0HPqIrjyYqGeGUprbxolaWErRDhCTQptyOF%2BiqXiWPQ0P83jGY6W1NEtglgrCxl4JEcNnwmN0IMAp%2FcXNc8Y5gMjICRVdMBrSRUMj8rAL1fytVO5JciOCOKCqMmm%2B8Luv2XsmL1k0tbnDbJF1zlB3iF1f%2F52D7Fb79va%2BZj0aK%2Fa%2F9EbKK7Jgv8vwMmYmBHGe8Z%2FreXfsYLKwr7UzlvJgIBzHEoc%2BzxmlurV%2BaHyZjtC4UP9oOpmm1KjcPrI0UrPupgqP%2FYwAPubmQDqUoUOyC9sT0awC%2FGUVYrihxvkO3a99vik9x5SQxqvn%2FQR0UOXdfdcaE5mIzi67IyUcm7LKXW6gTdMZEHVMfQ2PL2obT8ANiXSHSHT82RhyE7PG51oNMMSb2sEGOp4BSJyJDVztbXh3E4yFzwEyLrP2TZ%2BZNt3IR%2BrR%2Bl57iiSmvTG1HlmHsJswKp5kZBYq6evLkUeuhSv1zX2vbIvnxXaKKVdQYpv0vq3pwRmZ1K1kt3eF%2B0J7Hsi7ODRnVP3tcmHUCVdRjj%2BqTi5yHvVPnDIHr49svQlriS%2F4oWmoIUPtjCL3w6M%2Fh%2BXn1Qpe%2Blc5lUGgnoC2JdxdMaY1DK8%3D&Expires=1749010501',	'2025-05-28 04:15:02.999862'),
('e4687ee9-c49f-4644-bc5c-9ac20e137267',	'Fahrenheit 451',	'Ray Bradbury',	'Una distopía sobre un futuro donde los libros están prohibidos y quemados.',	4.99,	0,	'2dba4084-66d3-40b7-bdbb-4c7ca8c8ca07',	'https://www.tornamesa.co/imagenes/9789588/978958861195.GIF',	'https://bucket-libreria.s3.amazonaws.com/Fahrenheit_451.pdf?AWSAccessKeyId=ASIA3NXLYUWK3PODDDK4&Signature=3ibsp%2BWX31tUmBR7PC9QngEd8a0%3D&x-amz-security-token=IQoJb3JpZ2luX2VjEKX%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLWVhc3QtMSJHMEUCIQDkSRyE8FQbAaWMNK6mLhSrDfjCnezRyoQD7MGWf1%2FGCAIgO9QYYYqjPJSV8gWil1AEZ5rkB7jiur8hlzewhKEkvI4q%2BAIIbhAAGgw3ODUzOTk3MTkzMTciDOx60AYZKvOY3DR0oirVAuNyfVAYcl%2FPTBb5%2FtMSAln%2FiSVOLmGzI2MVGAlv8%2FvQNa7voV5XMK5yMeKO19F%2BCup7BnB3z7m3gLgajkWcVnYPo5Frfi9pRU6HP9ILJQJbscsxBPb8sGEgO%2FVE2eC3m8wSVwl677TEZHTQex3mES0IlR6U9tDKZnij6Tbp5NcTiUXk1atTncX1cORvhtwqtcGYT5nC2PxInqybd%2FiLzK7Puu42qDXu3eCzCc4D2%2FAFcmAB0LlVEfIAyxQrVPNUuo1qHC8Rlwl1wgMPZQOZ%2Bo1gBAru%2BOPqquhZTOMfFQnyJAypBrtQUf%2BGjSTfKGRuPkf8wHHVz%2Fqsd357NkkMkC5EGqZJ7nszqPGlVgKS1YZ%2BhZgOkr6XO%2BsIrxToECCJx8TQdS6SfdwOUIAx5v9XEmw6adCNy69O6tokuSGTShkbiIf67nuGTMbJ6juu54JJIaVMWCaBMJqf2sEGOp4BbyCLHH9hICDNQVKH%2BbTsyUwbo5FIcXITil6My%2BBlegiE4RLLce6vxItpfG2iI%2FEuBzxz8bIo9et8Eg8CokXt%2BxC6qH%2BS6lhxiI7Dw8DOaYkQb5DFh%2BfSMbvqNP3Ixa%2BekepOX4ZYX7YasduAtRrM%2FCIn2DHrA%2Bq2BSBMxw09TnryDvFjnaUCoc4tW6l4AVpAPs7CtGT%2Bdat5MVCrLgI%3D&Expires=1749010971',	'2025-05-28 04:22:52.048436'),
('bd35e686-4b73-4e6d-9da7-3711faca8f64',	'De Junior a Senior en una semana',	'Monichu',	'Aprende programación con el mejor profesor de la historia, y digo de la historia porque hace parte de la historia.',	21.99,	10,	'b4669412-c15f-4300-9275-c7c56bf2b666',	'https://i.ytimg.com/vi/w56gsDarNHA/maxresdefault.jpg',	'https://bucket-libreria.s3.amazonaws.com/De%20Junior%20a%20Senior.pdf?AWSAccessKeyId=ASIA3NXLYUWK76XF5SMV&Signature=crslMU2mJhW1OjfBLHF%2FJDgOe1A%3D&x-amz-security-token=IQoJb3JpZ2luX2VjEKX%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLWVhc3QtMSJGMEQCIHxG0oitIAuK50%2FfuJdRbdhWd6d8k0lKk%2FBRJhmT2jhsAiA2mDsOvXAuTYviQY4MkmhnRxtB7Q7BY%2FQ8HttmppYeJCr4AghuEAAaDDc4NTM5OTcxOTMxNyIMBcp15tStHAnYq0r%2BKtUCa%2BDVTO25dCA05zA04D0oskngusHDXJj9ljRm%2FjUrV7fxU6H0rS4YAV%2BhuGgSqC%2FNBnrhA7tuJTX6eaqd16aXL%2FVqcR4uM%2FshjYhVZ0ljRfkfZaPVjBUknMnGU%2BRRTiijIEJhkyfhKS0LovmyFsUUUA280SvqZsOrh8xIjJUDegfAyPpuuGjNFmEd4mcjNsAuCzVcm1F%2Bmqf%2Fxu9YJpxYLCErhtdzR0Awdfmg%2F2daI4dbCzsOE6GG2eW9EAdoSVmBoMRh9lj6eyCcxnyD42lQyHVSx7MqahUmZGT5pEkHzhEMYt2mxrG4oFJ%2BlEhk6G1mHbpqcU36b7VIa0zq7eEV7Xm1kdsDDHxOzr0lrSPmAi0jb%2Btuq0AqJ3wHXEzQ1ov537XVLA2v9IJ5k71D80OCEf6OEKUJDEGPJwg2V6eyoTGM8ErZxWYuARfsMy2RcEug2XyH4kUw4qzawQY6nwEOZlZTPgzUIVkyn6TTC8qPHY2M%2Bob5YG4Nd8Kg4D0wQZ99SaiMpBJlaIGDa3VBnvnQMeq%2FHWBUXodPhzUOKL4VUUQNO%2Bu7OEVpoPZSPnr%2F96LcMnJsA4DQftomv%2F3AvPL0Fx9jo2O%2BPOsdmhaMAK98Fu7kOyBeB666vRyozpelzLng9ufRHV2wfgp3zLWsqSoB94do2EmN6jY41xO8q6E%3D&Expires=1749012707',	'2025-05-19 00:38:35.454454'),
('485dfd18-83ca-448b-9e43-59426d674d3a',	'La vida de un Monichu',	'Monichu',	'Autobiografía de la vida de un monichu. Criaturas extrañas y horribles que habitan el planeta, lo mejor es que no se reproduzcan, por el bien de la humanidad.',	14.99,	10,	'24b03b4f-de60-45cc-8be7-910aee0140bb',	'https://static.dw.com/image/70682545_605.jpg',	'https://bucket-libreria.s3.amazonaws.com/La%20vida%20monichu.pdf?AWSAccessKeyId=ASIA3NXLYUWK76XF5SMV&Signature=Sfy5uX0GXzVjiPsnNS7rC4otbbs%3D&x-amz-security-token=IQoJb3JpZ2luX2VjEKX%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLWVhc3QtMSJGMEQCIHxG0oitIAuK50%2FfuJdRbdhWd6d8k0lKk%2FBRJhmT2jhsAiA2mDsOvXAuTYviQY4MkmhnRxtB7Q7BY%2FQ8HttmppYeJCr4AghuEAAaDDc4NTM5OTcxOTMxNyIMBcp15tStHAnYq0r%2BKtUCa%2BDVTO25dCA05zA04D0oskngusHDXJj9ljRm%2FjUrV7fxU6H0rS4YAV%2BhuGgSqC%2FNBnrhA7tuJTX6eaqd16aXL%2FVqcR4uM%2FshjYhVZ0ljRfkfZaPVjBUknMnGU%2BRRTiijIEJhkyfhKS0LovmyFsUUUA280SvqZsOrh8xIjJUDegfAyPpuuGjNFmEd4mcjNsAuCzVcm1F%2Bmqf%2Fxu9YJpxYLCErhtdzR0Awdfmg%2F2daI4dbCzsOE6GG2eW9EAdoSVmBoMRh9lj6eyCcxnyD42lQyHVSx7MqahUmZGT5pEkHzhEMYt2mxrG4oFJ%2BlEhk6G1mHbpqcU36b7VIa0zq7eEV7Xm1kdsDDHxOzr0lrSPmAi0jb%2Btuq0AqJ3wHXEzQ1ov537XVLA2v9IJ5k71D80OCEf6OEKUJDEGPJwg2V6eyoTGM8ErZxWYuARfsMy2RcEug2XyH4kUw4qzawQY6nwEOZlZTPgzUIVkyn6TTC8qPHY2M%2Bob5YG4Nd8Kg4D0wQZ99SaiMpBJlaIGDa3VBnvnQMeq%2FHWBUXodPhzUOKL4VUUQNO%2Bu7OEVpoPZSPnr%2F96LcMnJsA4DQftomv%2F3AvPL0Fx9jo2O%2BPOsdmhaMAK98Fu7kOyBeB666vRyozpelzLng9ufRHV2wfgp3zLWsqSoB94do2EmN6jY41xO8q6E%3D&Expires=1749012737',	'2025-05-19 00:28:00.706386'),
('29b62da9-7a92-4321-b861-c32391ed0261',	'Uno siempre vuelve a donde fue feliz',	'Monichu',	'Este corto relato relata una parte de mi vida, donde aplicando la filosofía monichu, creada por mi, monichu, llego a la conclusión de que uno siempre vuelve a donde fue feliz :)',	9.99,	10,	'8580e254-c741-4a68-979f-995a03ce0f4d',	'https://culturacientifica.com/app/uploads/2013/08/chet-phillips.jpg',	'https://bucket-libreria.s3.amazonaws.com/Feliz.pdf?AWSAccessKeyId=ASIA3NXLYUWK76XF5SMV&Signature=o04Ql4rgmalFKGz%2Far1tGLbJHSw%3D&x-amz-security-token=IQoJb3JpZ2luX2VjEKX%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLWVhc3QtMSJGMEQCIHxG0oitIAuK50%2FfuJdRbdhWd6d8k0lKk%2FBRJhmT2jhsAiA2mDsOvXAuTYviQY4MkmhnRxtB7Q7BY%2FQ8HttmppYeJCr4AghuEAAaDDc4NTM5OTcxOTMxNyIMBcp15tStHAnYq0r%2BKtUCa%2BDVTO25dCA05zA04D0oskngusHDXJj9ljRm%2FjUrV7fxU6H0rS4YAV%2BhuGgSqC%2FNBnrhA7tuJTX6eaqd16aXL%2FVqcR4uM%2FshjYhVZ0ljRfkfZaPVjBUknMnGU%2BRRTiijIEJhkyfhKS0LovmyFsUUUA280SvqZsOrh8xIjJUDegfAyPpuuGjNFmEd4mcjNsAuCzVcm1F%2Bmqf%2Fxu9YJpxYLCErhtdzR0Awdfmg%2F2daI4dbCzsOE6GG2eW9EAdoSVmBoMRh9lj6eyCcxnyD42lQyHVSx7MqahUmZGT5pEkHzhEMYt2mxrG4oFJ%2BlEhk6G1mHbpqcU36b7VIa0zq7eEV7Xm1kdsDDHxOzr0lrSPmAi0jb%2Btuq0AqJ3wHXEzQ1ov537XVLA2v9IJ5k71D80OCEf6OEKUJDEGPJwg2V6eyoTGM8ErZxWYuARfsMy2RcEug2XyH4kUw4qzawQY6nwEOZlZTPgzUIVkyn6TTC8qPHY2M%2Bob5YG4Nd8Kg4D0wQZ99SaiMpBJlaIGDa3VBnvnQMeq%2FHWBUXodPhzUOKL4VUUQNO%2Bu7OEVpoPZSPnr%2F96LcMnJsA4DQftomv%2F3AvPL0Fx9jo2O%2BPOsdmhaMAK98Fu7kOyBeB666vRyozpelzLng9ufRHV2wfgp3zLWsqSoB94do2EmN6jY41xO8q6E%3D&Expires=1749012845',	'2025-05-19 00:50:54.368169'),
('4276b905-dd7e-4d14-a096-6b96b0a8e890',	'Cien años de soledad',	'Gabriel García Márquez',	'La saga de la familia Buendía en el mítico pueblo de Macondo.',	21.99,	0,	'b2542f8b-1407-4156-9bb9-19e167ba7191',	'https://images.cdn3.buscalibre.com/fit-in/360x360/61/8d/618d227e8967274cd9589a549adff52d.jpg',	'https://bucket-libreria.s3.amazonaws.com/100-a%C3%83%C2%B1os-de-soledad.pdf?AWSAccessKeyId=ASIA3NXLYUWK34VVW3KN&Signature=sVPnhxYdjmFRRC7YXZpBJFBD0TQ%3D&x-amz-security-token=IQoJb3JpZ2luX2VjEKb%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLWVhc3QtMSJHMEUCID%2B1WOMoFsuUJTusIXJSuUl1%2FfuIc%2F2pNeR9A%2FbnzOU9AiEA06I6PXrLyDS2RPYeP6P6j%2B%2FPcqfWjBKjfWzzpYXAIBQq%2BAIIbhAAGgw3ODUzOTk3MTkzMTciDMIHGBkypclLGLYGmSrVAk2MtjpQ1AcYwmuAiIl5dilsc6AmAityCxK5u5uPobpVXEW7ocZAfB%2BadSQ9%2FUKjZGLY1ALkLIxPZmP3RDKaiYDB8tGydQBdT4eireiDImg8dWRg1sObaxTXcqcDTq5SnkyYrCzAcVkjup%2Bp2LtNqof5alK2rGQr1I%2FDzn%2BakjWlhC7jNXNFzdx9gSitsIXK%2Bi5lgpz%2BHTgW0H3QvjgRYGbDPqPS8Wa6kg%2FwIpbJNHQ26O294BlN%2BxfyNkFSnDeAYqbzZQv3RQm05YM%2BeP4NRUiyOvc09ewg6fqmkMmikT2Rcjj9ciFBBMAwmUtyO0ebdUKM%2FfzNSCMaMheAhonqDnsBKiV5zCfAgVHUpH6Fr2FX1Qt5l%2ByDPsOW709vR2l3pvI7zYfq77kY29dinSdfvWSMNI%2F74z0RruKjt6oUVal3aZNn6PrMcEx4XerLQFBIlQWJyLdlMMez2sEGOp4BgTp3SxyQHBHjn5lo5nIZf8B%2Bmzsil4MWpSR0Y2Bxpiybf0SIL%2Fmf3X80G3qg0DOfQpKntcVM2LWN%2Fe4urkqFAyl9P3ndHzWA4IjIzPNBG35Da7sQc1QrOw5Jnvor%2BoFGuUnl%2BGRTzYf1L0QLIzmH4ekG9Ko7L1xbrHET630QI00lDkvUqu3Ysx0KOr%2BFQ2M%2Fzh8mbFS0leAD0hU40mg%3D&Expires=1749013993',	'2025-05-28 05:16:51.722397'),
('9c03626f-e5c1-4dc9-b77c-a7f028a6b4e6',	'Don Quijote de la Mancha',	'Miguel de Cervantes',	'Las aventuras de un hidalgo que enloquece leyendo novelas de caballería.',	25.99,	0,	'5cdd9d82-24d1-4d66-af9d-a5c654fbd93d',	'https://images.cdn2.buscalibre.com/fit-in/360x360/c0/63/c0633c2d4dd430b32d5e02475461f030.jpg',	'https://bucket-libreria.s3.amazonaws.com/quijote.pdf?AWSAccessKeyId=ASIA3NXLYUWK2B7NBQYN&Signature=AJkOuHKUDw2Rg%2B3%2Fed5S6yPZbDM%3D&x-amz-security-token=IQoJb3JpZ2luX2VjEKb%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLWVhc3QtMSJHMEUCIGy3Zc2%2F%2FTDgF%2F7w5yVRwEvGnGVoqcC%2BfgIfTecREAe1AiEAqWuhYLTVAV%2FEVkQYSLvI4aiRmXzbmfW6Sj9Bbt66xrIq%2BAIIbxAAGgw3ODUzOTk3MTkzMTciDFywzpl2blikmANcgyrVAuXOsb0CDCC8BrIHFjEurPmUlZVf2CTEN0Q5GC9vSYoIeEmTpKDiRekN0uakiW%2FIJRXQRQEj%2BFTeZp8r58mMZten4%2FVNeUBydV3bp0rheyb1PaEqB4oZMAGMhySsUajuE1fMLkgcULnFPOxEOhcPxewLa4cNNmUrqFskUOqPVoavzHij2uqIyRUIKAGT0VqEgJI2DbH%2FEUlCTZUuYfS9TQLbtOua8FKBInyrEWgxceRj0CfIHEKoy4MuyBPKN3P4GMA2ZOseiUgSoeHjm8bnJ%2FAKSBEUeQ3BGwFvfyJQok89z8gIp0NVfdd0UOLqYbJfjrY1YELcBWwBjhfGIEQulqumR3%2FBdh%2FR%2FNbyBCDJIkZbpZcHIU%2F%2FTideB3mA3e%2Fsyx%2BnfMhdAyL2JAlgpydtEDsx0BfcXcnCeJUVHD6TwgtSrDtZaD6W1q9tbeqRU%2B3tndVz1JO2MMq82sEGOp4BmseEdSdcf7CQfiFHZ4%2FlPJGZncyCwfmUdAJOdWeKWG8OCn6tCT2mfSjYK3zpHcZZK6FyEoP0qOUKz3K73IiCwOsg3IlVwo6N1Ux8yf%2BzaZ5mzdzjpW8ovp76RrskqBORzM2o0fv7JtTKU3dWZH7J%2FdZskvlDNGx2rcmcvSUd36k7r%2FegL%2BdzrXiiljigTZPdsYlSuIM%2F5bY4ekU6SGg%3D&Expires=1749014731',	'2025-05-28 05:25:38.272985'),
('0e4e8d7c-d54d-4176-aca4-4c8e5880d257',	'Los juegos del hambre',	'Suzanne Collins',	'Katniss Everdeen lucha por sobrevivir en una sociedad distópica cruel y televisada.',	11.99,	0,	'2dba4084-66d3-40b7-bdbb-4c7ca8c8ca07',	'https://m.media-amazon.com/images/M/MV5BMjIwMDkwZjUtMGU0ZC00NGQ5LWJhMWUtNWZjZDFjZjU2NTZiXkEyXkFqcGc@.V1_FMjpg_UX1000.jpg',	'https://bucket-libreria.s3.amazonaws.com/los_juegos_del_hambre.pdf?AWSAccessKeyId=ASIA3NXLYUWK34VVW3KN&Signature=d9X%2B6FtV6lwsTa%2BXhK5YY0ApiLk%3D&x-amz-security-token=IQoJb3JpZ2luX2VjEKb%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLWVhc3QtMSJHMEUCID%2B1WOMoFsuUJTusIXJSuUl1%2FfuIc%2F2pNeR9A%2FbnzOU9AiEA06I6PXrLyDS2RPYeP6P6j%2B%2FPcqfWjBKjfWzzpYXAIBQq%2BAIIbhAAGgw3ODUzOTk3MTkzMTciDMIHGBkypclLGLYGmSrVAk2MtjpQ1AcYwmuAiIl5dilsc6AmAityCxK5u5uPobpVXEW7ocZAfB%2BadSQ9%2FUKjZGLY1ALkLIxPZmP3RDKaiYDB8tGydQBdT4eireiDImg8dWRg1sObaxTXcqcDTq5SnkyYrCzAcVkjup%2Bp2LtNqof5alK2rGQr1I%2FDzn%2BakjWlhC7jNXNFzdx9gSitsIXK%2Bi5lgpz%2BHTgW0H3QvjgRYGbDPqPS8Wa6kg%2FwIpbJNHQ26O294BlN%2BxfyNkFSnDeAYqbzZQv3RQm05YM%2BeP4NRUiyOvc09ewg6fqmkMmikT2Rcjj9ciFBBMAwmUtyO0ebdUKM%2FfzNSCMaMheAhonqDnsBKiV5zCfAgVHUpH6Fr2FX1Qt5l%2ByDPsOW709vR2l3pvI7zYfq77kY29dinSdfvWSMNI%2F74z0RruKjt6oUVal3aZNn6PrMcEx4XerLQFBIlQWJyLdlMMez2sEGOp4BgTp3SxyQHBHjn5lo5nIZf8B%2Bmzsil4MWpSR0Y2Bxpiybf0SIL%2Fmf3X80G3qg0DOfQpKntcVM2LWN%2Fe4urkqFAyl9P3ndHzWA4IjIzPNBG35Da7sQc1QrOw5Jnvor%2BoFGuUnl%2BGRTzYf1L0QLIzmH4ekG9Ko7L1xbrHET630QI00lDkvUqu3Ysx0KOr%2BFQ2M%2Fzh8mbFS0leAD0hU40mg%3D&Expires=1749013777',	'2025-05-28 05:09:42.495292'),
('d9c4e420-f353-4b82-bb39-d867b97599e6',	'1984',	'George Orwell',	'Un clásico de la literatura distópica sobre un régimen totalitario.',	7.99,	0,	'2dba4084-66d3-40b7-bdbb-4c7ca8c8ca07',	'https://www.tornamesa.co/imagenes/9788418/978841893301.GIF',	'https://bucket-libreria.s3.amazonaws.com/1984.pdf?AWSAccessKeyId=ASIA3NXLYUWK34VVW3KN&Signature=b9BAAmqSj9AldS2LyH6G09KoNAA%3D&x-amz-security-token=IQoJb3JpZ2luX2VjEKb%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLWVhc3QtMSJHMEUCID%2B1WOMoFsuUJTusIXJSuUl1%2FfuIc%2F2pNeR9A%2FbnzOU9AiEA06I6PXrLyDS2RPYeP6P6j%2B%2FPcqfWjBKjfWzzpYXAIBQq%2BAIIbhAAGgw3ODUzOTk3MTkzMTciDMIHGBkypclLGLYGmSrVAk2MtjpQ1AcYwmuAiIl5dilsc6AmAityCxK5u5uPobpVXEW7ocZAfB%2BadSQ9%2FUKjZGLY1ALkLIxPZmP3RDKaiYDB8tGydQBdT4eireiDImg8dWRg1sObaxTXcqcDTq5SnkyYrCzAcVkjup%2Bp2LtNqof5alK2rGQr1I%2FDzn%2BakjWlhC7jNXNFzdx9gSitsIXK%2Bi5lgpz%2BHTgW0H3QvjgRYGbDPqPS8Wa6kg%2FwIpbJNHQ26O294BlN%2BxfyNkFSnDeAYqbzZQv3RQm05YM%2BeP4NRUiyOvc09ewg6fqmkMmikT2Rcjj9ciFBBMAwmUtyO0ebdUKM%2FfzNSCMaMheAhonqDnsBKiV5zCfAgVHUpH6Fr2FX1Qt5l%2ByDPsOW709vR2l3pvI7zYfq77kY29dinSdfvWSMNI%2F74z0RruKjt6oUVal3aZNn6PrMcEx4XerLQFBIlQWJyLdlMMez2sEGOp4BgTp3SxyQHBHjn5lo5nIZf8B%2Bmzsil4MWpSR0Y2Bxpiybf0SIL%2Fmf3X80G3qg0DOfQpKntcVM2LWN%2Fe4urkqFAyl9P3ndHzWA4IjIzPNBG35Da7sQc1QrOw5Jnvor%2BoFGuUnl%2BGRTzYf1L0QLIzmH4ekG9Ko7L1xbrHET630QI00lDkvUqu3Ysx0KOr%2BFQ2M%2Fzh8mbFS0leAD0hU40mg%3D&Expires=1749014306',	'2025-05-28 05:18:27.115875'),
('f03c2c16-c7f2-4cdb-9a82-7e11aaf26c1b',	'El Hobbit',	'J.R.R. Tolkien',	'Bilbo Bolsón se embarca en una aventura con enanos para recuperar un tesoro.',	11.99,	0,	'468c2a7d-cd45-4327-ac45-721d8abfe63c',	'https://static.wikia.nocookie.net/bibliotecadelatierramedia/images/8/88/Lelhobbit.jpg/revision/latest?cb=20130725103721&path-prefix=es',	'https://bucket-libreria.s3.amazonaws.com/J.R.R.%20Tolkien%20-%20El%20Hobbit.pdf?AWSAccessKeyId=ASIA3NXLYUWK3OEZSTZO&Signature=KDwp6PX2YaHbCACQ8apxftqqwkc%3D&x-amz-security-token=IQoJb3JpZ2luX2VjEKb%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLWVhc3QtMSJHMEUCIQDLpeghqum0654861iI%2Bj1RZH45DC1SnzDVJIvfpg267QIga%2BKPd%2B4QSIb9c%2BOm1aP9blwCAbyzDnAEbuFygDzuGaoq%2BAIIbxAAGgw3ODUzOTk3MTkzMTciDGUTgjFeh9tXeuDoQCrVAturKSm%2Fm%2FYmpSLh1EY2IGug7VDveiOyNgCbaVibesLudCnqpGsVKM24o%2Bk41D%2FZYu9Pby32qHJO7wXA%2BgorwPIKmjGja7DKFvW6hw%2BbeC7HhUtyhiHezx%2BsH%2BQYIwERdZwC8UOKzotWg5CUAHi7vZgotedpsvLXDuU8YemnMbMpwKqh33eA9t7%2FMxKae39Ym%2BVxfFedMlUTkWNmb5eueT08T9PUFlPh6VipGYK4Eq9edZDR3hz55HjFVjp7CbUbqOXliFJV1dEvYk9CNAJ%2BPCniwtUVgQq%2FAR1CShaTmpyJ1jNarFVH2n4%2Fz0nslhcHlDCNKHleCYogmapH1PrmwLwEJowAXvooY2UoAf6RYXqgyEYodRoD6P7WWFbUJAyqX%2BvjbqrR06pmNbiY5lvOYO9KAgkmkrjHYiVSpeHfbNWUGWlpmLvrzOoYlvgzTKJMgc4cqXvnMMm%2F2sEGOp4BmwscoWM%2FArCYIEUwLry3RPv65AnAmAgC%2Fc%2BAXbzPOvPlto4lwl7xPYMWKIFFfymrwhBltc2Z1rJqu2lItwSxcUNuEuzeWq%2BcW2MKqSnjToTcFVPsGK%2FELZinPj019lWKqU9Mw1asc8t8UmSOZTBD7qI8OkBMzXQ%2B8%2FJYf7S%2FyX8DHfSyN2t6069ezHXzXUy2Yf3PCoxJWdVyK93KKiw%3D&Expires=1749015114',	'2025-05-28 05:31:55.347457');

DROP TABLE IF EXISTS "cart_items";
CREATE TABLE "public"."cart_items" (
    "id" uuid NOT NULL,
    "user_id" uuid,
    "book_id" uuid,
    "quantity" integer NOT NULL,
    CONSTRAINT "cart_items_pkey" PRIMARY KEY ("id")
)
WITH (oids = false);

CREATE UNIQUE INDEX uq_user_book_cart ON public.cart_items USING btree (user_id, book_id);


DROP TABLE IF EXISTS "categories";
CREATE TABLE "public"."categories" (
    "id" uuid NOT NULL,
    "name" text NOT NULL,
    CONSTRAINT "categories_pkey" PRIMARY KEY ("id")
)
WITH (oids = false);

INSERT INTO "categories" ("id", "name") VALUES
('8580e254-c741-4a68-979f-995a03ce0f4d',	'Comedia'),
('24b03b4f-de60-45cc-8be7-910aee0140bb',	'Historia'),
('b4669412-c15f-4300-9275-c7c56bf2b666',	'Educación'),
('c3640a9f-3176-4dca-a7b0-ad60256d0c2a',	'Misterio'),
('2dba4084-66d3-40b7-bdbb-4c7ca8c8ca07',	'Ciencia Ficción'),
('f70e247f-230a-42c5-bca1-ea8290892863',	'Romance'),
('b2542f8b-1407-4156-9bb9-19e167ba7191',	'Realismo Mágico'),
('5cdd9d82-24d1-4d66-af9d-a5c654fbd93d',	'Clásico'),
('468c2a7d-cd45-4327-ac45-721d8abfe63c',	'Fantasía');

DROP TABLE IF EXISTS "order_items";
CREATE TABLE "public"."order_items" (
    "id" uuid NOT NULL,
    "order_id" uuid,
    "book_id" uuid,
    "quantity" integer NOT NULL,
    "price" numeric(10,2) NOT NULL,
    CONSTRAINT "order_items_pkey" PRIMARY KEY ("id")
)
WITH (oids = false);

INSERT INTO "order_items" ("id", "order_id", "book_id", "quantity", "price") VALUES
('4e596c3a-9f18-445e-b13b-6613bb7a0285',	'6889ad70-da90-4272-8182-7e63ff07930f',	'29b62da9-7a92-4321-b861-c32391ed0261',	1,	9.99),
('c3a1e7a7-01be-4c04-bad8-96ab6ff6ca7d',	'e789e70a-1172-413c-b3fd-c214cd7bd479',	'bd35e686-4b73-4e6d-9da7-3711faca8f64',	1,	21.99),
('79c8229f-0b2f-42c6-98b7-b656fdb5e99a',	'e789e70a-1172-413c-b3fd-c214cd7bd479',	'485dfd18-83ca-448b-9e43-59426d674d3a',	1,	14.99);

DROP TABLE IF EXISTS "orders";
CREATE TABLE "public"."orders" (
    "id" uuid NOT NULL,
    "user_id" uuid,
    "total_amount" numeric(10,2) NOT NULL,
    "status" text NOT NULL,
    "created_at" timestamp,
    CONSTRAINT "orders_pkey" PRIMARY KEY ("id")
)
WITH (oids = false);

INSERT INTO "orders" ("id", "user_id", "total_amount", "status", "created_at") VALUES
('6889ad70-da90-4272-8182-7e63ff07930f',	'a6f5d4be-85df-48eb-b85b-b90a5f360479',	9.99,	'completed',	'2025-05-27 04:27:14.267365'),
('e789e70a-1172-413c-b3fd-c214cd7bd479',	'a6f5d4be-85df-48eb-b85b-b90a5f360479',	36.98,	'completed',	'2025-05-28 03:04:33.264394');

DROP TABLE IF EXISTS "payments";
CREATE TABLE "public"."payments" (
    "id" uuid NOT NULL,
    "order_id" uuid NOT NULL,
    "amount" numeric(10,2) NOT NULL,
    "status" character varying(50) NOT NULL,
    "created_at" timestamp,
    "epayco_transaction_id" character varying(100),
    "epayco_response_code" integer,
    "epayco_response_message" text,
    "epayco_approval_code" character varying(50),
    "epayco_receipt" character varying(100),
    "payment_method" character varying(50),
    "card_last_four" character varying(4),
    "card_brand" character varying(20),
    "client_name" character varying(200),
    "client_email" character varying(200),
    "client_phone" character varying(20),
    "client_ip" inet,
    "processed_at" timestamp,
    "updated_at" timestamp,
    CONSTRAINT "payments_pkey" PRIMARY KEY ("id")
)
WITH (oids = false);

INSERT INTO "payments" ("id", "order_id", "amount", "status", "created_at", "epayco_transaction_id", "epayco_response_code", "epayco_response_message", "epayco_approval_code", "epayco_receipt", "payment_method", "card_last_four", "card_brand", "client_name", "client_email", "client_phone", "client_ip", "processed_at", "updated_at") VALUES
('247de035-6134-479b-aa01-0a9e00718a3b',	'6889ad70-da90-4272-8182-7e63ff07930f',	9.99,	'completed',	'2025-05-27 04:27:50.250523',	'285282608',	1,	'Aprobada',	NULL,	'285282608',	'credit_card',	'0326',	'Visa',	'Daniel Velasco',	'daniv@gmail.com',	'3333333333',	'172.20.0.5',	'2025-05-27 04:27:50.24537',	'2025-05-27 04:27:50.250526'),
('9729885c-e18e-4d90-8599-bcdf4b0e9673',	'e789e70a-1172-413c-b3fd-c214cd7bd479',	36.98,	'completed',	'2025-05-28 03:05:23.363796',	'285501795',	1,	'Aprobada',	NULL,	'285501795',	'credit_card',	'0326',	'Visa',	'Daniel Velasco',	'danivego2015@gmail.com',	'3333333333',	'172.20.0.5',	'2025-05-28 03:05:23.35988',	'2025-05-28 03:05:23.3638');

DROP TABLE IF EXISTS "user_hidden_books";
CREATE TABLE "public"."user_hidden_books" (
    "id" uuid NOT NULL,
    "user_id" uuid NOT NULL,
    "book_id" uuid NOT NULL,
    "hidden_at" timestamp,
    CONSTRAINT "user_hidden_books_pkey" PRIMARY KEY ("id")
)
WITH (oids = false);

CREATE UNIQUE INDEX unique_user_hidden_book ON public.user_hidden_books USING btree (user_id, book_id);


DROP TABLE IF EXISTS "user_sessions";
CREATE TABLE "public"."user_sessions" (
    "id" uuid NOT NULL,
    "user_id" uuid NOT NULL,
    "session_token" text NOT NULL,
    "device_type" character varying(20),
    "device_name" character varying(100),
    "browser" character varying(50),
    "os" character varying(50),
    "user_agent" text,
    "ip_address" inet,
    "location" character varying(100),
    "is_active" boolean,
    "last_activity" timestamp,
    "login_method" character varying(20),
    "failed_attempts" integer,
    "is_suspicious" boolean,
    "created_at" timestamp,
    "expires_at" timestamp NOT NULL,
    "revoked_at" timestamp,
    "session_metadata" text,
    CONSTRAINT "user_sessions_pkey" PRIMARY KEY ("id")
)
WITH (oids = false);

CREATE UNIQUE INDEX user_sessions_session_token_key ON public.user_sessions USING btree (session_token);

INSERT INTO "user_sessions" ("id", "user_id", "session_token", "device_type", "device_name", "browser", "os", "user_agent", "ip_address", "location", "is_active", "last_activity", "login_method", "failed_attempts", "is_suspicious", "created_at", "expires_at", "revoked_at", "session_metadata") VALUES
('da7e4a60-52ea-4c1b-b9f9-a3dbc3db6fff',	'a6f5d4be-85df-48eb-b85b-b90a5f360479',	'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkYW5pdkBnbWFpbC5jb20iLCJleHAiOjE4MjA4OTA0MTl9.q-3HUtq2NGHSHjIkbP-Z8IG6ttqrmiYbILsD1J9AwE0',	'desktop',	NULL,	'Firefox',	'Windows',	'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:139.0) Gecko/20100101 Firefox/139.0',	'172.20.0.5',	NULL,	'0',	'2025-05-27 02:53:39.798891',	'password',	0,	'0',	'2025-05-27 02:53:39.798896',	'2025-06-03 02:53:39.798899',	'2025-05-27 02:55:00.31067',	NULL),
('7a4f7909-470b-4bc8-9568-ea4059c71e32',	'a6f5d4be-85df-48eb-b85b-b90a5f360479',	'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkYW5pdkBnbWFpbC5jb20iLCJleHAiOjE4MjA4OTMzNDd9.IppCCCN-jbIgBCKf5Ang_tSGY8bXcOTbwQ93J3C3w7g',	'desktop',	NULL,	'Chrome',	'Windows',	'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/136.0.0.0 Safari/537.36',	'172.20.0.5',	NULL,	'0',	'2025-05-27 05:20:11.058621',	'password',	0,	'0',	'2025-05-27 03:42:27.123826',	'2025-06-03 03:42:27.123829',	'2025-05-27 17:56:41.394181',	NULL),
('aacb75ba-4d6f-459c-b303-2d734c4e3dcc',	'2bd78c88-8c1f-422a-b18f-f34390d57193',	'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJhZG1pbkBhZG1pbi5jb20iLCJleHAiOjE4MjA4OTA5NDh9.DuY-XPi5WdUMvL1OO5AerDbghZL-npRPLWWcYFWpHCE',	'desktop',	NULL,	'Chrome',	'Windows',	'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/136.0.0.0 Safari/537.36',	'172.20.0.5',	NULL,	'0',	'2025-05-27 03:30:51.981838',	'password',	0,	'0',	'2025-05-27 03:02:28.648952',	'2025-06-03 03:02:28.648954',	'2025-05-27 03:31:29.09254',	NULL),
('bc5574f3-8dcc-493e-b265-af9a67c0beef',	'2bd78c88-8c1f-422a-b18f-f34390d57193',	'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJhZG1pbkBhZG1pbi5jb20iLCJleHAiOjE4MjA5NTUzNzd9.crKn9Qj_eQ3cP6_SPvaAKjLD2TBfIkaJKNZggnZ5F-4',	'desktop',	NULL,	'Chrome',	'Windows',	'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/136.0.0.0 Safari/537.36',	'172.20.0.5',	NULL,	'0',	'2025-05-27 21:18:03.150854',	'password',	0,	'0',	'2025-05-27 20:56:17.46047',	'2025-06-03 20:56:17.460509',	'2025-05-27 21:18:17.405216',	NULL),
('22df1122-6db1-46d2-b346-e6f27c3c9a74',	'a6f5d4be-85df-48eb-b85b-b90a5f360479',	'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkYW5pdkBnbWFpbC5jb20iLCJleHAiOjE4MjA4OTI4OTN9.yPwN6kfpyhJ7dGAsxBF4-07hV3MQrtlftK1Gu7kpX3s',	'desktop',	NULL,	'Chrome',	'Windows',	'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/136.0.0.0 Safari/537.36',	'172.20.0.5',	NULL,	'0',	'2025-05-27 03:34:54.266773',	'password',	0,	'0',	'2025-05-27 03:34:53.886219',	'2025-06-03 03:34:53.886222',	'2025-05-27 03:41:30.244598',	NULL),
('84ba52bf-505f-44de-a525-8de51ed61234',	'a6f5d4be-85df-48eb-b85b-b90a5f360479',	'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkYW5pdkBnbWFpbC5jb20iLCJleHAiOjE4MjA4OTMyOTB9.Zc6hboj9qqEsSTKcCsWmpO9G1WBd8VGti4TnFhD6g_s',	'desktop',	NULL,	'Chrome',	'Windows',	'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/136.0.0.0 Safari/537.36',	'172.20.0.5',	NULL,	'0',	'2025-05-27 03:41:46.596466',	'password',	0,	'0',	'2025-05-27 03:41:30.254738',	'2025-06-03 03:41:30.254741',	'2025-05-27 03:42:08.432266',	NULL),
('813c6eac-6a30-421b-925f-e4f0bfd3efb1',	'a6f5d4be-85df-48eb-b85b-b90a5f360479',	'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkYW5pdkBnbWFpbC5jb20iLCJleHAiOjE4MjA4ODkyMjh9.MUDUCDGEY5WXWhCmDL3TZSs8W3bVZUkhVEzi73Z3cDs',	'desktop',	NULL,	'Chrome',	'Windows',	'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/136.0.0.0 Safari/537.36',	'172.20.0.5',	NULL,	'0',	'2025-05-27 03:02:08.154159',	'password',	0,	'0',	'2025-05-27 02:33:48.222211',	'2025-06-03 02:33:48.222213',	'2025-05-27 03:30:58.281865',	NULL),
('45efca7b-b2f3-4c5c-88b8-652b52e91e09',	'2bd78c88-8c1f-422a-b18f-f34390d57193',	'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJhZG1pbkBhZG1pbi5jb20iLCJleHAiOjE4MjA4OTI2ODl9.TPxEn8iNn_-ycOV4eMwHZ-QkAOIt7M2zYGCKA9IIsCc',	'desktop',	NULL,	'Firefox',	'Windows',	'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:139.0) Gecko/20100101 Firefox/139.0',	'172.20.0.5',	NULL,	'0',	'2025-05-27 03:31:37.746901',	'password',	0,	'0',	'2025-05-27 03:31:29.10166',	'2025-06-03 03:31:29.101663',	'2025-05-27 03:34:18.630397',	NULL),
('fe9108cc-8838-4cee-9de1-dd6241b735ff',	'a6f5d4be-85df-48eb-b85b-b90a5f360479',	'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkYW5pdkBnbWFpbC5jb20iLCJleHAiOjE4MjA4OTI3MzF9.C2q0XTAOyrlaWP4xoVcBU4Ke8H8a9AwRx2s7Bgm4aLc',	'desktop',	NULL,	'Firefox',	'Windows',	'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:139.0) Gecko/20100101 Firefox/139.0',	'172.20.0.5',	NULL,	'0',	'2025-05-27 03:32:43.207195',	'password',	0,	'0',	'2025-05-27 03:32:11.791657',	'2025-06-03 03:32:11.791659',	'2025-05-27 03:32:49.16214',	NULL),
('979636aa-b80c-4a03-8d2c-14a1ee86e820',	'a6f5d4be-85df-48eb-b85b-b90a5f360479',	'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkYW5pdkBnbWFpbC5jb20iLCJleHAiOjE4MjA4OTA4OTl9.0vS4Wv8YLcubQ8hNR1g77Ld_mJ5jD5bnaUzBVvS30mo',	'desktop',	NULL,	'Firefox',	'Windows',	'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:139.0) Gecko/20100101 Firefox/139.0',	'172.20.0.5',	NULL,	'0',	'2025-05-27 03:01:47.516493',	'password',	0,	'0',	'2025-05-27 03:01:39.047838',	'2025-06-03 03:01:39.047841',	'2025-05-27 03:01:54.011694',	NULL),
('6e35c01e-34ff-4dc9-9e06-ed8d48c84b01',	'a6f5d4be-85df-48eb-b85b-b90a5f360479',	'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkYW5pdkBnbWFpbC5jb20iLCJleHAiOjE4MjA4OTI2NTh9.GMkiqAhfVWgMH9h9pib37dSJYyCcvnmrNPzgoJDoZZw',	'desktop',	NULL,	'Chrome',	'Windows',	'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/136.0.0.0 Safari/537.36',	'172.20.0.5',	NULL,	'0',	'2025-05-27 03:32:05.454812',	'password',	0,	'0',	'2025-05-27 03:30:58.306526',	'2025-06-03 03:30:58.306529',	'2025-05-27 03:32:11.77059',	NULL),
('b6cd78c3-3b23-4def-98dd-04b701aa0334',	'a6f5d4be-85df-48eb-b85b-b90a5f360479',	'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkYW5pdkBnbWFpbC5jb20iLCJleHAiOjE4MjA4OTI3Njl9.i_wjckrNfCezAvnmWG7GWvnGCZkgG9xVurlqFRYiX3s',	'desktop',	NULL,	'Chrome',	'Windows',	'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/136.0.0.0 Safari/537.36',	'172.20.0.5',	NULL,	'0',	'2025-05-27 03:34:05.773955',	'password',	0,	'0',	'2025-05-27 03:32:49.169497',	'2025-06-03 03:32:49.169499',	'2025-05-27 03:34:53.878451',	NULL),
('b55ce5ca-2223-42bb-99af-317bac3f0973',	'2bd78c88-8c1f-422a-b18f-f34390d57193',	'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJhZG1pbkBhZG1pbi5jb20iLCJleHAiOjE4MjA4OTI4NTh9.BchYTjnWjTxxJHCD829p1zpsJIG9uWFyJXey4YgVJwA',	'desktop',	NULL,	'Chrome',	'Windows',	'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/136.0.0.0 Safari/537.36',	'172.20.0.5',	NULL,	'0',	'2025-05-27 03:34:22.204258',	'password',	0,	'0',	'2025-05-27 03:34:18.638206',	'2025-06-03 03:34:18.638208',	'2025-05-27 03:43:02.277215',	NULL),
('e892d6d1-bb55-46fe-8d97-c89b3d9c14ca',	'a6f5d4be-85df-48eb-b85b-b90a5f360479',	'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkYW5pdkBnbWFpbC5jb20iLCJleHAiOjE4MjA4OTMzMjh9.p0U0ZBVA9zCO0FFhYK-BCEZvmW9IhW4oA5vPtF_VUJM',	'desktop',	NULL,	'Firefox',	'Windows',	'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:139.0) Gecko/20100101 Firefox/139.0',	'172.20.0.5',	NULL,	'0',	'2025-05-27 03:42:08.613239',	'password',	0,	'0',	'2025-05-27 03:42:08.451433',	'2025-06-03 03:42:08.451436',	'2025-05-27 03:42:27.1161',	NULL),
('04de69ff-48ef-40ae-9557-ca72d87f01b6',	'2bd78c88-8c1f-422a-b18f-f34390d57193',	'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJhZG1pbkBhZG1pbi5jb20iLCJleHAiOjE4MjA4OTMzODJ9.HXUKAzGeNTlLEQAlawsuLjDs3LkhRS4Rl8KJO70RYdE',	'desktop',	NULL,	'Firefox',	'Windows',	'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:139.0) Gecko/20100101 Firefox/139.0',	'172.20.0.5',	NULL,	'0',	'2025-05-27 03:43:38.587898',	'password',	0,	'0',	'2025-05-27 03:43:02.294756',	'2025-06-03 03:43:02.29476',	'2025-05-27 20:56:17.412541',	NULL),
('ae0df960-329e-487c-84b0-161dcca953c3',	'a6f5d4be-85df-48eb-b85b-b90a5f360479',	'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkYW5pdkBnbWFpbC5jb20iLCJleHAiOjE4MjA5NDQ2MDF9.6tsglVd8ZzG0w878DsO1BJgcQbxZuELkk4XGSN83qOg',	'desktop',	NULL,	'Chrome',	'Windows',	'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/136.0.0.0 Safari/537.36',	'172.20.0.5',	NULL,	'0',	'2025-05-27 17:57:04.718735',	'password',	0,	'0',	'2025-05-27 17:56:41.411123',	'2025-06-03 17:56:41.411126',	'2025-05-27 22:11:08.559871',	NULL),
('4d5bdf24-e38a-4f6c-9f5d-70fbdcb30ff3',	'2bd78c88-8c1f-422a-b18f-f34390d57193',	'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJhZG1pbkBhZG1pbi5jb20iLCJleHAiOjE4MjA5NTc1MDV9.RkiMuwhFIsmytgLwqY-2Xw8Fr7QicEJeNvprOZ1_X1I',	'desktop',	NULL,	'Chrome',	'Windows',	'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/136.0.0.0 Safari/537.36',	'172.20.0.5',	NULL,	'0',	'2025-05-27 21:35:54.403067',	'password',	0,	'0',	'2025-05-27 21:31:45.067406',	'2025-06-03 21:31:45.067409',	'2025-05-27 21:38:11.009828',	NULL),
('23bdf2fc-1ad0-4a39-87cf-d2213872d77b',	'2bd78c88-8c1f-422a-b18f-f34390d57193',	'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJhZG1pbkBhZG1pbi5jb20iLCJleHAiOjE4MjA5NTY2OTd9.BAOsbLdN6uO_jTBZ9zvAXxB7M1PAyRZaS7JkNdpxcu0',	'desktop',	NULL,	'Chrome',	'Windows',	'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/136.0.0.0 Safari/537.36',	'172.20.0.5',	NULL,	'0',	'2025-05-27 21:31:16.468223',	'password',	0,	'0',	'2025-05-27 21:18:17.426475',	'2025-06-03 21:18:17.426479',	'2025-05-27 21:31:45.05453',	NULL),
('ea5b72b6-c10f-40e4-a4df-a931c1d390a5',	'2bd78c88-8c1f-422a-b18f-f34390d57193',	'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJhZG1pbkBhZG1pbi5jb20iLCJleHAiOjE4MjA5NTc4OTF9.OwK70gz4hvNyFAyZOQGkUTjxIJYI2pMxlhkx3mMoRw4',	'desktop',	NULL,	'Chrome',	'Windows',	'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/136.0.0.0 Safari/537.36',	'172.20.0.1',	NULL,	'0',	'2025-05-27 21:47:40.655832',	'password',	0,	'0',	'2025-05-27 21:38:11.019225',	'2025-06-03 21:38:11.019267',	'2025-05-27 21:47:58.996574',	NULL),
('1e459e68-3021-4e72-83b7-0b820b618b0b',	'2bd78c88-8c1f-422a-b18f-f34390d57193',	'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJhZG1pbkBhZG1pbi5jb20iLCJleHAiOjE4MjA5NzcxMjd9.UzC-3wc4oSZ1lpr3vmrwSlOe5sTH93DnQqx5lcvAASY',	'desktop',	NULL,	'Chrome',	'Windows',	'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/136.0.0.0 Safari/537.36',	'172.20.0.5',	NULL,	'0',	'2025-05-28 02:59:17.478208',	'encrypted_password',	0,	'0',	'2025-05-28 02:58:47.028544',	'2025-06-04 02:58:47.028548',	'2025-05-28 03:06:47.413243',	NULL),
('5f097c6c-7772-44ce-84b5-0a82e8f6b065',	'a6f5d4be-85df-48eb-b85b-b90a5f360479',	'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkYW5pdkBnbWFpbC5jb20iLCJleHAiOjE4MjA5NjE3Nzh9.mqStbOnU_L_w_2-CSlD_rNOeSPkFgpQclUwQl0h7YE4',	'desktop',	NULL,	'Chrome',	'Windows',	'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/136.0.0.0 Safari/537.36',	'172.20.0.5',	NULL,	'0',	'2025-05-27 22:42:58.606848',	'encrypted_password',	0,	'0',	'2025-05-27 22:42:58.398245',	'2025-06-03 22:42:58.398247',	'2025-05-27 22:46:49.910998',	NULL),
('b8fcc49c-1cf3-4a77-be8b-5bd36e7e9935',	'a6f5d4be-85df-48eb-b85b-b90a5f360479',	'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkYW5pdkBnbWFpbC5jb20iLCJleHAiOjE4MjA5NjIwMDl9.mF2F-wvu51EiXas7slpCB_dmlWHDAOdsak3OC-TflZ8',	'desktop',	NULL,	'Chrome',	'Windows',	'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/136.0.0.0 Safari/537.36',	'172.20.0.5',	NULL,	'0',	'2025-05-27 22:50:55.660577',	'encrypted_password',	0,	'0',	'2025-05-27 22:46:49.918139',	'2025-06-03 22:46:49.918141',	'2025-05-27 23:05:41.116831',	NULL),
('a4b576dd-b933-403b-9ae7-ad96b659ac2e',	'a6f5d4be-85df-48eb-b85b-b90a5f360479',	'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkYW5pdkBnbWFpbC5jb20iLCJleHAiOjE4MjA5NzcwOTZ9.7e-P0lsdMWOwVODczqum7Lq1C73ZgDlpVgvQSOsrah0',	'desktop',	NULL,	'Firefox',	'Windows',	'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:139.0) Gecko/20100101 Firefox/139.0',	'172.20.0.5',	NULL,	'0',	'2025-05-28 02:58:22.567617',	'encrypted_password',	0,	'0',	'2025-05-28 02:58:16.048222',	'2025-06-04 02:58:16.048224',	'2025-05-28 02:59:29.876416',	NULL),
('c5ae150e-23fb-4c7d-946f-90c95ccf77de',	'2bd78c88-8c1f-422a-b18f-f34390d57193',	'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJhZG1pbkBhZG1pbi5jb20iLCJleHAiOjE4MjA5ODI2ODN9.JY8nhlRWJtFXmWg0P5r3pM4r4zvaXnDNY6F-rXNXHbg',	'desktop',	NULL,	'Chrome',	'Windows',	'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/136.0.0.0 Safari/537.36',	'172.20.0.5',	NULL,	'1',	'2025-05-28 05:49:32.465678',	'encrypted_password',	0,	'0',	'2025-05-28 04:31:23.687282',	'2025-06-04 04:31:23.687283',	NULL,	NULL),
('66832eb6-7be0-4955-bd8f-29ddfb6c95d0',	'a6f5d4be-85df-48eb-b85b-b90a5f360479',	'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkYW5pdkBnbWFpbC5jb20iLCJleHAiOjE4MjA5NjE1MzF9.nuTPocw7zYqNK07y_j0OzGoMAtyuZK2vQxnBluDRkDU',	'desktop',	NULL,	'Chrome',	'Windows',	'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/136.0.0.0 Safari/537.36',	'172.20.0.5',	NULL,	'0',	'2025-05-27 22:39:23.946941',	'encrypted_password',	0,	'0',	'2025-05-27 22:38:51.290485',	'2025-06-03 22:38:51.290487',	'2025-05-27 22:42:58.387587',	NULL),
('2917bb45-54b8-4f11-a23d-ab2bf5a3792e',	'2bd78c88-8c1f-422a-b18f-f34390d57193',	'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJhZG1pbkBhZG1pbi5jb20iLCJleHAiOjE4MjA5NzcwODF9.NGPJTuym-NErVXyUYqj0Lu4lBqI9PLDrcgFhfktpo4g',	'desktop',	NULL,	'Firefox',	'Windows',	'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:139.0) Gecko/20100101 Firefox/139.0',	'172.20.0.5',	NULL,	'0',	'2025-05-28 02:58:04.472391',	'encrypted_password',	0,	'0',	'2025-05-28 02:58:01.373748',	'2025-06-04 02:58:01.373751',	'2025-05-28 02:58:47.020492',	NULL),
('80bf8ace-cc03-4e20-ad38-dc0351cd2554',	'a6f5d4be-85df-48eb-b85b-b90a5f360479',	'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkYW5pdkBnbWFpbC5jb20iLCJleHAiOjE4MjA5ODAxODh9.ykh_fLc6wbIt8t4n42tNMQCRfmp3vTtK0XeO40vT3qU',	'desktop',	NULL,	'Chrome',	'Windows',	'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/136.0.0.0 Safari/537.36',	'172.20.0.5',	NULL,	'1',	'2025-05-28 03:50:24.36187',	'encrypted_password',	0,	'0',	'2025-05-28 03:49:48.972099',	'2025-06-04 03:49:48.972134',	NULL,	NULL),
('846e5c7b-8e28-4fd8-8ac9-055110309ccf',	'2bd78c88-8c1f-422a-b18f-f34390d57193',	'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJhZG1pbkBhZG1pbi5jb20iLCJleHAiOjE4MjA5NTg0Nzh9.z_1LMam_M5cejvgjya9jAmIz5wWe6HhIPZXQ-F1v-08',	'desktop',	NULL,	'Chrome',	'Windows',	'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/136.0.0.0 Safari/537.36',	'172.20.0.5',	NULL,	'0',	'2025-05-27 22:11:01.566957',	'password',	0,	'0',	'2025-05-27 21:47:59.016986',	'2025-06-03 21:47:59.016989',	'2025-05-28 02:58:01.325312',	NULL),
('a175fe31-efa0-422a-8ccc-397749e23346',	'a6f5d4be-85df-48eb-b85b-b90a5f360479',	'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkYW5pdkBnbWFpbC5jb20iLCJleHAiOjE4MjA5NTk4Njh9.9xZwnJJD4zLtni1UW3Tr7gY7qX7MLhj0Rjpdf3kMLno',	'desktop',	NULL,	'Chrome',	'Windows',	'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/136.0.0.0 Safari/537.36',	'172.20.0.5',	NULL,	'0',	'2025-05-27 22:34:14.414998',	'password',	0,	'0',	'2025-05-27 22:11:08.568518',	'2025-06-03 22:11:08.568521',	'2025-05-27 22:38:51.26552',	NULL),
('098cac40-d60b-4a50-9c32-aeb44b20f293',	'a6f5d4be-85df-48eb-b85b-b90a5f360479',	'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkYW5pdkBnbWFpbC5jb20iLCJleHAiOjE4MjA5NjMxNDF9.Kwkppm0P5KIUyF3kMVjv7byNJbupFBQxjQ1pLk6H-2c',	'desktop',	NULL,	'Chrome',	'Windows',	'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/136.0.0.0 Safari/537.36',	'172.20.0.5',	NULL,	'0',	'2025-05-28 02:57:34.530982',	'encrypted_password',	0,	'0',	'2025-05-27 23:05:41.132765',	'2025-06-03 23:05:41.132768',	'2025-05-28 02:58:16.018822',	NULL),
('7669787c-8b0a-4fc7-af36-70ff07f055db',	'a6f5d4be-85df-48eb-b85b-b90a5f360479',	'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkYW5pdkBnbWFpbC5jb20iLCJleHAiOjE4MjA5NzcxNjl9.FrFl-7XPlKmkohbShtaUUO6gYK0kjA3WbivuthO4GvY',	'desktop',	NULL,	'Chrome',	'Windows',	'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/136.0.0.0 Safari/537.36',	'172.20.0.5',	NULL,	'0',	'2025-05-28 03:06:21.863407',	'encrypted_password',	0,	'0',	'2025-05-28 02:59:29.895115',	'2025-06-04 02:59:29.895117',	'2025-05-28 03:49:48.93095',	NULL),
('434974f6-b2b5-49d1-aacf-22e4d76d8ed8',	'2bd78c88-8c1f-422a-b18f-f34390d57193',	'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJhZG1pbkBhZG1pbi5jb20iLCJleHAiOjE4MjA5Nzc2MDd9.xCXdoj84hxjL6RqGe87yCFM9n-Y-Y4rhUmZHeULKigk',	'desktop',	NULL,	'Chrome',	'Windows',	'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/136.0.0.0 Safari/537.36',	'172.20.0.5',	NULL,	'0',	'2025-05-28 03:11:29.182631',	'encrypted_password',	0,	'0',	'2025-05-28 03:06:47.431945',	'2025-06-04 03:06:47.431948',	'2025-05-28 03:58:56.552841',	NULL),
('109712f4-249a-4209-ad70-320741896243',	'2bd78c88-8c1f-422a-b18f-f34390d57193',	'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJhZG1pbkBhZG1pbi5jb20iLCJleHAiOjE4MjA5ODA3MzZ9.4GnkcWOZ0MO2e4uYHcwAFhzO3gr9Gq5ij8SnEl_IX2k',	'desktop',	NULL,	'Chrome',	'Windows',	'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/136.0.0.0 Safari/537.36',	'172.20.0.5',	NULL,	'0',	'2025-05-28 04:29:53.925291',	'encrypted_password',	0,	'0',	'2025-05-28 03:58:56.574097',	'2025-06-04 03:58:56.5741',	'2025-05-28 04:31:23.66747',	NULL);

DROP TABLE IF EXISTS "users";
CREATE TABLE "public"."users" (
    "id" uuid NOT NULL,
    "name" text NOT NULL,
    "email" text NOT NULL,
    "password_hash" text NOT NULL,
    "role" character varying NOT NULL,
    "created_at" timestamp,
    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
)
WITH (oids = false);

CREATE UNIQUE INDEX users_email_key ON public.users USING btree (email);

INSERT INTO "users" ("id", "name", "email", "password_hash", "role", "created_at") VALUES
('a6f5d4be-85df-48eb-b85b-b90a5f360479',	'Daniv',	'daniv@gmail.com',	'$2b$12$juObZ2daVwKjN.tjuZzspuo/meUWgQr1DUBb5Pmn5EuCFt/LDAf9y',	'customer',	'2025-05-21 16:43:56.871698'),
('6148cbb8-f320-4a20-a599-38c23d5eb7cb',	'alert(XSS)',	'test@test.com',	'$2b$12$pbdGcyafqgyLPl6fSBT.kOyCvjBaFdzSFZb6cbCTYBVkH5hDDrQiW',	'customer',	'2025-05-23 20:51:41.03732'),
('2bd78c88-8c1f-422a-b18f-f34390d57193',	'Admin',	'admin@admin.com',	'$2b$12$.l.r36K6dnjiJlXqJOWr8ukEMAAu8Qn0axfIyIswqehsuL/M3dmH.',	'admin',	'2025-05-19 20:11:12.929388');

ALTER TABLE ONLY "public"."books" ADD CONSTRAINT "books_category_id_fkey" FOREIGN KEY (category_id) REFERENCES categories(id) NOT DEFERRABLE;

ALTER TABLE ONLY "public"."cart_items" ADD CONSTRAINT "cart_items_book_id_fkey" FOREIGN KEY (book_id) REFERENCES books(id) NOT DEFERRABLE;
ALTER TABLE ONLY "public"."cart_items" ADD CONSTRAINT "cart_items_user_id_fkey" FOREIGN KEY (user_id) REFERENCES users(id) NOT DEFERRABLE;

ALTER TABLE ONLY "public"."order_items" ADD CONSTRAINT "order_items_book_id_fkey" FOREIGN KEY (book_id) REFERENCES books(id) NOT DEFERRABLE;
ALTER TABLE ONLY "public"."order_items" ADD CONSTRAINT "order_items_order_id_fkey" FOREIGN KEY (order_id) REFERENCES orders(id) NOT DEFERRABLE;

ALTER TABLE ONLY "public"."orders" ADD CONSTRAINT "orders_user_id_fkey" FOREIGN KEY (user_id) REFERENCES users(id) NOT DEFERRABLE;

ALTER TABLE ONLY "public"."payments" ADD CONSTRAINT "payments_order_id_fkey" FOREIGN KEY (order_id) REFERENCES orders(id) NOT DEFERRABLE;

ALTER TABLE ONLY "public"."user_hidden_books" ADD CONSTRAINT "user_hidden_books_book_id_fkey" FOREIGN KEY (book_id) REFERENCES books(id) NOT DEFERRABLE;
ALTER TABLE ONLY "public"."user_hidden_books" ADD CONSTRAINT "user_hidden_books_user_id_fkey" FOREIGN KEY (user_id) REFERENCES users(id) NOT DEFERRABLE;

ALTER TABLE ONLY "public"."user_sessions" ADD CONSTRAINT "user_sessions_user_id_fkey" FOREIGN KEY (user_id) REFERENCES users(id) NOT DEFERRABLE;

-- 2025-05-28 05:50:31 UTC