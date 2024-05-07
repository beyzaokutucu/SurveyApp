import * as SQLite from 'expo-sqlite';

// Open a database connection
const db = SQLite.openDatabase('database.db');

// Initialize the database
const init = () => {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        `CREATE TABLE IF NOT EXISTS users (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          nickname TEXT UNIQUE NOT NULL,
          password TEXT NOT NULL,
          email TEXT NOT NULL,
          birthdate INTEGER,
          gender TEXT
        );`,
        [],
        () => console.log('Kullanıcılar tablosu başarıyla oluşturuldu'),
        (_, err) => reject(err)
      );
      // Sorular ve Şıklar için Tablo Oluşturma
   // Sorular tablosunu oluşturma
   tx.executeSql(
    `CREATE TABLE IF NOT EXISTS Questions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT,
      options TEXT,
      correct INTEGER
    );`,
    [],
    () => console.log('Questions table created successfully'),
    (_, err) => reject(err)
  );

  // Anket ilerlemesini takip etmek için tablo
  tx.executeSql(
    `CREATE TABLE IF NOT EXISTS survey_progress (
      user_id INTEGER PRIMARY KEY,
      current_question_index INTEGER,
      remaining_time INTEGER,
      FOREIGN KEY (user_id) REFERENCES users(id)
    );`,
    [],
    () => { console.log('Survey progress table created successfully'); resolve(); },
    (_, err) => { console.error('Error creating survey progress table:', err); reject(err); }
  );
  
 
});
});
};

// Insert a new user into the database
const insertUser = (nickname, password, email, birthdate, gender) => {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        'INSERT INTO users (nickname, password, email, birthdate, gender) VALUES (?, ?, ?, ?, ?);',
        [nickname, password, email, birthdate, gender],
        (_, result) => resolve(result),
        (_, err) => reject(err)
      );
    });
  });
};

// Retrieve all users from the database
const getUsers = () => {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        'SELECT * FROM users;',
        [],
        (_, resultSet) => resolve(resultSet.rows._array),
        (_, err) => reject(err)
      );
    });
  });
};

// Validate a user's login credentials
const validateUser = (nickname, password) => {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        'SELECT * FROM users WHERE nickname = ? AND password = ?',
        [nickname, password],
        (_, resultSet) => {
          if (resultSet.rows.length > 0) {
            resolve(resultSet.rows._array[0]);
          } else {
            reject('Invalid username or password');
          }
        },
        (_, err) => reject(err)
      );
    });
  });
};

// Retrieve information for a specific user
const getUserInfo = (nickname) => {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        'SELECT * FROM users WHERE nickname = ?',
        [nickname],
        (_, resultSet) => {
          if (resultSet.rows.length > 0) {
            resolve(resultSet.rows._array[0]);
          } else {
            reject('User not found');
          }
        },
        (_, err) => reject('Database error: ' + err.message)
      );
    });
  });
};

// Update user information
const updateUserInfo = (nickname, updatedInfo) => {
  const { email, birthdate, gender } = updatedInfo;
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        'UPDATE users SET email = ?, birthdate = ?, gender = ? WHERE nickname = ?;',
        [email, birthdate, gender, nickname],
        (_, result) => resolve(result),
        (_, err) => { console.error('Failed to update user:', err); reject(err); }
      );
    });
  });
};

const updateSurveyProgress = (userId, questionIndex) => {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        'REPLACE INTO survey_progress (user_id, current_question_index) VALUES (?, ?);',
        [userId, questionIndex],
        (_, result) => resolve(result),
        (_, err) => reject(err)
      );
    });
  });
};

const getSurveyProgress = (userId) => {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        'SELECT current_question_index FROM survey_progress WHERE user_id = ?;',
        [userId],
        (_, resultSet) => {
          if (resultSet.rows.length > 0) {
            resolve(resultSet.rows.item(0).current_question_index);
          } else {
            resolve(null); // Henüz kaydedilmiş bir ilerleme yok
          }
        },
        (_, err) => reject(err)
      );
    });
  });
};
let activeUserId = null; // Aktif kullanıcının ID'sini saklamak için global bir değişken

const setActiveUser = (userId) => {
  activeUserId = userId; // Kullanıcı giriş yaptığında çağrılacak
};

const getLoggedInUserId = () => {
  return activeUserId; // Aktif kullanıcının ID'sini döndür
};
const fetchQuestions = () => {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        'SELECT * FROM questions;', // Make sure the table and columns exist and are named correctly
        [],
        (_, resultSet) => resolve(resultSet.rows._array),
        (_, err) => reject(err)
      );
    });
  });
};

// Mock implementation of saveAnswer to simulate saving a response
const saveAnswer = (userId, questionId, optionId) => {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        'INSERT INTO answers (question_id, user_id, answer_text) VALUES (?, ?, ?);',
        [questionId, userId, optionId],
        (_, result) => resolve(result),
        (_, err) => reject(err)
      );
    });
  });
};
const insertQuestions = (questions) => {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      questions.forEach(q => {
        const options = JSON.stringify(q.options);
        tx.executeSql(
          'INSERT OR REPLACE INTO Questions (title, options, correct) VALUES (?, ?, ?);',
          [q.title, options, q.correct],
          () => console.log('Question inserted successfully'),
          (_, err) => reject(err)
        );
      });
    }, reject, resolve);
  });
};

const getQuestions = () => {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        'SELECT * FROM Questions;',
        [],
        (_, resultSet) => {
          const questions = resultSet.rows._array.map(row => ({
            ...row,
            options: JSON.parse(row.options)
          }));
          resolve(questions);
        },
        (_, err) => reject(err)
      );
    });
  });
};


// Export functions for external use
export { init, insertUser, getUsers, validateUser, getUserInfo, updateUserInfo, getSurveyProgress,updateSurveyProgress, setActiveUser, getLoggedInUserId, insertQuestions, saveAnswer, getQuestions,fetchQuestions };
