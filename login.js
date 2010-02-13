(function($) {
  function switchType(source) {
    var type = source.attr('type');
    var options = {
      type: type == 'password' ? 'text' : 'password',
      placeholder: source.placeholder(),
      focusout: function() {
        $(this).presentPlaceholder();
      },
      focusin: function() {
        $(this).removePlaceholder();
      },
      required: source.attr('required'),
      name: source.attr('name'),
      id: source.attr('id')
    };
    
    var dupe = $('<input>', options);
    dupe.data('isPassword', type == 'password');
    return dupe;
  }
  
  $.fn.extend({
    placeholder: function() {
      return this.attr('placeholder');
    },
    
    isEmpty: function(orPlaceholder) {
      var value = this.val();
      var blank = value == "";
      
      if(orPlaceholder) {
        return blank || (this.placeholder() == value);
      }
      
      return blank;
    },
    
    presentPlaceholder: function() {
      var element = this;
      
      if(this.isEmpty(true)) {
        if(this.attr('type') == 'password') {
          var dupe = switchType(this);
          this.replaceWith(dupe);
          element = dupe;
        }
        
        element.val(this.placeholder()).addClass('with_placeholder');
      }
    },
    
    removePlaceholder: function() {
      var element = this;
      if(this.data('isPassword')) {
        var dupe = switchType(this);
        
        this.replaceWith(dupe);
        dupe.focus();
        element = dupe;
      }
      
      if(element.isEmpty(true)) {
        element.removeClass('with_placeholder');
        element.val('');
      }
    }
  });
  
  $(document).ready(function() {
    var selector = 'input[placeholder]';
    
    // Safari 4 already supports the HTML5 attributes
    if(!$.browser.webkit) {
      $(selector).each(function() {
        var input = $(this);
        input.presentPlaceholder();
      });
    
      $(selector).focusin(function() {
        $(this).removePlaceholder();
      }).focusout(function() {
        $(this).presentPlaceholder();
      });
    
      $('input[autofocus]').first().trigger('focus');
    }
    
    // $('label').hide();
    
    $('#login').submit(function() {
      var element;
      
      $(this).find('input[required]').each(function() {
        var input = $(this);
        if(input.isEmpty(true)) {
          element = input;
          return false;
        }
      });
      
      if(element) {
        element.focus();
        return false;
      }
    });
  });
})(jQuery);
