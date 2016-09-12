var orden=0;
var arrOrden = Array();

$("a.dpto[disabled!=disabled]").click(function(){
	var pos = jQuery.inArray( $(this).attr('dptoid'), arrOrden);
	if ( pos == -1) {
		// Agrego este dpto como opcion numero "orden"
		orden++;
		arrOrden[orden] = $(this).attr('dptoid');
		$('#orden_'+$(this).attr('dptoid')).text(orden+'º');
		$(this).addClass("btn-success");
	} else {
		// Saco este dpto de la lista
		orden--;
		$('#orden_'+$(this).attr('dptoid')).text('');
		// saco el elemento
		arrOrden.splice( pos,1 );
		// redibujo los otros elementos
		for (o in arrOrden) {
			$('#orden_'+arrOrden[o]).text(o+'º');
		}
		$(this).removeClass("btn-success");
	}
	// redibujo el destino en el formulario
	$('input#destino').val( arrOrden.map(function(v){ return departamentos[v] }).join(', ').substr(2) );

	// habilito submit si corresponde
	$('button#submit').removeAttr('disabled');
	if ($('input#destino').val() === "") {
		$('button#submit').attr('disabled','disabled');
	}

	return 0;
});
