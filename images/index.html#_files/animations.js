var slideout = new Slideout({
  'panel': document.getElementById('panel'),
  'menu': document.getElementById('menu'),
  'padding': 256,
  'tolerance': 70
});


//slideout panel
$(document).ready(function() {
  // slideout.open();  
  //clicking option button will slide out toggle menu
  $('button#slideout').click(function() {
    slideout.toggle();
  })
});
