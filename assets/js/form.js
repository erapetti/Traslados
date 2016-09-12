$('button#solicitud').click(function(){
	$('form#solicitud').show();
	$('button#solicitud').attr('disabled','disabled');
	$('html,body').animate({ scrollTop: $("form#solicitud").offset().top }, 'slow', 'linear');
});
// inicialmente el botón está habilitado
$('button#solicitud').removeAttr('disabled');
