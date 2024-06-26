const autoBind = require('auto-bind');

class AlbumsHandler {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;
    autoBind(this);
  }

  async postAlbumHandler(request, h) {
    this._validator.AlbumValidatePayload(request.payload);

    const { name, year } = request.payload;
    const albumId = await this._service.addAlbum({ name, year });

    const response = h.response({
      status: 'success',
      data: {
        albumId,
      },
    }).code(201);
    return response;
  }

  async getAlbumByIdHandler(request) {
    const { id } = request.params;
    const albums = await this._service.getAlbumById(id);
    const songs = await this._service.getSongFromAlbums(id);
    const result = { ...albums, songs };
    return {
      status: 'success',
      data: {
        album: result,
      },
    };
  }

  async putAlbumByIdHandler(request) {
    this._validator.AlbumValidatePayload(request.payload);

    const { id } = request.params;
    await this._service.editAlbumById(id, request.payload);
    return {
      status: 'success',
      message: 'Album Berhasil diperbarui',
    };
  }

  async deleteAlbumByIdHandler(request) {
    const { id } = request.params;

    await this._service.deleteAlbumById(id);

    return {
      status: 'success',
      message: 'Album berhasil di hapus',
    };
  }
}

module.exports = AlbumsHandler;
