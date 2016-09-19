/**
 * Cupos.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

  connection: 'Personal',
  autoCreatedAt: false,
  autoUpdatedAt: false,
  autoPK: false,
  migrate: 'safe',
  tableName: 'traslados_cupos',

	attributes: {
		AsignId: 'integer',
		DeptoId: 'integer',
    Cupo: 'integer',
	}
};
