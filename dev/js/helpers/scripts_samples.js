
// Show PC view in Tablet devices

app.tabletViewport = function () {

  var viewport = document.getElementById('viewport');

  var viewportSet = function () {
    if (screen.width >= 768 && screen.width <= 1024) {
      viewport.setAttribute('content', 'width=1300, user-scalable=0');
    } else {
      viewport.setAttribute('content', 'width=device-width, initial-scale=1, shrink-to-fit=no, user-scalable=0');
    }
  };

  viewportSet();

  window.onload = function () {
    viewportSet();
  };

  window.onresize = function () {
    viewportSet();
  };

};


// Sample Btn_Top fixes above Footer

app.btnTop = function () {

  var btnTop = $('#btn-top');

  btnTop.click(function () {
    $('html, body').animate({
      scrollTop: 0
    }, 500);
  });

  btnTopFade();
  btnTopFixed();

  $(window).on('load scroll resize', function () {
    btnTopFade();
    btnTopFixed();
  });

  function btnTopFade () {
    if ($(window).scrollTop() > $(window).height() * 0.2) {
      if (!btnTop.is(':visible')) {
        btnTop.css('opacity', 0).show();
        btnTop.animate({
          opacity: 1
        }, 400);
      }
    } else {
      if (btnTop.is(':visible') && !btnTop.is(':animated')) {
        btnTop.animate({
          opacity: 0
        }, 400, function () {
          btnTop.css('opacity', 1).hide();
        });
      }
    }
  }

  function btnTopFixed () {
    if (!app.isMobile()) {
      var gutter = 20;
      var footer = $('footer');
      var footerLine = $('html').height() - footer.outerHeight() - gutter;
      var winBottomLine = $(window).scrollTop() + $(window).height();
      var distance = winBottomLine - footerLine;
      if (distance > gutter) {
        btnTop.css('bottom', distance + 'px');
      } else {
        btnTop.css('bottom', gutter + 'px');
      }
    }
  }
};


// Sample Fixed Header

app.fixedHeader = function () {

  var element, distance;

  if (!app.isMobile() && $('#header').length) {

    $('#header').clone().removeAttr('id').addClass('header-fixed').appendTo('body');

    element = $('.header-fixed');
    distance = 400;

    toogleHeaderActive();
    toogleHeaderLeft();

    $(window).on('load scroll resize', function () {
      toogleHeaderActive();
      toogleHeaderLeft();
    });

  }

  function toogleHeaderActive () {
    if ($(window).scrollTop() > distance) {
      element.addClass('active');
    } else {
      element.removeClass('active');
    }
  }

  function toogleHeaderLeft () {
    var winLeft = $(window).scrollLeft();
    if (winLeft > 0) {
      element.css('left', -winLeft + 'px');
    } else {
      element.css('left', 0);
    }
  }

  if (app.isMobile()) {
    $('#header').clone().addClass('header_fixed').appendTo('body');
    $(window).on('load scroll resize', function () {
      var innerHeight = $('#header').innerHeight();
      if ($(window).scrollTop() > innerHeight) {
        $('.header_fixed').addClass('visible');
      } else {
        if (!$('.btn-menu').hasClass('is-down')) {
          $('.header_fixed').removeClass('visible');
        }
      }
    });
  }

};
