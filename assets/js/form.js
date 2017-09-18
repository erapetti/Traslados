// Botón del PASO 1:
$('button#btnsolicitud').click(function(){
	actualizo_departamentos();
	$('form#solicitud').show();
	$('button#btnsolicitud').attr('disabled','disabled');
	$('html,body').animate({ scrollTop: $("form#solicitud").offset().top }, 'slow', 'linear');
});
// inicialmente el botón está habilitado
$('button#btnsolicitud').removeAttr('disabled');

// Botón del PASO 2:
$('button#btnpaso2').click(function(){
	$('#paso2').show();
  $('button#btnpaso2').hide();
	$('html,body').animate({ scrollTop: $("#paso2").offset().top }, 'slow', 'linear');
});
// inicialmente el botón está deshabilitado
$('button#btnpaso2').attr('disabled','disabled');

// Selección en la tabla de cargos:
$('table#cargos tr td').click(function(e){
	// marco la fila como seleccionada:
	$('table#cargos tr').attr('checked',false);
	$('#'+e.currentTarget.parentNode.id).attr('checked',true);
	// marco el radio button como seleccionado:
	$('#'+e.currentTarget.parentNode.firstElementChild.firstChild.id).prop('checked',true);
	// actualizo los departamentos
	actualizo_departamentos();
	// actualizo el form de solicitud
	var ad = $('input[name=cargo]:checked').prop('id').split('-');
	$('#asignatura').val(ad[0]);
	$('#asignaturadesc').val(arrAsignaturas[ad[0]]);
	$('#origen').val(ad[1]);
	$('#origendesc').val(arrDepartamentos[ad[1]]);
	// habilito el botón del paso1
	$('button#btnsolicitud').removeAttr('disabled');
	$('button#btnsolicitud').html("Iniciar solicitud de traslado");
});

function actualizo_departamentos() {
	borrar_dptos();
	// deshabilito todos los departamentos
	$('a[dptoid]').attr('disabled','disabled');
	if (typeof $('input[name=cargo]:checked').prop('id') !== 'undefined') {
		var ad = $('input[name=cargo]:checked').prop('id').split('-')
		var AsignId = ad[0];
		var DeptoId = ad[1];
		// habilito los que tienen cupos
		for (var d in arrCupos[AsignId]) {
			$('a[dptoid='+d+']').removeAttr('disabled');
		}
		// deshabilito el depto del cargo seleccionado
		$('a[dptoid='+DeptoId+']').attr('disabled','disabled');
	}
}
