var slideout = new Slideout({
  'panel': document.getElementById('panel'),
  'menu': document.getElementById('menu'),
  'padding': 256,
  'tolerance': 70
});

$(document).ready(function() {
  // slideout.open();
  $('button#slideout').click(function() {
    console.log(this);
    slideout.toggle();
  })
});
