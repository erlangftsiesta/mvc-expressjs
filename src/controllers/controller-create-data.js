// Definisikan configurasi Database
const config = require('../configs/database');
// Gunakan library mysql
let mysql    = require('mysql');
// Buat koneksi
let pool     = mysql.createPool(config);

// Kirim error jika koneksi gagal
pool.on('error',(err)=> {
    console.error(err);
});

module.exports ={
    // Fungsi untuk merender file create-data yang ada pada folder 'src/views/create-data.ejs'
    formCreateData(req,res){
        res.render("create-data",{
            // Definisikan semua varibel yang ingin ikut dirender kedalam register.ejs
            url : 'http://localhost:5000/',
        });
    },
    // Fungsi untuk menyimpan data
    saveCreateData(req,res){
        // Tampung inputan user kedalam varibel username, email dan password
        let nama = req.body.nama;
        let kelas = req.body.kelas;
        let event = req.body.nama_event;
        let waktu = new Date();
        // Pastikan semua varibel terisi
        if (nama && kelas && event) {
            // Panggil koneksi dan eksekusi query
            pool.getConnection(function(err, connection) {
                if (err) throw err;
                connection.query(
                    `INSERT INTO transaksi (${nama},${kelas},${event},created_at) VALUES (?,?,?,?);`
                , [nama, kelas, event, waktu],function (error, results) {
                    if (error) throw error;
                    // Jika tidak ada error, set library flash untuk menampilkan pesan sukses
                    req.flash('color', 'success');
                    req.flash('status', 'Yes..');
                    req.flash('message', 'penambahan data berhasil');
                    setTimeout(5000)
                    // Kembali kehalaman login
                    res.redirect('/create-data');
                });
                // Koneksi selesai
                connection.release();
            })
        }
    }
}