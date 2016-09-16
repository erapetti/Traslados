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
			sessionid = req.cookies.SESION;
		}
		wsPortal.getSession(sessionid, function(err,session) {
			if (sails.config.environment === "development") {
				err = undefined;
				session = {Sesionesid:1,Userid:'u13683344',Dependid:1023,Lugarid:1023};
				//session = {Sesionesid:1,Userid:'u19724241',Dependid:1023,Lugarid:1023};
			}
			if (err) {
				return res.forbidden(err);
				//err.status = 403;
				//return res.negotiate(err);
			}

			var ci = session.Userid.substr(1);

			Personas.nombrecompleto(ci, function(err, nombrecompleto) {
				if (err || typeof nombrecompleto[0]==='undefined') {
					return res.serverError(err);
				}

				Asignaturas.find().exec(function(err, asignaturas) {
					if (err) {
						return res.serverError(err);
					}

					Departamentos.find().exec(function(err, departamentos) {
						if (err) {
							return res.serverError(err);
						}

						Escalafon.find({fnccedula:ci,fncEsCargI:'000'}).exec(function(err, efectividad) {
							if (err) {
								return res.serverError(err);
							}

							var cargos = Array();
							var origen;
							var i;
							for (i in efectividad) {
								var e=efectividad[i];
								var asig;
								if (e.FncEsGrupI>0) {
									asig = asignaturas.find(function(v){if (v.AsignId===e.FncEsGrupI){return true}}).AsignDesc;
								}
								var dpto = departamentos.find(function(v){if (v.DeptoId===e.FncEsDepto){return true}}).DeptoNombre;
								var ingreso = new Date(e.FncEsFecha);
								cargos.push({cargo:"DOCENTE",AsignId:e.FncEsGrupI,asignatura:asig,DeptoId:e.FncEsDepto,departamento:dpto,grado:e.FncEsGrado,ingreso:ingreso.getFullYear()});
								origen = e.FncEsDepto;
							}

							var data = Array();
							data["cargos"] = cargos;
							data["departamentos"] = departamentos;
							data["origen"] = origen;
							data["cedula"] = ci;
							data["nombre"] = nombrecompleto[0].pernombrecompleto;
							res.view(data);
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
