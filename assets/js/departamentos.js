var orden=0;
var arrOrden = Array();

function borrar_dptos() {
	orden=0;
	arrOrden = Array();
	$('#destino').val('');
	$('#destinoids').val('');
	for(var dpto=1;dpto<=19;dpto++) {
		$('#orden_'+dpto).text('');
	}
	$("a.dpto").removeClass("btn-success");
	$('button#submit').attr('disabled','disabled');
	$('button#btnpaso2').attr('disabled','disabled');
}

$('document').ready(function(){
	borrar_dptos();
});

$("a.dpto").click(function(){
	if (! $(this).attr("disabled")) {

		var pos = jQuery.inArray( $(this).attr('dptoid'), arrOrden);
		if ( pos == -1) {
			// Agrego este dpto como opcion numero "orden"
			orden++;
			arrOrden[orden] = $(this).attr('dptoid');
			$('#orden_'+$(this).attr('dptoid')).text(orden+'º');//agrego etiqueta
			$(this).addClass("btn-success");
		} else {
			// Saco este dpto de la lista
			orden--;
			$('#orden_'+$(this).attr('dptoid')).text('');
			// saco el elemento
			arrOrden.splice( pos,1 );
			// redibujo las etiquetas de los otros elementos
			for (o in arrOrden) {
				$('#orden_'+arrOrden[o]).text(o+'º');
			}
			$(this).removeClass("btn-success");
		}
		// redibujo el destino en el formulario
		$('#destino').val( arrOrden.map(function(v){ return arrDepartamentos[v] }).join(', ').substr(2) );
		$('#destinoids').val( arrOrden.join(',').substr(1) );

		// habilito submit si corresponde
		$('button#submit').removeAttr('disabled');
		$('button#btnpaso2').removeAttr('disabled');
		if ($('#destino').val() === "") {
			$('button#submit').attr('disabled','disabled');
			$('button#btnpaso2').attr('disabled','disabled');
		}
	}

	return 0;
});
