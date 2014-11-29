(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
//     __  __         __           _
//    / / / /__  ____ _____/ /  ____  ____         (_)____
//   / /_/ / _ \/ __ `/ __  /_____/ __ \/ __ \    / / ___/
//  / __  /  __/ /_/ / /_/ /_____/ /_/ / / / /   / (__  )
// /_/ /_/\___/\__,_/\__,_/      \____/_/ /_(_)_/ /____/
//                         /___/
(function(window, undefined){
  "use strict";
  var headOn = (function(){

    var headOn = {

        groups: {},
        _images: {},
        fps:60,
        imagesLoaded: true,
        gameTime: 0,
        _update:"",
        _render:"",
        _ticks: 0,
        alias: false,
        _const: {},
        randInt: function(min, max) {
          return Math.floor(Math.random() * (max +1 - min)) + min;
        },
        randFloat: function(min, max) {
          return Math.random() * (max - min) + min;
        },
        clamp: function(value, min, max){
          return Math.min(Math.max(value, min), max);
        },
        lerp: function(start,  end, t){
          //console.log(t)
          t = this.clamp(t,0,1);
          //console.log(t);
          return start + (end - start) * t;
        },
        constants: function(constname, value){
          if(arguments.length === 1){
            return this._const["constname"] || null;
          }else{
            this._const["constname"] = value;
          }
        },
        events: {
          events: {},
          listen: function(eventName, callback){
            var id = headOn.uId();
            if(!this.events[eventName]){
              this.events[eventName] = [];
            }
            this.events[eventName].push({cb:callback, id:id});
          },
          unlisten:function(eventName, id){
            if(!this.events[eventName]) return;
            this.events[eventName].forEach(function(e, i){
              if(e.id === id){
                this.events[eventName].splice(i,1);
              }
            });
          },
          trigger: function(eventName){
            var args = [].splice.call(arguments, 1),
              e = this.events[eventName],
              l,
              i;
            if(e){
              l = e.length;
              for(i = 0; i < l; i++){
                e[i].cb.apply(headOn, args);
              }
            }

          }
        },
        uId: function s4() {
            return Math.floor((1 + Math.random()) * 0x10000)
               .toString(16)
               .substring(1);
        },
        FSM: function(entity){
          this.entity = entity;
          return this;
        },
        Camera: function(width, height, x, y, zoom){
          this.width = width;
          this.height = height;
          x = x || 0;
          y = y || 0;
          this.position = headOn.Vector(x, y);
          this.dimensions = headOn.Vector(width, height);
          this.center = headOn.Vector(x+width/2, y+height/2);
          this.zoomAmt = zoom || 1;
          return this;
        },
        animate: function(object,keyFrames,callback){
          var that, interval, currentFrame = 0;
          if(!object.animating){
            object.animating = true;
            object.image = keyFrames[0];
            that = this;

            interval = setInterval(function(){
              if(keyFrames.length === currentFrame){
                callback();
                object.animating = false;
                object.image = "";
                clearInterval(interval);
              }
              else{
                currentFrame += 1;
                object.image = keyFrames[currentFrame];
              }
            },1000/this.fps);
          }



        },

        update: function(cb){this._update = cb;},

        render: function(cb){this._render = cb;},

        entity: function(values, parent){
          var i, o, base;
          if (parent && typeof parent === "object") {
            o = Object.create(parent);
          }
          else{
            o = {};
          }
          for(i in values){
            if(values.hasOwnProperty(i)){
              o[i] = values[i];
            }
          }
          return o;
        },
        inherit: function (base, sub) {
          // Avoid instantiating the base class just to setup inheritance
          // See https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/create
          // for a polyfill
          sub.prototype = Object.create(base.prototype);
          // Remember the constructor property was set wrong, let's fix it
          sub.prototype.constructor = sub;
          // In ECMAScript5+ (all modern browsers), you can make the constructor property
          // non-enumerable if you define it like this instead
          Object.defineProperty(sub.prototype, 'constructor', {
            enumerable: false,
            value: sub
          });
        },

        extend: function(base, values){
          var i;
          for(i in values){
            if(values.hasOwnProperty(i)){
              base[i] = values[i];
            }
          }
        },
        clone: function (obj) {
          // Handle the 3 simple types, and null or undefined
          if (null === obj || "object" != typeof obj) return obj;
          var copy;
          // Handle Date
          if (obj instanceof Date) {
              copy = new Date();
              copy.setTime(obj.getTime());
              return copy;
          }

          // Handle Array
          if (obj instanceof Array) {
              copy = [];
              for (var i = 0, len = obj.length; i < len; i++) {
                  copy[i] = clone(obj[i]);
              }
              return copy;
          }

          // Handle Object
          if (obj instanceof Object) {
              copy = {};
              for (var attr in obj) {
                  if (obj.hasOwnProperty(attr)) copy[attr] = clone(obj[attr]);
              }
              return copy;
          }

          throw new Error("Unable to copy obj! Its type isn't supported.");
        },
        collides: function(poly1, poly2, center) {
          var points1 = this.getPoints(poly1, center),
            points2 = this.getPoints(poly2, center),
            i = 0,
            l = points1.length,
            j, k = points2.length,
            normal = {
              x: 0,
              y: 0
            },
            length,
            min1, min2,
            max1, max2,
            interval,
            MTV = null,
            MTV2 = null,
            MN = null,
            dot,
            nextPoint,
            currentPoint;

          if(poly1.type === "circle" && poly2.type ==="circle"){
            return circleCircle(poly1, poly2);
          }else if(poly1.type === "circle"){
            return circleRect(poly1, poly2);
          }else if(poly2.type === "circle"){
            return circleRect(poly2, poly1);
          }


          //loop through the edges of Polygon 1
          for (; i < l; i++) {
            nextPoint = points1[(i == l - 1 ? 0 : i + 1)];
            currentPoint = points1[i];

            //generate the normal for the current edge
            normal.x = -(nextPoint[1] - currentPoint[1]);
            normal.y = (nextPoint[0] - currentPoint[0]);

            //normalize the vector
            length = Math.sqrt(normal.x * normal.x + normal.y * normal.y);
            normal.x /= length;
            normal.y /= length;

            //default min max
            min1 = min2 = -1;
            max1 = max2 = -1;

            //project all vertices from poly1 onto axis
            for (j = 0; j < l; ++j) {
              dot = points1[j][0] * normal.x + points1[j][1] * normal.y;
              if (dot > max1 || max1 === -1) max1 = dot;
              if (dot < min1 || min1 === -1) min1 = dot;
            }

            //project all vertices from poly2 onto axis
            for (j = 0; j < k; ++j) {
              dot = points2[j][0] * normal.x + points2[j][1] * normal.y;
              if (dot > max2 || max2 === -1) max2 = dot;
              if (dot < min2 || min2 === -1) min2 = dot;
            }

            //calculate the minimum translation vector should be negative
            if (min1 < min2) {
              interval = min2 - max1;

              normal.x = -normal.x;
              normal.y = -normal.y;
            } else {
              interval = min1 - max2;
            }

            //exit early if positive
            if (interval >= 0) {
              return false;
            }

            if (MTV === null || interval > MTV) {
              MTV = interval;
              MN = {
                x: normal.x,
                y: normal.y
              };
            }
          }

          //loop through the edges of Polygon 2
          for (i = 0; i < k; i++) {
            nextPoint = points2[(i == k - 1 ? 0 : i + 1)];
            currentPoint = points2[i];

            //generate the normal for the current edge
            normal.x = -(nextPoint[1] - currentPoint[1]);
            normal.y = (nextPoint[0] - currentPoint[0]);

            //normalize the vector
            length = Math.sqrt(normal.x * normal.x + normal.y * normal.y);
            normal.x /= length;
            normal.y /= length;

            //default min max
            min1 = min2 = -1;
            max1 = max2 = -1;

            //project all vertices from poly1 onto axis
            for (j = 0; j < l; ++j) {
              dot = points1[j][0] * normal.x + points1[j][1] * normal.y;
              if (dot > max1 || max1 === -1) max1 = dot;
              if (dot < min1 || min1 === -1) min1 = dot;
            }

            //project all vertices from poly2 onto axis
            for (j = 0; j < k; ++j) {
              dot = points2[j][0] * normal.x + points2[j][1] * normal.y;
              if (dot > max2 || max2 === -1) max2 = dot;
              if (dot < min2 || min2 === -1) min2 = dot;
            }

            //calculate the minimum translation vector should be negative
            if (min1 < min2) {
              interval = min2 - max1;

              normal.x = -normal.x;
              normal.y = -normal.y;
            } else {
              interval = min1 - max2;


            }

            //exit early if positive
            if (interval >= 0) {
              return false;
            }

            if (MTV === null || interval > MTV) MTV = interval;
            if (interval > MTV2 || MTV2 === null) {
              MTV2 = interval;
              MN = {
                x: normal.x,
                y: normal.y
              };
            }
          }

          return {
            overlap: MTV2,
            normal: MN
          };
          function circleRect(circle, rect){
            var newX = circle.position.x * Math.cos(-rect.angle);
            var newY = circle.position.y * Math.sin(-rect.angle);
            var circleDistance = {x:newX, y:newY};
            var cornerDistance_sq;
            circleDistance.x = Math.abs(circle.position.x - rect.position.x);
              circleDistance.y = Math.abs(circle.position.y - rect.position.y);

              if (circleDistance.x > (rect.width/2 + circle.radius)) { return false; }
              if (circleDistance.y > (rect.height/2 + circle.radius)) { return false; }

              if (circleDistance.x <= (rect.width/2)) { return true; }
              if (circleDistance.y <= (rect.height/2)) { return true; }

              cornerDistance_sq = Math.pow(circleDistance.x - rect.width/2,2) +
                                   Math.pow(circleDistance.y - rect.height/2, 2);

              return (cornerDistance_sq <= Math.pow(circle.radius,2));
          }
          function pointInCircle(point, circle){
            return Math.pow(point.x - circle.position.x ,2) + Math.pow(point.y - circle.position.y, 2) < Math.pow(circle.radius,2);
          }
          function circleCircle(ob1, ob2){
            return square(ob2.position.x - ob1.position.x) + square(ob2.position.y - ob1.position.y) <= square(ob1.radius + ob2.radius);
          }
        },

        getPoints: function (obj, center){
          if(obj.type === "circle"){
            return [];
          }
          var pos = obj.pos || obj.position;
          var x = pos.x,
            y = pos.y,
            width = obj.width,
            height = obj.height,
            angle = obj.angle,
            that = this,
            h,
            w,
            points = [];
          if(!center){
            points[0] = [x,y];
            points[1] = [];
            points[1].push(Math.sin(-angle) * height + x);
            points[1].push(Math.cos(-angle) * height + y);
            points[2] = [];
            points[2].push(Math.cos(angle) * width + points[1][0]);
            points[2].push(Math.sin(angle) * width + points[1][1]);
            points[3] = [];
            points[3].push(Math.cos(angle) * width + x);
            points[3].push(Math.sin(angle) * width + y);
          }else{
            w = (width/2);
            h = (height/2);
            points[0] = [x-w, y-h];
            points[1] = [x+w, y-h];
            points[2] = [x+w, y+h];
            points[3] = [x-w, y+h];
          }

            //console.log(points);
          return points;

        },

        Timer: function(){
          this.jobs = [];
        },
        pause: function(){
          this.paused = true;
          this.events.trigger("pause");
        },
        unpause: function(){
          this.events.trigger("unpause");
          this.paused = false;
        },
        isPaused: function(){
          return this.paused;
        },
        group: function(groupName, entity){
          if(this.groups[groupName]){
            if(entity){
              this.groups[groupName].push(entity);
            }
          }
          else{
            this.groups[groupName] = [];
            if(entity){
              this.groups[groupName].push(entity);
            }
          }
          return this.groups[groupName];
        },

        loadImages: function(imageArray, progress, allCallback){
          var args, img, total, loaded, timeout, interval, that, cb, imgOnload;
          that = this;
          this.imagesLoaded = false;
          total = imageArray.length;
          if(!total){
            this.imagesLoaded = true;
          }
          loaded = 0;
          imgOnload = function(){
            loaded += 1;
            //Is this too clever?
            //Should we not rely on short circut and just use and if?
            progress && progress(loaded, total);
            if(loaded === total){
              //Same here
              allCallback && allCallback();
              that.imagesLoaded = true;
            }
          };
          imageArray.forEach(function(image){
            img = new Image();
            img.src = image.src;
            img.onload = imgOnload;

            that._images[image.name] = img;
          });
        },
        setFPS: function(fps){
          this.fps = fps;
          this.events.trigger("FPS change");
        },
        debug: function(){
          if(window.DEBUG){
            console.log.apply(console, arguments);
          }
          return;
        },
        images: function(image){
          if(this._images[image]){
            return this._images[image];
          }
          else{
            return null;
          }
        },


        timeout: function(cb, time, scope){
          setTimeout(function(){
            cb.call(scope);
          }, time);
        },

        interval: function(cb, time, scope){
          return setInterval(function(){
            cb.call(scope);
          }, time);
        },
        canvas: function(name){
          if(this === headOn){
            return new this.canvas(name);
          }
          this.canvas = this.canvases[name];
          this.width = this.canvas.width;
          this.height = this.canvas.height;
          return this;
        },
        vectorCount:0,
        copies:0,
        adds:0,
        subs:0,
        muls:0,
        Vector: function(x, y){
          headOn.vectorCount++;
          if(this === headOn){
            return new headOn.Vector(x,y);
          }
          if(typeof x !== "number"){
            if(x){
              this.x = x.x;
              this.y = x.y;
            }else{
              this.x = 0;
              this.y = 0;
            }

          }else{
            this.x = x;
            this.y = y;
          }
          return this;
        },
        run: function(){
          var that = this;
          var then = Date.now();
          var now;
          var interval = 1000/this.fps;
          var delta;
          window.requestAnimationFrame(aniframe);
          //setTimeout(updateFrame, 1000/this.fps);
          this.events.listen("FPS change", function(){
            that.debug(interval)
            interval = 1000/that.fps;
            that.debug(interval);
          });
          function aniframe(){
            var now = Date.now();
            delta = now - then;
            //We want the time inbetween frames not the time in between frames + time it took to do a frame
            if(delta > interval){
              that._update(delta);

              then = now - (delta % interval);

            }
            that.renderTick();
            window.requestAnimationFrame(aniframe);


          }

        },
        updateTick: function(then){
          var now = Date.now(),
          modifier = now - then;
          this.trueFps = 1/(modifier/1000);
          this._ticks+=1;
          this._update(modifier, this._ticks);
          this.gameTime += modifier;

        },
        renderTick: function(then){
          this._render();
        },
        exception: function(message){
          this.message = message;
          this.name = "Head-on Exception";
          this.toString = function(){
            return this.name + ": " + this.message;
          };
        }
    };

    headOn.canvas.create = function(name, width, height, camera, styles){
      var canvas, ctx;
      if(!camera || !(camera instanceof headOn.Camera)){
        throw new headOn.exception("Canvas must be intialized with a camera");
      }
      canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      if(styles){
        for(var key in styles){
          if(styles.hasOwnProperty(key)){
            canvas.style[key] = styles[key];
          }
        }
      }

      ctx = canvas.getContext("2d");
      ctx.webkitImageSmoothingEnabled = false;
      ctx.mozImageSmoothingEnabled = false;
      ctx.imageSmoothingEnabled = false; //future
      this.prototype.canvases[name] = {
        canvas: canvas,
        ctx: ctx,
        width: canvas.width,
        height: canvas.height,
        camera: camera
      };
      return headOn.canvas(name);
    };
    headOn.canvas.prototype = {
      canvases: {},
      stroke: function(stroke){
        var ctx = this.canvas.ctx;
        ctx.save();
        if(stroke){
          ctx.lineWidth = stroke.width;
          ctx.strokeStyle = stroke.color;
          ctx.stroke();
        }
        ctx.restore();
      },
      drawSquare: function(x, y, size, color, stroke, rotation){
        this.drawRect(size, size, x, y, color, stroke, rotation);
      },
      drawRect: function(width, height, x, y, color, stroke, rotation){
        var ctx = this.canvas.ctx, mod = 1, camera = this.canvas.camera;
        var obj;
        if(arguments.length === 1 && typeof arguments[0] === "object"){
          obj = arguments[0];
          x = obj.x;
          y = obj.y;
          width = obj.width;
          height = obj.height;
          color = obj.color;
          stroke = obj.stroke;
          rotation = obj.rotation;
        }

        ctx.save();
        ctx.beginPath();

        if(rotation){
          ctx.translate(x,y);
          ctx.rotate(rotation);
          ctx.rect(0, 0, width, height);
        }
        else{
          //console.log(camera.position.x)
          if(obj && obj.camera === false){
            ctx.rect(x, y, width, height);
          }else{
            ctx.rect((x - camera.position.x)/camera.zoomAmt , (y - camera.position.y)/camera.zoomAmt , width / camera.zoomAmt, height / camera.zoomAmt);
          }

        }
        if(color){
          ctx.fillStyle = color;
        }

        ctx.fill();
        if(typeof stroke === "object" && !isEmpty(stroke)){
          this.stroke(stroke);
        }
        ctx.closePath();
        ctx.restore();
        return this;
      },
      drawCircle: function(x, y, radius, color, stroke){
        var ctx = this.canvas.ctx, mod = 1, camera = this.canvas.camera, oneArg;
        if(arguments.length === 1 && typeof arguments[0] === "object"){
          oneArg = true;
          x=arguments[0].x;
          y=arguments[0].y;
          radius=arguments[0].radius;
          color = arguments[0].color;
          stroke = arguments[0].stroke;
        }

        ctx.save();
        ctx.beginPath();
        if(oneArg && arguments[0].camera === false){
          ctx.arc(x, y, radius, 0, 2*Math.PI, false);
        }else{

          ctx.arc((x - camera.position.x)/camera.zoomAmt, (y - camera.position.y)/camera.zoomAmt, radius / camera.zoomAmt, 0, 2*Math.PI, false);
        }

        ctx.fillStyle = color || "black";
        ctx.fill();
        this.stroke(stroke);
        ctx.restore();
        ctx.closePath();
        return this;
      },
      drawImage: function(image,x,y){
        var ctx = this.canvas.ctx;
        var camera = this.canvas.camera;
        var coords = camera.unproject(headOn.Vector(x,y));
        //try{
          ctx.drawImage(image,coords.x,coords.y);
       // }
       // catch(e){
          //console.log(image);
      //  }
        return this;
      },
      drawLine: function(start, end, color){
        var ctx = this.canvas.ctx;
        var camera = this.canvas.camera;
        start = camera.unproject(start);
        end = camera.unproject(end);
        ctx.save();
        ctx.beginPath();
        ctx.moveTo(start.x, start.y);
        ctx.lineTo(end.x, end.y);
        ctx.strokeStyle = color;
        ctx.stroke();
        ctx.restore();
      },
      drawImageRotated: function(image, rotation, x,y){
        var ctx = this.canvas.ctx;
        var radians = rotation ;
        var camera = this.canvas.camera;
        var coords = camera.unproject(headOn.Vector(x,y))
        ctx.save();
        ctx.translate(coords.x, coords.y);
        ctx.rotate(radians);
        ctx.drawImage(image, 0 - image.width/2, 0 - image.height/2);
        ctx.restore();
        return this;
      },
      createGradient: function(options){
        var grd;
        var ctx = this.canvas.ctx;
        var camera = this.canvas.camera;
        var start;
        var end;
        if(options.camera !== false){
          start = camera.unproject(options.start);
          end = camera.unproject(options.end);
        }else{
          start = options.start;
          end = options.end;
        }
        if(options.type === "radial"){
          return ctx.createRadialGradient(start.x, start.y, options.radius1, end.x, end.y, options.radius2);
        }else{
          return ctx.createLinearGradient(start.x, start.y, end.x, end.y);
        }

      },
      drawText: function(textString, x, y, fontStyle, color, alignment, baseline){
        var ctx = this.canvas.ctx;
        ctx.save();

        if(fontStyle){
          ctx.font = fontStyle + " sans-serif";
        }
        if(color){
          ctx.fillStyle = color;
        }
        if(alignment){
          ctx.textAlign = alignment;
        }
        if(baseline){
          ctx.textBaseline = baseline;
        }

        ctx.fillText(textString,x,y);

        ctx.restore();
        return this;
      },

      append: function(element){
        element = document.querySelector(element);
        if(element){
          this.canvas.canvas = element.appendChild(this.canvas.canvas);
        }
        else{
          this.canvas.canvas = document.body.appendChild(this.canvas.canvas);
        }
        return this;
      },
      clear: function(){
        var ctx = this.canvas.ctx;
        ctx.clearRect(0,0, this.canvas.width, this.canvas.height);
      },
      setCamera: function(cam){
        this.canvas.camera = cam;
      }
    };
    headOn.FSM.prototype = {
      changeState: function(state){
        if(this.state){
          this.state.exit();
        }

        this.state = state;
        this.state.enter();
      },
      update: function(){
        var args = [].slice.call(arguments, 0);
        args.unshift(this.entity);
        this.state.execute.apply(null, args);
      },
      setState: function(state){
        this.state = state;
      }
    },
    headOn.Timer.prototype = {
      job: function(time, start){
        var rem = arguments.length === 2 ? start : time;
        var jiff = {
          TTL: time,
          remaining: rem
        };
        this.jobs.push(jiff);
        return {
          ready: function(){
            return jiff.remaining <= 0;
          },
          reset: function(){
            jiff.remaining = jiff.TTL;
          },
          timeLeft: function(){
            return jiff.remaining;
          }
        };
      },
      update: function(time){
        this.jobs.forEach(function(j){
          j.remaining -= time;
        });
      }
    };
    headOn.Camera.prototype = {
      zoomIn: function(amt){
        this.zoomAmt /= amt;
        this.center.sub(this.dimensions.mul(this.zoomAmt / 2), this.position);
        return this;
      },
      zoomOut: function(amt){
        this.zoomAmt *= amt;
        this.center.sub(this.dimensions.mul(this.zoomAmt / 2), this.position);

        return this;
      },
      move: function(vec){
        this.position.add(vec, this.position);
        this.position.add(headOn.Vector(this.width, this.height).mul(0.5), this.center);
        headOn.events.trigger("cameraMoved", this);
        return this;
      },
      inView: function(vec){
        var x;
        var y;
        if(arguments.length === 2){
          x = arguments[0];
          y = arguments[1]
        }else{
          x = vec.x;
          y = vec.y;
        }
        if(x >= this.position.x && x <= this.position.x + this.width *this.zoomAmt && y >= this.position.y && y <= this.position.y + this.height*this.zoomAmt){
          return true;
        }else{
          return false;
        }
      },
      latchTo: function(vec1, vec2, vec3, vec4){
        this.latched = true;
        this.bounds = [vec1, vec2, vec3, vec4];
        console.log("latched")
      },
      latch: function(vec){
        //if we arent latched to coordinates then allow us to mvoe
        if(!this.latched){
          return vec;
        }else{
          //else check if we are in bounds.
          //console.log(this.bounds[1].x, this.width +vec.x);
          if(this.bounds[0].x > vec.x){
            vec.x = this.bounds[0].x;
          }
          if(this.bounds[0].y > vec.y){
            vec.y = this.bounds[0].y;
          }
          if(this.bounds[1].x < vec.x + this.width){
            vec.x = this.bounds[1].x - this.width
          }
          if(this.bounds[2].y < vec.y + this.height){
            //console.log("too far down")
            vec.y = this.bounds[2].y - this.height;
          }
          return vec;
        }
      },
      moveTo: function(vec){
        //if(!this.canMove()) return;
        var temp = $h.Vector(0,0);

        vec.sub(this.dimensions.mul(0.5).mul(this.zoomAmt), temp);
        if(temp.x === this.position.x && temp.y === this.position.y) return;
        //console.log(temp);
        temp = this.latch(temp);
        this.position = temp;
        headOn.events.trigger("cameraMoved", this);
        this.center = vec;
      },
      project: function(vec){
        return vec.mul(this.zoomAmt).add(this.position);
      },
      unproject: function(vec, out){
        if(out){
          vec.mul(1/this.zoomAmt, out).sub(this.position, out);
        }else{
          return vec.mul(1/this.zoomAmt).sub(this.position);
        }

      }
    };
    headOn.Vector.prototype = {
      normalize: function(out){
        var len = this.length();
        var finalx;
        var finaly;

        if(len === 0){
          finalx = 0;
          finaly = 0;
        }else{
          finalx = this.x/len;
          finaly = this.y/len;
        }
        if(out){
          out.x = finalx;
          out.y = finaly;
          return out;
        }else{
          return $h.Vector(finalx, finaly);
        }

      },

      normalizeInPlace: function(){
        var len = this.length();
        this.x /= len;
        this.y /= len;
      },
      distance: function(vec2){
        return this.sub(vec2).length();
      },
      toString: function(){
        return "( "+this.x + " , "+this.y +")";
      },
      dot: function(vec2){
        return vec2.x * this.x + vec2.y * this.y;
      },

      length: function(){
        return Math.sqrt(this.x*this.x + this.y*this.y);
      },
      copy: function(out){
        headOn.copies++;
        if(out){
          out.x = this.x;
          out.y = this.y;
          return out;
        }else{
          return new headOn.Vector(this.x, this.y);
        }

      },
      sub: function(vec2, out){
        headOn.subs++;
        if(out){
          out.x = this.x - vec2.x;
          out.y = this.y - vec2.y;
          return out;
        }
        return headOn.Vector(this.x - vec2.x, this.y - vec2.y);
      },

      add: function(vec2, out){
        if(out){
          out.x = this.x + vec2.x;
          out.y = this.y + vec2.y;
          return out;
        }
        headOn.adds++;
        return headOn.Vector(this.x + vec2.x, this.y + vec2.y);
      },
      truncate: function(max, out){
        var i;
        i = max / this.length();
        i = i < 1 ? i : 1;
        return this.mul(i, out);
      },
      mul: function(scalar, out){
        headOn.muls++;
        if(out){
          out.x = this.x * scalar;
          out.y = this.y * scalar;
          return out;
        }
        return headOn.Vector(this.x * scalar, this.y * scalar);
      }
    };
    function sign(num){
      if(num < 0){
        return -1;
      }else{
        return 1;
      }
    }


    return headOn;
    function square(num){
      return num * num;
    }
    function isEmpty(obj){
      return Object.keys(obj).length === 0;
    }
  }());
  module.exports = headOn;
  window.headOn = headOn;
})(window);

},{}],2:[function(require,module,exports){
var $h = require("../lib/headOn.js");
var Piece = require("./piece.js");

function Bishop(team, x, y){
  Piece.apply(this, arguments);
  this.attacksDiag = true;
}
$h.inherit(Piece, Bishop);
//Returns an array of all possible x,y pairs the Bishop can move
Bishop.prototype.calcMoves = function(board){
   var squares = [];
  //Go up

 
  this.checkDiagUpLeft(7, squares);
  this.checkDiagUpRight(7, squares);
  this.checkDiagDownLeft(7, squares);
  this.checkDiagDownRight(7, squares);
  this.validSquares = squares;
};

module.exports = Bishop;
},{"../lib/headOn.js":1,"./piece.js":9}],3:[function(require,module,exports){
var $h = require("../lib/headOn.js");
module.exports = {
  squareSize:10,
  flipped:false,
  _whiteColor: "white",
  _blackColor: "black",
  flip:function(){
    this.flipped = !this.flipped;
  },
  isFlipped: function(){
    return this.flipped;
  },
  setSquareSize: function(size){
    this.squareSize = size;
  },
  //lets you set the color for white squares
  //default is white
  setWhiteColor: function(color){
    this._whiteColor = color;
  },
  //sets the color for black squares
  //defualt is black
  setBlackColor: function(color){
    this._blackColor = color;
  },
  // Draw a chess board using a supplied canvas
  // Also take into account whether or not the board should be flipped
  draw: function(canvas){
    //whiteOrBlack is the negation of what flipped currently is
    var whiteOrBlack = this.flipped;
    var color;
    //Loop to draw all the squares
    for(var i = 0; i<8; i++){
      for(var j = 0; j<8; j++){
        //if whiteOrBlack is true color is white
        //else color is black
        color = whiteOrBlack ? this._whiteColor : this._blackColor;
        //Place to draw the square is the x,y (j,i) tile number multiplied by the size of tiles
        canvas.drawRect(this.squareSize, this.squareSize, j*this.squareSize, i*this.squareSize, color);
        //alterante color
        whiteOrBlack = !whiteOrBlack;
      }

      //The start of a new row always has the same color as the end of the previous row
      //Flip whiteOrBlack to reflect that
      whiteOrBlack = !whiteOrBlack;
    }
    
    //Draw the boarder for the board
    canvas.drawRect(canvas.width, canvas.height, 0,0, "transparent", {color:"black", width:5});
  },


};
},{"../lib/headOn.js":1}],4:[function(require,module,exports){
(function(){
  "use strict";
  var $h = require("../lib/headOn.js");
  var gameRunner = {
    init: function(pieces){
      this.pieces = pieces;
      $h.events.listen("squareclick", this.handleSquareClick.bind(this));
      this.turn = TEAMS.white;
    },
    //See if the the square click event clicks on a piece.
    handleSquareClick: function(x, y){
      var piece = this.pieces.at(x,y);
      //If there is a pice at that square
      //and It's that pieces teams turn
      if(piece && piece.getTeam() === this.turn){
        //Check that currentActive is intialized
        if(this.currentActive){
          //Set whatever is active as inactive 
          this.currentActive.setInactive();
        }
        //Set the new active piece
        this.currentActive = piece;
        //Set is as active
        piece.setActive();
      }else if(this.currentActive){
        //If we moved successfully. It's the next player's turn
        if(this.pieces.move(this.currentActive, x, y)){
          this.nextPlayerTurn();
        }
        //If we off click or it is the next player's turn
        //We dont have an active piece anymore
        this.currentActive.setInactive();
        this.currentActive = null;
      }
    },
    nextPlayerTurn: function(){
      //Remeber to add break statements for your fucking cases
      switch(this.turn){
        case TEAMS.white:
          this.turn = TEAMS.black;
          break;
        case TEAMS.black:
          this.turn = TEAMS.white;
          break;
        default:
          assert(false, "Invalid team");
      }
    }
  };

  module.exports = gameRunner;
}());

},{"../lib/headOn.js":1}],5:[function(require,module,exports){
var $h = require("../lib/headOn.js");
var Piece = require("./piece.js");

function King(team, x, y){
  Piece.apply(this, arguments);
  this.attacksKing = true;
}
$h.inherit(Piece, King);
//Returns an array of all possible x,y pairs the queen can move
King.prototype.calcMoves = function(){
  var squares = [];
  this.checkUp(1, squares);
  this.checkLeft(1, squares);
  this.checkDown(1, squares);
  this.checkRight(1, squares);
  this.checkDiagUpLeft(1, squares);
  this.checkDiagUpRight(1, squares);
  this.checkDiagDownLeft(1, squares);
  this.checkDiagDownRight(1, squares);
  this.validSquares = squares;
};

King.prototype.underAttack = function(startPos, endPos){
  var squares = [];
  var piece;
  var attacked = false;
  //this.position.x = endPos[0];
  //this.position.y = endPos[1];
  this.pieces.useIntermediateBoard(startPos, endPos);
  piece = this.checkUp(7, squares, true);
  if(piece && piece.getTeam() !== this.team && piece.attacksOrtho){
    console.log("up", piece);
    attacked = true;
  }
  piece = this.checkLeft(7, squares, true);
  if(!attacked && piece && piece.getTeam() !== this.team && piece.attacksOrtho){
    console.log("left", piece);
    attacked = true;
  }
  piece = this.checkDown(7, squares, true);
  if(!attacked && piece && piece.getTeam() !== this.team && piece.attacksOrtho){
    console.log("down", piece);
    attacked = true;
  }
  piece = this.checkRight(7, squares, true);
  if(!attacked && piece && piece.getTeam() !== this.team && piece.attacksOrtho){
    console.log("right", piece);
    attacked = true;
  }
  piece = this.checkDiagUpLeft(7, squares, true);
  if(!attacked && piece && piece.getTeam() !== this.team && piece.attacksDiag){
    console.log("diag", piece);
    attacked = true;
  }
  piece = this.checkDiagUpRight(7, squares, true);
  if(!attacked && piece && piece.getTeam() !== this.team && piece.attacksDiag){
    console.log("diag", piece);
    attacked = true;
  }
  piece = this.checkDiagDownLeft(7, squares, true);
  if(!attacked && piece && piece.getTeam() !== this.team && piece.attacksDiag){
    console.log("diag", piece);
    attacked = true;
  }
  piece = this.checkDiagDownRight(7, squares, true);
  if(!attacked && piece && piece.getTeam() !== this.team && piece.attacksDiag){
    console.log("diag", piece);
    attacked = true;
  }
  //this.position.x = startPos[0];
  //this.position.y = startPos[1];
  this.pieces.useActualBoard();
  return attacked;
};

module.exports = King;
},{"../lib/headOn.js":1,"./piece.js":9}],6:[function(require,module,exports){
var $h = require("../lib/headOn.js");
var Piece = require("./piece.js");

function Knight(team, x, y){
  Piece.apply(this, arguments);
  this.attacksKnight = true;
}
$h.inherit(Piece, Knight);
//Returns an array of all possible x,y pairs the Knight can move
Knight.prototype.calcMoves = function(board){
  "use strict";
  
  var squares = [];
  var x       = this.position.x;
  var y       = this.position.y;
  var newx;
  var newy;
  var p;
  var angle = 0;
  var sin;
  var cos;
  var coord1;
  var coord2;
  for(var i = 0; i<4; i++, angle+=Math.PI/2){
    sin = Math.round(Math.sin(angle));
    cos = Math.round(Math.cos(angle));
    //Go around the cirle starting at 0 degrees
    //Check 0, 90, 180, 270

    //If sin === 0 that means we are at 0 or 180 degrees
    //x goes over 2 and y goes up or down 1
    if(sin === 0){
      newx = x + cos * 2;
      coord1 = [newx, y+1];
      coord2 = [newx, y-1];
    }else{//We are at 90 or 270 degrees y goes up or down 2 and x goes up or down 1
      newy = y + sin * 2;
      coord1 = [x-1, newy];
      coord2 = [x+1, newy];
    }
    //Check for collisions and if we are in bounds
    p = this.pieces.at(coord1[0], coord1[1]);
    if(this.inBounds(coord1[0], coord1[1]) && (!p || p.team != this.team)){
      squares.push(coord1);
    }
    p = this.pieces.at(coord2[0], coord2[1]);
    if(this.inBounds(coord2[0], coord2[1]) && (!p || p.team != this.team)){
      squares.push(coord2);
    }
    
  }
  console.log(squares);
  this.validSquares = squares;
};

module.exports = Knight;
},{"../lib/headOn.js":1,"./piece.js":9}],7:[function(require,module,exports){
(function(){
  "use strict";
  var $h = require("../lib/headOn.js");
  var canvasSize = 800;
  var gameRunner = require("./game_runner.js");
  var board = require("./board.js");
  var pieces = require("./pieces.js");
  var camera = new $h.Camera(canvasSize, canvasSize);
  var canvas = $h.canvas.create("main", canvasSize, canvasSize, camera);
  var gameHTMLNode = document.getElementById("game");
  var TEAMS = {white:{}, black:{}};
  //Make an enum of the teams kind of hacky but it will work
  Object.freeze(TEAMS);
  window.TEAMS = TEAMS;
  window.assert = function assert(condition, message){
    if(!condition){
      message = message || "Assertion failed";
      if(typeof Error !== "undefined"){
        throw new Error(message);
      }
      //Fallback;
      throw message;
    }
  };
  window.STUB = function(){};
  window.printBoard = function(){pieces.print()}
  $h.constants("squareSize", canvasSize/8);
  canvas.append("#game");
  board.setSquareSize($h.constants("squareSize"));
  gameHTMLNode.style.width = canvasSize;
  gameHTMLNode.style.height = canvasSize;
  board.setWhiteColor("#440663");
  board.setBlackColor("#CCCCCC");

  $h.loadImages([{src:"assests/black_pieces/queen.png", "name": "black_queen"}],function(){}, function(){
    pieces.init();
    gameRunner.init(pieces);
    $h.run();
  });
  
  registerClicks(canvas, board);
  $h.render(function(){
    board.draw(canvas);
    pieces.draw(canvas, board.isFlipped());
  });
  $h.update(function(){

  });
  $h.run();
  //Sets up event listeners for clicks on the canvas
  //Turns those into what square was clicked on
  //Fire an event saying as much
  function registerClicks(canvas, board){
    var domObject = canvas.canvas.canvas;
    var squareSize = $h.constants("squareSize");
    domObject.addEventListener("mouseup", function(e){
      var x = Math.floor(e.offsetX/ squareSize);
      var y = Math.floor(e.offsetY/ squareSize);
      y = (board.isFlipped()) ? y : (y - 7) * -1;

      $h.events.trigger("squareclick", x, y);
    });
  }
}());


},{"../lib/headOn.js":1,"./board.js":3,"./game_runner.js":4,"./pieces.js":10}],8:[function(require,module,exports){
var $h = require("../lib/headOn.js");
var Piece = require("./piece.js");

function Pawn(team, x, y){
  Piece.apply(this, arguments);
  this.moved = false;
  this.attacksPawn = true;
}
$h.inherit(Piece, Pawn);
//Returns an array of all possible x,y pairs the Pawn can move
Pawn.prototype.calcMoves = function(){
  var squares = [];
  //Go up
  var range = (!this.moved) ? 2 : 1;
  var dx;
  var tiley;
  var tilex;
  var pieceAt;
  if(this.team === TEAMS.white){
      dx = 1;
  }else{
    dx = -1;
  }
  //Move the correct direction to look at the tile
  tiley = this.position.y + dx;
  //Go however many squares we can look forward and select valid spaces
  for(var i = 1; i<=range; i++){
    //If there isnt a piece blocking us add it to our valid list
    if(!this.pieces.at(this.position.x, tiley)){
      squares.push([this.position.x, tiley]);
    }else{//we can go no farther just break out;
      break;
    }
    tiley += dx;
  }
  
  //Now we check the diagnals
  tiley = this.position.y + dx;
  tilex = this.position.x;
  pieceAt = this.pieces.at(tilex+1, tiley);
  if(pieceAt && pieceAt.getTeam() !== this.team){
    squares.push([tilex+1, tiley]);
  }
  pieceAt = this.pieces.at(tilex-1, tiley);
  if(pieceAt && pieceAt.getTeam() !== this.team){
    squares.push([tilex-1, tiley]);
  }
  this.validSquares = squares;
};
Pawn.prototype.moveTo = function(x, y){
  
  if(Piece.prototype.moveTo.call(this, x, y)){
    this.moved = true;
    return true;
  }else{
    return false;
  }
};

module.exports = Pawn;
},{"../lib/headOn.js":1,"./piece.js":9}],9:[function(require,module,exports){
(function(){
  "use strict";
  var count = 0;
  var $h = require("../lib/headOn.js");
  var defaults = {
    "white": "white",
    "black": "black"
  };
  function Piece(team, x, y, pieces, color){
    this.team = team;
    this.color = color || pieces.getTeamColor(team);
    this.position = $h.Vector(x,y);
    this._active = false;
    this.pieces = pieces;
    this.validSquares = [];
    this._alive = true;
    this.takenBy = null;
    this.attacksOrtho = false;
    this.attacksDiag = false;
    this.attacksKnight = false;
    this.attacksPawn = false;
  }

  Piece.prototype.getTeam = function(){
    return this.team;
  };

  Piece.prototype.isActive = function(){
    return this._active;
  };
  Piece.prototype.calcMoves = function(){};
  Piece.prototype.setActive = function(){
    this.calcMoves();
    this._active = true;
  };

  Piece.prototype.setInactive = function(){
    this._active = false;
  };
  Piece.prototype.checkUp = function(range, squares, check){
    var p = null;
    var tile = this.position.y + 1;
    var dist = 1;
    var king = this.pieces.getKing(this.team);
    while(tile < 8 && dist <= range){
      p = this.loopInner(this.position.x, tile, squares, king, check);
      if(p) break;
      tile++;
      dist++;
    }
    return p;
  };
  //In: range out: squares
  //Returns the piece hit, if there is one
  Piece.prototype.checkDown = function(range, squares, check){
    var p = null;
    var tile = this.position.y - 1;
    var dist = 1;
    var king = this.pieces.getKing(this.team);
    var underAttack;
    while(tile >= 0 && dist <= range){
      p = this.loopInner(this.position.x, tile, squares, king, check);
      if(p) break;
      tile--;
      dist++;
    }
    return p;
  };
  
  Piece.prototype.checkRight = function(range, squares, check){
    var p = null;
    var tile = this.position.x + 1;
    var dist = 1;
    var king = this.pieces.getKing(this.team);
    while(tile < 8 && dist <= range){
      p = this.loopInner(tile, this.position.y, squares, king, check);
      if(p) break;
      tile++;
      dist++;
    }
    return p;
  };
  Piece.prototype.checkLeft = function(range, squares, check){
    var p = null;
    var tile = this.position.x - 1;
    var dist = 1;
    var king = this.pieces.getKing(this.team);
    while(tile >= 0 && dist <= range){
      p = this.loopInner(tile, this.position.y, squares, king, check);
      if(p) break;
      tile--;
      dist++;
    }
    return p;
  };
  Piece.prototype.checkDiagUpLeft = function(range, squares, check){
    var p = null;
    var tilex = this.position.x - 1;
    var tiley = this.position.y + 1;
    var dist = 1;
    var king = this.pieces.getKing(this.team);
    while(tilex >= 0 && tiley < 8 && dist <= range){
      p = this.loopInner(tilex, tiley, squares, king, check);
      if(p) break;
      tilex--;
      tiley++;
      dist++;
    }
    return p;
  };

  Piece.prototype.checkDiagUpRight = function(range, squares, check){
    var p = null;
    var tilex = this.position.x + 1;
    var tiley = this.position.y + 1;
    var dist = 1;
    var king = this.pieces.getKing(this.team);
    while(tilex < 8 && tiley < 8 && dist <= range){
      p = this.loopInner(tilex, tiley, squares, king, check);
      if(p) break;
      tilex++;
      tiley++;
      dist++;
    }
    return p;
  };
  Piece.prototype.checkDiagDownRight = function(range, squares, check){
    var p = null;
    var tilex = this.position.x + 1;
    var tiley = this.position.y - 1;
    var dist = 1;
    var king = this.pieces.getKing(this.team);
    while(tilex < 8 && tiley >= 0 && dist <= range){
      p = this.loopInner(tilex, tiley, squares, king, check);
      if(p) break;
      tilex++;
      tiley--;
      dist++;
    }
    return p;
  };
  Piece.prototype.checkDiagDownLeft = function(range, squares, check){
    var p = null;
    var tilex = this.position.x - 1;
    var tiley = this.position.y - 1;
    var dist = 1;
    var king = this.pieces.getKing(this.team);
    while(this.inBounds(tilex, tiley) && dist <= range){
      p = this.loopInner(tilex, tiley, squares, king, check);
      if(p) break;
      tilex--;
      tiley--;
      dist++;
    }
    return p;
  };
  Piece.prototype.translate = function(val, flip){
    return (flip) ? val : (val - 7) * -1;
  };
  Piece.prototype.inBounds = function(x, y){
    var xValid = (x >= 0 && x < 8);
    var yValid = (y >= 0 && y < 8);
    return xValid && yValid;
  };
  //Check if a piece can move to a square.
  //Will need to add a provision for testing if we will be in check
  Piece.prototype.canMoveTo = function(x, y){
    //Array.some return true if inside the loop you return true 
    //It then termitates
    //Or else it returns false if we never return true
    return this.validSquares.some(function(s){
      if(s[0] === x && s[1] === y){
        return true;
      }
    });
  };
  //Moves a piece to a space pice will check if it can move there
  //Returns if it moved successfully
  Piece.prototype.moveTo = function(x, y){
    if(this.canMoveTo(x,y)){
      this.position.x = x;
      this.position.y = y;
      return true;
    }else{
      return false;
    }
  };
  //The inner part of checking for shit is the same for all the check functions so I factored it out 
  Piece.prototype.loopInner = function(x, y, squares, king, check){
    var p = this.pieces.at(x, y);
    var underAttack = false;
    var squareToAdd;
    if(!p || (p.getTeam() != this.team)){
      //The check is a flag called when the king calls this function
      //We dont want him to recursively call underAttack.
      //Would be bad. Cause it did that. And it was.
      
      if(!check){
        underAttack = king.underAttack([this.position.x, this.position.y], [x, y]);
      }
      if(!underAttack){
        squareToAdd = [x, y];
      }
    }
    
    if(squareToAdd){
      squares.push(squareToAdd);
    }
    return p;
  };
  Piece.prototype.taken = function(piece){
    this._alive = false;
    this.takenBy = piece;
  };
  
  Piece.prototype.draw = function(canvas, flip){
    //If we are a taken piece dont draw us
    //Will probably will set to have it draw to the side of the screen
    if(!this._alive) return;
    var that = this;
    //Canvas x,y starts at the top left but chess x,y starts at the bottom left
    //So if the board isnt flipped we need to flip the y position of the piece to print in properly
    var y = (flip) ? this.position.y : (this.position.y - 7) * -1;
    var squareSize = $h.constants("squareSize");
    //If the piece is currently selected highlight it and its moves
    //Else just draw it normal
    if(this.isActive()){
      canvas.drawSquare(this.position.x * squareSize, y * squareSize, squareSize - 10, "red");
      this.validSquares.forEach(function(s){
        canvas.drawSquare(s[0] * squareSize, that.translate(s[1], flip) * squareSize, squareSize, "rgba(46, 96, 197, 0.7)");
      });
    }else{
      if(this.image){
        canvas.drawImage(this.image, this.position.x * squareSize, y * squareSize);
      }else{
        canvas.drawSquare(this.position.x * squareSize, y * squareSize, squareSize - 10, this.color);
      }
      
    }
  };


  module.exports = Piece;
}());

},{"../lib/headOn.js":1}],10:[function(require,module,exports){
(function(){
  "use strict";

  var $h = require("../lib/headOn.js");
  var Queen = require("./queen.js");
  var King = require("./king.js");
  var Bishop = require("./bishop.js");
  var Knight = require("./knight.js");
  var Rook = require("./rook.js");
  var Pawn = require("./pawn.js");
  module.exports = {
    //Initializes all the pices to their propper place on the board
    _pieces: [],
    teamColor:{white:"white", black:"black"},
    getTeamColor: function(team){
      switch(team){
        case TEAMS.white:
          return this.teamColor.white;
        case TEAMS.black:
          return this.teamColor.black;
      }
    },
    piecesTaken: [],
    board: [],
    boardBackup: [],

    _kings:{},
    init: function(){
      //represent the board as a 2d array
      this.board = [];
      //Pieces that have been taken and are no longer in play
      this.piecesTaken = [];
      //set up the board propper we can put stuff in it.
      for(var i = 0; i<8; i++){
        for(var j = 0; j<8; j++){
          this.board[i] = [false, false, false, false, false, false, false, false];
        }
      }
      //2 Queens
      this._initQueens();
      //2 kings
      this._initKings();
      //4 bishops
      this._initBishops();
      //4 knights
      this._initKnights();
      //4 rooks
      this._initRooks();
      //16 pawns
      //this._initPawns();

    },
    //Switches the pieces to run checks on an intermediate board instead of the real once
    useIntermediateBoard: function(startPos, endPos){
      var piece;
      
      this.boardBackup = this.board.map(function(arr){
        return arr.slice(0);
      });
      //Assert a piece is here
      piece = this.at(startPos[0], startPos[1]);
      assert(piece, "No piece to move for the intermediate board representation");
      this.board[startPos[1]][startPos[0]] = false;
      this.board[endPos[1]][endPos[0]] = piece;
      this.intermediatePiecePos = piece.position.copy();
      this.intermediatePiece = piece;
      piece.x = endPos[0];
      piece.y = endPos[1];
    },
    
    //Switches to use the actual board
    useActualBoard: function(){
      this.board = this.boardBackup.map(function(arr){
        return arr.slice(0);
      });
      this.intermediatePiece.position = this.intermediatePiecePos.copy();
    },
    print: function(){
      console.table(this.board);
    },
    //Gets the king for a specific team
    getKing: function(team){
      switch(team){
        case TEAMS.white:
          return this._kings.white;
        case TEAMS.black:
          return this._kings.black;
        default:
          assert(false, "team does not exist");
      }
    },
    //Moves a passed in piece to the square passed to it
    //Updates its board representation
    move: function(piece, x, y){
      var oldx = piece.position.x;
      var oldy = piece.position.y;
      var pieceAtMovementSpace;
      if(piece.moveTo(x,y)){
        //Check if we are taking another piece
        pieceAtMovementSpace = this.at(x, y);
        if(pieceAtMovementSpace){
          pieceAtMovementSpace.taken(piece);
          this.piecesTaken.push(pieceAtMovementSpace);
        }
        this.board[y][x] = piece;
        this.board[oldy][oldx] = false;
        return true;
      }else{
        return false;
      }
    },
    //returns the piece if there is a piece there otherwise null
    at: function(x, y){
      //if it is outside the range [0,7] in either x or y
      //return null as in nothing is there.
      if(x > 7 || x < 0 || y > 7 || y < 0){
        return false;
      }
      return this.board[y][x] || false;
    },
    copyBoard: function(){
      return this.board.slice(0);
    },
    //Draw the pieces to the board
    //gets the current canvas to draw to and whether or not the board is flipped
    draw: function(canvas, flip){
      this._pieces.forEach(function(p){
        p.draw(canvas, flip);
      });
    },
    flipPos: function(pos){
      return (pos - 7) * -1;
    },
    _initQueens: function(){
      console.log(TEAMS);
      var whiteQueen = new Queen(TEAMS.white, 3, 0, this);
      var blackQueen = new Queen(TEAMS.black, 3, 7, this);
      this._pieces.push(whiteQueen, blackQueen);
      this.board[0][3] = whiteQueen;
      this.board[7][3] = blackQueen;
    },
    _initKings: function(){
      var whiteKing = new King(TEAMS.white, 4, 0, this);
      var blackKing = new King(TEAMS.black, 4, 7, this);
      //Store the kings so pieces can use them later to see if king is in check.
      this._kings.white = whiteKing;
      this._kings.black = blackKing;
      this._pieces.push(whiteKing, blackKing);
      this.board[0][4] = whiteKing;
      this.board[7][4] = blackKing;
    },
    _initBishops: function(){
      var b;
      var x1 = 2;
      var x2 = 5;
      var y = 0;
      var color;
      for(var i=0; i<2; i++){
        color = (i === 0) ? TEAMS.white : TEAMS.black;
        b = new Bishop(color, x1, y, this);
        this._pieces.push(b);
        this.board[y][x1] = b;
        b = new Bishop(color, x2, y, this);
        this._pieces.push(b);
        this.board[y][x2] = b;
        y = 7;
      }
    },
    _initKnights: function(){
      var b;
      var x1 = 1;
      var x2 = 6;
      var y = 0;
      var color;
      for(var i=0; i<2; i++){
        color = (i === 0) ? TEAMS.white : TEAMS.black;
        b = new Knight(color, x1, y, this);
        this._pieces.push(b);
        this.board[y][x1] = b;
        b = new Knight(color, x2, y, this);
        this._pieces.push(b);
        this.board[y][x2] = b;
        y = 7;
      }
    },
    _initRooks: function(){
      var b;
      var x1 = 0;
      var x2 = 7;
      var y = 0;
      var color;
      for(var i=0; i<2; i++){
        color = (i === 0) ? TEAMS.white : TEAMS.black;
        b = new Rook(color, x1, y, this);
        this._pieces.push(b);
        this.board[y][x1] = b;
        b = new Rook(color, x2, y, this);
        this._pieces.push(b);
        this.board[y][x2] = b;
        y = 7;
      }
    },
    _initPawns: function(){
      var row = 1;
      var team = TEAMS.white;
      var p;
      for(var i=0; i<2; i++){
        for(var j=0; j<8; j++){
          p = new Pawn(team, j, row, this);
          this._pieces.push(p);
          this.board[row][j] = p;
        }
        row = 6;
        team = TEAMS.black;
      }
    }
  };
}());
},{"../lib/headOn.js":1,"./bishop.js":2,"./king.js":5,"./knight.js":6,"./pawn.js":8,"./queen.js":11,"./rook.js":12}],11:[function(require,module,exports){
var $h = require("../lib/headOn.js");
var Piece = require("./piece.js");

function Queen(team, x, y){
  Piece.apply(this, arguments);
  this.attacksOrtho = true;
  this.attacksDiag = true;
  // if(this.team === TEAMS.black){
  //   this.image = $h.images("black_queen");
  // }else{
  // }
}
$h.inherit(Piece, Queen);
//Returns an array of all possible x,y pairs the queen can move
Queen.prototype.calcMoves = function(){
  //Valid squares
  var squares = [];
  var king = this.pieces.getKing(this.team);
  //Go up

  this.checkUp(7, squares);
  this.checkLeft(7, squares);
  this.checkDown(7, squares);
  this.checkRight(7, squares);
  this.checkDiagUpLeft(7, squares);
  this.checkDiagUpRight(7, squares);
  this.checkDiagDownLeft(7, squares);
  this.checkDiagDownRight(7, squares);


  this.validSquares = squares;
};



module.exports = Queen;
},{"../lib/headOn.js":1,"./piece.js":9}],12:[function(require,module,exports){
var $h = require("../lib/headOn.js");
var Piece = require("./piece.js");

function Rook(team, x, y){
  Piece.apply(this, arguments);
  this.attacksOrtho = true;
}
$h.inherit(Piece, Rook);
//Returns an array of all possible x,y pairs the Rook can move
Rook.prototype.calcMoves = function(){
   var squares = [];
  //Go up

  this.checkUp(7, squares);
  this.checkLeft(7, squares);
  this.checkDown(7, squares);
  this.checkRight(7, squares);
  
  this.validSquares = squares;
};

module.exports = Rook;
},{"../lib/headOn.js":1,"./piece.js":9}]},{},[7])