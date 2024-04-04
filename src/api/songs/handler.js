const autoBind = require('auto-bind');

class SongsHandler {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;
    autoBind(this);
  }

  async postSongHandler(request, h) {
    this._validator.SongValidatePayload(request.payload);
    const song = request.payload;
    const songId = await this._service.addSong(song);
    const response = h.response({
      status: 'success',
      data: {
        songId,
      },
    }).code(201);
    return response;
  }
}

module.exports = SongsHandler;
