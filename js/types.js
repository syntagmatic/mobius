$(function() {

    // Stub out Backbone.request...
    Backbone.sync = function() {
        lastRequest = _.toArray(arguments);
    };


    window.Panel = Backbone.Model.extend({
        defaults: {
            "height": '50%',
            "width": '50%'
        },     
        initialize: function() {
        },
        clear: function() {
            this.destroy();
            this.view.remove();
        }
    });
    window.PanelView = Backbone.View.extend({
        tagName: "div",
        className: "panel",
        template: _.template($('#panel-template').html()),
        events: {
            "click .play" : "play"
        },
        initialize: function() {
            this.playing = false;
            this.model.view = this;
        },
        render: function() {
            $(this.el).html(this.template(this.model.toJSON()))
            return this;
        },
        play: function() {
            if (!this.playing) {
                this.play = new Play();
                var playView = new PlayView({model: this.play});
                $(this.el).append(playView.render(this.el).el);
                this.playing = true;
            } else {
                this.play.clear();
                this.playing = false;
            }
        }
    });


    /* Canvas Play */

    window.Play = Backbone.Model.extend({

        defaults: {
            "height":200,
            "width":200
        },     
        initialize: function() {

        },

        clear: function() {
            this.destroy();
            this.view.remove();
        }
    });

    window.PlayView = Backbone.View.extend({
        initialize: function() {
            this.model.view = this;
        },
        tagName:"canvas",
        render: function(parent) {
            this.resize(parent);
            this.setContent();
            return this;
        },
        resize: function(parent) {
            $(this.el).attr({width: $(parent).width(),
                height: $(parent).height(),
                margin: 'auto'});
        }, 
        setContent: function() {
            var canvas = this.el;
            var context = canvas.getContext("2d");

            var minHue = 90,
                maxHue = 180,
                rangeHue = maxHue - minHue;

            var i = oi = Math.floor(canvas.width/10),
                j = oj = Math.floor(canvas.height/10);

            var colorspace = function() {
              while (i--) {
                while (j--) {
                  context.fillStyle = "hsl(" + minHue + rangeHue*Math.random() + ","
                                             + 100*Math.random() + "%,"
                                             + 90*Math.random() + "%)";
                  context.fillRect( i*10
                                  , j*10
                                  , 9 
                                  , 9);
                }
                j = oj;
              }
              i = oi
              setTimeout( function() {
                colorspace();
              }, 800);
            };

            colorspace();
        }
    });  

});
