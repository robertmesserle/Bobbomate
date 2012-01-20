( function ( $ ) {
    
    function get_property ( obj, namespace, not_found_value ) {
        if ( typeof obj === 'undefined' )   return typeof not_found_value !== 'undefined' ? not_found_value : false;
        if ( namespace.indexOf( '.' ) < 0 ) return typeof obj[ namespace ] !== 'undefined' ? obj[ namespace ] : typeof not_found_value !== 'undefined' ? not_found_value : false;
        var namespace_array  = namespace.split('.'),
            namespace_length = namespace_array.length,
            val              = obj, i;
        for ( i = 0; i < namespace_length; i++ )
            if ( typeof( val = val[ namespace_array[ i ] ] ) === 'undefined' )
                return typeof not_found_value !== 'undefined' ? not_found_value : false;
        return typeof val !== 'undefined' ? val : typeof not_found_value !== 'undefined' ? not_found_value : false;
    }

    function Animator ( options ) {
        if ( this.interval ) this.stop();
        this.duration   = get_property( options, 'duration', 1000 );
        this.step       = get_property( options, 'step', false );
        this.start      = get_property( options, 'start', 0 );
        this.end        = get_property( options, 'end',   1 );
        this.easing     = this.get_easing_method( get_property( options, 'easing', false ) );
        this.start_time = +new Date();
        this.callback   = get_property( options, 'callback', false );
        this.play();
    }

    Animator.prototype = {
        fps:      77,
        wait:     Math.round( 1000 / Animator.prototype.fps ),
        interval: false,
        callback: false,
        get_easing_method: function ( easing ) {
            var default = function ( x, t, b, c, d ) { return -c * ( t /= d ) * ( t - 2 ) + b; };
            return typeof easing === 'function' ? easing : get_property( $, 'easing.' + easing, default );
        },
        stop: function () {
            clearInterval( this.interval );
            if ( this.callback ) this.callback();
            this.callback = false;
        },
        play: function () {
            var self = this;
            this.interval = setInterval( function () {
                var now  = +new Date(),
                    time = now - self.start_time;
                self.step( self.easing( null, Math.min( time, self.duration ), self.start, self.end - self.start, self.duration ) );
                if ( time > self.duration ) self.stop();
            }, this.wait );
        }
    };

    $.bobbonate = function ( options ) {
        var ret = new Animator( options );
        return {
            stop: $.proxy( ret, 'stop' )
        };
    };
} )( jQuery );