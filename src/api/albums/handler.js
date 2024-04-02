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
    console.log(name);
    console.log(year);
    const albumId = await this._service.addAlbum({ name, year });

    const response = h.response({
      status: 'success',
      data: {
        albumId,
      },
    }).code(201);
    return response;
  }
}

module.exports = AlbumsHandler;
