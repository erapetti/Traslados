$('button#btnsolicitud').click(function(){
	$('form#solicitud').show();
	$('button#btnsolicitud').attr('disabled','disabled');
	$('html,body').animate({ scrollTop: $("form#solicitud").offset().top }, 'slow', 'linear');
});
// inicialmente el botón está habilitado
$('button#btnsolicitud').removeAttr('disabled');


$('button#btnpaso2').click(function(){
	$('#paso2').show();
  $('button#btnpaso2').hide();
	$('html,body').animate({ scrollTop: $("#paso2").offset().top }, 'slow', 'linear');
});
// inicialmente el botón está deshabilitado
$('button#btnpaso2').attr('disabled','disabled');
