const express = require('express');
const session = require('express-session');
const bcrypt = require('bcryptjs');
const mysql = require('mysql2');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

const app = express();
const port = 3000;

const db = mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'file_storage_db'
});

db.connect(err => {
    if (err) {
        console.error('Koneksi database gagal:', err);
    } else {
        console.log('Terhubung ke database MySQL');
    }
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(session({
    secret: 'super-secret-key-12345',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
}));

app.use(express.static(path.join(__dirname, '../public')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/html/login.html'));
});

app.get('/:page.html', (req, res) => {
    const page = req.params.page;
    res.sendFile(path.join(__dirname, `../public/html/${page}.html`), (err) => {
        if (err) {
            res.status(404).send('Halaman tidak ditemukan');
        }
    });
});

app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

app.get('/check-login', (req, res) => {
    if (req.session.user) {
        res.status(200).json({ loggedIn: true, username: req.session.user.username });
    } else {
        res.status(200).json({ loggedIn: false });
    }
});

app.post('/register', async (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
        return res.status(400).json({ success: false, message: 'Username dan password diperlukan.' });
    }
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const sql = 'INSERT INTO users (username, password) VALUES (?, ?)';
        db.query(sql, [username, hashedPassword], (err, result) => {
            if (err) {
                if (err.code === 'ER_DUP_ENTRY') {
                    return res.status(409).json({ success: false, message: 'Username sudah digunakan.' });
                }
                console.error(err);
                return res.status(500).json({ success: false, message: 'Terjadi kesalahan saat pendaftaran.' });
            }
            res.status(201).json({ success: true, message: 'Pendaftaran berhasil.' });
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Terjadi kesalahan server.' });
    }
});

app.post('/login', (req, res) => {
    const { username, password } = req.body;
    const sql = 'SELECT * FROM users WHERE username = ?';
    db.query(sql, [username], async (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ success: false, message: 'Terjadi kesalahan server.' });
        }
        if (results.length === 0) {
            return res.status(401).json({ success: false, message: 'Username atau password salah.' });
        }
        const user = results[0];
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ success: false, message: 'Username atau password salah.' });
        }
        req.session.user = { id: user.id, username: user.username };
        res.status(200).json({ success: true, message: 'Login berhasil.' });
    });
});

app.post('/upload', async (req, res) => {
    if (!req.session.user) {
        return res.status(401).json({ success: false, message: 'Unauthorized' });
    }
    const multerMiddleware = multer({
        storage: multer.diskStorage({
            destination: (req, file, cb) => {
                cb(null, 'uploads/');
            },
            filename: (req, file, cb) => {
                cb(null, `${Date.now()}-${file.originalname}`);
            }
        })
    }).single('myFile');
    multerMiddleware(req, res, (err) => {
        if (err instanceof multer.MulterError) {
            return res.status(500).json({ success: false, message: 'Error Multer: ' + err.message });
        } else if (err) {
            return res.status(500).json({ success: false, message: 'Error upload: ' + err.message });
        }
        if (!req.file) {
            return res.status(400).json({ success: false, message: 'Tidak ada file yang diunggah.' });
        }
        const { filename, path: filePath } = req.file;
        const userId = req.session.user.id;
        const sql = 'INSERT INTO files (user_id, file_name, file_path) VALUES (?, ?, ?)';
        db.query(sql, [userId, filename, filePath], (err, result) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ success: false, message: 'Terjadi kesalahan saat menyimpan data file.' });
            }
            res.status(200).json({ success: true, message: 'File berhasil diunggah.' });
        });
    });
});

app.get('/files', (req, res) => {
    if (!req.session.user) {
        return res.status(401).json({ success: false, message: 'Unauthorized' });
    }
    const userId = req.session.user.id;
    const sql = 'SELECT id, file_name, upload_date FROM files WHERE user_id = ? ORDER BY upload_date DESC';
    db.query(sql, [userId], (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ success: false, message: 'Terjadi kesalahan saat mengambil data file.' });
        }
        res.status(200).json(results);
    });
});

app.put('/files/:id', (req, res) => {
    if (!req.session.user) {
        return res.status(401).json({ success: false, message: 'Unauthorized' });
    }
    const fileId = req.params.id;
    const { newFileName } = req.body;
    const userId = req.session.user.id;

    if (!newFileName || newFileName.trim() === '') {
        return res.status(400).json({ success: false, message: 'Nama file baru tidak boleh kosong.' });
    }

    const sql = 'UPDATE files SET file_name = ? WHERE id = ? AND user_id = ?';
    db.query(sql, [newFileName, fileId, userId], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ success: false, message: 'Terjadi kesalahan saat memperbarui nama file.' });
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({ success: false, message: 'File tidak ditemukan atau Anda tidak memiliki izin untuk mengeditnya.' });
        }
        res.status(200).json({ success: true, message: 'Nama file berhasil diperbarui.' });
    });
});

app.delete('/files/:id', (req, res) => {
    if (!req.session.user) {
        return res.status(401).json({ success: false, message: 'Unauthorized' });
    }
    const fileId = req.params.id;
    const userId = req.session.user.id;

    const getFileSql = 'SELECT file_path FROM files WHERE id = ? AND user_id = ?';
    db.query(getFileSql, [fileId, userId], (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ success: false, message: 'Terjadi kesalahan saat mencari file.' });
        }
        if (results.length === 0) {
            return res.status(404).json({ success: false, message: 'File tidak ditemukan atau Anda tidak memiliki izin untuk menghapusnya.' });
        }
        
        const filePath = path.join(__dirname, '..', results[0].file_path);

        const deleteFileSql = 'DELETE FROM files WHERE id = ? AND user_id = ?';
        db.query(deleteFileSql, [fileId, userId], (err, result) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ success: false, message: 'Terjadi kesalahan saat menghapus data file.' });
            }
            if (result.affectedRows === 0) {
                 return res.status(404).json({ success: false, message: 'File tidak ditemukan atau Anda tidak memiliki izin untuk menghapusnya.' });
            }
            
            fs.unlink(filePath, (unlinkErr) => {
                if (unlinkErr) {
                    console.error('Gagal menghapus file fisik:', unlinkErr);
                }
                res.status(200).json({ success: true, message: 'File berhasil dihapus.' });
            });
        });
    });
});

app.post('/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) {
            return res.status(500).json({ success: false, message: 'Gagal logout.' });
        }
        res.clearCookie('connect.sid');
        res.status(200).json({ success: true, message: 'Logout berhasil.' });
    });
});

app.listen(port, () => {
    console.log(`Server berjalan di http://localhost:${port}`);
});