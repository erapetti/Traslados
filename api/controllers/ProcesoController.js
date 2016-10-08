/**
 * ProcesoController
 *
 * @description :: Server-side logic for managing Procesoes
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
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
				//session = {Sesionesid:1,Userid:'u10121248',Dependid:1023,Lugarid:1023};
				//session = {Sesionesid:1,Userid:'u19724241',Dependid:1023,Lugarid:1023};
				//session = {Sesionesid:1,Userid:'u13683344',Dependid:1023,Lugarid:1023};
				session = {Sesionesid:1,Userid:'u17488617',Dependid:1023,Lugarid:1023};
			}
			if (err) {
				return res.forbidden(err);
				//err.status = 403;
				//return res.negotiate(err);
			}

			var ci = session.Userid.substr(1);
			var anio = new Date().getFullYear();
			var sprintf = require("sprintf");
			function fecha_toString(d) {
				return sprintf("%02d/%02d/%04d", d.getDate(),d.getMonth()+1,d.getFullYear());
			};

			Departamentos.find().exec(function(err, departamentos) {
				if (err) {
					return res.serverError(err);
				}

				var arrDepartamentos = Array();
				departamentos.forEach(function(d) {
					arrDepartamentos[d.DeptoId] = d.DeptoNombre;
				});

				Cupos.find().exec(function(err, cupos) {
					if (err) {
						return res.serverError(err);
					}

					var arrCupos = Array();
					cupos.forEach(function(c) {
						if (typeof arrCupos[c.AsignId]==='undefined') {
								arrCupos[c.AsignId]=Array();
						}
						arrCupos[c.AsignId][c.DeptoId] = c.Cupo;
					});

					Proceso.proceso(function(err,result) {
						if (err || !result) {
							console.log("error en proceso",err);
							var mensaje = {texto:"No se pudo obtener el resultado del proceso de traslado",
														 detalle:err.details};
							return res.view({mensaje:mensaje});
						}
						// Determino el destino del traslado
						var destinos = Array();
						result.forEach(function(info) {
							info.cupo = Array();
							info.destino = undefined;
							JSON.parse(info.Destino).forEach(function(d) {
								info.cupo[d] = arrCupos[info.AsignId][d];
								if (arrCupos[info.AsignId][d] > 0 && !info.destino) {
									arrCupos[info.AsignId][d]--;
									info.destino = d;
								}
							})
						});
						return res.view({traslado:result,arrDepartamentos:arrDepartamentos,arrCupos:arrCupos});
					});
				});
			});
		});
	}
};
