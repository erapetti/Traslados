/**
 * DepartamentosController
 *
 * @description :: Server-side logic for managing departamentos
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {

	index: function (req, res) {
	    Departamentos.find({DeptoId:{'<':20}}).exec(function(err, departamentos) {
		if (err) {
			return res.serverError(err);
		}
		res.view({departamentos:departamentos});
	    });
	}

};
