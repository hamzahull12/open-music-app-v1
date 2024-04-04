const mapSongsTable = ({
  id,
  title,
  year,
  performer,
  genre,
  duration,
  album_id,
}) => ({
  id,
  title,
  year,
  performer,
  genre,
  duration,
  albumId: album_id,
});

const mapAlbumsTable = ({
  id,
  name,
  year,
}) => ({
  id,
  name,
  year,
});

const mapGetSongInAlbums = ({
  id,
  title,
  performer,
}) => ({
  id,
  title,
  performer,
});

module.exports = { mapSongsTable, mapAlbumsTable, mapGetSongInAlbums };
