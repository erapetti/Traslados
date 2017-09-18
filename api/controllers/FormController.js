/**
 * FormController
 *
 * @description :: Server-side logic for managing forms
 * @help		:: See http://sailsjs.org/#!/documentation/concepts/Controllers
 *
 */
/* ex: set tabstop=4 softtabstop=0 noexpandtab shiftwidth=4
 */

module.exports = {

	index: function (req, res) {
		var sessionid;
		if (sails.config.environment === "development") {
			sessionid = '9728448076454730240';
		} else {
			sessionid = req.cookies.SESION.replace(/[+ ]/g,'');
		}
		wsPortal.getSession(sessionid, function(err,session) {
			if (sails.config.environment === "development") {
				err = undefined;
				//session = {Sesionesid:1,Userid:'u10121248',Dependid:1023,Lugarid:1023};
				//session = {Sesionesid:1,Userid:'u19724241',Dependid:1023,Lugarid:1023};
				//session = {Sesionesid:1,Userid:'u13683344',Dependid:1023,Lugarid:1023};
				session = {Sesionesid:1,Userid:'u29502003',Dependid:1023,Lugarid:1023};
				//session = {Sesionesid:1,Userid:'u18098726',Dependid:1023,Lugarid:1023};
			}
			if (err) {
				return res.forbidden(err);
			}

			var ci = session.Userid.substr(1);
			var anio = new Date().getFullYear();
			var sprintf = require("sprintf");
			function fecha_toString(d) {
				return sprintf("%02d/%02d/%04d", d.getDate(),d.getMonth()+1,d.getFullYear());
			};

			Personas.info(ci, function(err, persona) {
				if (err) {
					return res.serverError(err);
				}
				if (typeof persona==='undefined') {
					return res.serverError(new Error("No se puede obtener los datos de la persona con documento "+ci,undefined));
				}

				persona.ci = session.Userid.substr(1);

				Departamentos.find({DeptoId:{'<':20}}).exec(function(err, departamentos) {
					if (err) {
						return res.serverError(err);
					}

					var arrDepartamentos = Array();
					departamentos.forEach(function(d) {
						arrDepartamentos[d.DeptoId] = d.DeptoNombre;
					});

					// cada registro del escalafón es de una única asignatura
					Asignaturas.find().exec(function(err, asignaturas) {
						if (err) {
							return res.serverError(err);
						}

						var arrAsignaturas = Array();
						asignaturas.forEach(function(a) {
							arrAsignaturas[a.AsignId] = a.AsignDesc;
						});

						Cupos.find().exec(function(err, cupos) {
							if (err) {
								return res.serverError(err);
							}

							var arrCupos = Array();
							cupos.forEach(function(c) {
								if (typeof arrCupos[c.AsignId] === 'undefined') {
									arrCupos[c.AsignId] = Array();
								}
								arrCupos[c.AsignId][c.DeptoId] = c.Cupo;
							});

							Escalafon.find({fnccedula:ci,fncEsCargI:'000'}).exec(function(err, efectividades) {
								if (err) {
									return res.serverError(err);
								}
								if (typeof efectividades==='undefined') {
									var mensaje = {texto: "No se encuentran cargos efectivos para la cédula "+ci};
									return res.view({anio:anio,mensaje:mensaje});
								}

								var objTraslados;

								Traslados.find({Anio:anio, PersonalPerid:persona.perid, Borrado:'N'}).exec(function(err, traslados) {
									if (err) {
										return res.serverError(err);
									}

									if (typeof traslados[0] !== 'undefined') {
										// hay traslados registrados

										if (req.param("anular") === "s") {
											// es una solicitud para anular el traslado
											tid = req.param("tid");
											if (typeof tid !== 'undefined' && parseInt(tid)>0) {
												sails.log(new Date,"Anulo traslado "+tid+" de "+session.Userid);
												Traslados.update({id:tid},{Borrado:'S'},function(err,records) {
													 if (err) {
														 	sails.log(new Date,"Al anular traslado "+tid,err);
														}
													 return res.redirect(sails.config.environment==='development' ? '' : '/node/traslados');
												 });
												 return;
											}
										}
										traslados.forEach(function(traslado){
											try {
												traslado.UpdatedAt = fecha_toString(traslado.UpdatedAt);
												traslado.Destino = traslado.Destino.map(function(v){ return arrDepartamentos[v] }).toString();
												traslado.Asignatura = arrAsignaturas[traslado.AsignId];
												traslado.Departamento = arrDepartamentos[traslado.DeptoId];
											} catch (e) {	}
										});
										objTraslados = traslados;
									}

									// no hay pedido previo de traslado
									var destino = req.param("destino");
									if (! destino) {
										// formulario inicial
										return res.view({anio:anio,persona:persona,arrDepartamentos:arrDepartamentos,arrAsignaturas:arrAsignaturas,arrCupos:arrCupos,efectividades:efectividades,traslados:objTraslados});
									}

									// tengo un destino para registrar
									try {
										var destinos = destino.split(',').map(function(v) { return parseInt(v) });
										var asignid = req.param("asignid");
										var origen = req.param("origen");
										var valido=false;
										efectividades.forEach(function(efectividad){
											if (efectividad.FncEsGrupI == asignid && efectividad.FncEsDepto == origen) {
												valido=true;
											}
										});
										if (!valido) {
											return res.serverError(new Error("Parámetros incorrectos"));
										}
										Traslados.create({
											Anio:anio,
											PersonalPerid:persona.perid,
											AsignId:asignid,
											DeptoId:origen,
											Destino:destinos,
											UserId:session.Userid
										}).exec(function(err,data) {
											if (err) {
												var mensaje = {texto:"No se pudo guardar los departamentos destino para "+session.Userid+" ("+destino+")",
																			 detalle:err.details};
												sails.log(new Date,mensaje.texto, mensaje.detalle);
												return res.view({anio:anio,persona:persona,cargo:cargo,departamentos:departamentos,cupos:cupos,origen:efectividad.FncEsDepto,mensaje:mensaje});
											} else {
												sails.log(new Date,"Guardado destino de "+session.Userid+" para "+asignid+" que es "+destino);
												return res.redirect(sails.config.environment==='development' ? '' : '/node/traslados');
											}
										});
									} catch (e) {
										return res.serverError(new Error("Error al guardar sus preferencias. Por favor reintente luego."));
									}
								});
							});
						});
					});
				});
			});
		});
	},

};


//app.locals.fmtCedula = function (ci) {
//	return ci.replace(/(.)?(...)(...)(.)$/, function(match,millon,mil,unidades,verif) { return millon+'.'+mil+'.'+unidades+'-'+verif });
//};
