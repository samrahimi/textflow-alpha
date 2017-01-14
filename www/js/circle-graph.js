//Inspired by http://jsfiddle.net/Aapn8/8758/
class CircleGraph {
    constructor(opts, el) {
        this.ctx = null
        //Should be user-specified
        this.el = el || document.getElementById('graph')
        this.options = opts || ({
                percent:  el.getAttribute('data-percent') || 25,
                size: el.getAttribute('data-size') || 180,
                lineWidth: el.getAttribute('data-line') || 15,
                rotate: el.getAttribute('data-rotate') || 0,
                lineColor: el.getAttribute('data-line-color') || '#555555'
        })
    }

    //Should be a private method. Called by render
    drawCircle(color, lineWidth, percent, radius) {
                percent = Math.min(Math.max(0, percent || 1), 1);
                var ctx = this.ctx
                ctx.beginPath();
                ctx.arc(0, 0, radius, 0, Math.PI * 2 * percent, false);
                ctx.strokeStyle = color;
                ctx.lineCap = 'round'; // butt, round or square
                ctx.lineWidth = lineWidth
                ctx.stroke();
    }

    render() {
        var el = this.el // get canvas
        el.innerHTML = '' //Clear the previous rendering, if any

        var options = this.options
        var canvas = document.createElement('canvas');
        var span = document.createElement('span');
        span.textContent = options.percent;

        this.ctx = canvas.getContext('2d');
        canvas.width = canvas.height = options.size;

        el.appendChild(span);
        el.appendChild(canvas);

        this.ctx.translate(options.size / 2, options.size / 2); // change center
        this.ctx.rotate((-1 / 2 + options.rotate / 180) * Math.PI); // rotate -90 deg

        //imd = ctx.getImageData(0, 0, 240, 240);
        var radius = (options.size - options.lineWidth) / 2;


        this.drawCircle('#efefef', options.lineWidth, 100 / 100, radius);
        this.drawCircle(options.lineColor, options.lineWidth, options.percent / 100,radius);

    }
}


//Usage:
//<div class="chart" id="graph" data-percent="88"></div>
