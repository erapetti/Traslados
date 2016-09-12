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
		var userId = "u15098331"; // lo tomo de la sesion
		var nombre = "Ernesto Rapetti";

		var ci = userId.substr(1);

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
						cargos.push({cargo:"DOCENTE",AsignId:e.FncEsGrupI,asignatura:asig,DeptoId:e.FncEsDepto,departamento:dpto,grado:e.FncEsGrado,ingreso:ingreso.getFullYear(),puntaje:100});
						origen = e.FncEsDepto;
					}

					var data = Array();
					data["cargos"] = cargos;
					data["departamentos"] = departamentos;
					data["origen"] = origen;
					data["cedula"] = ci;
					data["nombre"] = nombre;
					res.view(data);
				});
			});
		});

	}

	
};


//app.locals.fmtCedula = function (ci) {
//	return ci.replace(/(.)?(...)(...)(.)$/, function(match,millon,mil,unidades,verif) { return millon+'.'+mil+'.'+unidades+'-'+verif });
//};

