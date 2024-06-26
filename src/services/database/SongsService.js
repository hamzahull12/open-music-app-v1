const { nanoid } = require('nanoid');
const { Pool } = require('pg');
const InvariantError = require('../../exception/InvariantError');
const NotFoundError = require('../../exception/NotFoundError');
const { mapGetSongInAlbums } = require('../../utils');

class SongsService {
  constructor() {
    this._pool = new Pool();
  }

  async addSong({
    title,
    year,
    genre,
    performer,
    duration,
    albumId,
  }) {
    const id = `songs-${nanoid(16)}`;

    const query = {
      text: 'INSERT INTO songs VALUES($1, $2, $3, $4, $5, $6, $7) RETURNING id',
      values: [id, title, year, performer, genre, duration, albumId],
    };

    const result = await this._pool.query(query);

    if (!result.rows[0].id) {
      throw new InvariantError('Lagu gagal ditambahkan');
    }

    return result.rows[0].id;
  }

  async getSongs({ title, performer }) {
    let query;

    if (title && performer) {
      query = {
        text: 'SELECT * FROM songs WHERE LOWER (title) LIKE $1 AND LOWER (performer) LIKE $2',
        values: [`%${title}%`, `%${performer}%`],
      };
    } else if (title) {
      query = {
        text: 'SELECT * FROM songs WHERE LOWER (title) LIKE $1',
        values: [`%${title}%`],
      };
    } else if (performer) {
      query = {
        text: 'SELECT * FROM songs WHERE LOWER (performer) LIKE $1',
        values: [`%${performer}%`],
      };
    } else {
      query = {
        text: 'SELECT * FROM songs',
      };
    }

    const result = await this._pool.query(query);
    if (!result.rowCount) throw new NotFoundError('Lagu tidak ditemukan');

    return result.rows.map(mapGetSongInAlbums);
  }

  async getSongById(id) {
    const query = {
      text: 'SELECT * FROM songs WHERE id = $1',
      values: [id],
    };

    const result = await this._pool.query(query);
    if (!result.rowCount) throw new NotFoundError(`Lagu tidak ditemukan, id: ${id} Not Found`);

    return result.rows[0];
  }

  async editSongById(id, {
    title,
    year,
    performer,
    genre,
    duration,
  }) {
    const query = {
      text: 'UPDATE songs SET title= $1, year= $2, performer= $3, genre= $4, duration= $5 WHERE id= $6 RETURNING id',
      values: [title, year, performer, genre, duration, id],
    };
    const result = await this._pool.query(query);
    if (!result.rowCount) throw new NotFoundError(`Lagu tidak ditemukan, id: ${id} Not Found`);
  }

  async deleteSongById(id) {
    const query = {
      text: 'DELETE FROM songs WHERE id = $1 RETURNING id',
      values: [id],
    };

    const result = await this._pool.query(query);
    if (!result.rowCount) throw new NotFoundError(`Lagu gagal dihapus, id: ${id} Not Found`);
  }
}

module.exports = SongsService;
