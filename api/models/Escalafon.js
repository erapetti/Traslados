/**
 * Escalafon.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

        connection: 'legajos',
        autoCreatedAt: false,
        autoUpdatedAt: false,
        autoPK: false,
        migrate: 'safe',
        tableName: 'escalafon',
        attributes: {
                FncCedula: {
                        type: 'integer',
                        primaryKey: true
                },
		FncEsCargI: {
			type: 'string',
                        primaryKey: true
                },
		FncEsEscId: 'string',
		FncEsGrupI: 'integer',
		FncEsCarac: 'string',
		FncEsDepto: 'integer',
		FncEsGrado: 'integer',
		FncEsFecha: 'datetime',
        }

};

