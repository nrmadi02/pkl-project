# Aplikasi Pendataan Konseling dan Pelanggaran Siswa SMA Negeri 1 Bati-Bati

## Bahasa Pemrograman

    Typescript

## Software Required

    Sebelum melakukan installasi diperlukan beberapa software atau tools pendukung.

    1. Xampp
       Untuk server lokal database.
    2. MySQL
       Untuk tipe database yang digunakan.
    3. Node JS
       Untuk runtime Javascript di lokal komputer.
    4. NPM
       Untuk mengelola package atau library yang digunakan.

## Cara Installasi

1. Lakukan installasi tools yang diperlukan diatas terlebih dahulu.
2. Buat database bernama ```db_pkl```.
3. Buat file dengan nama ```.env``` kemudian tuliskan didalam file tersebut ```DATABASE_URL="mysql://root:@127.0.0.1:3306/db_pkl"``` sesuai dengan lokal database komputer.
4. Jalankan ```npm install``` didalam folder project.
5. Jalankan ```npm run postinstall``` untuk menginstall. module dari prisma.
6. Jalankan ```npm run db:push``` untuk membuat tabel di dalam database.
7. Untuk menjalankan versi development bisa menggunakan perintah ```npm run dev```.
8. Sedangkan untuk menjalankan versi production/build bisa menggunakan perintah ```npm run build```, setelah berhasil jalankan folder build dengan mengetik perintah ```npm run start```.
