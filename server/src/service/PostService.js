import pool from '..';

export const getMain = (req, res) => {
  pool.getConnection((err, conn) => {
    if (err) {
      console.error(err);
      conn.release();
      return res.status(500).send({ err: err.message });
    }

    const sql = `
    SELECT * FROM crawler_table WHERE site = 'REAL' ORDER BY timeUpload DESC LIMIT 10;
    SELECT * FROM crawler_table WHERE site = 'DOG' ORDER BY timeUpload DESC LIMIT 10;
    SELECT * FROM crawler_table WHERE site = 'FM' ORDER BY timeUpload DESC LIMIT 10;
    SELECT * FROM crawler_table WHERE site = 'HUMOR' ORDER BY timeUpload DESC LIMIT 10;
    `;

    conn.query(sql, [1, 2, 3, 4], (err, results) => {
      if (err) {
        console.error(err);
        conn.release();
        return res.status(500).send({ err: err.message });
      }

      const data = {};
      console.log(results[0]);

      conn.release();
      return res.json(data);
    });
  });
};

export const getAll = (req, res) => {
  const { page, sort } = req.query;
  pool.getConnection((err, conn) => {
    if (err) {
      console.error(err);
      conn.release();
      return res.status(500).send({ err: err.message });
    }

    let order = 'timeUpload';
    if (sort === 'vote') {
      order = 'voteNum';
    } else if (sort === 'reply') {
      order = 'replyNum';
    }

    const sql = `SELECT * FROM crawler_table WHERE site = 'REAL' or site = 'DOG' or site = 'FM' or site = 'HUMOR' ORDER BY ${order} DESC LIMIT 15;`;
    console.log(sql);
    conn.query(sql, (err, results) => {
      if (err) {
        console.error(err);
        conn.release();
        return res.status(500).send({ err: err.message });
      }

      const data = {};
      console.log(results);
      conn.release();
      return res.json(data);
    });
  });
};
