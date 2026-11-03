const pool = require('./db');

const initializeDatabase = async () => {
    try {
        console.log('מתחיל באתחול מסד הנתונים...');

        // יצירת טבלת משתמשים
        await pool.query(`
            CREATE TABLE IF NOT EXISTS Users (
                user_id INT AUTO_INCREMENT PRIMARY KEY,
                first_name VARCHAR(50) NOT NULL,
                last_name VARCHAR(50) NOT NULL,
                id_number VARCHAR(20) UNIQUE NOT NULL,
                birth_date DATE NOT NULL,
                city VARCHAR(100) NOT NULL,
                street VARCHAR(100) NOT NULL,
                house_number VARCHAR(10) NOT NULL,
                email VARCHAR(100) UNIQUE NOT NULL,
                phone VARCHAR(20) NOT NULL,
                occupation VARCHAR(100) NOT NULL,
                additional_occupation VARCHAR(100),
                spouse_name VARCHAR(100),
                spouse_id_number VARCHAR(20),
                spouse_occupation VARCHAR(100),
                password VARCHAR(255) NOT NULL,
                status ENUM('pending', 'active') DEFAULT 'pending',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);
        console.log('טבלת Users קיימת או נוצרה בהצלחה.');


        // טבלת עסקים מעודכנת - הוספנו IF NOT EXISTS
        await pool.query(`
    CREATE TABLE IF NOT EXISTS Businesses (
        business_id INT AUTO_INCREMENT PRIMARY KEY,
        business_name VARCHAR(100) NOT NULL,
        company_id VARCHAR(20) UNIQUE NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        phone VARCHAR(20) NOT NULL,
        website_url VARCHAR(255),
        logo_url VARCHAR(255),
        category ENUM('בניה', 'מזון', 'ביגוד', 'אלקטרוניקה', 'שירותים', 'אחר') NOT NULL,
        description TEXT,
        status ENUM('pending', 'active', 'rejected') DEFAULT 'pending',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
`);

        // טבלת מענקי עסקים - הוספנו IF NOT EXISTS
        await pool.query(`
    CREATE TABLE IF NOT EXISTS BusinessGrants (
        grant_id INT AUTO_INCREMENT PRIMARY KEY,
        business_id INT NOT NULL,
        grant_amount DECIMAL(10,2) NOT NULL,
        total_units INT NOT NULL,
        used_units INT DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (business_id) REFERENCES Businesses(business_id) ON DELETE CASCADE
    )
`);
        await pool.query(`
            CREATE TABLE IF NOT EXISTS AdminMessages (
                message_id INT AUTO_INCREMENT PRIMARY KEY,
                title VARCHAR(100) NOT NULL,
                content TEXT NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);

        // טבלת בקשות להוספת עסקים
        await pool.query(`
            CREATE TABLE IF NOT EXISTS BusinessRequests (
                request_id INT AUTO_INCREMENT PRIMARY KEY,
                user_id INT NOT NULL,
                business_name VARCHAR(100) NOT NULL,
                business_identifier VARCHAR(50),
                recommendation TEXT,
                status ENUM('pending', 'reviewed') DEFAULT 'pending',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES Users(user_id) ON DELETE CASCADE
            )
        `);
        console.log('טבלת BusinessRequests קיימת או נוצרה בהצלחה.');

        // ---- התיקון: טבלת הקופונים הוכנסה לכאן ----
        await pool.query(`
            CREATE TABLE IF NOT EXISTS Coupons (
                coupon_id INT AUTO_INCREMENT PRIMARY KEY,
                coupon_code VARCHAR(20) UNIQUE NOT NULL,
                user_id INT NOT NULL,
                business_id INT NOT NULL,
                amount DECIMAL(10,2) NOT NULL,
                status ENUM('active', 'redeemed', 'expired') DEFAULT 'active',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                redeemed_at TIMESTAMP NULL,
                FOREIGN KEY (user_id) REFERENCES Users(user_id),
                FOREIGN KEY (business_id) REFERENCES Businesses(business_id)
            )
        `);
        console.log('טבלת Coupons קיימת או נוצרה בהצלחה.');

        // --- טבלת תנועות ארנק (Ledger) ---
        await pool.query(`
            CREATE TABLE IF NOT EXISTS Transactions (
                transaction_id INT AUTO_INCREMENT PRIMARY KEY,
                user_id INT NOT NULL,
                amount DECIMAL(10,2) NOT NULL, -- סכום חיובי לטעינה, שלילי למימוש
                type ENUM('load', 'redeem', 'refund') NOT NULL,
                source ENUM('website', 'pos', 'phone', 'admin') NOT NULL,
                description VARCHAR(255),
                reference_id VARCHAR(50), -- ישמור את קוד הקופון במקרה שלנו
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES Users(user_id)
            )
        `);
        console.log('טבלת Transactions קיימת או נוצרה בהצלחה.');

        process.exit(0); // יציאה חלקה מהסקריפט בסיום
    } catch (error) {
        console.error('שגיאה במהלך אתחול המסד:', error);
        process.exit(1); // יציאה עם קוד שגיאה
    }
};

initializeDatabase();