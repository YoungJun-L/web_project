import pool from '..';

export const getMain = (req, res) => {
  pool.getConnection((err, conn) => {
    if (err) {
      console.error(err);
      return res.status(500).send({ err: err.message });
    }

    const sql = `
    SELECT url, title, voteNum, timeUpdate FROM crawler_table WHERE site = 'REAL' ORDER BY timeUpdate DESC LIMIT 10;
    SELECT url, title, voteNum, timeUpdate FROM crawler_table WHERE site = 'DOG' ORDER BY timeUpdate DESC LIMIT 10;
    SELECT url, title, voteNum, timeUpdate FROM crawler_table WHERE site = 'FM' ORDER BY timeUpdate DESC LIMIT 10;
    SELECT url, title, voteNum, timeUpdate FROM crawler_table WHERE site = 'HUMOR' ORDER BY timeUpdate DESC LIMIT 10;
    `;

    conn.query(sql, [1, 2, 3, 4], (err, results) => {
      if (err) {
        console.error(err);
        return res.status(500).send({ err: err.message });
      }

      const data = results;
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
      return res.status(500).send({ err: err.message });
    }

    let order = 'timeUpdate';
    let time = '';
    if (sort === 'vote') {
      order = 'voteNum';
      time += 'and timeUpdate > NOW() - INTERVAL 1 MONTH';
    } else if (sort === 'reply') {
      order = 'replyNum';
      time += 'and timeUpdate > NOW() - INTERVAL 1 MONTH';
    }

    const sql = `SELECT url, title, viewNum, voteNum, timeUpdate FROM crawler_table WHERE (site = 'REAL' or site = 'DOG' or site = 'FM' or site = 'HUMOR') ${time} ORDER BY ${order} DESC LIMIT 15 OFFSET ${
      (page - 1) * 15
    };`;

    conn.query(sql, (err, results) => {
      if (err) {
        console.error(err);
        return res.status(500).send({ err: err.message });
      }

      const data = results;
      conn.release();
      return res.json(data);
    });
  });
};
