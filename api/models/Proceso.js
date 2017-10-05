/**
 * Proceso.js
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

  attributes: {
    PerDocId: 'string',
    PersonalPerid: 'integer',
    PerNombreCompleto: 'string',
    AsignId: 'integer',
    AsignDesc: 'string',
    DeptoId: 'integer',
    Destino: 'json',
    Grado: 'string'
  },

  proceso2016: function(callback) {
    return this.query(`
      select PerDocId,PersonalPerid,PerNombreCompleto,AsignId,AsignDesc,
             DeptoId,Destino,concat(FncEsGrado,'/',year(FncEsFecha)) Grado
      from traslados_destinos t
      join Personas.PERSONASDOCUMENTOS
        on PERSONALPERID=PERID AND PAISCOD='UY' AND DOCCOD='CI'
      join legajos.orden on cast(perdocid as UNSIGNED)=fnccedula
      join legajos.escalafon using (FncCedula,FncEsGrupI,FncEsDepto)
      join Estudiantil.ASIGNATURAS using (asignid)
      join Personas.PERSONAS using (perid)
      where FncEsCargI='000'
        and borrado='N'
      order by asignid,orden
    `,
    [],
    function(err,result){
      if (result===null) {
        err = new Error("No se pueden obtener los registros de traslado",undefined);
      }
      callback(err, result);
    });
  },

  proceso2017: function(callback) {
    return this.query(`
      select PerDocId,PersonalPerid,PerNombreCompleto,AsignId,AsignDesc,
             DeptoId,Destino,concat(FncEsGrado,'/',year(FncEsFecha)) Grado
      from (select PersonalPerid,AsignId,DeptoId,Destino
            from traslados_destinos t
            where Anio=year(curdate())
              and borrado='N'
            group by 1,2,3,4
          ) T
      join Personas.PERSONASDOCUMENTOS
        on PERSONALPERID=PERID AND PAISCOD='UY' AND DOCCOD='CI'
      join legajos.GRADOS2017 on cast(perdocid as UNSIGNED)=fnccedula and asignid=FncEsGrupI
      join legajos.FNCESPU2017 P using (fnccedula,fncescargi,fncesgrupi)
      join Estudiantil.ASIGNATURAS using (asignid)
      join Personas.PERSONAS using (perid)
      where FncEsCargI='000'
      and FncEsYearP=year(curdate())-1
      order by asignid,FncEsGrado desc,if(year(FncEsFecha)=year(curdate()),0,fncespromy) desc,FncEsAptit desc,fncesordin
    `,
    [],
    function(err,result){
      if (result===null) {
        err = new Error("No se pueden obtener los registros de traslado",undefined);
      }
      callback(err, result);
    });
  }
};
