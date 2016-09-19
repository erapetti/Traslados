/**
 * Personas.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

  connection: 'Personas',
  autoCreatedAt: false,
  autoUpdatedAt: false,
  autoPK: false,
  migrate: 'safe',
  attributes: {
    perid: 'integer',
    pernombrecompleto: 'string',
  },

  info: function(perci,callback) {
    return this.query(`
      SELECT perid,pernombrecompleto
      FROM PERSONAS
      JOIN PERSONASDOCUMENTOS
      USING (PerId)
      WHERE PAISCOD='UY'
        AND DOCCOD='CI'
        AND PERDOCID=?
      LIMIT 1
    `,
    [perci],
    function(err,result){
      if (err) {
        return err
      }
      if (result===null) {
        return new Error("No se pueden obtener los datos de la persona",undefined);
      }
      callback(undefined, result[0])
    });
  },
};
