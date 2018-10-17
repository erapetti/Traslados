
function proceso(event) {

  var espera=300; // cuántos milisegundos esperar entre un reglón y el siguiente para dar dramatismo

  event.preventDefault();
  btn_disable( $('#btnproceso') );
  var line=2;
  function siguiente() {
    $('#resultado tr:nth-child('+line+') td').css('background-color','lightblue');
    $('#resultado tr:nth-child('+line+') td:nth-child(7)').css('color','');
    $("html, body").scrollTop(
      $('#resultado tr:nth-child('+line+')').offset().top + $('#resultado tr:nth-child('+line+')').outerHeight(true) - $(window).height()
    );
    $('#resultado tr:nth-child('+line+') td:nth-child(7)').animate({"font-size":"200%"},50,"swing",function(){
      $('#resultado tr:nth-child('+line+') td:nth-child(7)').animate({"font-size":"100%"},150,"swing",function(){
        $('#resultado tr:nth-child('+line+') td:nth-child(8)').css('color','');
        $('#resultado tr:nth-child('+line+') td:nth-child(8)').animate({"font-size":"200%"},50,"swing",function(){
          $('#resultado tr:nth-child('+line+') td:nth-child(8)').animate({"font-size":"100%"},150);
          $('#resultado tr:nth-child('+line+') td').css('background-color','');
          line+=1;
          if (line <= postulantes+1) {
            setTimeout(siguiente, espera);
          } else {
            btn_enable( $('#btnimprimir') );
            $("html, body").scrollTop( $(document).height() );
          }
        });
      });
    });
  };
  setTimeout(siguiente, espera);
};

function btn_enable(btn) {
  btn.removeClass("btn-default");
  btn.addClass("btn-primary");
  btn.removeAttr("disabled");
  btn.focus();
}
function btn_disable(btn) {
  btn.removeClass("btn-primary");
  btn.addClass("btn-default");
  btn.attr("disabled","disabled");
}
$(document).ready(function() {
  $("html, body").scrollTop(0);
  $('#resultado').hide();
  btn_enable( $('#btnver') );
  $('#btnver').click(function() {
    $('#resultado').show();
    $('#resultado tr td:nth-child(7)').css('color','transparent');
    $('#resultado tr td:nth-child(8)').css('color','transparent');
    btn_enable( $('#btnproceso') );
    btn_disable( $('#btnver') );
  });
  btn_disable( $('#btnproceso') );
  $('#btnproceso').click(proceso);
  btn_disable( $('#btnimprimir') );
  $('#btnimprimir').click(function(){
    window.print();
  });
});
