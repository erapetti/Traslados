/**
 * Traslados.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

  connection: 'Personal',
  autoCreatedAt: true,
  autoUpdatedAt: true,
  autoPK: false,
  migrate: 'safe',
  tableName: 'traslados_destinos',

	attributes: {
    id: {
      type: 'integer',
      primaryKey: true
    },
    Anio: 'integer',
    PersonalPerid: 'integer',
		AsignId: 'integer',
		DeptoId: 'integer',
    Destino: 'json',
    UserId: {
      type: 'string',
      alphanumeric: true
    },
    Borrado: {
      type: 'string',
      maxLength: 1,
      defaultsTo: 'N'
    },
    UpdatedAt: 'date',
	}
};
