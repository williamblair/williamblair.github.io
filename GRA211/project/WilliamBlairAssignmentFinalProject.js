(function (cjs, an) {

var p; // shortcut to reference prototypes
var lib={};var ss={};var img={};
lib.ssMetadata = [
		{name:"WilliamBlairAssignmentFinalProject_atlas_1", frames: [[902,0,1034,1328],[0,0,900,1600]]},
		{name:"WilliamBlairAssignmentFinalProject_atlas_2", frames: [[0,1713,1321,152],[0,1867,1321,152],[0,0,1034,1328],[1323,1713,676,288],[0,1330,626,288],[1036,920,457,791],[1533,0,436,1029],[1036,0,495,918],[1495,1031,500,330]]},
		{name:"WilliamBlairAssignmentFinalProject_atlas_3", frames: [[1146,689,466,99],[258,1455,466,99],[258,1556,466,99],[1209,1388,466,99],[1564,952,466,99],[1564,1053,466,99],[640,308,504,243],[1564,1154,466,99],[1032,0,504,243],[1564,1255,466,99],[640,553,504,243],[1610,790,410,99],[1146,245,476,220],[1614,689,410,99],[1538,0,476,220],[1624,222,410,99],[1146,467,476,220],[0,0,1030,152],[454,1040,700,152],[0,154,1030,152],[908,798,700,152],[0,308,638,194],[0,504,638,194],[1624,519,378,80],[1624,601,378,80],[0,700,452,240],[1209,1489,378,80],[454,798,452,240],[1209,1571,378,80],[0,942,452,240],[726,1628,348,80],[258,1657,348,80],[0,1184,406,216],[1589,1489,348,80],[1156,952,406,216],[1677,1356,348,80],[1156,1170,406,216],[408,1194,301,259],[1032,245,93,41],[1095,1331,14,12],[1095,1318,19,11],[1003,1194,134,122],[1003,1388,204,238],[454,700,160,52],[1610,891,286,53],[1624,323,215,180],[1841,323,186,194],[726,1418,159,159],[0,1402,256,256],[1003,1318,90,65],[711,1194,290,222]]}
];


(lib.AnMovieClip = function(){
	this.actionFrames = [];
	this.ignorePause = false;
	this.currentSoundStreamInMovieclip;
	this.soundStreamDuration = new Map();
	this.streamSoundSymbolsList = [];

	this.gotoAndPlayForStreamSoundSync = function(positionOrLabel){
		cjs.MovieClip.prototype.gotoAndPlay.call(this,positionOrLabel);
	}
	this.gotoAndPlay = function(positionOrLabel){
		this.clearAllSoundStreams();
		var pos = this.timeline.resolve(positionOrLabel);
		if (pos != null) { this.startStreamSoundsForTargetedFrame(pos); }
		cjs.MovieClip.prototype.gotoAndPlay.call(this,positionOrLabel);
	}
	this.play = function(){
		this.clearAllSoundStreams();
		this.startStreamSoundsForTargetedFrame(this.currentFrame);
		cjs.MovieClip.prototype.play.call(this);
	}
	this.gotoAndStop = function(positionOrLabel){
		cjs.MovieClip.prototype.gotoAndStop.call(this,positionOrLabel);
		this.clearAllSoundStreams();
	}
	this.stop = function(){
		cjs.MovieClip.prototype.stop.call(this);
		this.clearAllSoundStreams();
	}
	this.startStreamSoundsForTargetedFrame = function(targetFrame){
		for(var index=0; index<this.streamSoundSymbolsList.length; index++){
			if(index <= targetFrame && this.streamSoundSymbolsList[index] != undefined){
				for(var i=0; i<this.streamSoundSymbolsList[index].length; i++){
					var sound = this.streamSoundSymbolsList[index][i];
					if(sound.endFrame > targetFrame){
						var targetPosition = Math.abs((((targetFrame - sound.startFrame)/lib.properties.fps) * 1000));
						var instance = playSound(sound.id);
						var remainingLoop = 0;
						if(sound.offset){
							targetPosition = targetPosition + sound.offset;
						}
						else if(sound.loop > 1){
							var loop = targetPosition /instance.duration;
							remainingLoop = Math.floor(sound.loop - loop);
							if(targetPosition == 0){ remainingLoop -= 1; }
							targetPosition = targetPosition % instance.duration;
						}
						instance.loop = remainingLoop;
						instance.position = Math.round(targetPosition);
						this.InsertIntoSoundStreamData(instance, sound.startFrame, sound.endFrame, sound.loop , sound.offset);
					}
				}
			}
		}
	}
	this.InsertIntoSoundStreamData = function(soundInstance, startIndex, endIndex, loopValue, offsetValue){ 
 		this.soundStreamDuration.set({instance:soundInstance}, {start: startIndex, end:endIndex, loop:loopValue, offset:offsetValue});
	}
	this.clearAllSoundStreams = function(){
		this.soundStreamDuration.forEach(function(value,key){
			key.instance.stop();
		});
 		this.soundStreamDuration.clear();
		this.currentSoundStreamInMovieclip = undefined;
	}
	this.stopSoundStreams = function(currentFrame){
		if(this.soundStreamDuration.size > 0){
			var _this = this;
			this.soundStreamDuration.forEach(function(value,key,arr){
				if((value.end) == currentFrame){
					key.instance.stop();
					if(_this.currentSoundStreamInMovieclip == key) { _this.currentSoundStreamInMovieclip = undefined; }
					arr.delete(key);
				}
			});
		}
	}

	this.computeCurrentSoundStreamInstance = function(currentFrame){
		if(this.currentSoundStreamInMovieclip == undefined){
			var _this = this;
			if(this.soundStreamDuration.size > 0){
				var maxDuration = 0;
				this.soundStreamDuration.forEach(function(value,key){
					if(value.end > maxDuration){
						maxDuration = value.end;
						_this.currentSoundStreamInMovieclip = key;
					}
				});
			}
		}
	}
	this.getDesiredFrame = function(currentFrame, calculatedDesiredFrame){
		for(var frameIndex in this.actionFrames){
			if((frameIndex > currentFrame) && (frameIndex < calculatedDesiredFrame)){
				return frameIndex;
			}
		}
		return calculatedDesiredFrame;
	}

	this.syncStreamSounds = function(){
		this.stopSoundStreams(this.currentFrame);
		this.computeCurrentSoundStreamInstance(this.currentFrame);
		if(this.currentSoundStreamInMovieclip != undefined){
			var soundInstance = this.currentSoundStreamInMovieclip.instance;
			if(soundInstance.position != 0){
				var soundValue = this.soundStreamDuration.get(this.currentSoundStreamInMovieclip);
				var soundPosition = (soundValue.offset?(soundInstance.position - soundValue.offset): soundInstance.position);
				var calculatedDesiredFrame = (soundValue.start)+((soundPosition/1000) * lib.properties.fps);
				if(soundValue.loop > 1){
					calculatedDesiredFrame +=(((((soundValue.loop - soundInstance.loop -1)*soundInstance.duration)) / 1000) * lib.properties.fps);
				}
				calculatedDesiredFrame = Math.floor(calculatedDesiredFrame);
				var deltaFrame = calculatedDesiredFrame - this.currentFrame;
				if((deltaFrame >= 0) && this.ignorePause){
					cjs.MovieClip.prototype.play.call(this);
					this.ignorePause = false;
				}
				else if(deltaFrame >= 2){
					this.gotoAndPlayForStreamSoundSync(this.getDesiredFrame(this.currentFrame,calculatedDesiredFrame));
				}
				else if(deltaFrame <= -2){
					cjs.MovieClip.prototype.stop.call(this);
					this.ignorePause = true;
				}
			}
		}
	}
}).prototype = p = new cjs.MovieClip();
// symbols:



(lib.CachedBmp_65 = function() {
	this.initialize(ss["WilliamBlairAssignmentFinalProject_atlas_3"]);
	this.gotoAndStop(0);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_63 = function() {
	this.initialize(ss["WilliamBlairAssignmentFinalProject_atlas_3"]);
	this.gotoAndStop(1);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_61 = function() {
	this.initialize(ss["WilliamBlairAssignmentFinalProject_atlas_3"]);
	this.gotoAndStop(2);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_59 = function() {
	this.initialize(ss["WilliamBlairAssignmentFinalProject_atlas_3"]);
	this.gotoAndStop(3);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_57 = function() {
	this.initialize(ss["WilliamBlairAssignmentFinalProject_atlas_3"]);
	this.gotoAndStop(4);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_55 = function() {
	this.initialize(ss["WilliamBlairAssignmentFinalProject_atlas_3"]);
	this.gotoAndStop(5);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_62 = function() {
	this.initialize(ss["WilliamBlairAssignmentFinalProject_atlas_3"]);
	this.gotoAndStop(6);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_53 = function() {
	this.initialize(ss["WilliamBlairAssignmentFinalProject_atlas_3"]);
	this.gotoAndStop(7);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_60 = function() {
	this.initialize(ss["WilliamBlairAssignmentFinalProject_atlas_3"]);
	this.gotoAndStop(8);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_51 = function() {
	this.initialize(ss["WilliamBlairAssignmentFinalProject_atlas_3"]);
	this.gotoAndStop(9);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_64 = function() {
	this.initialize(ss["WilliamBlairAssignmentFinalProject_atlas_3"]);
	this.gotoAndStop(10);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_49 = function() {
	this.initialize(ss["WilliamBlairAssignmentFinalProject_atlas_3"]);
	this.gotoAndStop(11);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_48 = function() {
	this.initialize(ss["WilliamBlairAssignmentFinalProject_atlas_3"]);
	this.gotoAndStop(12);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_47 = function() {
	this.initialize(ss["WilliamBlairAssignmentFinalProject_atlas_3"]);
	this.gotoAndStop(13);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_46 = function() {
	this.initialize(ss["WilliamBlairAssignmentFinalProject_atlas_3"]);
	this.gotoAndStop(14);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_45 = function() {
	this.initialize(ss["WilliamBlairAssignmentFinalProject_atlas_3"]);
	this.gotoAndStop(15);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_44 = function() {
	this.initialize(ss["WilliamBlairAssignmentFinalProject_atlas_3"]);
	this.gotoAndStop(16);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_43 = function() {
	this.initialize(ss["WilliamBlairAssignmentFinalProject_atlas_2"]);
	this.gotoAndStop(0);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_42 = function() {
	this.initialize(ss["WilliamBlairAssignmentFinalProject_atlas_2"]);
	this.gotoAndStop(1);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_41 = function() {
	this.initialize(ss["WilliamBlairAssignmentFinalProject_atlas_3"]);
	this.gotoAndStop(17);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_40 = function() {
	this.initialize(ss["WilliamBlairAssignmentFinalProject_atlas_3"]);
	this.gotoAndStop(18);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_39 = function() {
	this.initialize(ss["WilliamBlairAssignmentFinalProject_atlas_3"]);
	this.gotoAndStop(19);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_38 = function() {
	this.initialize(ss["WilliamBlairAssignmentFinalProject_atlas_3"]);
	this.gotoAndStop(20);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_37 = function() {
	this.initialize(ss["WilliamBlairAssignmentFinalProject_atlas_1"]);
	this.gotoAndStop(0);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_36 = function() {
	this.initialize(ss["WilliamBlairAssignmentFinalProject_atlas_2"]);
	this.gotoAndStop(2);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_35 = function() {
	this.initialize(ss["WilliamBlairAssignmentFinalProject_atlas_3"]);
	this.gotoAndStop(21);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_34 = function() {
	this.initialize(ss["WilliamBlairAssignmentFinalProject_atlas_3"]);
	this.gotoAndStop(22);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_33 = function() {
	this.initialize(ss["WilliamBlairAssignmentFinalProject_atlas_2"]);
	this.gotoAndStop(3);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_32 = function() {
	this.initialize(ss["WilliamBlairAssignmentFinalProject_atlas_2"]);
	this.gotoAndStop(4);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_31 = function() {
	this.initialize(ss["WilliamBlairAssignmentFinalProject_atlas_3"]);
	this.gotoAndStop(23);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_29 = function() {
	this.initialize(ss["WilliamBlairAssignmentFinalProject_atlas_3"]);
	this.gotoAndStop(24);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_30 = function() {
	this.initialize(ss["WilliamBlairAssignmentFinalProject_atlas_3"]);
	this.gotoAndStop(25);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_27 = function() {
	this.initialize(ss["WilliamBlairAssignmentFinalProject_atlas_3"]);
	this.gotoAndStop(26);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_26 = function() {
	this.initialize(ss["WilliamBlairAssignmentFinalProject_atlas_3"]);
	this.gotoAndStop(27);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_25 = function() {
	this.initialize(ss["WilliamBlairAssignmentFinalProject_atlas_3"]);
	this.gotoAndStop(28);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_24 = function() {
	this.initialize(ss["WilliamBlairAssignmentFinalProject_atlas_3"]);
	this.gotoAndStop(29);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_23 = function() {
	this.initialize(ss["WilliamBlairAssignmentFinalProject_atlas_3"]);
	this.gotoAndStop(30);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_21 = function() {
	this.initialize(ss["WilliamBlairAssignmentFinalProject_atlas_3"]);
	this.gotoAndStop(31);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_20 = function() {
	this.initialize(ss["WilliamBlairAssignmentFinalProject_atlas_3"]);
	this.gotoAndStop(32);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_19 = function() {
	this.initialize(ss["WilliamBlairAssignmentFinalProject_atlas_3"]);
	this.gotoAndStop(33);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_22 = function() {
	this.initialize(ss["WilliamBlairAssignmentFinalProject_atlas_3"]);
	this.gotoAndStop(34);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_17 = function() {
	this.initialize(ss["WilliamBlairAssignmentFinalProject_atlas_3"]);
	this.gotoAndStop(35);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_16 = function() {
	this.initialize(ss["WilliamBlairAssignmentFinalProject_atlas_3"]);
	this.gotoAndStop(36);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_15 = function() {
	this.initialize(ss["WilliamBlairAssignmentFinalProject_atlas_2"]);
	this.gotoAndStop(5);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_14 = function() {
	this.initialize(ss["WilliamBlairAssignmentFinalProject_atlas_3"]);
	this.gotoAndStop(37);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_13 = function() {
	this.initialize(ss["WilliamBlairAssignmentFinalProject_atlas_2"]);
	this.gotoAndStop(6);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_12 = function() {
	this.initialize(ss["WilliamBlairAssignmentFinalProject_atlas_3"]);
	this.gotoAndStop(38);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_11 = function() {
	this.initialize(ss["WilliamBlairAssignmentFinalProject_atlas_3"]);
	this.gotoAndStop(39);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_10 = function() {
	this.initialize(ss["WilliamBlairAssignmentFinalProject_atlas_3"]);
	this.gotoAndStop(40);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_9 = function() {
	this.initialize(ss["WilliamBlairAssignmentFinalProject_atlas_3"]);
	this.gotoAndStop(41);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_8 = function() {
	this.initialize(ss["WilliamBlairAssignmentFinalProject_atlas_3"]);
	this.gotoAndStop(42);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_7 = function() {
	this.initialize(ss["WilliamBlairAssignmentFinalProject_atlas_3"]);
	this.gotoAndStop(43);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_6 = function() {
	this.initialize(ss["WilliamBlairAssignmentFinalProject_atlas_3"]);
	this.gotoAndStop(44);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_5 = function() {
	this.initialize(ss["WilliamBlairAssignmentFinalProject_atlas_3"]);
	this.gotoAndStop(45);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_4 = function() {
	this.initialize(ss["WilliamBlairAssignmentFinalProject_atlas_3"]);
	this.gotoAndStop(46);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_3 = function() {
	this.initialize(img.CachedBmp_3);
}).prototype = p = new cjs.Bitmap();
p.nominalBounds = new cjs.Rectangle(0,0,12819,1491);


(lib.CachedBmp_2 = function() {
	this.initialize(ss["WilliamBlairAssignmentFinalProject_atlas_2"]);
	this.gotoAndStop(7);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_1 = function() {
	this.initialize(ss["WilliamBlairAssignmentFinalProject_atlas_3"]);
	this.gotoAndStop(47);
}).prototype = p = new cjs.Sprite();



(lib.blacktexture = function() {
	this.initialize(ss["WilliamBlairAssignmentFinalProject_atlas_3"]);
	this.gotoAndStop(48);
}).prototype = p = new cjs.Sprite();



(lib.darkwatertexture4_modified = function() {
	this.initialize(ss["WilliamBlairAssignmentFinalProject_atlas_1"]);
	this.gotoAndStop(1);
}).prototype = p = new cjs.Sprite();



(lib.hair_purple_tex = function() {
	this.initialize(ss["WilliamBlairAssignmentFinalProject_atlas_3"]);
	this.gotoAndStop(49);
}).prototype = p = new cjs.Sprite();



(lib.IndustrialBrickCommonArchitextures_redhue = function() {
	this.initialize(ss["WilliamBlairAssignmentFinalProject_atlas_3"]);
	this.gotoAndStop(50);
}).prototype = p = new cjs.Sprite();



(lib.marble_liquid_texture = function() {
	this.initialize(img.marble_liquid_texture);
}).prototype = p = new cjs.Bitmap();
p.nominalBounds = new cjs.Rectangle(0,0,4500,4765);


(lib.metaltexturegrungerustspottedagedoldrusteddirtyoxygenated5 = function() {
	this.initialize(img.metaltexturegrungerustspottedagedoldrusteddirtyoxygenated5);
}).prototype = p = new cjs.Bitmap();
p.nominalBounds = new cjs.Rectangle(0,0,192,3192);


(lib.roofshingles = function() {
	this.initialize(ss["WilliamBlairAssignmentFinalProject_atlas_2"]);
	this.gotoAndStop(8);
}).prototype = p = new cjs.Sprite();
// helper functions:

function mc_symbol_clone() {
	var clone = this._cloneProps(new this.constructor(this.mode, this.startPosition, this.loop, this.reversed));
	clone.gotoAndStop(this.currentFrame);
	clone.paused = this.paused;
	clone.framerate = this.framerate;
	return clone;
}

function getMCSymbolPrototype(symbol, nominalBounds, frameBounds) {
	var prototype = cjs.extend(symbol, cjs.MovieClip);
	prototype.clone = mc_symbol_clone;
	prototype.nominalBounds = nominalBounds;
	prototype.frameBounds = frameBounds;
	return prototype;
	}


(lib.walklowbutton = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.instance = new lib.CachedBmp_59();
	this.instance.setTransform(-118,-28.7,0.5,0.5);

	this.instance_1 = new lib.CachedBmp_64();
	this.instance_1.setTransform(-126.55,-58.7,0.5,0.5);

	this.instance_2 = new lib.CachedBmp_61();
	this.instance_2.setTransform(-118,-28.7,0.5,0.5);

	this.instance_3 = new lib.CachedBmp_60();
	this.instance_3.setTransform(-126.55,-58.7,0.5,0.5);

	this.instance_4 = new lib.CachedBmp_63();
	this.instance_4.setTransform(-118,-28.7,0.5,0.5);

	this.instance_5 = new lib.CachedBmp_62();
	this.instance_5.setTransform(-126.55,-58.7,0.5,0.5);

	this.instance_6 = new lib.CachedBmp_65();
	this.instance_6.setTransform(-118,-28.7,0.5,0.5);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.instance_1},{t:this.instance}]}).to({state:[{t:this.instance_3},{t:this.instance_2}]},1).to({state:[{t:this.instance_5},{t:this.instance_4}]},1).to({state:[{t:this.instance_1},{t:this.instance_6}]},1).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-126.5,-58.7,252,121.5);


(lib.walkhighbutton = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.instance = new lib.CachedBmp_51();
	this.instance.setTransform(-118,-28.7,0.5,0.5);

	this.instance_1 = new lib.CachedBmp_64();
	this.instance_1.setTransform(-126.55,-58.7,0.5,0.5);

	this.instance_2 = new lib.CachedBmp_53();
	this.instance_2.setTransform(-118,-28.7,0.5,0.5);

	this.instance_3 = new lib.CachedBmp_60();
	this.instance_3.setTransform(-126.55,-58.7,0.5,0.5);

	this.instance_4 = new lib.CachedBmp_55();
	this.instance_4.setTransform(-118,-28.7,0.5,0.5);

	this.instance_5 = new lib.CachedBmp_62();
	this.instance_5.setTransform(-126.55,-58.7,0.5,0.5);

	this.instance_6 = new lib.CachedBmp_57();
	this.instance_6.setTransform(-118,-28.7,0.5,0.5);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.instance_1},{t:this.instance}]}).to({state:[{t:this.instance_3},{t:this.instance_2}]},1).to({state:[{t:this.instance_5},{t:this.instance_4}]},1).to({state:[{t:this.instance_1},{t:this.instance_6}]},1).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-126.5,-58.7,252,121.5);


(lib.walkbutton1 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.instance = new lib.CachedBmp_45();
	this.instance.setTransform(-105,-28.7,0.5,0.5);

	this.instance_1 = new lib.CachedBmp_44();
	this.instance_1.setTransform(-119.5,-55.45,0.5,0.5);

	this.instance_2 = new lib.CachedBmp_47();
	this.instance_2.setTransform(-105,-28.7,0.5,0.5);

	this.instance_3 = new lib.CachedBmp_46();
	this.instance_3.setTransform(-119.5,-55.45,0.5,0.5);

	this.instance_4 = new lib.CachedBmp_49();
	this.instance_4.setTransform(-105,-28.7,0.5,0.5);

	this.instance_5 = new lib.CachedBmp_48();
	this.instance_5.setTransform(-119.5,-55.45,0.5,0.5);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.instance_1},{t:this.instance}]}).to({state:[{t:this.instance_3},{t:this.instance_2}]},1).to({state:[{t:this.instance_5},{t:this.instance_4}]},1).wait(2));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-119.5,-55.4,238,110);


(lib.Tween24 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.instance = new lib.CachedBmp_43();
	this.instance.setTransform(-330.2,-37.85,0.5,0.5);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-330.2,-37.8,660.5,76);


(lib.Tween23 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.instance = new lib.CachedBmp_42();
	this.instance.setTransform(-330.2,-37.85,0.5,0.5);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-330.2,-37.8,660.5,76);


(lib.Tween20 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.instance = new lib.CachedBmp_41();
	this.instance.setTransform(-214.95,1.75,0.5,0.5);

	this.instance_1 = new lib.CachedBmp_40();
	this.instance_1.setTransform(-299.8,-77.6,0.5,0.5);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.instance_1},{t:this.instance}]}).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-299.8,-77.6,599.9000000000001,155.39999999999998);


(lib.Tween19 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.instance = new lib.CachedBmp_39();
	this.instance.setTransform(-214.95,1.75,0.5,0.5);

	this.instance_1 = new lib.CachedBmp_38();
	this.instance_1.setTransform(-299.8,-77.6,0.5,0.5);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.instance_1},{t:this.instance}]}).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-299.8,-77.6,599.9000000000001,155.39999999999998);


(lib.Tween18 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.shape = new cjs.Shape();
	this.shape.graphics.f().s("#373535").p("AfPAdQi/j9j0jLQmElEnWiYQkvhjjsgcQmwg1l3B+QqtDnmQMIQiAD4hTEVQgtCWgTBoQKrFVDtjCQAoghAWgtQASgmAPhGQAijKAtisQBVlHA8iUQBjj4COiCQDOi7FogNQDLgHFRA9QGoBLF7DxQEBCiDcDjg");
	this.shape.setTransform(0.068,0.0017);

	this.shape_1 = new cjs.Shape();
	this.shape_1.graphics.f("#000000").s().p("A/PM9QAShoAtiWQBUkVCAj4QGPsIKujnQF3h+GvA1QDtAcEvBjQHVCYGFFEQD0DLC/D9IiFBdQjdjjkAiiQl7jxmohLQlRg9jLAHQloANjOC7QiOCChjD4Qg8CUhVFHQguCsghDKQgPBGgTAmQgVAtgoAhQhWBHiRAAQj+gBmzjZg");
	this.shape_1.setTransform(-0.0086,0.0017);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.shape_1},{t:this.shape}]}).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-201,-105.6,402,211.3);


(lib.Tween17 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.shape = new cjs.Shape();
	this.shape.graphics.f().s("#373535").p("AfPAdQi/j9j0jLQmElEnWiYQkvhjjsgcQmwg1l3B+QqtDnmQMIQiAD4hTEVQgtCWgTBoQKrFVDtjCQAoghAWgtQASgmAPhGQAijKAtisQBVlHA8iUQBjj4COiCQDOi7FogNQDLgHFRA9QGoBLF7DxQEBCiDcDjg");
	this.shape.setTransform(0.068,0.0017);

	this.shape_1 = new cjs.Shape();
	this.shape_1.graphics.f("#000000").s().p("A/PM9QAShoAtiWQBUkVCAj4QGPsIKujnQF3h+GvA1QDtAcEvBjQHVCYGFFEQD0DLC/D9IiFBdQjdjjkAiiQl7jxmohLQlRg9jLAHQloANjOC7QiOCChjD4Qg8CUhVFHQguCsghDKQgPBGgTAmQgVAtgoAhQhWBHiRAAQj+gBmzjZg");
	this.shape_1.setTransform(-0.0086,0.0017);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.shape_1},{t:this.shape}]}).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-201,-105.6,402,211.3);


(lib.Tween16 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.shape = new cjs.Shape();
	this.shape.graphics.f().s("#373535").p("AAQuYQgFAGgzAjQg3AjgKAKIhCA6QhRBDhOApQg7AfhCgGQgsgEhGgbQhSgfgbgGQg7gNguAUQg5AahECXQgPAghwEhQBDBOAzgMQAUgEAPgUQAIgKAWgmQAHgLA+h5QAvhaAYgYQA7g3BcAMQAhAEAcAMQAZALADAIQADAJhGAnQhlA4g6AsQhKA4hBCAQgrBUhWDcQAQAdBIA2QBJA3AWgCQAUgCAMhUQAOhpACgFQAWg5AmgnQBEg9BDhDQBZhYC6hEQBAgXA6gOQAygMAEAEQACADgaARQgzAkgXARQiGBlh8CMQiHCXg+BfQhMB1ASAzQAHASAoCBQApB3ATgDQATgDBgh6QBdh0AFgQQAGgQBah4QB/imBKhjQCSjCEdBEQA3ANgOAnQgGAShGBlQgfAtiwB0QioBvgbAzQhuDMgfBEQhnDdAqAcQBLAzE8iCQB6gyBug7QBrg5AiggQBrhmCmlKQCbkxAKhWIB9n/g");
	this.shape.setTransform(0.0451,0.01,0.9999,0.9999);

	this.shape_1 = new cjs.Shape();
	this.shape_1.graphics.f("#000000").s().p("AkiOLQgrgdBnjcQAfhFBujMQAbgyCohwQCwhzAfguQBGhkAHgTQANgmg3gNQkdhFiSDDIjIEJQhbB4gGAPQgEAQheB1QhgB5gTADQgSADgph3QgoiAgIgTQgSgzBMh0QA/hgCHiXQB7iLCGhlQAXgSA0gjQAZgSgCgDQgDgEgzAMQg5AOhBAYQi6BDhZBZQhDBDhEA9QgmAngWA5QgCAFgOBoQgLBUgVACQgWADhJg3QhHg2gRgeQBWjbArhUQBBiBBLg4QA5grBlg4QBGgogDgJQgDgIgZgLQgcgMgggEQhdgMg7A4QgXAXgwBbQg9B4gHAMQgXAmgIAJQgPAUgUAFQgzAMhDhOQBxkhAOghQBEiXA5gZQAvgUA7AMQAaAGBSAfQBGAbAtAFQBCAGA6gfQBOgqBRhCIBDg6QAJgKA3gkQA0giAEgGIP8DYIh8H/QgLBWibEwQimFKhrBmQghAghsA6QhuA6h6AzQjiBdhnAAQgoAAgVgOg");
	this.shape_1.setTransform(0.0286,0.0358,0.9999,0.9999);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.shape_1},{t:this.shape}]}).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-104.5,-93.1,209.1,187);


(lib.Tween15 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.shape = new cjs.Shape();
	this.shape.graphics.f().s("#373535").p("AAQuYQgFAGgzAjQg3AjgKAKIhCA6QhRBDhOApQg7AfhCgGQgsgEhGgbQhSgfgbgGQg7gNguAUQg5AahECXQgPAghwEhQBDBOAzgMQAUgEAPgUQAIgKAWgmQAHgLA+h5QAvhaAYgYQA7g3BcAMQAhAEAcAMQAZALADAIQADAJhGAnQhlA4g6AsQhKA4hBCAQgrBUhWDcQAQAdBIA2QBJA3AWgCQAUgCAMhUQAOhpACgFQAWg5AmgnQBEg9BDhDQBZhYC6hEQBAgXA6gOQAygMAEAEQACADgaARQgzAkgXARQiGBlh8CMQiHCXg+BfQhMB1ASAzQAHASAoCBQApB3ATgDQATgDBgh6QBdh0AFgQQAGgQBah4QB/imBKhjQCSjCEdBEQA3ANgOAnQgGAShGBlQgfAtiwB0QioBvgbAzQhuDMgfBEQhnDdAqAcQBLAzE8iCQB6gyBug7QBrg5AiggQBrhmCmlKQCbkxAKhWIB9n/g");
	this.shape.setTransform(0.0451,0.01,0.9999,0.9999);

	this.shape_1 = new cjs.Shape();
	this.shape_1.graphics.f("#000000").s().p("AkiOLQgrgdBnjcQAfhFBujMQAbgyCohwQCwhzAfguQBGhkAHgTQANgmg3gNQkdhFiSDDIjIEJQhbB4gGAPQgEAQheB1QhgB5gTADQgSADgph3QgoiAgIgTQgSgzBMh0QA/hgCHiXQB7iLCGhlQAXgSA0gjQAZgSgCgDQgDgEgzAMQg5AOhBAYQi6BDhZBZQhDBDhEA9QgmAngWA5QgCAFgOBoQgLBUgVACQgWADhJg3QhHg2gRgeQBWjbArhUQBBiBBLg4QA5grBlg4QBGgogDgJQgDgIgZgLQgcgMgggEQhdgMg7A4QgXAXgwBbQg9B4gHAMQgXAmgIAJQgPAUgUAFQgzAMhDhOQBxkhAOghQBEiXA5gZQAvgUA7AMQAaAGBSAfQBGAbAtAFQBCAGA6gfQBOgqBRhCIBDg6QAJgKA3gkQA0giAEgGIP8DYIh8H/QgLBWibEwQimFKhrBmQghAghsA6QhuA6h6AzQjiBdhnAAQgoAAgVgOg");
	this.shape_1.setTransform(0.0286,0.0358,0.9999,0.9999);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.shape_1},{t:this.shape}]}).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-104.5,-93.1,209.1,187);


(lib.Tween12 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.instance = new lib.CachedBmp_37();
	this.instance.setTransform(-258.4,-331.85,0.5,0.5);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-258.4,-331.8,517,664);


(lib.Tween11 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.instance = new lib.CachedBmp_36();
	this.instance.setTransform(-258.4,-331.85,0.5,0.5);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-258.4,-331.8,517,664);


(lib.Tween10 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.shape = new cjs.Shape();
	this.shape.graphics.f().s("#000000").ss(1,1,1).p("AVnAAQAAI9mVGVQmVGVo9AAQo8AAmVmVQmVmVAAo9QAAo7GVmVQGVmWI8AAQI9AAGVGWQGVGVAAI7g");
	this.shape.setTransform(0.0114,-0.006,1.311,1.311);

	this.shape_1 = new cjs.Shape();
	this.shape_1.graphics.bf(img.marble_liquid_texture, null, new cjs.Matrix2D(1,0,0,1,-2250,-2382.5)).s().p("AvQPSQmVmWAAo8QAAo8GVmUQGUmVI8AAQI8AAGWGVQGVGUAAI8QAAI8mVGWQmWGVo8AAQo8AAmUmVg");
	this.shape_1.setTransform(0.0114,-0.006,1.311,1.311);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.shape_1},{t:this.shape}]}).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-182.2,-182.2,364.5,364.5);


(lib.Tween9 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.shape = new cjs.Shape();
	this.shape.graphics.f().s("#000000").ss(1,1,1).p("AVnAAQAAI9mVGVQmVGVo9AAQo8AAmVmVQmVmVAAo9QAAo7GVmVQGVmWI8AAQI9AAGVGWQGVGVAAI7g");
	this.shape.setTransform(0.0114,-0.006,1.311,1.311);

	this.shape_1 = new cjs.Shape();
	this.shape_1.graphics.bf(img.marble_liquid_texture, null, new cjs.Matrix2D(1,0,0,1,-2250,-2382.5)).s().p("AvQPSQmVmWAAo8QAAo8GVmUQGUmVI8AAQI8AAGWGVQGVGUAAI8QAAI8mVGWQmWGVo8AAQo8AAmUmVg");
	this.shape_1.setTransform(0.0114,-0.006,1.311,1.311);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.shape_1},{t:this.shape}]}).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-182.2,-182.2,364.5,364.5);


(lib.Tween6 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.instance = new lib.CachedBmp_35();
	this.instance.setTransform(-159.6,-48.4,0.5,0.5);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-159.6,-48.4,319,97);


(lib.Tween5 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.instance = new lib.CachedBmp_34();
	this.instance.setTransform(-159.6,-48.4,0.5,0.5);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-159.6,-48.4,319,97);


(lib.Tween4 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.shape = new cjs.Shape();
	this.shape.graphics.f("#999999").s().p("A4sN2IAA7sMAxZAAAIAAbsg");
	this.shape.setTransform(0.025,0);

	this.timeline.addTween(cjs.Tween.get(this.shape).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-158,-88.6,316.1,177.3);


(lib.Tween3 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.shape = new cjs.Shape();
	this.shape.graphics.f("#999999").s().p("A4sN2IAA7sMAxZAAAIAAbsg");
	this.shape.setTransform(0.025,0);

	this.timeline.addTween(cjs.Tween.get(this.shape).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-158,-88.6,316.1,177.3);


(lib.Tween2 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.instance = new lib.CachedBmp_33();
	this.instance.setTransform(-168.9,-72.1,0.5,0.5);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-168.9,-72.1,338,144);


(lib.Tween1 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.instance = new lib.CachedBmp_32();
	this.instance.setTransform(-156.4,-72.1,0.5,0.5);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-156.4,-72.1,313,144);


(lib.tryagainbutton = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.instance = new lib.CachedBmp_25();
	this.instance.setTransform(-92,-21.3,0.5,0.5);

	this.instance_1 = new lib.CachedBmp_24();
	this.instance_1.setTransform(-112.45,-59.45,0.5,0.5);

	this.instance_2 = new lib.CachedBmp_27();
	this.instance_2.setTransform(-92.5,-19.45,0.5,0.5);

	this.instance_3 = new lib.CachedBmp_26();
	this.instance_3.setTransform(-112.45,-59.45,0.5,0.5);

	this.instance_4 = new lib.CachedBmp_29();
	this.instance_4.setTransform(-92.5,-19.45,0.5,0.5);

	this.instance_5 = new lib.CachedBmp_30();
	this.instance_5.setTransform(-112.45,-59.45,0.5,0.5);

	this.instance_6 = new lib.CachedBmp_31();
	this.instance_6.setTransform(-92.5,-19.45,0.5,0.5);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.instance_1},{t:this.instance}]}).to({state:[{t:this.instance_3},{t:this.instance_2}]},1).to({state:[{t:this.instance_5},{t:this.instance_4}]},1).to({state:[{t:this.instance_5},{t:this.instance_6}]},1).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-112.4,-59.4,226,120);


(lib.Scene_1_sky_bg = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// sky_bg
	this.instance = new lib.CachedBmp_3();
	this.instance.setTransform(-262.45,-1345.8,0.5,0.5);

	this.shape = new cjs.Shape();
	this.shape.graphics.lf(["#6500FF","#000000"],[0,1],-0.3,736,-0.3,-560.4).s().p("ElD2B0oIgBAAMAAAjpQIACAAMKHtAAAMAAADpQMqHtAAAg");
	this.shape.setTransform(5424.175,-185.65);

	this.shape_1 = new cjs.Shape();
	this.shape_1.graphics.lf(["#6500FF","#000000"],[0,1],-0.3,736.2,-0.3,-560.6).s().p("ElD9B0qMAAAjpUMKH7AAAIAAABIgBAAMAAADpPIABABIAAAAIAAADMqH6AABg");
	this.shape_1.setTransform(1278.125,-185.475);

	this.shape_2 = new cjs.Shape();
	this.shape_2.graphics.lf(["#6500FF","#000000"],[0,1],-0.7,1472,-0.7,-1120.7).s().p("EqHuDpQMAAAnSgIADAAMUPaAAAMAAAHSgM0PaAABIgBAAg");
	this.shape_2.setTransform(10848.325,-371.3375);

	this.shape_3 = new cjs.Shape();
	this.shape_3.graphics.lf(["#6500FF","#000000"],[0,1],-0.7,1472.5,-0.7,-1121.1).s().p("EqH7DpVMAAAnSpMUP4AAAIAAABIgEAAMAAAHSgIACABIACgBIAAAIM0P3AAAg");
	this.shape_3.setTransform(2556.25,-371);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.shape_3},{t:this.shape_2},{t:this.shape_1},{t:this.shape},{t:this.instance}]}).wait(815));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();


(lib.Scene_1_horizon = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// horizon
	this.shape = new cjs.Shape();
	this.shape.graphics.f().s("#000000").ss(0.5,1,1).p("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");
	this.shape.setTransform(2002.3951,353.075);

	this.shape_1 = new cjs.Shape();
	var sprImg_shape_1 = cjs.SpriteSheetUtils.extractFrame(ss["WilliamBlairAssignmentFinalProject_atlas_3"],48);
	sprImg_shape_1.onload = function(){
		this.shape_1.graphics.bf(sprImg_shape_1, null, new cjs.Matrix2D(0.985,0,0,0.985,-114.4,-126.3)).s().p("EAZtAl3MhLcAAmMgvCgBMMg5/AAUMghbgA6IDQ5JIDj5uIDfmNIFGm0IJLjQIBXgSIAMAgQAKAcAKAUQAQAgAVgCQANgBAGgOQAHgNgDgPQgDgKgIgPIgNgZQgEgIgEgOIgBgHIADgBQArgGAmgCQABAQAFALQAEAIAHAEQAIAFAIgBQAWgDADgpQBCACAsATQDiBgC+A3QCFAmEvByIEvAmIDji+IC0gcIAdgLIAAADQAEAYAHAMQAGAHAJAEQAJAEAIgCQAJgCAGgJQAGgHABgKQACgMgGgZIgCgHQA0gLAnANIgIAUQgJAaANAOQAHAHAPAFQAXAHAMgLQAGgFAEgMIAEgNIAaASIA2AmIgDAMQgCAIAAAGQACAOAUAJQAOAGALgEQAJgDAFgJIAbAUQDBCDBZAAQBTAAC5AUQC4ASApAAQAaAAAZAkQAeAtAQAJQBIArDRjQIE4lFQA3g5BDg1QAFAAAFgCQALgFADgMIA1gnQCDhbCvg1QBwgiBcgIQAHAFAKAFQANAFAFAEQAFAEAIANQALALARAAQASgBAKgMQAKgNAAgaIBCgDQADAEAFAEQAKAGAKgCQgEAIAFAKQAEAJAJAFQAOAJAXgFQASgFAJgNQAHgLAAgbIAcgCIBKgCQABAOADAJQAFANANADQAHABAPgCQAGAAALAFQAMAGAFABQAPADAMgLQANgKADgPQABgFgBgHQAgAEAWAIQAjAMARALIAcAUQAsAaCzAsQDFAyCPARQBQAJBbAAQAYAAAQgLQAJgGARgQQAjgaBYAVQAxANAVAVQANANAVAkQAYAiAwAjQABAKAGAGQAJAKAQgDIABAAQAkAYAvAYQgGAVAIAOQAFAKAKAEQALAEAIgEQAIgDAGgKIAEgJIAhAPQC/BWCRBaQBkA+BeAcQA5ARArA5IAgAuQASAaANAMQAIAHAJAEQAhARAtgTQBGgdB+h4QBxhrBPiBQAhg3AshTQAJADAJgDQAIgDAFgGQAFgFABgFIAFgBQAMgBAIgMIAMgWQAPgXAGgMQAFgKABgIQAFgGADgHQADgKgDgKIgEgKQAWgUAWgOQAOgIAQgIIAJARQAMAQAIAFQAGADAIAAQAEAJAIADQAJAEAKgFQAJgEAFgJQAHgNAAgZQAAgTgCgNQAggIAlgFQABAJADAEQADAIAHAFQAGAGAIgBQAKAAAHgGQAFgGADgHQAHgCAKgLIAHgFIABgBIALgBIAAAOQABAMAEAHQADAEADACIABABQAEADAGABQAMADAJgGIAFgDQAFADAHABQANACAIgHQAMgLAAgeIAAgEIBpgHIABACQAJAWAHAIQAOARARgDQALgCAHgLIAHAAIAOgCIAJABIAIAAQAKgCAHgKQAEgHACgIIAAAAQAFgFACgGQA0gCAgACQBrAFDCAzIgBAJQgCAVAFAMQADAIAHAFQAHAGAIAAQASAAAIgWQADgGABgLIABgHQBDAVA8AfIgDAIIgGAOIgFAOQgEASAJALQAGAHALABQAKAAAJgFQAOgJAIgWIACgIIArAbIArAdQBIAyAtAWQBGAiBSAMQEKApA2AFQCVALBkglQBLgdBog5QA7gbA+gDIABAEQADANALAHQAMAIALgEIAGgDIAFACQAOAFAeADIA9AGIASABIASAIIATAIQALADAJgDQAHgCAKgIIACABIAIAIQAOAPAOgBQAKgBAIgHQAHAKAMABQALABAJgJQAIgJADgMIABgGIBBABIAUgBIAAARQgBAXACAJQAGATAQADQAIACAIgFQAIgFAFgJQAGgMAAgWIABgbIAMgDQAFAFAHACQAGADAFgBQAIACAJgEQAGgDAEgEQAGAGAMADQAZAGARgLIABgBQAKAJANgDQAJgDAGgIQAEgIABgKIgBgKIAHgEQABAQAEAJQAEAIAIAGQAIAGAJgCQAYgDABguIAAgCQApADAvAMQCZAmC0BhQCSBNBZBIQAdAXAGAcQADAOAAAbQAHAtCQAhQBWAUBTgPQBDgNBdgsIBDggQACAIADAGQAFAJALACQALADAJgFQAUgLgCgiIgBgHIA8gfQB/g9B0gpQC6hBBvgkIABAHQADAHAHAFQAGAFAIABQARACAJgPQAHgJAAgWIA0gPQCBgjBsAAQBXAABrASIC+AiQAEANAMAGQANAGALgGQAHgDAFgIIDQAiQDbAiDNAvQBuAaCdARIABABQADAFAIAGIAMAKQAHAHAIAOIAOAWQAIAMALAGQANAGALgFQAJgEAEgLQAEgKgDgKQgCgOgRgVIgDgEIAgACIAJAHIAPAPQAIAGAJgBQAKAAAHgGQAHgHAEgJIBHABIAAAGQAAAUAHAIQAGAIALACQAKABAJgFQAQgIAJgWIAEgLQBMgEBGgLIAMALQALAIALAEQALADALgCQALgBAIgHQAGgGACgJIAHADQAJAFAIABQAUACAMgNIACgCIAGAEQASAMAKABQAPACAKgNQALgMgGgPQgCgEgDgEIALABQA6AMDnhqICIhAQAEAGAIADQAKAEATgGQASgHAHgHQAMgLACgVIBGgiIADAIIACAMIAEAMQAEALAMAEQANAEAKgHQAQgKAAgZIgBgMQAJgCAIgFQAFgDAHgJIAHgBQAIgDAIgJIAPgNQAFgDAOgEIAAAAQAPAAAJgFIAMgEIADADQAIAGAJgBQAKAAAHgGQAIgHADgLIADgRIBbglIBFgYIABADQAJASAGAGQAMANAOgCQALgBAHgLQAGgJgBgLQAAgLgGgNQA3gRAygLQBpgYFuh4QABANAEAGQAGAMAPACQAOACAJgKQAHgHACgLQABgHABgOIAAgFIBBgWIABABQAMAJANgEQAPgFAHgRIBcgfQAIAEAJgCQAKgBAGgIIAEgGIA8gUIF7A4IgCABIAdACQBQAFEQAMQBgADFiAIQCUADCeARIAFAEQAKAIAUgCQANgBAIgDIACAAQBgALCAAJIABALQAFAXAPAFQAIADAKgEQAJgEAFgIQAFgIAFgPQByAGCIAEQCoAFCAAAIFqEcQEoDpCDBuIgpgQQgSgHgLACQgNADgGAPQgGAOAHALQAIALAYAIQBFAaA8AtQgNAQAKAkIgHAGQgcACgJANQgIAJACAMQACANAKAGQAJAHAXAAIAgAAIAuAHIACACQAoAeAxAeQAWANAOgCQANgCAGgMQAHgMgEgLQAMACAZAHQAYAHANABIAWACQAOABAIACIAVAGQAMADAIgBQALgBAHgGIh6DZIjjZuIjRZJMAgrAA4QhkBWiRBZQiHBTieBMIiDA7gECkagWqIAEABIgEAIIAAgJg")
	}.bind(this);
	this.shape_1.setTransform(890.875,367.925);

	this.shape_2 = new cjs.Shape();
	var sprImg_shape_2 = cjs.SpriteSheetUtils.extractFrame(ss["WilliamBlairAssignmentFinalProject_atlas_3"],48);
	sprImg_shape_2.onload = function(){
		this.shape_2.graphics.bf(sprImg_shape_2, null, new cjs.Matrix2D(0.984,0,0,0.984,-126.2,-126.3)).s().p("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")
	}.bind(this);
	this.shape_2.setTransform(3102.2701,338.2);

	this.shape_3 = new cjs.Shape();
	this.shape_3.graphics.f("#000000").s().p("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QgXgBgIgFQgOgKACgUQABgPALgIQAIgFAMAAQAGAAAOADQAfAGAlADQAEgZAAgOIAAgUQACgMAFgIQAFgIALgCQALgCAJAFQAQAJABAdQABARgEAhIBSAAQAZAAAJAIQAOAIgCASQAAAHgGAHQgFAGgGADQgHADgOAAIgeAAIhGAAIgFATIgJAWQgFALgBAWQgFBGABAkQAAAcgDALIgCAGQgHASgPAEIgIACQgJAAgIgHgECEtgBcQgIgDgFgJQgHAAgGgEQgIgEgMgRIgJgQIgLgWQgEAVgPAJQgJAGgLgCQgMgCgFgJQgEgGAAgMIgBgVQgCgHgIgQQgHgOAAgJQgBgTAUgNQALgHAZgHQAcgIAWgDQAggFAMAQQAFAHABAQIABAMQAHAIACATIACACQAIALACAEQAEAHABANQACANAAATQAAAZgHAMQgFAJgJAFQgGADgFAAIgIgCgECTKgBrQgHgFgDgIQgGgNACgUIABgKQAFgmAThGIADgLIgYgHIgbgHQgOgGgHgJQgKgMACgOQABgJAFgHQAFgIAIgCQALgEAXAMQATAJAYAJQAHgZACgSIADgXQACgOADgJQAFgLAKgHQALgIALADQAJACAGAIQAGAIACAKQABALgGAaIgRBCIADABQAUAHAOAIQAYANAAARQAAAMgKAIQgLAHgMAAQgOAAgdgOIgJAiQgNAsgCAXIgBALIgBAHQAAAKgDAHQgIAVgSABQgIAAgHgGgEhCkgCCIgCgBQgQgKAAgdIABgDQgOgCgHgEQgRgKACgUQAAgIAGgIQAGgHAIgDIAIgCIgBgDQgFgPACgLQACgIAGgGQAFgGAIgCQARgGANANQAIAHAFASIAFAWQAXABAKAJQALAJgBAPQgBAPgNAHQgJAEgRABIgBAKQgBAMgEAJIgEAGQgGAHgKACIgFAAQgGAAgGgDgECIHgCZQgGgBgFgDIAAgBQgEgDgCgEQgEgHgBgLIAAgPIAAgFQgFABgGAFIgCACIgGAFQgKALgHACQgDAHgFAFQgIAHgJAAQgIABgHgGQgGgFgEgIQgCgEgBgJQgCgIAAgLQAAgvAHgeQAHggATgKQAKgGAYAAIAoABQAaAAAPAEQAXAHAJAQQAGAMgBAaIgBA+IAAADQAAAegMAMQgJAHgMgCQgIgBgFgEIgEAEQgGAEgIAAIgHgBgECL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");
	this.shape_3.setTransform(1992.1582,134.3674);

	this.shape_4 = new cjs.Shape();
	this.shape_4.graphics.f().s("#000000").ss(1,1,1).p("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");
	this.shape_4.setTransform(4004.7565,706.125);

	this.shape_5 = new cjs.Shape();
	var sprImg_shape_5 = cjs.SpriteSheetUtils.extractFrame(ss["WilliamBlairAssignmentFinalProject_atlas_3"],48);
	sprImg_shape_5.onload = function(){
		this.shape_5.graphics.bf(sprImg_shape_5, null, new cjs.Matrix2D(1.969,0,0,1.969,-252.3,-252.5)).s().p("EAvuBLuMiW3ABMMheDgCYMhz9AAnIhigCMhBVgBwMAGggySMAHHgzeID0myIAWgmIAJgQICrkyIKMtnISWmhICugjIAXBAQAVA5ATAmQAgBBAqgEQAagCANgcQANgbgGgcQgFgWgQgeQgWgmgFgLQgIgRgHgbIgDgOIAHgCQBWgMBLgFQADAiAJAUQAJAQAOAJQAPAJAQgCQAtgGAFhRQCFAEBXAmQHEDBF9BtQEJBLJeDkIJeBMIHHl7IFmg4IA6gXIABAHQAIAwAPAXQAMAPAQAJQATAIARgFQARgFAMgRQALgOACgUQAEgZgMgwIgDgPQBogWBOAaIgQAnQgRA0AaAeQAMAMAfAKQAuAOAZgUQAMgMAGgXIAIgaIA1AkIBtBMIgHAXQgFAQACAMQAEAeAnAQQAdANAVgIQARgGAKgRIA2AmQGCEICzAAQCmAAFxAmQFxAlBRAAQA1ABAxBIQA9BZAfASQCRBXGimiIJwqJQBuhyCGhrQAKABAJgEQAWgKAHgZQA0gnA2glQEGi4FdhpQDghEC4gRQAPALAUAJQAaAKAJAIQALAJAPAZQAWAXAjgBQAkAAAUgaQATgYABg1QA4gCBLgEQAHAIAKAHQAUAMATgEQgHASAJASQAIATASAKQAdATAtgLQAkgKASgaQAPgXAAg0IA4gFQBQgEBEAAQABAcAGARQALAbAZAHQAPABAdgFQANABAWAJQAYAMAKACQAdAGAZgVQAagUAFgeQACgKgBgNQA/AIArAOQBGAYAkAXQAUAMAjAbQBYA0FlBZQGLBkEeAhQChATC0ABQAwAAAhgXQASgNAigfQBHg1CvAsQBjAYApAqQAaAbArBIQAvBDBgBGQACAUALAMQATAVAhgGIABAAQBHAwBeAwQgMApARAeQAKASAUAIQAVAJASgIQAQgHAKgTQAEgFAFgMIBBAdQF+CsEjC0QDIB7C8A4QByAiBXBzIA/BcQAkAzAbAZQAPANARAJQBCAiBcgmQCKg6D9jwQDijWCdkBQBDhvBYimQARAFATgGQAPgFALgLQAJgLADgLIAKAAQAYgDAQgZIAXgsQAfgtAMgZQAJgTADgPQAKgMAFgQQAGgTgFgTQgCgKgGgMQArgoAtgbQAcgRAfgPIATAhQAXAhARAJQAMAHAPAAQAJASAQAHQASAHAUgLQARgIAKgSQAOgYAAgzQABgmgEgaQBAgQBKgKQACASAFAJQAHAPANAKQANALAQgBQATABAPgOQAJgLAGgOQAPgEAUgWIANgKIADgDIAWgCIAAAdQABAXAJAOQAFAIAHAFIABABQAJAHAMACQAXAGATgMIAJgHQAKAHAPADQAZADARgOQAYgXAAg8IAAgHIDRgNIACADQATArANASQAcAhAigGQAXgEAOgWQAGAAAHAAQAKgBASgEIASACQALABAGgBQAUgCANgWQAJgOADgPIABgBQAKgJAEgMQBogDA/ADQDWAJGEBmIgCASQgEAqALAZQAGAQANAKQAPAMAQAAQAjgBARgqQAFgOACgVIACgNQCHApB4A+IgGAQIgMAcQgHARgDALQgIAkASAVQAMAQAWAAQAUABARgLQAdgRAPgtIAFgPQAnAYAuAeIBWA6QCRBkBZArQCMBEClAZQITBSBsAJQEqAWDHhKQCYg4DPhyQB3g3B7gGIACAJQAGAZAWAPQAYAQAVgJQAGgDAGgEIAKAFQAdAJA8AHIB9AMQATACAQAAIAkAPQAaANAMADQAXAGARgEQANgEAUgSIAFACQAEACAMAOQAaAeAdgBQAUgCAPgOQAPAUAYACQAWACASgTQARgQAFgaIACgMQA/ACBDAAIAogBQABARgBARQgCAuAFASQALAmAfAGQARAEARgLQAPgKAJgRQANgYAAgsIABg2IAagHQAKALAMAEQAMAFALgBQAQAEARgIQAMgGAIgJQAOANAYAGQAxAMAhgXIACgBQAWASAZgHQARgFAMgQQAKgQABgUQABgJgCgKIAOgIQABAeAIASQAHASAQAKQARAMASgDQAwgGAChcIAAgFQBTAGBcAYQEyBNFqDBQEiCbCyCQQA7AvALA2QAGAdAAA2QAQBaEeBCQCtAoClgfQCHgaC6hXICGhAQADARAGALQALARAWAFQAWAGARgKQApgVgEhFIgCgPIB3g9QD/h6DohSQF0iCDdhIIADAOQAGAOANAJQAMALAQABQAiAFATgeQANgSABgrIBogfQEChHDXAAQCuAADXAmIF8BDQAIAZAXAMQAaAMAXgLQANgGAKgQQD5AqCnAaQG3BEGZBeQDcAzE7AkIABABQAGAKAQAMIAYATQAPAPAQAbQAWAoAEAFQAQAYAYAMQAZAMAXgKQARgJAIgVQAHgTgFgVQgEgcgigrIgGgIIA/AFQAIAHAMAHIAdAeQAPALAUgBQAUgBANgMQAOgMAHgUQBJADBHAAIAAANQAAAnANARQALAQAWACQAVAEASgLQAggQASgsIAJgXQCXgICMgWQAPAPAJAHQAWASAWAGQAWAHAVgEQAYgDAPgOQAMgMAEgRIANAGQAUAJAQACQAmAFAZgbIAEgEIAMAJQAkAYAUACQAdADAVgZQAVgYgLgfQgDgIgHgIIAVADQB2AXHMjUIERiAQAJANAPAGQATAHAngMQAjgOAOgNQAagXADgpICMhEIAGAPIAEAZQADAPAEAIQAJAWAZAIQAZAIAUgNQAggTAAgzIgDgYQATgEAQgKQALgHAOgRQAGAAAHgDQAPgGASgRQAUgVAJgGQAKgGAcgHIABAAQAcAAASgKIAZgIIAHAGQAOALAUgBQAUAAANgMQAPgNAHgYQADgMACgVIC2hJQBHgbBDgVIADAEQATAlAMAMQAWAZAdgDQAVgDAOgVQANgSgBgXQgBgUgMgcQBughBlgXQDSgvLbjvQABAZAIANQAMAWAeAEQAdAEASgUQANgNAEgXQADgNABgdIAAgKICCgsIADADQAXARAagHQAfgKAOgjIC4g+QAPAIASgDQAUgDAMgOIAIgNIB5gpIL2ByIgEABIA5ADQChAKIgAYQC/AILEAOQEoAHE8AhQAEAFAGAEQAVAQAogEQAZgCAQgGIAEAAQDBAWD/ARIADAXQAKAuAdAKQARAFATgHQARgIALgQQALgQAJgeQDkALERAIQFQALEAgBILTI5QJPHSEGDcQgogSgpgPQgkgNgWAFQgaAFgMAdQgMAdAPAWQAPAXAwAQQCLAzB4BZQgbAhAUBIQgHAGgHAHQg3ACgUAaQgPASAEAZQADAaAUANQAUANAuABIA+AAQAmAHA3AGIAFAEQBOA8BjA8QAsAaAdgEQAYgEAOgZQANgXgIgXQAYAEAyAPQAvANAbAEIAsADQAbADARAEQAOADAcAIQAYAGARgBQAjgGAQgeQAIgSgCgRQMbA7Q4AaQFiAIEnAEQDUACC1AAIGgqDMAB4AySUABoAzxgBIAHZQhHHZtdIRQkOCmk8CXIkGB3g")
	}.bind(this);
	this.shape_5.setTransform(6204.5315,676.4);

	this.shape_6 = new cjs.Shape();
	var sprImg_shape_6 = cjs.SpriteSheetUtils.extractFrame(ss["WilliamBlairAssignmentFinalProject_atlas_3"],48);
	sprImg_shape_6.onload = function(){
		this.shape_6.graphics.bf(sprImg_shape_6, null, new cjs.Matrix2D(1.969,0,0,1.969,-228.7,-252.5)).s().p("EAzaBLvMiW4ABLMheEgCXMhz+AAnMhC3gBzMAGggyTMAHHgzdIG+sbIKMtnISVmgICvgkIAWBAQAWA5ATAmQAfBCArgFQAZgBAOgdQANgbgGgcQgFgVgQgeQgXgngEgKQgIgRgHgcIgDgNIAHgDQBWgLBKgGQAEAiAJAVQAJAPAOAKQAPAIAPgCQAugFAEhRQCGAEBXAlQHEDBF9BtQEJBMJeDjIJeBMIHHl7IFng4IA6gWIABAGQAIAxAOAWQAMAQAQAIQAUAIAQgEQARgFANgRQAKgPADgTQADgZgMgxIgCgPQBngWBOAbIgQAnQgRAzAaAeQANANAeAKQAuANAZgUQAMgLAHgYIAIgZIA0AjIBtBNIgHAXQgEAQABAMQAEAdAnARQAdAMAVgIQARgFALgSIA1AmQGDEICyAAQCmAAFyAmQFxAmBQAAQA2AAAxBIQA9BZAfATQCRBWGimiIJwqJQBuhxCGhrQAKAAAIgEQAXgKAHgZQA0gmA2gmQEFi4FehpQDghDC3gRQAPAKAVAKQAZAKAJAIQAMAJAPAYQAWAYAjgBQAjgBAUgZQAUgZABg0QA4gCBLgFQAHAIAJAIQAUAMAUgEQgHARAJATQAIASARAKQAeATAsgKQAlgKASgaQAOgXAAg1IA4gEQBQgEBFgBQABAdAGAQQALAcAYAGQAQACAdgFQAMAAAXAKQAYALAKACQAdAGAZgUQAZgVAFgdQADgKgCgOQBBAIAqAOQBHAZAjAWQAUANAjAbQBYA0FmBZQGKBkEfAhQCgATC1AAQAwAAAggXQASgMAigfQBHg2CvAsQBjAYApArQAaAaArBIQAwBDBfBHQACAUALAMQATAUAhgFIABAAQBHAvBfAwQgMApAQAeQAKASAVAIQAVAKARgJQAQgGAKgTQAFgGAFgMIBAAdQF+CtEjCzQDIB8C8A3QByAjBXBzIA/BbQAkA0AbAYQAQAOAQAJQBDAhBbgmQCKg6D+jvQDijXCdkBQBChuBZimQARAEATgFQAPgFAKgMQAJgKAEgLIAKgBQAYgDAPgZIAYgrQAeguAMgYQAKgTADgQQAKgMAFgQQAGgSgFgUQgCgJgGgNQArgnAsgcQAcgRAggOIATAhQAXAhARAIQAMAIAPAAQAIASARAGQASAHAUgKQARgJAKgSQAOgYAAgzQABglgEgbQBAgPBKgKQABARAFAJQAHAQANAKQAOALAQgBQATAAAOgOQAKgKAGgOQAPgFAUgVIANgLIACgDIAXgBIAAAcQABAXAJAOQAFAJAHAFIABABQAIAGANADQAXAFASgMIAJgHQAKAIAQACQAYAEASgPQAYgWAAg9IAAgGIDRgOIACAEQASArAOARQAcAiAigHQAXgDAOgXQAFABAHgBQAKAAATgEIASACQAKABAGgBQAVgDANgVQAJgPADgPIABgBQAKgJADgMQBpgDA/ADQDWAKGEBmIgCASQgFAqALAYQAHAQANAKQAPAMAQAAQAjAAARgrQAFgOACgUIACgOQCGAqB4A+IgFAQIgMAbQgHASgDALQgIAjASAWQAMAPAWABQAUABARgLQAdgRAPgtIAFgQQAmAYAvAfIBWA6QCRBjBZAsQCLBDCmAaQITBSBsAJQErAWDGhLQCYg4DQhyQB2g2B7gHIACAJQAGAZAXAPQAXAQAWgJQAFgCAHgEIAKAEQAcAKA8AGIB8AMQATADARAAIAjAPQAaAMAMAEQAXAGASgFQANgEAUgRIAFACQAEABAMAPQAbAeAcgBQAVgCAPgPQAOAUAYACQAXADARgTQARgRAFgaIACgMQA/ADBDgBIAogBQABASgBAQQgCAvAFARQALAmAgAGQAQAFARgLQAPgKAKgRQAMgYAAgtIABg2IAagGQAKAKAMAFQANAEAKAAQAQAEASgJQAMgFAIgJQANAMAYAHQAxAMAigXIABgBQAWASAZgHQASgFALgRQAKgPABgVQABgJgCgKIAOgIQABAfAIASQAHARAQALQARAMASgDQAwgHAChbIAAgGQBTAHBcAYQEzBMFpDCQEiCbCyCPQA8AvALA3QAFAdAAA1QAQBaEeBCQCtApClgfQCHgaC6hYICHg/QADAQAGALQALARAVAFQAXAGARgJQAogWgDhFIgDgOIB4g9QD+h7DphSQF0iBDchJIAEAOQAFAOANAKQANAKAQABQAiAGATgeQANgSABgsIBngfQEDhGDXgBQCuABDXAlIF8BDQAHAaAYALQAaANAXgMQANgFAKgQQD5AqCnAZQG3BFGYBdQDdA0E7AjIABACQAGAKAQALIAYAUQAPAOAQAcQAWAoAFAFQAPAYAYALQAZANAXgLQARgJAIgVQAIgTgGgUQgEgdgigqIgFgJIA+AFQAIAHAMAHIAdAfQAQAKATgBQAUAAANgMQAPgNAHgUQBIADBHAAIAAANQAAAoANAQQALAQAWADQAVADASgKQAggRASgsIAJgXQCXgICMgVQAPAOAJAIQAWARAWAHQAWAHAWgEQAXgDAPgPQANgLADgRIANAFQAUAKAQABQAmAFAZgaIAEgEIAMAJQAkAXAUACQAdADAVgZQAVgYgLgeQgDgJgHgHIAVACQB2AXHMjUIERiAQAJAOAPAFQATAHAngLQAjgPAPgMQAZgXADgpICMhEIAGAOIAFAaQADAOADAJQAJAWAZAHQAZAJAUgNQAggUABgyIgEgZQATgDAQgLQALgGAOgSQAGAAAIgDQAPgFARgSQAVgVAIgFQALgGAbgHIABAAQAcAAASgKIAZgIIAHAGQAOALAUgBQAUgBAOgMQAPgNAHgYQACgLACgVIC2hKQBIgaBCgWIADAFQATAlAMAMQAWAYAdgCQAWgDANgVQANgSgBgYQgBgUgMgcQBughBlgXQDSguLbjwQACAZAHANQANAXAeAEQAdAEASgUQANgOADgXQADgNACgdIAAgJICCgsIADACQAXASAagIQAfgJAOgkIC4g9QAPAHARgDQAUgDANgOIAIgMIB5gqIL2ByIgFABIA5AEQCiAKIfAXQC/AILEAPQEpAHE8AgQAEAGAFAEQAVAPApgEQAYgBARgHIAEAAQDBAWD/ASIADAWQAKAvAdAJQARAGATgIQARgHAMgRQAKgPAJgfQDkAMERAIQFQAKEAAAILUI4QJOHSEGDdQgogSgpgPQgkgNgVAEQgbAGgMAcQgMAdAPAWQAPAXAwAQQCLAzB4BaQgaAgATBJQgHAFgHAHQg3ADgTAZQgQATAFAZQACAZAVANQATAOAuAAIA/AAQAlAHA3AHIAFADQBPA8BiA8QAsAaAdgDQAYgFAOgYQANgYgIgXQAYAEAyAPQAvAOAbADIAsAEQAbACARAEQAOADAcAJQAZAFAQgBQAVgDAOgMIj0GyMgHGAzeMgGhAyRMBBVABxQjICskjCyQkOCmk8CXIkGB3gEFI0gtUIAJABIgJAPQABgIgBgIg")
	}.bind(this);
	this.shape_6.setTransform(1781.7,735.8);

	this.shape_7 = new cjs.Shape();
	this.shape_7.graphics.f("#000000").s().p("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");
	this.shape_7.setTransform(3984.2914,268.7103);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.shape_7},{t:this.shape_6},{t:this.shape_5},{t:this.shape_4},{t:this.shape_3},{t:this.shape_2},{t:this.shape_1},{t:this.shape}]}).wait(815));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();


(lib.runghost_button = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.instance = new lib.CachedBmp_17();
	this.instance.setTransform(-84.5,-21.2,0.5,0.5);

	this.instance_1 = new lib.CachedBmp_16();
	this.instance_1.setTransform(-101,-54.45,0.5,0.5);

	this.instance_2 = new lib.CachedBmp_19();
	this.instance_2.setTransform(-83.65,-21.6,0.5,0.5);

	this.instance_3 = new lib.CachedBmp_22();
	this.instance_3.setTransform(-100.2,-54.45,0.5,0.5);

	this.instance_4 = new lib.CachedBmp_21();
	this.instance_4.setTransform(-83.3,-21.55,0.5,0.5);

	this.instance_5 = new lib.CachedBmp_20();
	this.instance_5.setTransform(-99.85,-54.4,0.5,0.5);

	this.instance_6 = new lib.CachedBmp_23();
	this.instance_6.setTransform(-87,-19.95,0.5,0.5);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.instance_1},{t:this.instance}]}).to({state:[{t:this.instance_3,p:{x:-100.2}},{t:this.instance_2}]},1).to({state:[{t:this.instance_5},{t:this.instance_4}]},1).to({state:[{t:this.instance_3,p:{x:-101.5}},{t:this.instance_6}]},1).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-101.5,-54.4,204.7,108);


(lib.lamplightsymbol = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.shape = new cjs.Shape();
	this.shape.graphics.f("rgba(255,255,255,0.4)").s().p("AgD23MAadAtsMg0zAADg");
	this.shape.setTransform(178.5101,174.4222,1.0569,1.1909);

	this.timeline.addTween(cjs.Tween.get(this.shape).wait(1));

	this._renderFirstFrame();

}).prototype = getMCSymbolPrototype(lib.lamplightsymbol, new cjs.Rectangle(0,0,357.1,348.8), null);


(lib.house_windows_symbol = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.instance = new lib.CachedBmp_15();
	this.instance.setTransform(-0.5,-0.5,0.5,0.5);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = getMCSymbolPrototype(lib.house_windows_symbol, new cjs.Rectangle(-0.5,-0.5,228.5,395.5), null);


(lib.house_smoke3_symbol = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.shape = new cjs.Shape();
	this.shape.graphics.f().s("#373535").p("AKiAAQAAEXjGDFQjFDGkXAAQkWAAjFjGQjGjFAAkXQAAkWDGjGQDFjFEWAAQEXAADFDFQDGDGAAEWg");
	this.shape.setTransform(35.125,35.15);

	this.shape_1 = new cjs.Shape();
	this.shape_1.graphics.f("#FFFFFF").s().p("AnbHdQjGjGAAkXQAAkWDGjGQDFjFEWAAQEXAADFDFQDGDGAAEWQAAEXjGDGQjFDFkXAAQkWAAjFjFg");
	this.shape_1.setTransform(35.125,35.15);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.shape_1},{t:this.shape}]}).wait(1));

	this._renderFirstFrame();

}).prototype = getMCSymbolPrototype(lib.house_smoke3_symbol, new cjs.Rectangle(-33.2,-33.2,136.7,136.8), null);


(lib.house_smoke2_symbol = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.shape = new cjs.Shape();
	this.shape.graphics.f().s("#373535").p("AF7AAQAACdhvBvQhvBvidAAQicAAhvhvQhvhvAAidQAAicBvhvQBwhvCbAAQCdAABvBvQBvBvAACcg");
	this.shape.setTransform(37.9,37.9);

	this.shape_1 = new cjs.Shape();
	this.shape_1.graphics.f("#FFFFFF").s().p("AkLEMQhvhvAAidQAAibBvhwQBvhvCcAAQCdAABvBvQBvBvAACcQAACdhvBvQhvBvidAAQicAAhvhvg");
	this.shape_1.setTransform(37.9,37.9);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.shape_1},{t:this.shape}]}).wait(1));

	this._renderFirstFrame();

}).prototype = getMCSymbolPrototype(lib.house_smoke2_symbol, new cjs.Rectangle(-1,-1,77.8,77.8), null);


(lib.house_smoke1_symbol = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.shape = new cjs.Shape();
	this.shape.graphics.f().s("#373535").p("ADnAAQAABghDBDQhEBEhgAAQheAAhEhEQhEhDAAhgQAAheBEhEQBEhEBeAAQBgAABEBEQBDBEAABeg");
	this.shape.setTransform(23.1,23.075);

	this.shape_1 = new cjs.Shape();
	this.shape_1.graphics.f("#FFFFFF").s().p("AijCjQhDhDAAhgQAAheBDhEQBFhEBeAAQBgAABEBEQBDBEAABeQAABghDBDQhEBEhgAAQheAAhFhEg");
	this.shape_1.setTransform(23.1,23.075);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.shape_1},{t:this.shape}]}).wait(1));

	this._renderFirstFrame();

}).prototype = getMCSymbolPrototype(lib.house_smoke1_symbol, new cjs.Rectangle(-1,-1,48.2,48.2), null);


(lib.house_roofpatch_symbol = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.shape = new cjs.Shape();
	this.shape.graphics.f().s("#373535").p("AIJImIyVgdIGDwuIOXAAg");
	this.shape.setTransform(65.2793,54.9805);

	this.shape_1 = new cjs.Shape();
	this.shape_1.graphics.f("#606163").s().p("AqMIJIGCwuIOXAAIiFRLg");
	this.shape_1.setTransform(65.35,54.975);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.shape_1},{t:this.shape}]}).wait(1));

	this._renderFirstFrame();

}).prototype = getMCSymbolPrototype(lib.house_roofpatch_symbol, new cjs.Rectangle(-1,-1,132.7,112), null);


(lib.house_roofchimney_symbol = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.instance = new lib.CachedBmp_14();
	this.instance.setTransform(-0.5,-0.5,0.5,0.5);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = getMCSymbolPrototype(lib.house_roofchimney_symbol, new cjs.Rectangle(-0.5,-0.5,150.5,129.5), null);


(lib.house_roof_symbol = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.shape = new cjs.Shape();
	this.shape.graphics.f().s("#373535").p("EBM0AYVMiZnAAAMAvhgwpMA6mAAAg");
	this.shape.setTransform(491.6249,155.7);

	this.shape_1 = new cjs.Shape();
	var sprImg_shape_1 = cjs.SpriteSheetUtils.extractFrame(ss["WilliamBlairAssignmentFinalProject_atlas_2"],8);
	sprImg_shape_1.onload = function(){
		this.shape_1.graphics.bf(sprImg_shape_1, null, new cjs.Matrix2D(1,0,0,1,-250,-165)).s().p("EhMzAYVMAvhgwpMA6mAAAMAvgAwpg")
	}.bind(this);
	this.shape_1.setTransform(491.625,155.7);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.shape_1},{t:this.shape}]}).wait(1));

	this._renderFirstFrame();

}).prototype = getMCSymbolPrototype(lib.house_roof_symbol, new cjs.Rectangle(-1.1,-1,985.5,313.4), null);


(lib.house_door_symbol = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.instance = new lib.CachedBmp_13();
	this.instance.setTransform(-0.5,-0.5,0.5,0.5);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = getMCSymbolPrototype(lib.house_door_symbol, new cjs.Rectangle(-0.5,-0.5,218,514.5), null);


(lib.house_chimneypatch1_symbol = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.shape = new cjs.Shape();
	this.shape.graphics.f().s("#333333").ss(0.1).p("AnPh2IOeAAIAADtIueAAg");
	this.shape.setTransform(48.648,21.4398,1.0208,0.8137,0,17.8472,14.9988);

	this.shape_1 = new cjs.Shape();
	this.shape_1.graphics.f("#999999").s().p("AnPB3IAAjtIOeAAIAADtg");
	this.shape_1.setTransform(48.648,21.4398,1.0208,0.8137,0,17.8472,14.9988);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.shape_1},{t:this.shape}]}).wait(1));

	this._renderFirstFrame();

}).prototype = getMCSymbolPrototype(lib.house_chimneypatch1_symbol, new cjs.Rectangle(-1,-1,99.4,45), null);


(lib.house_chimney_symbol = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.shape = new cjs.Shape();
	this.shape.graphics.f().s("#373535").p("AMgAAQAAB9jrBZQjpBZlMAAQlLAAjphZQjrhZAAh9QAAh9DrhYQDphZFLAAQFLAADqBZQDrBZAAB8g");
	this.shape.setTransform(222.25,44.375);

	this.shape_1 = new cjs.Shape();
	this.shape_1.graphics.f("#000000").s().p("Ao0DWQjrhZAAh9QAAh9DrhYQDqhZFKAAQFLAADrBZQDqBZAAB8QAAB9jqBZQjrBZlLAAQlKAAjqhZg");
	this.shape_1.setTransform(222.25,44.375);

	this.shape_2 = new cjs.Shape();
	this.shape_2.graphics.f().s("#373535").p("A5aRjISWAAIDnyRIjWlkIBZsbQA5hSBEhBQDujmF+g0QDLgcC9AaQEuAqEGCyQCXBoB5CKIAADLIkvODImHDvIrZSeIoCEdI0kiVg");
	this.shape_2.setTransform(162.675,164.1815);

	this.shape_3 = new cjs.Shape();
	this.shape_3.graphics.bf(img.metaltexturegrungerustspottedagedoldrusteddirtyoxygenated5, null, new cjs.Matrix2D(1,0,0,1,-96,-1596)).s().p("A5aXVIAAlyISWAAIDnyRIjWlkIBZsbQA5hSBEhBQDujmF+g0QDLgcC9AaQEuAqEGCyQCXBoB5CKIAADLIkvODImHDvIrZSeIoCEdg");
	this.shape_3.setTransform(162.675,164.1741);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.shape_3},{t:this.shape_2},{t:this.shape_1},{t:this.shape}]}).wait(1));

	this._renderFirstFrame();

}).prototype = getMCSymbolPrototype(lib.house_chimney_symbol, new cjs.Rectangle(-1,-1,327.4,330.4), null);


(lib.house_body_symbol = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.shape = new cjs.Shape();
	this.shape.graphics.f().s("#373535").p("EAybAqZMhk1AAAMAAAhUxMBk1AAAg");
	this.shape.setTransform(322.675,271.3);

	this.shape_1 = new cjs.Shape();
	var sprImg_shape_1 = cjs.SpriteSheetUtils.extractFrame(ss["WilliamBlairAssignmentFinalProject_atlas_1"],1);
	sprImg_shape_1.onload = function(){
		this.shape_1.graphics.bf(sprImg_shape_1, null, new cjs.Matrix2D(1,0,0,1,-450,-800)).s().p("EgyaAqZMAAAhUxMBk1AAAMAAABUxg")
	}.bind(this);
	this.shape_1.setTransform(322.675,271.3);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.shape_1},{t:this.shape}]}).wait(1));

	this._renderFirstFrame();

}).prototype = getMCSymbolPrototype(lib.house_body_symbol, new cjs.Rectangle(-1,-1,647.4,544.6), null);


(lib.ghost_shadow_symbol = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.shape = new cjs.Shape();
	this.shape.graphics.f().s("#373535").p("ANtAAQAAAxkBAjQkBAjlrAAQlrAAkAgjQkBgjAAgxQAAgwEBgjQEAgiFrAAQFrAAEBAiQEBAjAAAwg");
	this.shape.setTransform(87.7,11.85);

	this.shape_1 = new cjs.Shape();
	this.shape_1.graphics.f("#000000").s().p("AprBUQkBgjAAgxQAAgwEBgjQEBgjFqABQFsgBEAAjQEBAjAAAwQAAAxkBAjQkAAilsABQlqgBkBgig");
	this.shape_1.setTransform(87.7,11.85);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.shape_1},{t:this.shape}]}).wait(1));

	this._renderFirstFrame();

}).prototype = getMCSymbolPrototype(lib.ghost_shadow_symbol, new cjs.Rectangle(-1,-1,177.4,25.7), null);


(lib.ghost_righteye_symbol = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.shape = new cjs.Shape();
	this.shape.graphics.f().s("#373535").p("AhmAmQAegQAUgoQAWgwAXgTQAkggAygHQAzgIAWAXQALANAAAXQAAANgFAcQgIApgWAiQgbAtgmAKQgSAFgfgHQgbgHgYAJQgOAFgSAOQgOAKgNAAQgZABgXgWQgWgVAFgRQACgJARgGQAdgJALgGg");
	this.shape.setTransform(16.3368,12.7334);

	this.shape_1 = new cjs.Shape();
	this.shape_1.graphics.f("#000000").s().p("AiQBqQgWgVAFgRQACgJARgGQAdgJALgGQAegQAUgoQAWgwAXgTQAkggAygHQAzgIAWAXQALANAAAXQAAANgFAcQgIApgWAiQgbAtgmAKQgSAFgfgHQgbgHgYAJQgOAFgSAOQgOAKgNAAIgCAAQgYAAgWgVg");
	this.shape_1.setTransform(16.3368,12.7334);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.shape_1},{t:this.shape}]}).wait(1));

	this._renderFirstFrame();

}).prototype = getMCSymbolPrototype(lib.ghost_righteye_symbol, new cjs.Rectangle(-1.6,-2.2,35.300000000000004,30), null);


(lib.ghost_mouth_symbol = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.shape = new cjs.Shape();
	this.shape.graphics.f().s("#373535").p("Ah2gvIiUAAQgGAPgJARQgSAfgOAIQgPAHgYAkQgLATgJAQIAvA0ICChNIAkA1IBHA8IBqhYIAjg9IBlAAIBHAeIBHg1IA1hBIAYiOQgjAGgSgGQgLgDgcAfIgaAgIg8A1IgdgSQgOgBgPAAQgdACgFALQgKAXgCAEQgJAPgLALQgLAMgfAKIgdAHIhMhAg");
	this.shape.setTransform(37.3253,19.0449);

	this.shape_1 = new cjs.Shape();
	this.shape_1.graphics.f("#000000").s().p("AifCCIgkg1IiCBNIgvg0IAUgjQAYgkAPgHQAOgIASgfQAJgRAGgPICUAAIAqgRIBMBAIAdgHQAfgKALgMQALgLAJgPIAMgbQAFgLAdgCQAPAAAOABIAdASIA8g1IAaggQAcgfALADQASAGAjgGIgYCOIg1BBIhHA1IhHgeIhlAAIgjA9IhqBYg");
	this.shape_1.setTransform(37.325,19.0072);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.shape_1},{t:this.shape}]}).wait(1));

	this._renderFirstFrame();

}).prototype = getMCSymbolPrototype(lib.ghost_mouth_symbol, new cjs.Rectangle(-1,-1.5,76.7,40.5), null);


(lib.ghost_lefteye_symbol = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.shape = new cjs.Shape();
	this.shape.graphics.f().s("#373535").p("AB2iYQhGgQhLARQgsAKg7AZQhDAegWAOQgiAWgHAdQgLAwAyA4QAxA3BCASQAmAKAxgLQAggIBYghQBWggAagPQAogWAIggQAIgfgUgmQgQgfgagXQgUgSgagLQgPgGgcgHg");
	this.shape.setTransform(26.2838,16.0568);

	this.shape_1 = new cjs.Shape();
	this.shape_1.graphics.f("#000000").s().p("AhqCcQhCgSgxg3Qgyg4ALgwQAHgdAigWQAWgOBDgeQA7gZAsgKQBLgRBGAQQAcAHAPAGQAaALAUASQAaAXAQAfQAUAmgIAfQgIAggoAWQgaAPhWAgQhYAhggAIQgaAGgWAAQgVAAgSgFg");
	this.shape_1.setTransform(26.2838,16.0568);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.shape_1},{t:this.shape}]}).wait(1));

	this._renderFirstFrame();

}).prototype = getMCSymbolPrototype(lib.ghost_lefteye_symbol, new cjs.Rectangle(-1.4,-1,55.5,34.2), null);


(lib.ghost_body_symbol = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.shape = new cjs.Shape();
	this.shape.graphics.f().s("#373535").p("AyKa8QhCnIASm/QAXomCWoIQCDnLCNkWQDunVF6kfQDAiSCCg7QDahjDOAlQDXAnCtCjQCsCjAtDMQAeCIgoCMQghB0haCQQgqBCiQDJQiACzhFB4QnZMyDOTcIjnjUIhrEmIjmkmIiOEqIiOpGIgkFQIighGIBZEaIg1DrIiylGIiyhPIg1Cqg");
	this.shape.setTransform(121.4796,201.9702);

	this.shape_1 = new cjs.Shape();
	this.shape_1.graphics.f("rgba(255,255,255,0.6)").s().p("AsDaZIiyhPIg1CrIigg1QhCnHASnAQAXomCWoHQCDnLCNkXQDunUF6kgQDAiSCCg7QDahiDOAlQDXAnCtCjQCsCiAtDNQAeCIgoCLQghB0haCQQgqBCiQDKQiACyhFB5QnZMyDOTbIjnjUIhrEmIjmkmIiOErIiOpHIgkFQIighFIBZEaIg1Dqg");
	this.shape_1.setTransform(121.4796,201.5198);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.shape_1},{t:this.shape}]}).wait(1));

	this._renderFirstFrame();

}).prototype = getMCSymbolPrototype(lib.ghost_body_symbol, new cjs.Rectangle(-1,-1,245,405.4), null);


(lib.character_shoe_symbol = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.instance = new lib.CachedBmp_12();
	this.instance.setTransform(-0.5,-0.55,0.5,0.5);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = getMCSymbolPrototype(lib.character_shoe_symbol, new cjs.Rectangle(-0.5,-0.5,46.5,20.5), null);


(lib.character_right_bottom_leg = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.shape = new cjs.Shape();
	this.shape.graphics.f().s("#373535").p("Ag1hyIAADlIBrAAIAAjlg");
	this.shape.setTransform(5.425,13.1556,1,1.1464);

	this.shape_1 = new cjs.Shape();
	this.shape_1.graphics.f("#292929").s().p("Ag1BzIAAjlIBrAAIAADlg");
	this.shape_1.setTransform(5.425,13.1556,1,1.1464);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.shape_1},{t:this.shape}]}).wait(1));

	this._renderFirstFrame();

}).prototype = getMCSymbolPrototype(lib.character_right_bottom_leg, new cjs.Rectangle(-1,-1,12.9,28.4), null);


(lib.character_right_arm_symbol = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.shape = new cjs.Shape();
	this.shape.graphics.f().s("#373535").p("AgwhwICPDGIgoAcIiVi5g");
	this.shape.setTransform(9.4902,11.2944,0.9999,0.9999);

	this.shape_1 = new cjs.Shape();
	this.shape_1.graphics.f("#EEF3CD").s().p("AhehHIAugqICPDGIgnAcg");
	this.shape_1.setTransform(9.4844,11.3263,0.9999,0.9999);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.shape_1},{t:this.shape}]}).wait(1));

	this._renderFirstFrame();

}).prototype = getMCSymbolPrototype(lib.character_right_arm_symbol, new cjs.Rectangle(-1,-1,21,24.7), null);


(lib.character_open_mouth_symbol = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.shape = new cjs.Shape();
	this.shape.graphics.f().s("#373535").p("ABvAAQAAAighAZQggAYguAAQgtAAgggYQghgZAAgiQAAgiAhgYQAggYAtAAQAuAAAgAYQAhAYAAAig");
	this.shape.setTransform(11.075,8.325);

	this.shape_1 = new cjs.Shape();
	this.shape_1.graphics.f("#000000").s().p("AhNA7QghgZAAgiQAAgiAhgYQAggYAtAAQAuAAAgAYQAhAYAAAiQAAAighAZQggAYguAAQgtAAgggYg");
	this.shape_1.setTransform(11.075,8.325);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.shape_1},{t:this.shape}]}).wait(1));

	this._renderFirstFrame();

}).prototype = getMCSymbolPrototype(lib.character_open_mouth_symbol, new cjs.Rectangle(-1,-1,24.2,18.7), null);


(lib.character_nose_symbol = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.instance = new lib.CachedBmp_11();
	this.instance.setTransform(-1.6,-1.05,0.5,0.5);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = getMCSymbolPrototype(lib.character_nose_symbol, new cjs.Rectangle(-1.6,-1,7,6), null);


(lib.character_mouth_symbol = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.instance = new lib.CachedBmp_10();
	this.instance.setTransform(-0.5,-1.5,0.5,0.5);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = getMCSymbolPrototype(lib.character_mouth_symbol, new cjs.Rectangle(-0.5,-1.5,9.5,5.5), null);


(lib.character_leftforearm_symbol = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.instance = new lib.CachedBmp_9();
	this.instance.setTransform(-0.7,-0.65,0.5,0.5);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = getMCSymbolPrototype(lib.character_leftforearm_symbol, new cjs.Rectangle(-0.7,-0.6,67,61), null);


(lib.character_left_top_leg = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.shape = new cjs.Shape();
	this.shape.graphics.f().s("#373535").p("Ag1kBIAAIDIBrAAIAAoDg");
	this.shape.setTransform(5.412,11.5065,0.9999,0.4456);

	this.shape_1 = new cjs.Shape();
	this.shape_1.graphics.f("#292929").s().p("Ag1ECIAAoDIBrAAIAAIDg");
	this.shape_1.setTransform(5.412,11.5065,0.9999,0.4456);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.shape_1},{t:this.shape}]}).wait(1));

	this._renderFirstFrame();

}).prototype = getMCSymbolPrototype(lib.character_left_top_leg, new cjs.Rectangle(-1,-1,12.9,25), null);


(lib.character_left_arm_symbol = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.shape = new cjs.Shape();
	this.shape.graphics.f().s("#373535").p("AA/h3IieDUIAnAdICZi2g");
	this.shape.setTransform(9.5924,11.935,0.9999,0.9999);

	this.shape_1 = new cjs.Shape();
	this.shape_1.graphics.f("#EEF3CD").s().p("AhgBcICfjUIAiA7IiaC2g");
	this.shape_1.setTransform(9.6407,12.0511,0.9999,0.9999);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.shape_1},{t:this.shape}]}).wait(1));

	this._renderFirstFrame();

}).prototype = getMCSymbolPrototype(lib.character_left_arm_symbol, new cjs.Rectangle(-1,-1,21.3,26.2), null);


(lib.character_hair_symbol = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.shape = new cjs.Shape();
	this.shape.graphics.f().s("#373535").p("AqrEvQgGg4AHg7QAKhXAnhOQAjhHA6g5QAigiA1glQBlhICBgdQBPgSCggLQCagLBIAHQBtALBVA1QBcA7AwBRQATAhANAuQAIAeAeCCIAoC0ImGAAIgelxIgnAFIAVFog");
	this.shape.setTransform(68.7111,31.2996,0.9999,0.9999);

	this.shape_1 = new cjs.Shape();
	var sprImg_shape_1 = cjs.SpriteSheetUtils.extractFrame(ss["WilliamBlairAssignmentFinalProject_atlas_3"],49);
	sprImg_shape_1.onload = function(){
		this.shape_1.graphics.bf(sprImg_shape_1, null, new cjs.Matrix2D(1,0,0,1,-45,-32.5)).s().p("AEoE5IgelxIgmAFIAVFoIukgGQgGg4AHg7QAKhXAnhOQAkhHA6g5QAigiA0glQBmhICBgdQBPgSCfgLQCbgLBIAHQBtALBUA1QBcA7AwBRQATAhANAuQAJAeAdCCIAoC0g")
	}.bind(this);
	this.shape_1.setTransform(68.6495,31.2996,0.9999,0.9999);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.shape_1},{t:this.shape}]}).wait(1));

	this._renderFirstFrame();

}).prototype = getMCSymbolPrototype(lib.character_hair_symbol, new cjs.Rectangle(-1,-1,139.3,64.7), null);


(lib.character_face_symbol = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.instance = new lib.CachedBmp_8();
	this.instance.setTransform(-0.5,-0.5,0.5,0.5);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = getMCSymbolPrototype(lib.character_face_symbol, new cjs.Rectangle(-0.5,-0.5,102,119), null);


(lib.character_eyes_symbol = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.instance = new lib.CachedBmp_7();
	this.instance.setTransform(-0.5,-0.5,0.5,0.5);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = getMCSymbolPrototype(lib.character_eyes_symbol, new cjs.Rectangle(-0.5,-0.5,80,26), null);


(lib.character_eyeballs_symbol = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.shape = new cjs.Shape();
	this.shape.graphics.f().s("#373535").p("AhSAJQAGAoAiAdQAjAdAigKQAdgIAQggQAPgfgEgfQgFgogfgdQgggfgjAIQgfAGgSAiQgRAgAEAig");
	this.shape.setTransform(8.3852,9.9519,0.9999,0.9999);

	this.shape_1 = new cjs.Shape();
	this.shape_1.graphics.f("#373535").s().p("AgqBOQgigdgGgoQgEgiARggQASgiAfgGQAjgIAgAfQAfAdAFAoQAEAfgPAfQgQAggdAIQgJADgJAAQgZAAgagWg");
	this.shape_1.setTransform(8.3852,9.9519,0.9999,0.9999);

	this.shape_2 = new cjs.Shape();
	this.shape_2.graphics.f().s("#373535").p("AhSAJQAGAoAiAdQAjAdAigKQAdgIAQggQAPgfgEgfQgFgogfgdQgggfgjAIQgfAGgSAiQgRAgAEAig");
	this.shape_2.setTransform(58.5821,9.9519,0.9999,0.9999);

	this.shape_3 = new cjs.Shape();
	this.shape_3.graphics.f("#373535").s().p("AgqBOQgigdgGgoQgEgiARggQASgiAfgGQAjgIAgAfQAfAdAFAoQAEAfgPAfQgQAggdAIQgJADgJAAQgZAAgagWg");
	this.shape_3.setTransform(58.5821,9.9519,0.9999,0.9999);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.shape_3},{t:this.shape_2},{t:this.shape_1},{t:this.shape}]}).wait(1));

	this._renderFirstFrame();

}).prototype = getMCSymbolPrototype(lib.character_eyeballs_symbol, new cjs.Rectangle(-1.3,-1.2,69.3,22.2), null);


(lib.character_eyebags_symbol = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.shape = new cjs.Shape();
	this.shape.graphics.f().s("#373535").p("Ai6hpQgGAbAIAiQAFAXAXA8QAYBBANAZQAUAnAgAZQAaAVAUALQAiARAfgFQAygIAlhAQATgiATg8QARg7ADggQAFg8gZguQgjhAhKgeQhLgghDAcQglAPgcAfQgeAhgJAog");
	this.shape.setTransform(67.8315,23.7802,0.9999,0.9999);

	this.shape_1 = new cjs.Shape();
	this.shape_1.graphics.f("#953993").s().p("AgVDhQgUgLgagVQgggZgUgnQgNgZgYhBQgXg8gFgXQgIgiAGgbQAJgoAeghQAcgfAlgPQBDgcBLAgQBKAeAjBAQAZAugFA8QgDAggRA7QgTA8gTAiQglBAgyAIIgOABQgZAAgagNg");
	this.shape_1.setTransform(67.8315,23.7802,0.9999,0.9999);

	this.shape_2 = new cjs.Shape();
	this.shape_2.graphics.f().s("#373535").p("Ai6hpQgGAbAIAiQAFAXAXA8QAYBBANAZQAUAnAgAZQAaAVAUALQAiARAfgFQAygIAlhAQATgiATg8QARg7ADggQAFg8gZguQgjhAhKgeQhLgghDAcQglAPgcAfQgeAhgJAog");
	this.shape_2.setTransform(18.9845,23.7802,0.9999,0.9999);

	this.shape_3 = new cjs.Shape();
	this.shape_3.graphics.f("#953993").s().p("AgVDhQgUgLgagVQgggZgUgnQgNgZgYhBQgXg8gFgXQgIgiAGgbQAJgoAeghQAcgfAlgPQBDgcBLAgQBKAeAjBAQAZAugFA8QgDAggRA7QgTA8gTAiQglBAgyAIIgOABQgZAAgagNg");
	this.shape_3.setTransform(18.9845,23.7802,0.9999,0.9999);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.shape_3},{t:this.shape_2},{t:this.shape_1},{t:this.shape}]}).wait(1));

	this._renderFirstFrame();

}).prototype = getMCSymbolPrototype(lib.character_eyebags_symbol, new cjs.Rectangle(-1.1,-1,89,49.6), null);


(lib.character_ears_symbol = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.instance = new lib.CachedBmp_6();
	this.instance.setTransform(-0.45,-0.45,0.4863,0.4863);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = getMCSymbolPrototype(lib.character_ears_symbol, new cjs.Rectangle(-0.4,-0.4,139.1,25.7), null);


(lib.character_body_symbol = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.instance = new lib.CachedBmp_5();
	this.instance.setTransform(-0.65,-0.5,0.5,0.5);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = getMCSymbolPrototype(lib.character_body_symbol, new cjs.Rectangle(-0.6,-0.5,107.5,90), null);


(lib.character_backpack_symbol = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.instance = new lib.CachedBmp_4();
	this.instance.setTransform(-0.5,-1,0.5,0.5);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = getMCSymbolPrototype(lib.character_backpack_symbol, new cjs.Rectangle(-0.5,-1,93,97), null);


(lib.brickground = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.shape = new cjs.Shape();
	var sprImg_shape = cjs.SpriteSheetUtils.extractFrame(ss["WilliamBlairAssignmentFinalProject_atlas_3"],50);
	sprImg_shape.onload = function(){
		this.shape.graphics.bf(sprImg_shape, null, new cjs.Matrix2D(1,0,0,1,-145,-111)).s().p("EjUrAjdMAA1hG5MGoiAAAMgA1BG5g")
	}.bind(this);
	this.shape.setTransform(1361.225,226.875);

	this.timeline.addTween(cjs.Tween.get(this.shape).wait(1));

	this._renderFirstFrame();

}).prototype = getMCSymbolPrototype(lib.brickground, new cjs.Rectangle(0,0,2722.5,453.8), null);


(lib.___Camera___ = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// timeline functions:
	this.frame_0 = function() {
		this.visible = false;
	}

	// actions tween:
	this.timeline.addTween(cjs.Tween.get(this).call(this.frame_0).wait(2));

	// cameraBoundary
	this.shape = new cjs.Shape();
	this.shape.graphics.f().s("rgba(0,0,0,0)").ss(2,1,1,3,true).p("EAq+AfQMhV7AAAMAAAg+fMBV7AAAg");

	this.timeline.addTween(cjs.Tween.get(this.shape).wait(2));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-451,-326,902,652);


(lib.Scene_1_titletext2 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// titletext2
	this.instance = new lib.Tween5("synched",0);
	this.instance.setTransform(489.55,286.7);
	this.instance.alpha = 0;
	this.instance._off = true;

	this.instance_1 = new lib.Tween6("synched",0);
	this.instance_1.setTransform(489.55,286.7);
	this.instance_1._off = true;

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(47).to({_off:false},0).to({_off:true,alpha:1},21).wait(172));
	this.timeline.addTween(cjs.Tween.get(this.instance_1).wait(47).to({_off:false},21).wait(16).to({startPosition:0},0).to({alpha:0},10).wait(146));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();


(lib.Scene_1_titletext_background = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// titletext_background
	this.instance = new lib.Tween3("synched",0);
	this.instance.setTransform(490,286.3,0.9999,0.9999,0,0,0,0.2,0.2);
	this.instance.alpha = 0;

	this.instance_1 = new lib.Tween4("synched",0);
	this.instance_1.setTransform(490.05,286.6);
	this.instance_1._off = true;

	this.timeline.addTween(cjs.Tween.get(this.instance).to({_off:true,regX:0,regY:0,scaleX:1,scaleY:1,x:490.05,y:286.6,alpha:1},23).wait(217));
	this.timeline.addTween(cjs.Tween.get(this.instance_1).to({_off:false},23).wait(24).to({startPosition:0},0).to({startPosition:0},21).wait(16).to({startPosition:0},0).to({alpha:0},10).wait(146));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();


(lib.Scene_1_titletext = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// titletext
	this.instance = new lib.Tween1("synched",0);
	this.instance.setTransform(490.5,287.65,0.9998,0.9998,0,0,0,0.7,0.7);
	this.instance.alpha = 0;

	this.instance_1 = new lib.Tween2("synched",0);
	this.instance_1.setTransform(490,288,0.9999,0.9999,0,0,0,0.2,0.2);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.instance}]}).to({state:[{t:this.instance_1,p:{regX:0.2,regY:0.2,scaleX:0.9999,scaleY:0.9999,x:490,y:288,alpha:1}}]},23).to({state:[{t:this.instance_1,p:{regX:0.3,regY:0.4,scaleX:0.8668,scaleY:0.9998,x:479.95,y:86.3,alpha:0}}]},24).wait(193));
	this.timeline.addTween(cjs.Tween.get(this.instance).to({_off:true,regX:0.2,regY:0.2,scaleX:0.9999,scaleY:0.9999,x:490,y:288,alpha:1},23).wait(217));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();


(lib.Scene_1_lamp = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// lamp
	this.instance = new lib.lamplightsymbol();
	this.instance.setTransform(861.95,327.2,0.9998,0.9998,0,0,0,178.8,174.8);

	this.instance_1 = new lib.CachedBmp_2();
	this.instance_1.setTransform(789.05,27.5,0.5,0.5);

	this.instance_2 = new lib.CachedBmp_1();
	this.instance_2.setTransform(820.7,134.8,0.5,0.5);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.instance_2},{t:this.instance_1},{t:this.instance}]}).wait(720));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();


(lib.Scene_1_grabmonster = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// grabmonster
	this.instance = new lib.Tween11("synched",0);
	this.instance.setTransform(1862.45,782.55,0.9971,0.9971,0,0,0,0,9.6);
	this.instance.alpha = 0;
	this.instance._off = true;

	this.instance_1 = new lib.Tween12("synched",0);
	this.instance_1.setTransform(1872,277.05);
	this.instance_1.alpha = 0.8398;
	this.instance_1._off = true;

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(189).to({_off:false},0).to({_off:true,regY:0,scaleX:1,scaleY:1,x:1872,y:277.05,alpha:0.8398},35).wait(317));
	this.timeline.addTween(cjs.Tween.get(this.instance_1).wait(189).to({_off:false},35).to({alpha:0},64).wait(253));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();


(lib.Scene_1_fence = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// fence
	this.instance = new lib.brickground();
	this.instance.setTransform(2143.5,664.6,1.7347,1.4287,0,45.5894,0,1362,227.3);

	this.shape = new cjs.Shape();
	this.shape.graphics.f().s("#000000").ss(1,1,1).p("EF43gtZIhNAAIAAhCIBNAAEFHlgtZIkWAAIAAhCIEWAAEETegtZIkWAAIAAhCIEWAAEFOQgY6IAAniEFQ3gfvIAAG1EEaJgY6IAAniEEcwgfvIAAG1EDavgtZIAAhCIEXAAECmrgtGIAAhCIEWAAEDlxgY6IAAniEDoXgfvIAAG1EB2mgtGIkWAAIAAhCIEWAAEBCggtGIkXAAIAAhCIEXAAEB9RgY6IAAnQEB/4gfcIAAGiEBLxgfcIAAGiEBJLgY6IAAnQEAvqgP/MAAAA+bMmogAAAEAEWgtYIhNAAIAAhDIBNAAEAOFgtGIkXAAIAAhCIEXAAEgs7gtYIkWAAIAAhDIEWAAEgjpgYcIDyAAICCAAIEyAAICCAAIEWAAICCAAIEpAAICCAAIEXAAICCAAIEsAAICCAAMAshAAAEgmQgYcICCAAIAlAAEhXwgYcIDyAAICCAAIEyAAICCAAIEWAAICCAAIEpAAICCAAIEXAAICCAAIEZAAICCAAIEWAAICCAAIEpAAIAAoAEgjpgfuIAAHSAXW/cIAAGiAUw46IAAnQEhhCgtYIkWAAIAAhDIEWAAEiVbgtYIkWAAIAAhDIEWAAEiMJgYcIDyAAICCAAIEyAAICCAAIEWAAICCAAIEpAAICCAAIEVAAICCAAIEtAAICCAAIEWAAICCAAIEpAAICCAAIAlAAEiOwgYcICCAAIAlAAEjAOgYcIDyAAICCAAIEyAAICCAAIEXAAICCAAIEpAAICCAAIEWAAICCAAIEXAAICCAAIEWAAICCAAIEpAAIAAoAEiMJgfuIAAHSEhXwgfuIAAHSEhaXgYcIAAoAEjJfgtGIkXAAIAAhCIEXAAEj96gtGIkXAAIAAhCIEXAAEj0pgYcIDyAAICCAAIEyAAICCAAIEXAAICCAAIEpAAICCAAIEWAAICCAAIEtAAICCAAIEXAAICCAAIEpAAICCAAIAkAAEj3PgYcICCAAIAkAAEkowgYcIDyAAICCAAIEyAAICCAAIEXAAICCAAIEpAAICCAAIEWAAICCAAIEZAAICCAAIEXAAICCAAIEpAAIAAntEj0pgfcIAAHAEjC0gYcIAAntEjAOgfcIAAHAEkyBgtGIkXAAIAAhCIEXAAElmcgtGIkXAAIAAhCIEXAAEldLgYcIDyAAICCAAIEyAAICCAAIEXAAICCAAIEpAAICCAAIEWAAICCAAIEtAAICCAAIEXAAICCAAIEpAAICCAAIAkAAElfxgYcICCAAIAkAAEls1gYcICCAAIEXAAICCAAIEpAAIAAntEldLgfcIAAHAEkowgfcIAAHAEkrWgYcIAAnt");
	this.shape.setTransform(2346.725,594.05);

	this.shape_1 = new cjs.Shape();
	this.shape_1.graphics.bf(img.metaltexturegrungerustspottedagedoldrusteddirtyoxygenated5, null, new cjs.Matrix2D(1,0,0,1,-96.2,-1595.8)).s().p("AiKAhIAAhBIEVAAIAABBg");
	this.shape_1.setTransform(290.225,389.45);

	this.shape_2 = new cjs.Shape();
	this.shape_2.graphics.bf(img.metaltexturegrungerustspottedagedoldrusteddirtyoxygenated5, null, new cjs.Matrix2D(1,0,0,1,-96.2,-1595.8)).s().p("AiKAhIAAhBIEVAAIAABBg");
	this.shape_2.setTransform(290.225,302.05);

	this.shape_3 = new cjs.Shape();
	this.shape_3.graphics.bf(img.metaltexturegrungerustspottedagedoldrusteddirtyoxygenated5, null, new cjs.Matrix2D(1,0,0,1,-96.2,-1595.8)).s().p("AiKAhIAAhBIEVAAIAABBg");
	this.shape_3.setTransform(247.525,371.85);

	this.shape_4 = new cjs.Shape();
	this.shape_4.graphics.bf(img.metaltexturegrungerustspottedagedoldrusteddirtyoxygenated5, null, new cjs.Matrix2D(1,0,0,1,-96.2,-1595.8)).s().p("AiKAhIAAhBIEVAAIAABBg");
	this.shape_4.setTransform(206.675,389.45);

	this.shape_5 = new cjs.Shape();
	this.shape_5.graphics.bf(img.metaltexturegrungerustspottedagedoldrusteddirtyoxygenated5, null, new cjs.Matrix2D(1,0,0,1,-96.2,-1595.8)).s().p("AiKAhIAAhBIEVAAIAABBg");
	this.shape_5.setTransform(206.675,302.05);

	this.shape_6 = new cjs.Shape();
	this.shape_6.graphics.bf(img.metaltexturegrungerustspottedagedoldrusteddirtyoxygenated5, null, new cjs.Matrix2D(1,0,0,1,-96.2,-1595.8)).s().p("AiKAhIAAhBIEVAAIAABBg");
	this.shape_6.setTransform(247.525,322.7);

	this.shape_7 = new cjs.Shape();
	this.shape_7.graphics.bf(img.metaltexturegrungerustspottedagedoldrusteddirtyoxygenated5, null, new cjs.Matrix2D(0.781,0,0,1,-75.1,-1591.7)).s().p("AhANgIAAnAIAAhCIAAsnIAAhCIAAlUICBAAIAAIjIAABCIAAGoIAABCIAAJwg");
	this.shape_7.setTransform(227.1,351.125);

	this.shape_8 = new cjs.Shape();
	this.shape_8.graphics.bf(img.metaltexturegrungerustspottedagedoldrusteddirtyoxygenated5, null, new cjs.Matrix2D(0.781,0,0,1,-75.1,-1591.7)).s().p("AhANgIAApwIAAhCIAAmoIAAhCIAAojICBAAIAAFUIAABCIAAMnIAABCIAAHAg");
	this.shape_8.setTransform(186.25,351.125);

	this.shape_9 = new cjs.Shape();
	this.shape_9.graphics.bf(img.metaltexturegrungerustspottedagedoldrusteddirtyoxygenated5, null, new cjs.Matrix2D(0.781,0,0,1,-75.1,-1591.7)).s().p("AhANgIAAnAIAAhCIAAsnIAAhCIAAlUICBAAIAAIjIAABCIAAGoIAABCIAAJwg");
	this.shape_9.setTransform(310.65,351.125);

	this.shape_10 = new cjs.Shape();
	this.shape_10.graphics.bf(img.metaltexturegrungerustspottedagedoldrusteddirtyoxygenated5, null, new cjs.Matrix2D(0.781,0,0,1,-75.1,-1591.7)).s().p("AhANgIAA6/ICBAAIAAFUIAABCIAAMnIAABCIAAHAg");
	this.shape_10.setTransform(269.8,351.125);

	this.shape_11 = new cjs.Shape();
	this.shape_11.graphics.bf(img.metaltexturegrungerustspottedagedoldrusteddirtyoxygenated5, null, new cjs.Matrix2D(1,0,0,1,-96.2,-1595.8)).s().p("AiKAhIAAhBIEVAAIAABBg");
	this.shape_11.setTransform(165.825,371.85);

	this.shape_12 = new cjs.Shape();
	this.shape_12.graphics.bf(img.metaltexturegrungerustspottedagedoldrusteddirtyoxygenated5, null, new cjs.Matrix2D(1,0,0,1,-96.2,-1595.8)).s().p("AhmAhIgkAAIAAhBIEVAAIAABBg");
	this.shape_12.setTransform(122.225,389.45);

	this.shape_13 = new cjs.Shape();
	this.shape_13.graphics.bf(img.metaltexturegrungerustspottedagedoldrusteddirtyoxygenated5, null, new cjs.Matrix2D(1,0,0,1,-96.2,-1595.8)).s().p("AiKAhIAAhBIEVAAIAABBg");
	this.shape_13.setTransform(122.225,302.05);

	this.shape_14 = new cjs.Shape();
	this.shape_14.graphics.bf(img.metaltexturegrungerustspottedagedoldrusteddirtyoxygenated5, null, new cjs.Matrix2D(1,0,0,1,-96.2,-1595.8)).s().p("AiKAhIAAhBIEVAAIAABBg");
	this.shape_14.setTransform(165.825,322.7);

	this.shape_15 = new cjs.Shape();
	this.shape_15.graphics.bf(img.metaltexturegrungerustspottedagedoldrusteddirtyoxygenated5, null, new cjs.Matrix2D(1,0,0,1,-95.8,-1595.8)).s().p("AiKAhIAAhBIEVAAIAABBg");
	this.shape_15.setTransform(79.525,371.85);

	this.shape_16 = new cjs.Shape();
	this.shape_16.graphics.bf(img.metaltexturegrungerustspottedagedoldrusteddirtyoxygenated5, null, new cjs.Matrix2D(1,0,0,1,-95.8,-1595.8)).s().p("AiKAhIAAhBIEVAAIAABBg");
	this.shape_16.setTransform(38.675,389.45);

	this.shape_17 = new cjs.Shape();
	this.shape_17.graphics.bf(img.metaltexturegrungerustspottedagedoldrusteddirtyoxygenated5, null, new cjs.Matrix2D(1,0,0,1,-95.8,-1595.8)).s().p("AiKAhIAAhBIEVAAIAABBg");
	this.shape_17.setTransform(38.675,302.05);

	this.shape_18 = new cjs.Shape();
	this.shape_18.graphics.bf(img.metaltexturegrungerustspottedagedoldrusteddirtyoxygenated5, null, new cjs.Matrix2D(1,0,0,1,-95.8,-1595.8)).s().p("AiKAhIAAhBIEVAAIAABBg");
	this.shape_18.setTransform(79.525,322.7);

	this.shape_19 = new cjs.Shape();
	this.shape_19.graphics.bf(img.metaltexturegrungerustspottedagedoldrusteddirtyoxygenated5, null, new cjs.Matrix2D(0.781,0,0,1,-74.7,-1591.7)).s().p("AhANgIAAnAIAAhCIAAsnIAAhCIAAlUICBAAIAAIjIAABCIAAGoIAABCIAAJwg");
	this.shape_19.setTransform(59.1,351.125);

	this.shape_20 = new cjs.Shape();
	this.shape_20.graphics.bf(img.metaltexturegrungerustspottedagedoldrusteddirtyoxygenated5, null, new cjs.Matrix2D(0.781,0,0,1,-74.7,-1591.7)).s().p("AhANgIAA6/ICBAAIAAFUIAABCIAAMnIAABCIAAHAg");
	this.shape_20.setTransform(18.25,351.125);

	this.shape_21 = new cjs.Shape();
	this.shape_21.graphics.bf(img.metaltexturegrungerustspottedagedoldrusteddirtyoxygenated5, null, new cjs.Matrix2D(0.781,0,0,1,-75.1,-1591.7)).s().p("AhANgIAAnAIAAhCIAAsnIAAhCIAAlUICBAAIAAa/g");
	this.shape_21.setTransform(142.65,351.125);

	this.shape_22 = new cjs.Shape();
	this.shape_22.graphics.bf(img.metaltexturegrungerustspottedagedoldrusteddirtyoxygenated5, null, new cjs.Matrix2D(0.781,0,0,1,-75.1,-1591.7)).s().p("AhANgIAAntIAAzSICBAAIAAFUIAABCIAAMnIAABCIAAHAg");
	this.shape_22.setTransform(101.8,351.125);

	this.shape_23 = new cjs.Shape();
	this.shape_23.graphics.bf(img.metaltexturegrungerustspottedagedoldrusteddirtyoxygenated5, null, new cjs.Matrix2D(1,0,0,1,-96.2,-1595.8)).s().p("AiKAhIAAhBIEVAAIAABBg");
	this.shape_23.setTransform(625.725,389.45);

	this.shape_24 = new cjs.Shape();
	this.shape_24.graphics.bf(img.metaltexturegrungerustspottedagedoldrusteddirtyoxygenated5, null, new cjs.Matrix2D(1,0,0,1,-96.2,-1595.8)).s().p("AiKAhIAAhBIEVAAIAABBg");
	this.shape_24.setTransform(583.025,371.85);

	this.shape_25 = new cjs.Shape();
	this.shape_25.graphics.bf(img.metaltexturegrungerustspottedagedoldrusteddirtyoxygenated5, null, new cjs.Matrix2D(1,0,0,1,-96.2,-1595.8)).s().p("AiKAhIAAhBIEVAAIAABBg");
	this.shape_25.setTransform(583.025,322.7);

	this.shape_26 = new cjs.Shape();
	this.shape_26.graphics.bf(img.metaltexturegrungerustspottedagedoldrusteddirtyoxygenated5, null, new cjs.Matrix2D(1,0,0,1,-96.2,-1595.8)).s().p("AiKAhIAAhBIEVAAIAABBg");
	this.shape_26.setTransform(625.725,302.05);

	this.shape_27 = new cjs.Shape();
	this.shape_27.graphics.bf(img.metaltexturegrungerustspottedagedoldrusteddirtyoxygenated5, null, new cjs.Matrix2D(1,0,0,1,-96.2,-1595.8)).s().p("AiKAhIAAhBIEVAAIAABBg");
	this.shape_27.setTransform(542.175,389.45);

	this.shape_28 = new cjs.Shape();
	this.shape_28.graphics.bf(img.metaltexturegrungerustspottedagedoldrusteddirtyoxygenated5, null, new cjs.Matrix2D(1,0,0,1,-96.2,-1595.8)).s().p("AiKAhIAAhBIEVAAIAABBg");
	this.shape_28.setTransform(501.325,371.85);

	this.shape_29 = new cjs.Shape();
	this.shape_29.graphics.bf(img.metaltexturegrungerustspottedagedoldrusteddirtyoxygenated5, null, new cjs.Matrix2D(1,0,0,1,-96.2,-1595.8)).s().p("AiKAhIAAhBIEVAAIAABBg");
	this.shape_29.setTransform(501.325,322.7);

	this.shape_30 = new cjs.Shape();
	this.shape_30.graphics.bf(img.metaltexturegrungerustspottedagedoldrusteddirtyoxygenated5, null, new cjs.Matrix2D(1,0,0,1,-96.2,-1595.8)).s().p("AiKAhIAAhBIEVAAIAABBg");
	this.shape_30.setTransform(542.175,302.05);

	this.shape_31 = new cjs.Shape();
	this.shape_31.graphics.bf(img.metaltexturegrungerustspottedagedoldrusteddirtyoxygenated5, null, new cjs.Matrix2D(0.781,0,0,1,-75.1,-1591.7)).s().p("AhANgIAApwIAAhCIAAmoIAAhCIAAojICBAAIAAFUIAABCIAAMnIAABCIAAHAg");
	this.shape_31.setTransform(521.75,351.125);

	this.shape_32 = new cjs.Shape();
	this.shape_32.graphics.bf(img.metaltexturegrungerustspottedagedoldrusteddirtyoxygenated5, null, new cjs.Matrix2D(0.781,0,0,1,-75.1,-1591.7)).s().p("AhANgIAAnAIAAhCIAAsnIAAhCIAAlUICBAAIAAIjIAABCIAAGoIAABCIAAJwg");
	this.shape_32.setTransform(562.6,351.125);

	this.shape_33 = new cjs.Shape();
	this.shape_33.graphics.bf(img.metaltexturegrungerustspottedagedoldrusteddirtyoxygenated5, null, new cjs.Matrix2D(0.781,0,0,1,-75.1,-1591.7)).s().p("AhANgIAA6/ICBAAIAAFUIAABCIAAMnIAABCIAAHAg");
	this.shape_33.setTransform(605.3,351.125);

	this.shape_34 = new cjs.Shape();
	this.shape_34.graphics.bf(img.metaltexturegrungerustspottedagedoldrusteddirtyoxygenated5, null, new cjs.Matrix2D(1,0,0,1,-96.2,-1595.8)).s().p("AhmAhIgkAAIAAhBIEVAAIAABBg");
	this.shape_34.setTransform(457.725,389.45);

	this.shape_35 = new cjs.Shape();
	this.shape_35.graphics.bf(img.metaltexturegrungerustspottedagedoldrusteddirtyoxygenated5, null, new cjs.Matrix2D(1,0,0,1,-96.2,-1595.8)).s().p("AiKAhIAAhBIEVAAIAABBg");
	this.shape_35.setTransform(457.725,302.05);

	this.shape_36 = new cjs.Shape();
	this.shape_36.graphics.bf(img.metaltexturegrungerustspottedagedoldrusteddirtyoxygenated5, null, new cjs.Matrix2D(1,0,0,1,-96.2,-1595.8)).s().p("AiKAhIAAhBIEVAAIAABBg");
	this.shape_36.setTransform(415.025,371.85);

	this.shape_37 = new cjs.Shape();
	this.shape_37.graphics.bf(img.metaltexturegrungerustspottedagedoldrusteddirtyoxygenated5, null, new cjs.Matrix2D(1,0,0,1,-96.2,-1595.8)).s().p("AiKAhIAAhBIEVAAIAABBg");
	this.shape_37.setTransform(374.175,389.45);

	this.shape_38 = new cjs.Shape();
	this.shape_38.graphics.bf(img.metaltexturegrungerustspottedagedoldrusteddirtyoxygenated5, null, new cjs.Matrix2D(1,0,0,1,-96.2,-1595.8)).s().p("AiKAhIAAhBIEVAAIAABBg");
	this.shape_38.setTransform(331.075,371.85);

	this.shape_39 = new cjs.Shape();
	this.shape_39.graphics.bf(img.metaltexturegrungerustspottedagedoldrusteddirtyoxygenated5, null, new cjs.Matrix2D(1,0,0,1,-96.2,-1595.8)).s().p("AiKAhIAAhBIEVAAIAABBg");
	this.shape_39.setTransform(331.075,322.7);

	this.shape_40 = new cjs.Shape();
	this.shape_40.graphics.bf(img.metaltexturegrungerustspottedagedoldrusteddirtyoxygenated5, null, new cjs.Matrix2D(1,0,0,1,-96.2,-1595.8)).s().p("AiKAhIAAhBIEVAAIAABBg");
	this.shape_40.setTransform(374.175,302.05);

	this.shape_41 = new cjs.Shape();
	this.shape_41.graphics.bf(img.metaltexturegrungerustspottedagedoldrusteddirtyoxygenated5, null, new cjs.Matrix2D(1,0,0,1,-96.2,-1595.8)).s().p("AiKAhIAAhBIEVAAIAABBg");
	this.shape_41.setTransform(415.025,322.7);

	this.shape_42 = new cjs.Shape();
	this.shape_42.graphics.bf(img.metaltexturegrungerustspottedagedoldrusteddirtyoxygenated5, null, new cjs.Matrix2D(0.781,0,0,1,-75.1,-1591.7)).s().p("AhANgIAAnAIAAhCIAAsnIAAhCIAAlUICBAAIAAIjIAABCIAAGoIAABCIAAJwg");
	this.shape_42.setTransform(394.6,351.125);

	this.shape_43 = new cjs.Shape();
	this.shape_43.graphics.bf(img.metaltexturegrungerustspottedagedoldrusteddirtyoxygenated5, null, new cjs.Matrix2D(0.781,0,0,1,-75.1,-1591.7)).s().p("AhANgIAA6/ICBAAIAAFUIAABCIAAMnIAABCIAAHAg");
	this.shape_43.setTransform(353.75,351.125);

	this.shape_44 = new cjs.Shape();
	this.shape_44.graphics.bf(img.metaltexturegrungerustspottedagedoldrusteddirtyoxygenated5, null, new cjs.Matrix2D(0.781,0,0,1,-75.1,-1591.7)).s().p("AhANgIAAnAIAAhCIAAsnIAAhCIAAlUICBAAIAAa/g");
	this.shape_44.setTransform(478.15,351.125);

	this.shape_45 = new cjs.Shape();
	this.shape_45.graphics.bf(img.metaltexturegrungerustspottedagedoldrusteddirtyoxygenated5, null, new cjs.Matrix2D(0.781,0,0,1,-75.1,-1591.7)).s().p("AhANgIAAntIAAzSICBAAIAAFUIAABCIAAMnIAABCIAAHAg");
	this.shape_45.setTransform(437.3,351.125);

	this.shape_46 = new cjs.Shape();
	this.shape_46.graphics.bf(img.metaltexturegrungerustspottedagedoldrusteddirtyoxygenated5, null, new cjs.Matrix2D(1,0,0,1,-96.2,-1595.8)).s().p("AiKAhIAAhBIEVAAIAABBg");
	this.shape_46.setTransform(916.525,371.85);

	this.shape_47 = new cjs.Shape();
	this.shape_47.graphics.bf(img.metaltexturegrungerustspottedagedoldrusteddirtyoxygenated5, null, new cjs.Matrix2D(1,0,0,1,-96.2,-1595.8)).s().p("AiKAhIAAhBIEVAAIAABBg");
	this.shape_47.setTransform(916.525,322.7);

	this.shape_48 = new cjs.Shape();
	this.shape_48.graphics.bf(img.metaltexturegrungerustspottedagedoldrusteddirtyoxygenated5, null, new cjs.Matrix2D(1,0,0,1,-96.2,-1595.8)).s().p("AiKAhIAAhBIEVAAIAABBg");
	this.shape_48.setTransform(875.675,389.45);

	this.shape_49 = new cjs.Shape();
	this.shape_49.graphics.bf(img.metaltexturegrungerustspottedagedoldrusteddirtyoxygenated5, null, new cjs.Matrix2D(1,0,0,1,-96.2,-1595.8)).s().p("AiKAhIAAhBIEVAAIAABBg");
	this.shape_49.setTransform(834.825,371.85);

	this.shape_50 = new cjs.Shape();
	this.shape_50.graphics.bf(img.metaltexturegrungerustspottedagedoldrusteddirtyoxygenated5, null, new cjs.Matrix2D(1,0,0,1,-96.2,-1595.8)).s().p("AiKAhIAAhBIEVAAIAABBg");
	this.shape_50.setTransform(834.825,322.7);

	this.shape_51 = new cjs.Shape();
	this.shape_51.graphics.bf(img.metaltexturegrungerustspottedagedoldrusteddirtyoxygenated5, null, new cjs.Matrix2D(1,0,0,1,-96.2,-1595.8)).s().p("AiKAhIAAhBIEVAAIAABBg");
	this.shape_51.setTransform(875.675,302.05);

	this.shape_52 = new cjs.Shape();
	this.shape_52.graphics.bf(img.metaltexturegrungerustspottedagedoldrusteddirtyoxygenated5, null, new cjs.Matrix2D(0.781,0,0,1,-75.1,-1591.7)).s().p("AhANgIAApwIAAhCIAAmoIAAhCIAAojICBAAIAAFUIAABCIAAMnIAABCIAAHAg");
	this.shape_52.setTransform(855.25,351.125);

	this.shape_53 = new cjs.Shape();
	this.shape_53.graphics.bf(img.metaltexturegrungerustspottedagedoldrusteddirtyoxygenated5, null, new cjs.Matrix2D(0.781,0,0,1,-75.1,-1591.7)).s().p("AhANgIAA6/ICBAAIAAFUIAABCIAAMnIAABCIAAHAg");
	this.shape_53.setTransform(938.8,351.125);

	this.shape_54 = new cjs.Shape();
	this.shape_54.graphics.bf(img.metaltexturegrungerustspottedagedoldrusteddirtyoxygenated5, null, new cjs.Matrix2D(0.781,0,0,1,-75.1,-1591.7)).s().p("AhANgIAAnAIAAhCIAAsnIAAhCIAAlUICBAAIAAIjIAABCIAAGoIAABCIAAJwg");
	this.shape_54.setTransform(896.1,351.125);

	this.shape_55 = new cjs.Shape();
	this.shape_55.graphics.bf(img.metaltexturegrungerustspottedagedoldrusteddirtyoxygenated5, null, new cjs.Matrix2D(1,0,0,1,-96.2,-1595.8)).s().p("AhmAhIgkAAIAAhBIEVAAIAABBg");
	this.shape_55.setTransform(791.225,389.45);

	this.shape_56 = new cjs.Shape();
	this.shape_56.graphics.bf(img.metaltexturegrungerustspottedagedoldrusteddirtyoxygenated5, null, new cjs.Matrix2D(1,0,0,1,-96.2,-1595.8)).s().p("AiKAhIAAhBIEVAAIAABBg");
	this.shape_56.setTransform(748.525,371.85);

	this.shape_57 = new cjs.Shape();
	this.shape_57.graphics.bf(img.metaltexturegrungerustspottedagedoldrusteddirtyoxygenated5, null, new cjs.Matrix2D(1,0,0,1,-96.2,-1595.8)).s().p("AiKAhIAAhBIEVAAIAABBg");
	this.shape_57.setTransform(748.525,322.7);

	this.shape_58 = new cjs.Shape();
	this.shape_58.graphics.bf(img.metaltexturegrungerustspottedagedoldrusteddirtyoxygenated5, null, new cjs.Matrix2D(1,0,0,1,-96.2,-1595.8)).s().p("AiKAhIAAhBIEVAAIAABBg");
	this.shape_58.setTransform(791.225,302.05);

	this.shape_59 = new cjs.Shape();
	this.shape_59.graphics.bf(img.metaltexturegrungerustspottedagedoldrusteddirtyoxygenated5, null, new cjs.Matrix2D(1,0,0,1,-96.2,-1595.8)).s().p("AiKAhIAAhBIEVAAIAABBg");
	this.shape_59.setTransform(707.675,389.45);

	this.shape_60 = new cjs.Shape();
	this.shape_60.graphics.bf(img.metaltexturegrungerustspottedagedoldrusteddirtyoxygenated5, null, new cjs.Matrix2D(1,0,0,1,-96.2,-1595.8)).s().p("AiKAhIAAhBIEVAAIAABBg");
	this.shape_60.setTransform(666.575,371.85);

	this.shape_61 = new cjs.Shape();
	this.shape_61.graphics.bf(img.metaltexturegrungerustspottedagedoldrusteddirtyoxygenated5, null, new cjs.Matrix2D(1,0,0,1,-96.2,-1595.8)).s().p("AiKAhIAAhBIEVAAIAABBg");
	this.shape_61.setTransform(666.575,322.7);

	this.shape_62 = new cjs.Shape();
	this.shape_62.graphics.bf(img.metaltexturegrungerustspottedagedoldrusteddirtyoxygenated5, null, new cjs.Matrix2D(1,0,0,1,-96.2,-1595.8)).s().p("AiKAhIAAhBIEVAAIAABBg");
	this.shape_62.setTransform(707.675,302.05);

	this.shape_63 = new cjs.Shape();
	this.shape_63.graphics.bf(img.metaltexturegrungerustspottedagedoldrusteddirtyoxygenated5, null, new cjs.Matrix2D(0.781,0,0,1,-75.1,-1591.7)).s().p("AhANgIAAnAIAAhCIAAsnIAAhCIAAlUICBAAIAAIjIAABCIAAGoIAABCIAAJwg");
	this.shape_63.setTransform(646.15,351.125);

	this.shape_64 = new cjs.Shape();
	this.shape_64.graphics.bf(img.metaltexturegrungerustspottedagedoldrusteddirtyoxygenated5, null, new cjs.Matrix2D(0.781,0,0,1,-75.1,-1591.7)).s().p("AhANgIAA6/ICBAAIAAFUIAABCIAAMnIAABCIAAHAg");
	this.shape_64.setTransform(687.25,351.125);

	this.shape_65 = new cjs.Shape();
	this.shape_65.graphics.bf(img.metaltexturegrungerustspottedagedoldrusteddirtyoxygenated5, null, new cjs.Matrix2D(0.781,0,0,1,-75.1,-1591.7)).s().p("AhANgIAAnAIAAhCIAAsnIAAhCIAAlUICBAAIAAa/g");
	this.shape_65.setTransform(811.65,351.125);

	this.shape_66 = new cjs.Shape();
	this.shape_66.graphics.bf(img.metaltexturegrungerustspottedagedoldrusteddirtyoxygenated5, null, new cjs.Matrix2D(0.781,0,0,1,-75.1,-1591.7)).s().p("AhANgIAAnAIAAhCIAAsnIAAhCIAAlUICBAAIAAIjIAABCIAAGoIAABCIAAJwg");
	this.shape_66.setTransform(728.1,351.125);

	this.shape_67 = new cjs.Shape();
	this.shape_67.graphics.bf(img.metaltexturegrungerustspottedagedoldrusteddirtyoxygenated5, null, new cjs.Matrix2D(0.781,0,0,1,-75.1,-1591.7)).s().p("AhANgIAAntIAAzSICBAAIAAFUIAABCIAAMnIAABCIAAHAg");
	this.shape_67.setTransform(770.8,351.125);

	this.shape_68 = new cjs.Shape();
	this.shape_68.graphics.bf(img.metaltexturegrungerustspottedagedoldrusteddirtyoxygenated5, null, new cjs.Matrix2D(1,0,0,1,-96.2,-1595.8)).s().p("AiKAhIAAhBIEVAAIAABBg");
	this.shape_68.setTransform(1252.025,371.85);

	this.shape_69 = new cjs.Shape();
	this.shape_69.graphics.bf(img.metaltexturegrungerustspottedagedoldrusteddirtyoxygenated5, null, new cjs.Matrix2D(1,0,0,1,-96.2,-1595.8)).s().p("AiKAhIAAhBIEVAAIAABBg");
	this.shape_69.setTransform(1252.025,322.7);

	this.shape_70 = new cjs.Shape();
	this.shape_70.graphics.bf(img.metaltexturegrungerustspottedagedoldrusteddirtyoxygenated5, null, new cjs.Matrix2D(1,0,0,1,-96.2,-1595.8)).s().p("AiKAhIAAhBIEVAAIAABBg");
	this.shape_70.setTransform(1211.175,389.45);

	this.shape_71 = new cjs.Shape();
	this.shape_71.graphics.bf(img.metaltexturegrungerustspottedagedoldrusteddirtyoxygenated5, null, new cjs.Matrix2D(1,0,0,1,-96.2,-1595.8)).s().p("AiKAhIAAhBIEVAAIAABBg");
	this.shape_71.setTransform(1170.325,371.85);

	this.shape_72 = new cjs.Shape();
	this.shape_72.graphics.bf(img.metaltexturegrungerustspottedagedoldrusteddirtyoxygenated5, null, new cjs.Matrix2D(1,0,0,1,-96.2,-1595.8)).s().p("AiKAhIAAhBIEVAAIAABBg");
	this.shape_72.setTransform(1170.325,322.7);

	this.shape_73 = new cjs.Shape();
	this.shape_73.graphics.bf(img.metaltexturegrungerustspottedagedoldrusteddirtyoxygenated5, null, new cjs.Matrix2D(1,0,0,1,-96.2,-1595.8)).s().p("AiKAhIAAhBIEVAAIAABBg");
	this.shape_73.setTransform(1211.175,302.05);

	this.shape_74 = new cjs.Shape();
	this.shape_74.graphics.bf(img.metaltexturegrungerustspottedagedoldrusteddirtyoxygenated5, null, new cjs.Matrix2D(0.781,0,0,1,-75.1,-1591.7)).s().p("AhANgIAApwIAAhCIAAmoIAAhCIAAojICBAAIAAFUIAABCIAAMnIAABCIAAHAg");
	this.shape_74.setTransform(1190.75,351.125);

	this.shape_75 = new cjs.Shape();
	this.shape_75.graphics.bf(img.metaltexturegrungerustspottedagedoldrusteddirtyoxygenated5, null, new cjs.Matrix2D(0.781,0,0,1,-75.1,-1591.7)).s().p("AhANgIAAnAIAAhCIAAsnIAAhCIAAlUICBAAIAAa/g");
	this.shape_75.setTransform(1147.15,351.125);

	this.shape_76 = new cjs.Shape();
	this.shape_76.graphics.bf(img.metaltexturegrungerustspottedagedoldrusteddirtyoxygenated5, null, new cjs.Matrix2D(0.781,0,0,1,-75.1,-1591.7)).s().p("AhANgIAA6/ICBAAIAAFUIAABCIAAMnIAABCIAAHAg");
	this.shape_76.setTransform(1274.3,351.125);

	this.shape_77 = new cjs.Shape();
	this.shape_77.graphics.bf(img.metaltexturegrungerustspottedagedoldrusteddirtyoxygenated5, null, new cjs.Matrix2D(0.781,0,0,1,-75.1,-1591.7)).s().p("AhANgIAAnAIAAhCIAAsnIAAhCIAAlUICBAAIAAIjIAABCIAAGoIAABCIAAJwg");
	this.shape_77.setTransform(1231.6,351.125);

	this.shape_78 = new cjs.Shape();
	this.shape_78.graphics.bf(img.metaltexturegrungerustspottedagedoldrusteddirtyoxygenated5, null, new cjs.Matrix2D(1,0,0,1,-96.2,-1595.8)).s().p("AhmAhIgkAAIAAhBIEVAAIAABBg");
	this.shape_78.setTransform(1126.725,389.45);

	this.shape_79 = new cjs.Shape();
	this.shape_79.graphics.bf(img.metaltexturegrungerustspottedagedoldrusteddirtyoxygenated5, null, new cjs.Matrix2D(1,0,0,1,-96.2,-1595.8)).s().p("AiKAhIAAhBIEVAAIAABBg");
	this.shape_79.setTransform(1084.025,371.85);

	this.shape_80 = new cjs.Shape();
	this.shape_80.graphics.bf(img.metaltexturegrungerustspottedagedoldrusteddirtyoxygenated5, null, new cjs.Matrix2D(1,0,0,1,-96.2,-1595.8)).s().p("AiKAhIAAhBIEVAAIAABBg");
	this.shape_80.setTransform(1126.725,302.05);

	this.shape_81 = new cjs.Shape();
	this.shape_81.graphics.bf(img.metaltexturegrungerustspottedagedoldrusteddirtyoxygenated5, null, new cjs.Matrix2D(1,0,0,1,-96.2,-1595.8)).s().p("AiKAhIAAhBIEVAAIAABBg");
	this.shape_81.setTransform(1084.025,322.7);

	this.shape_82 = new cjs.Shape();
	this.shape_82.graphics.bf(img.metaltexturegrungerustspottedagedoldrusteddirtyoxygenated5, null, new cjs.Matrix2D(1,0,0,1,-96.2,-1595.8)).s().p("AiKAhIAAhBIEVAAIAABBg");
	this.shape_82.setTransform(1043.175,389.45);

	this.shape_83 = new cjs.Shape();
	this.shape_83.graphics.bf(img.metaltexturegrungerustspottedagedoldrusteddirtyoxygenated5, null, new cjs.Matrix2D(1,0,0,1,-96.2,-1595.8)).s().p("AiKAhIAAhBIEVAAIAABBg");
	this.shape_83.setTransform(959.225,389.45);

	this.shape_84 = new cjs.Shape();
	this.shape_84.graphics.bf(img.metaltexturegrungerustspottedagedoldrusteddirtyoxygenated5, null, new cjs.Matrix2D(1,0,0,1,-96.2,-1595.8)).s().p("AiKAhIAAhBIEVAAIAABBg");
	this.shape_84.setTransform(1000.075,371.85);

	this.shape_85 = new cjs.Shape();
	this.shape_85.graphics.bf(img.metaltexturegrungerustspottedagedoldrusteddirtyoxygenated5, null, new cjs.Matrix2D(1,0,0,1,-96.2,-1595.8)).s().p("AiKAhIAAhBIEVAAIAABBg");
	this.shape_85.setTransform(959.225,302.05);

	this.shape_86 = new cjs.Shape();
	this.shape_86.graphics.bf(img.metaltexturegrungerustspottedagedoldrusteddirtyoxygenated5, null, new cjs.Matrix2D(1,0,0,1,-96.2,-1595.8)).s().p("AiKAhIAAhBIEVAAIAABBg");
	this.shape_86.setTransform(1043.175,302.05);

	this.shape_87 = new cjs.Shape();
	this.shape_87.graphics.bf(img.metaltexturegrungerustspottedagedoldrusteddirtyoxygenated5, null, new cjs.Matrix2D(1,0,0,1,-96.2,-1595.8)).s().p("AiKAhIAAhBIEVAAIAABBg");
	this.shape_87.setTransform(1000.075,322.7);

	this.shape_88 = new cjs.Shape();
	this.shape_88.graphics.bf(img.metaltexturegrungerustspottedagedoldrusteddirtyoxygenated5, null, new cjs.Matrix2D(0.781,0,0,1,-75.1,-1591.7)).s().p("AhANgIAA6/ICBAAIAAFUIAABCIAAMnIAABCIAAHAg");
	this.shape_88.setTransform(1022.75,351.125);

	this.shape_89 = new cjs.Shape();
	this.shape_89.graphics.bf(img.metaltexturegrungerustspottedagedoldrusteddirtyoxygenated5, null, new cjs.Matrix2D(0.781,0,0,1,-75.1,-1591.7)).s().p("AhANgIAAnAIAAhCIAAsnIAAhCIAAlUICBAAIAAIjIAABCIAAGoIAABCIAAJwg");
	this.shape_89.setTransform(979.65,351.125);

	this.shape_90 = new cjs.Shape();
	this.shape_90.graphics.bf(img.metaltexturegrungerustspottedagedoldrusteddirtyoxygenated5, null, new cjs.Matrix2D(0.781,0,0,1,-75.1,-1591.7)).s().p("AhANgIAAntIAAzSICBAAIAAFUIAABCIAAMnIAABCIAAHAg");
	this.shape_90.setTransform(1106.3,351.125);

	this.shape_91 = new cjs.Shape();
	this.shape_91.graphics.bf(img.metaltexturegrungerustspottedagedoldrusteddirtyoxygenated5, null, new cjs.Matrix2D(0.781,0,0,1,-75.1,-1591.7)).s().p("AhANgIAAnAIAAhCIAAsnIAAhCIAAlUICBAAIAAIjIAABCIAAGoIAABCIAAJwg");
	this.shape_91.setTransform(1063.6,351.125);

	this.shape_92 = new cjs.Shape();
	this.shape_92.graphics.bf(img.metaltexturegrungerustspottedagedoldrusteddirtyoxygenated5, null, new cjs.Matrix2D(1,0,0,1,-96.2,-1595.8)).s().p("AiKAhIAAhBIEVAAIAABBg");
	this.shape_92.setTransform(1585.275,370);

	this.shape_93 = new cjs.Shape();
	this.shape_93.graphics.bf(img.metaltexturegrungerustspottedagedoldrusteddirtyoxygenated5, null, new cjs.Matrix2D(1,0,0,1,-96.2,-1595.8)).s().p("AiKAhIAAhBIEVAAIAABBg");
	this.shape_93.setTransform(1585.275,320.85);

	this.shape_94 = new cjs.Shape();
	this.shape_94.graphics.bf(img.metaltexturegrungerustspottedagedoldrusteddirtyoxygenated5, null, new cjs.Matrix2D(1,0,0,1,-96.2,-1595.8)).s().p("AiKAhIAAhBIEVAAIAABBg");
	this.shape_94.setTransform(1544.425,387.6);

	this.shape_95 = new cjs.Shape();
	this.shape_95.graphics.bf(img.metaltexturegrungerustspottedagedoldrusteddirtyoxygenated5, null, new cjs.Matrix2D(1,0,0,1,-96.2,-1595.8)).s().p("AiKAhIAAhBIEVAAIAABBg");
	this.shape_95.setTransform(1503.575,370);

	this.shape_96 = new cjs.Shape();
	this.shape_96.graphics.bf(img.metaltexturegrungerustspottedagedoldrusteddirtyoxygenated5, null, new cjs.Matrix2D(1,0,0,1,-96.2,-1595.8)).s().p("AiKAhIAAhBIEVAAIAABBg");
	this.shape_96.setTransform(1503.575,320.85);

	this.shape_97 = new cjs.Shape();
	this.shape_97.graphics.bf(img.metaltexturegrungerustspottedagedoldrusteddirtyoxygenated5, null, new cjs.Matrix2D(0.781,0,0,1,-75.1,-1593.5)).s().p("AhANgIAAqCIAAhCIAAmpIAAhCIAAoQICBAAIAAFCIAABCIAAMnIAABCIAAHSg");
	this.shape_97.setTransform(1524,351.125);

	this.shape_98 = new cjs.Shape();
	this.shape_98.graphics.bf(img.metaltexturegrungerustspottedagedoldrusteddirtyoxygenated5, null, new cjs.Matrix2D(0.781,0,0,1,-75.1,-1593.5)).s().p("AhANgIAAnSIAAhCIAAsnIAAhCIAAlCICBAAIAAa/g");
	this.shape_98.setTransform(1480.4,351.125);

	this.shape_99 = new cjs.Shape();
	this.shape_99.graphics.bf(img.metaltexturegrungerustspottedagedoldrusteddirtyoxygenated5, null, new cjs.Matrix2D(0.781,0,0,1,-75.1,-1593.5)).s().p("AhANgIAA6/ICBAAIAAFCIAABCIAAMnIAABCIAAHSg");
	this.shape_99.setTransform(1607.55,351.125);

	this.shape_100 = new cjs.Shape();
	this.shape_100.graphics.bf(img.metaltexturegrungerustspottedagedoldrusteddirtyoxygenated5, null, new cjs.Matrix2D(1,0,0,1,-96.2,-1595.8)).s().p("AiKAhIAAhBIEVAAIAABBg");
	this.shape_100.setTransform(1544.425,300.2);

	this.shape_101 = new cjs.Shape();
	this.shape_101.graphics.bf(img.metaltexturegrungerustspottedagedoldrusteddirtyoxygenated5, null, new cjs.Matrix2D(0.781,0,0,1,-75.1,-1593.5)).s().p("AhANgIAAnSIAAhCIAAsnIAAhCIAAlCICBAAIAAIQIAABCIAAGpIAABCIAAKCg");
	this.shape_101.setTransform(1564.85,351.125);

	this.shape_102 = new cjs.Shape();
	this.shape_102.graphics.bf(img.metaltexturegrungerustspottedagedoldrusteddirtyoxygenated5, null, new cjs.Matrix2D(1,0,0,1,-96.2,-1595.8)).s().p("AhmAhIgkAAIAAhBIEVAAIAABBg");
	this.shape_102.setTransform(1459.975,387.6);

	this.shape_103 = new cjs.Shape();
	this.shape_103.graphics.bf(img.metaltexturegrungerustspottedagedoldrusteddirtyoxygenated5, null, new cjs.Matrix2D(1,0,0,1,-96.2,-1595.8)).s().p("AiKAhIAAhBIEVAAIAABBg");
	this.shape_103.setTransform(1417.275,370);

	this.shape_104 = new cjs.Shape();
	this.shape_104.graphics.bf(img.metaltexturegrungerustspottedagedoldrusteddirtyoxygenated5, null, new cjs.Matrix2D(1,0,0,1,-96.2,-1595.8)).s().p("AiKAhIAAhBIEVAAIAABBg");
	this.shape_104.setTransform(1417.275,320.85);

	this.shape_105 = new cjs.Shape();
	this.shape_105.graphics.bf(img.metaltexturegrungerustspottedagedoldrusteddirtyoxygenated5, null, new cjs.Matrix2D(1,0,0,1,-96.2,-1595.8)).s().p("AiKAhIAAhBIEVAAIAABBg");
	this.shape_105.setTransform(1376.425,387.6);

	this.shape_106 = new cjs.Shape();
	this.shape_106.graphics.bf(img.metaltexturegrungerustspottedagedoldrusteddirtyoxygenated5, null, new cjs.Matrix2D(1,0,0,1,-96.2,-1595.8)).s().p("AiKAhIAAhBIEVAAIAABBg");
	this.shape_106.setTransform(1294.725,389.45);

	this.shape_107 = new cjs.Shape();
	this.shape_107.graphics.bf(img.metaltexturegrungerustspottedagedoldrusteddirtyoxygenated5, null, new cjs.Matrix2D(1,0,0,1,-96.2,-1595.8)).s().p("AiKAhIAAhBIEVAAIAABBg");
	this.shape_107.setTransform(1335.575,372.75);

	this.shape_108 = new cjs.Shape();
	this.shape_108.graphics.bf(img.metaltexturegrungerustspottedagedoldrusteddirtyoxygenated5, null, new cjs.Matrix2D(1,0,0,1,-96.2,-1595.8)).s().p("AiKAhIAAhBIEVAAIAABBg");
	this.shape_108.setTransform(1294.725,302.05);

	this.shape_109 = new cjs.Shape();
	this.shape_109.graphics.bf(img.metaltexturegrungerustspottedagedoldrusteddirtyoxygenated5, null, new cjs.Matrix2D(1,0,0,1,-96.2,-1595.8)).s().p("AiKAhIAAhBIEVAAIAABBg");
	this.shape_109.setTransform(1335.575,323.6);

	this.shape_110 = new cjs.Shape();
	this.shape_110.graphics.bf(img.metaltexturegrungerustspottedagedoldrusteddirtyoxygenated5, null, new cjs.Matrix2D(0.781,0,0,1,-75.1,-1593.5)).s().p("AhANgIAApnIAAhCIAAmoIAAhCIAAosICBAAIAAFCIAABCIAAMnIAABCIAAHSg");
	this.shape_110.setTransform(1356,351.125);

	this.shape_111 = new cjs.Shape();
	this.shape_111.graphics.bf(img.metaltexturegrungerustspottedagedoldrusteddirtyoxygenated5, null, new cjs.Matrix2D(0.781,0,0,1,-75.1,-1591.7)).s().p("AhANgIAAnAIAAhCIAAsnIAAhCIAAlUICBAAIAAIsIAABCIAAGoIAABCIAAJng");
	this.shape_111.setTransform(1315.15,351.125);

	this.shape_112 = new cjs.Shape();
	this.shape_112.graphics.bf(img.metaltexturegrungerustspottedagedoldrusteddirtyoxygenated5, null, new cjs.Matrix2D(1,0,0,1,-96.2,-1595.8)).s().p("AiKAhIAAhBIEVAAIAABBg");
	this.shape_112.setTransform(1459.975,300.2);

	this.shape_113 = new cjs.Shape();
	this.shape_113.graphics.bf(img.metaltexturegrungerustspottedagedoldrusteddirtyoxygenated5, null, new cjs.Matrix2D(0.781,0,0,1,-75.1,-1593.5)).s().p("AhANgIAAoAIAAy/ICBAAIAAFCIAABCIAAMnIAABCIAAHSg");
	this.shape_113.setTransform(1439.55,351.125);

	this.shape_114 = new cjs.Shape();
	this.shape_114.graphics.bf(img.metaltexturegrungerustspottedagedoldrusteddirtyoxygenated5, null, new cjs.Matrix2D(1,0,0,1,-96.2,-1595.8)).s().p("AiKAhIAAhBIEVAAIAABBg");
	this.shape_114.setTransform(1376.425,300.2);

	this.shape_115 = new cjs.Shape();
	this.shape_115.graphics.bf(img.metaltexturegrungerustspottedagedoldrusteddirtyoxygenated5, null, new cjs.Matrix2D(0.781,0,0,1,-75.1,-1593.5)).s().p("AhANgIAAnSIAAhCIAAsnIAAhCIAAlCICBAAIAAIQIAABCIAAGpIAABCIAAKCg");
	this.shape_115.setTransform(1396.85,351.125);

	this.shape_116 = new cjs.Shape();
	this.shape_116.graphics.bf(img.metaltexturegrungerustspottedagedoldrusteddirtyoxygenated5, null, new cjs.Matrix2D(1,0,0,1,-96,-1595.8)).s().p("AiKAhIAAhBIEVAAIAABBg");
	this.shape_116.setTransform(1920.575,370);

	this.shape_117 = new cjs.Shape();
	this.shape_117.graphics.bf(img.metaltexturegrungerustspottedagedoldrusteddirtyoxygenated5, null, new cjs.Matrix2D(1,0,0,1,-96,-1595.8)).s().p("AiKAhIAAhBIEVAAIAABBg");
	this.shape_117.setTransform(1879.725,387.6);

	this.shape_118 = new cjs.Shape();
	this.shape_118.graphics.bf(img.metaltexturegrungerustspottedagedoldrusteddirtyoxygenated5, null, new cjs.Matrix2D(1,0,0,1,-96,-1595.8)).s().p("AiKAhIAAhBIEVAAIAABBg");
	this.shape_118.setTransform(1920.575,320.85);

	this.shape_119 = new cjs.Shape();
	this.shape_119.graphics.bf(img.metaltexturegrungerustspottedagedoldrusteddirtyoxygenated5, null, new cjs.Matrix2D(1,0,0,1,-96,-1595.8)).s().p("AiKAhIAAhBIEVAAIAABBg");
	this.shape_119.setTransform(1838.875,370);

	this.shape_120 = new cjs.Shape();
	this.shape_120.graphics.bf(img.metaltexturegrungerustspottedagedoldrusteddirtyoxygenated5, null, new cjs.Matrix2D(1,0,0,1,-96,-1595.8)).s().p("AiKAhIAAhBIEVAAIAABBg");
	this.shape_120.setTransform(1838.875,320.85);

	this.shape_121 = new cjs.Shape();
	this.shape_121.graphics.bf(img.metaltexturegrungerustspottedagedoldrusteddirtyoxygenated5, null, new cjs.Matrix2D(0.781,0,0,1,-74.9,-1593.5)).s().p("AhANgIAAnSIAAhCIAAsnIAAhCIAAlCICBAAIAAa/g");
	this.shape_121.setTransform(1815.7,351.125);

	this.shape_122 = new cjs.Shape();
	this.shape_122.graphics.bf(img.metaltexturegrungerustspottedagedoldrusteddirtyoxygenated5, null, new cjs.Matrix2D(1,0,0,1,-96,-1595.8)).s().p("AiKAhIAAhBIEVAAIAABBg");
	this.shape_122.setTransform(1879.725,300.2);

	this.shape_123 = new cjs.Shape();
	this.shape_123.graphics.bf(img.metaltexturegrungerustspottedagedoldrusteddirtyoxygenated5, null, new cjs.Matrix2D(0.781,0,0,1,-74.9,-1593.5)).s().p("AhANgIAAqCIAAhCIAAmpIAAhCIAAoQICBAAIAAFCIAABCIAAMnIAABCIAAHSg");
	this.shape_123.setTransform(1859.3,351.125);

	this.shape_124 = new cjs.Shape();
	this.shape_124.graphics.bf(img.metaltexturegrungerustspottedagedoldrusteddirtyoxygenated5, null, new cjs.Matrix2D(0.781,0,0,1,-74.9,-1593.5)).s().p("AhANgIAAnSIAAhCIAAsnIAAhCIAAlCICBAAIAAIQIAABCIAAGpIAABCIAAKCg");
	this.shape_124.setTransform(1900.15,351.125);

	this.shape_125 = new cjs.Shape();
	this.shape_125.graphics.bf(img.metaltexturegrungerustspottedagedoldrusteddirtyoxygenated5, null, new cjs.Matrix2D(1,0,0,1,-96,-1595.8)).s().p("AhmAhIgkAAIAAhBIEVAAIAABBg");
	this.shape_125.setTransform(1795.275,387.6);

	this.shape_126 = new cjs.Shape();
	this.shape_126.graphics.bf(img.metaltexturegrungerustspottedagedoldrusteddirtyoxygenated5, null, new cjs.Matrix2D(1,0,0,1,-96,-1595.8)).s().p("AiKAhIAAhBIEVAAIAABBg");
	this.shape_126.setTransform(1752.575,370);

	this.shape_127 = new cjs.Shape();
	this.shape_127.graphics.bf(img.metaltexturegrungerustspottedagedoldrusteddirtyoxygenated5, null, new cjs.Matrix2D(1,0,0,1,-96,-1595.8)).s().p("AiKAhIAAhBIEVAAIAABBg");
	this.shape_127.setTransform(1752.575,320.85);

	this.shape_128 = new cjs.Shape();
	this.shape_128.graphics.bf(img.metaltexturegrungerustspottedagedoldrusteddirtyoxygenated5, null, new cjs.Matrix2D(1,0,0,1,-96,-1595.8)).s().p("AiKAhIAAhBIEVAAIAABBg");
	this.shape_128.setTransform(1711.725,387.6);

	this.shape_129 = new cjs.Shape();
	this.shape_129.graphics.bf(img.metaltexturegrungerustspottedagedoldrusteddirtyoxygenated5, null, new cjs.Matrix2D(1,0,0,1,-96.1,-1595.8)).s().p("AiJAhIAAhBIETAAIAABBg");
	this.shape_129.setTransform(1627.875,387.6);

	this.shape_130 = new cjs.Shape();
	this.shape_130.graphics.bf(img.metaltexturegrungerustspottedagedoldrusteddirtyoxygenated5, null, new cjs.Matrix2D(1,0,0,1,-96,-1595.8)).s().p("AiKAhIAAhBIEVAAIAABBg");
	this.shape_130.setTransform(1668.625,370);

	this.shape_131 = new cjs.Shape();
	this.shape_131.graphics.bf(img.metaltexturegrungerustspottedagedoldrusteddirtyoxygenated5, null, new cjs.Matrix2D(1,0,0,1,-96,-1595.8)).s().p("AiKAhIAAhBIEVAAIAABBg");
	this.shape_131.setTransform(1668.625,320.85);

	this.shape_132 = new cjs.Shape();
	this.shape_132.graphics.bf(img.metaltexturegrungerustspottedagedoldrusteddirtyoxygenated5, null, new cjs.Matrix2D(0.781,0,0,1,-74.9,-1593.5)).s().p("AhANgIAA6/ICBAAIAAFCIAABCIAAMnIAABCIAAHSg");
	this.shape_132.setTransform(1691.3,351.125);

	this.shape_133 = new cjs.Shape();
	this.shape_133.graphics.bf(img.metaltexturegrungerustspottedagedoldrusteddirtyoxygenated5, null, new cjs.Matrix2D(1,0,0,1,-96.1,-1595.8)).s().p("AiJAhIAAhBIETAAIAABBg");
	this.shape_133.setTransform(1627.875,300.2);

	this.shape_134 = new cjs.Shape();
	this.shape_134.graphics.bf(img.metaltexturegrungerustspottedagedoldrusteddirtyoxygenated5, null, new cjs.Matrix2D(0.781,0,0,1,-74.9,-1593.5)).s().p("AhANgIAAnSIAAhCIAAsnIAAhCIAAlCICBAAIAAIQIAABCIAAGpIAABCIAAKCg");
	this.shape_134.setTransform(1648.2,351.125);

	this.shape_135 = new cjs.Shape();
	this.shape_135.graphics.bf(img.metaltexturegrungerustspottedagedoldrusteddirtyoxygenated5, null, new cjs.Matrix2D(1,0,0,1,-96,-1595.8)).s().p("AiKAhIAAhBIEVAAIAABBg");
	this.shape_135.setTransform(1795.275,300.2);

	this.shape_136 = new cjs.Shape();
	this.shape_136.graphics.bf(img.metaltexturegrungerustspottedagedoldrusteddirtyoxygenated5, null, new cjs.Matrix2D(0.781,0,0,1,-74.9,-1593.5)).s().p("AhANgIAAoAIAAy/ICBAAIAAFCIAABCIAAMnIAABCIAAHSg");
	this.shape_136.setTransform(1774.85,351.125);

	this.shape_137 = new cjs.Shape();
	this.shape_137.graphics.bf(img.metaltexturegrungerustspottedagedoldrusteddirtyoxygenated5, null, new cjs.Matrix2D(1,0,0,1,-96,-1595.8)).s().p("AiKAhIAAhBIEVAAIAABBg");
	this.shape_137.setTransform(1711.725,300.2);

	this.shape_138 = new cjs.Shape();
	this.shape_138.graphics.bf(img.metaltexturegrungerustspottedagedoldrusteddirtyoxygenated5, null, new cjs.Matrix2D(0.781,0,0,1,-74.9,-1593.5)).s().p("AhANgIAAnSIAAhCIAAsnIAAhCIAAlCICBAAIAAIQIAABCIAAGpIAABCIAAKCg");
	this.shape_138.setTransform(1732.15,351.125);

	this.shape_139 = new cjs.Shape();
	this.shape_139.graphics.bf(img.metaltexturegrungerustspottedagedoldrusteddirtyoxygenated5, null, new cjs.Matrix2D(1,0,0,1,-96,-1595.8)).s().p("AiKAhIAAhBIEVAAIAABBg");
	this.shape_139.setTransform(2213.225,387.6);

	this.shape_140 = new cjs.Shape();
	this.shape_140.graphics.bf(img.metaltexturegrungerustspottedagedoldrusteddirtyoxygenated5, null, new cjs.Matrix2D(1,0,0,1,-96,-1595.8)).s().p("AiKAhIAAhBIEVAAIAABBg");
	this.shape_140.setTransform(2172.375,370);

	this.shape_141 = new cjs.Shape();
	this.shape_141.graphics.bf(img.metaltexturegrungerustspottedagedoldrusteddirtyoxygenated5, null, new cjs.Matrix2D(1,0,0,1,-96,-1595.8)).s().p("AhmAhIgkAAIAAhBIEVAAIAABBg");
	this.shape_141.setTransform(2128.775,387.6);

	this.shape_142 = new cjs.Shape();
	this.shape_142.graphics.bf(img.metaltexturegrungerustspottedagedoldrusteddirtyoxygenated5, null, new cjs.Matrix2D(1,0,0,1,-96,-1595.8)).s().p("AiKAhIAAhBIEVAAIAABBg");
	this.shape_142.setTransform(2172.375,320.85);

	this.shape_143 = new cjs.Shape();
	this.shape_143.graphics.bf(img.metaltexturegrungerustspottedagedoldrusteddirtyoxygenated5, null, new cjs.Matrix2D(1,0,0,1,-96,-1595.8)).s().p("AiKAhIAAhBIEVAAIAABBg");
	this.shape_143.setTransform(2128.775,300.2);

	this.shape_144 = new cjs.Shape();
	this.shape_144.graphics.bf(img.metaltexturegrungerustspottedagedoldrusteddirtyoxygenated5, null, new cjs.Matrix2D(0.781,0,0,1,-74.9,-1593.5)).s().p("AhANgIAAnSIAAhCIAAsnIAAhCIAAlCICBAAIAAa/g");
	this.shape_144.setTransform(2149.2,351.125);

	this.shape_145 = new cjs.Shape();
	this.shape_145.graphics.bf(img.metaltexturegrungerustspottedagedoldrusteddirtyoxygenated5, null, new cjs.Matrix2D(1,0,0,1,-96,-1595.8)).s().p("AiKAhIAAhBIEVAAIAABBg");
	this.shape_145.setTransform(2213.225,300.2);

	this.shape_146 = new cjs.Shape();
	this.shape_146.graphics.bf(img.metaltexturegrungerustspottedagedoldrusteddirtyoxygenated5, null, new cjs.Matrix2D(0.781,0,0,1,-74.9,-1593.5)).s().p("AhANgIAAqCIAAhCIAAmpIAAhCIAAoQICBAAIAAFCIAABCIAAMnIAABCIAAHSg");
	this.shape_146.setTransform(2192.8,351.125);

	this.shape_147 = new cjs.Shape();
	this.shape_147.graphics.bf(img.metaltexturegrungerustspottedagedoldrusteddirtyoxygenated5, null, new cjs.Matrix2D(0.781,0,0,1,-74.9,-1593.5)).s().p("AhANgIAAnSIAAhCIAAsnIAAhCIAAlCICBAAIAAIQIAABCIAAGpIAABCIAAKCg");
	this.shape_147.setTransform(2233.65,351.125);

	this.shape_148 = new cjs.Shape();
	this.shape_148.graphics.bf(img.metaltexturegrungerustspottedagedoldrusteddirtyoxygenated5, null, new cjs.Matrix2D(1,0,0,1,-96,-1595.8)).s().p("AiKAhIAAhBIEVAAIAABBg");
	this.shape_148.setTransform(2086.075,370);

	this.shape_149 = new cjs.Shape();
	this.shape_149.graphics.bf(img.metaltexturegrungerustspottedagedoldrusteddirtyoxygenated5, null, new cjs.Matrix2D(1,0,0,1,-96,-1595.8)).s().p("AiKAhIAAhBIEVAAIAABBg");
	this.shape_149.setTransform(2045.225,387.6);

	this.shape_150 = new cjs.Shape();
	this.shape_150.graphics.bf(img.metaltexturegrungerustspottedagedoldrusteddirtyoxygenated5, null, new cjs.Matrix2D(1,0,0,1,-96,-1595.8)).s().p("AiKAhIAAhBIEVAAIAABBg");
	this.shape_150.setTransform(2086.075,320.85);

	this.shape_151 = new cjs.Shape();
	this.shape_151.graphics.bf(img.metaltexturegrungerustspottedagedoldrusteddirtyoxygenated5, null, new cjs.Matrix2D(1,0,0,1,-96,-1595.8)).s().p("AiKAhIAAhBIEVAAIAABBg");
	this.shape_151.setTransform(2004.125,370);

	this.shape_152 = new cjs.Shape();
	this.shape_152.graphics.bf(img.metaltexturegrungerustspottedagedoldrusteddirtyoxygenated5, null, new cjs.Matrix2D(1,0,0,1,-96,-1595.8)).s().p("AiKAhIAAhBIEVAAIAABBg");
	this.shape_152.setTransform(1963.275,387.6);

	this.shape_153 = new cjs.Shape();
	this.shape_153.graphics.bf(img.metaltexturegrungerustspottedagedoldrusteddirtyoxygenated5, null, new cjs.Matrix2D(1,0,0,1,-96,-1595.8)).s().p("AiKAhIAAhBIEVAAIAABBg");
	this.shape_153.setTransform(2004.125,320.85);

	this.shape_154 = new cjs.Shape();
	this.shape_154.graphics.bf(img.metaltexturegrungerustspottedagedoldrusteddirtyoxygenated5, null, new cjs.Matrix2D(1,0,0,1,-96,-1595.8)).s().p("AiKAhIAAhBIEVAAIAABBg");
	this.shape_154.setTransform(1963.275,300.2);

	this.shape_155 = new cjs.Shape();
	this.shape_155.graphics.bf(img.metaltexturegrungerustspottedagedoldrusteddirtyoxygenated5, null, new cjs.Matrix2D(0.781,0,0,1,-74.9,-1593.5)).s().p("AhANgIAA6/ICBAAIAAFCIAABCIAAMnIAABCIAAHSg");
	this.shape_155.setTransform(1942.85,351.125);

	this.shape_156 = new cjs.Shape();
	this.shape_156.graphics.bf(img.metaltexturegrungerustspottedagedoldrusteddirtyoxygenated5, null, new cjs.Matrix2D(0.781,0,0,1,-74.9,-1593.5)).s().p("AhANgIAAnSIAAhCIAAsnIAAhCIAAlCICBAAIAAIQIAABCIAAGpIAABCIAAKCg");
	this.shape_156.setTransform(1983.7,351.125);

	this.shape_157 = new cjs.Shape();
	this.shape_157.graphics.bf(img.metaltexturegrungerustspottedagedoldrusteddirtyoxygenated5, null, new cjs.Matrix2D(0.781,0,0,1,-74.9,-1593.5)).s().p("AhANgIAAoAIAAy/ICBAAIAAFCIAABCIAAMnIAABCIAAHSg");
	this.shape_157.setTransform(2108.35,351.125);

	this.shape_158 = new cjs.Shape();
	this.shape_158.graphics.bf(img.metaltexturegrungerustspottedagedoldrusteddirtyoxygenated5, null, new cjs.Matrix2D(1,0,0,1,-96,-1595.8)).s().p("AiKAhIAAhBIEVAAIAABBg");
	this.shape_158.setTransform(2045.225,300.2);

	this.shape_159 = new cjs.Shape();
	this.shape_159.graphics.bf(img.metaltexturegrungerustspottedagedoldrusteddirtyoxygenated5, null, new cjs.Matrix2D(0.781,0,0,1,-74.9,-1593.5)).s().p("AhANgIAA6/ICBAAIAAFCIAABCIAAMnIAABCIAAHSg");
	this.shape_159.setTransform(2024.8,351.125);

	this.shape_160 = new cjs.Shape();
	this.shape_160.graphics.bf(img.metaltexturegrungerustspottedagedoldrusteddirtyoxygenated5, null, new cjs.Matrix2D(0.781,0,0,1,-74.9,-1593.5)).s().p("AhANgIAAnSIAAhCIAAsnIAAhCIAAlCICBAAIAAIQIAABCIAAGpIAABCIAAKCg");
	this.shape_160.setTransform(2065.65,351.125);

	this.shape_161 = new cjs.Shape();
	this.shape_161.graphics.bf(img.metaltexturegrungerustspottedagedoldrusteddirtyoxygenated5, null, new cjs.Matrix2D(1,0,0,1,-96.3,-1595.7)).s().p("AiKAhIAAhBIEVAAIAABBg");
	this.shape_161.setTransform(2550.025,371.8);

	this.shape_162 = new cjs.Shape();
	this.shape_162.graphics.bf(img.metaltexturegrungerustspottedagedoldrusteddirtyoxygenated5, null, new cjs.Matrix2D(1,0,0,1,-96.3,-1595.7)).s().p("AiKAhIAAhBIEVAAIAABBg");
	this.shape_162.setTransform(2550.025,322.65);

	this.shape_163 = new cjs.Shape();
	this.shape_163.graphics.bf(img.metaltexturegrungerustspottedagedoldrusteddirtyoxygenated5, null, new cjs.Matrix2D(1,0,0,1,-96.3,-1595.7)).s().p("AhmAhIgkAAIAAhBIEVAAIAABBg");
	this.shape_163.setTransform(2506.425,389.4);

	this.shape_164 = new cjs.Shape();
	this.shape_164.graphics.bf(img.metaltexturegrungerustspottedagedoldrusteddirtyoxygenated5, null, new cjs.Matrix2D(1,0,0,1,-95.8,-1595.7)).s().p("AiKAhIAAhBIEVAAIAABBg");
	this.shape_164.setTransform(2463.725,371.8);

	this.shape_165 = new cjs.Shape();
	this.shape_165.graphics.bf(img.metaltexturegrungerustspottedagedoldrusteddirtyoxygenated5, null, new cjs.Matrix2D(1,0,0,1,-95.8,-1595.7)).s().p("AiKAhIAAhBIEVAAIAABBg");
	this.shape_165.setTransform(2463.725,322.65);

	this.shape_166 = new cjs.Shape();
	this.shape_166.graphics.bf(img.metaltexturegrungerustspottedagedoldrusteddirtyoxygenated5, null, new cjs.Matrix2D(1,0,0,1,-96.3,-1595.7)).s().p("AiKAhIAAhBIEVAAIAABBg");
	this.shape_166.setTransform(2506.425,302);

	this.shape_167 = new cjs.Shape();
	this.shape_167.graphics.bf(img.metaltexturegrungerustspottedagedoldrusteddirtyoxygenated5, null, new cjs.Matrix2D(0.781,0,0,1,-75.1,-1590.1)).s().p("AhANRIAAnQIAAzRICBAAIAAFUIAABCIAAMnIAABCIAAGig");
	this.shape_167.setTransform(2486,349.625);

	this.shape_168 = new cjs.Shape();
	this.shape_168.graphics.bf(img.metaltexturegrungerustspottedagedoldrusteddirtyoxygenated5, null, new cjs.Matrix2D(0.781,0,0,1,-74.7,-1590.1)).s().p("AhANRIAAmiIAAhCIAAsnIAAhCIAAlUICBAAIAAIiIAABCIAAGpIAABCIAAJSg");
	this.shape_168.setTransform(2443.3,349.625);

	this.shape_169 = new cjs.Shape();
	this.shape_169.graphics.bf(img.metaltexturegrungerustspottedagedoldrusteddirtyoxygenated5, null, new cjs.Matrix2D(0.781,0,0,1,-75.1,-1590.1)).s().p("AhANRIAApSIAAhCIAAmpIAAhCIAAoiICBAAIAAFUIAABCIAAMnIAABCIAAGig");
	this.shape_169.setTransform(2570.45,349.625);

	this.shape_170 = new cjs.Shape();
	this.shape_170.graphics.bf(img.metaltexturegrungerustspottedagedoldrusteddirtyoxygenated5, null, new cjs.Matrix2D(0.781,0,0,1,-75.1,-1590.1)).s().p("AhANRIAAmiIAAhCIAAsnIAAhCIAAlUICBAAIAAahg");
	this.shape_170.setTransform(2526.85,349.625);

	this.shape_171 = new cjs.Shape();
	this.shape_171.graphics.bf(img.metaltexturegrungerustspottedagedoldrusteddirtyoxygenated5, null, new cjs.Matrix2D(1,0,0,1,-95.8,-1595.7)).s().p("AiKAhIAAhBIEVAAIAABBg");
	this.shape_171.setTransform(2422.875,389.4);

	this.shape_172 = new cjs.Shape();
	this.shape_172.graphics.bf(img.metaltexturegrungerustspottedagedoldrusteddirtyoxygenated5, null, new cjs.Matrix2D(1,0,0,1,-86,-1595.8)).s().p("AgmAhIAAhBIBNAAIAABBg");
	this.shape_172.setTransform(2370.675,387.6);

	this.shape_173 = new cjs.Shape();
	this.shape_173.graphics.bf(img.metaltexturegrungerustspottedagedoldrusteddirtyoxygenated5, null, new cjs.Matrix2D(1,0,0,1,-95.8,-1595.7)).s().p("AiKAhIAAhBIEVAAIAABBg");
	this.shape_173.setTransform(2422.875,302);

	this.shape_174 = new cjs.Shape();
	this.shape_174.graphics.bf(img.metaltexturegrungerustspottedagedoldrusteddirtyoxygenated5, null, new cjs.Matrix2D(1,0,0,1,-96,-1595.8)).s().p("AiKAhIAAhBIEVAAIAABBg");
	this.shape_174.setTransform(2337.625,370);

	this.shape_175 = new cjs.Shape();
	this.shape_175.graphics.bf(img.metaltexturegrungerustspottedagedoldrusteddirtyoxygenated5, null, new cjs.Matrix2D(1,0,0,1,-96,-1595.8)).s().p("AiKAhIAAhBIEVAAIAABBg");
	this.shape_175.setTransform(2296.775,387.6);

	this.shape_176 = new cjs.Shape();
	this.shape_176.graphics.bf(img.metaltexturegrungerustspottedagedoldrusteddirtyoxygenated5, null, new cjs.Matrix2D(1,0,0,1,-96,-1595.8)).s().p("AiKAhIAAhBIEVAAIAABBg");
	this.shape_176.setTransform(2254.075,370);

	this.shape_177 = new cjs.Shape();
	this.shape_177.graphics.bf(img.metaltexturegrungerustspottedagedoldrusteddirtyoxygenated5, null, new cjs.Matrix2D(1,0,0,1,-96,-1595.8)).s().p("AiKAhIAAhBIEVAAIAABBg");
	this.shape_177.setTransform(2254.075,320.85);

	this.shape_178 = new cjs.Shape();
	this.shape_178.graphics.bf(img.metaltexturegrungerustspottedagedoldrusteddirtyoxygenated5, null, new cjs.Matrix2D(1,0,0,1,-96,-1595.8)).s().p("AiKAhIAAhBIEVAAIAABBg");
	this.shape_178.setTransform(2337.625,320.85);

	this.shape_179 = new cjs.Shape();
	this.shape_179.graphics.bf(img.metaltexturegrungerustspottedagedoldrusteddirtyoxygenated5, null, new cjs.Matrix2D(0.781,0,0,1,-74.9,-1593.5)).s().p("AhANgIAAnSIAAhCIAAsnIAAhCIAAlCICBAAIAAIQIAABCIAAGpIAABCIAAKCg");
	this.shape_179.setTransform(2317.2,351.125);

	this.shape_180 = new cjs.Shape();
	this.shape_180.graphics.bf(img.metaltexturegrungerustspottedagedoldrusteddirtyoxygenated5, null, new cjs.Matrix2D(1,0,0,1,-96,-1595.8)).s().p("AiKAhIAAhBIEVAAIAABBg");
	this.shape_180.setTransform(2296.775,300.2);

	this.shape_181 = new cjs.Shape();
	this.shape_181.graphics.bf(img.metaltexturegrungerustspottedagedoldrusteddirtyoxygenated5, null, new cjs.Matrix2D(0.781,0,0,1,-74.9,-1593.5)).s().p("AhANgIAA6/ICBAAIAAFCIAABCIAAMnIAABCIAAHSg");
	this.shape_181.setTransform(2276.35,351.125);

	this.shape_182 = new cjs.Shape();
	this.shape_182.graphics.bf(img.metaltexturegrungerustspottedagedoldrusteddirtyoxygenated5, null, new cjs.Matrix2D(0.781,0,0,1,-74.7,-1590.1)).s().p("AhANRIAA6hICBAAIAAFUIAABCIAAMnIAABCIAAGig");
	this.shape_182.setTransform(2402.45,349.625);

	this.shape_183 = new cjs.Shape();
	this.shape_183.graphics.bf(img.metaltexturegrungerustspottedagedoldrusteddirtyoxygenated5, null, new cjs.Matrix2D(1,0,0,1,-86,-1595.8)).s().p("AgmAhIAAhBIBNAAIAABBg");
	this.shape_183.setTransform(2370.675,300.2);

	this.shape_184 = new cjs.Shape();
	this.shape_184.graphics.bf(img.metaltexturegrungerustspottedagedoldrusteddirtyoxygenated5, null, new cjs.Matrix2D(0.781,0,0,1,-74.9,-1593.5)).s().p("AhANgIAA6/ICBAAIAAFCIAABCIAAMnIAABCIAAHSg");
	this.shape_184.setTransform(2360.3,351.125);

	this.shape_185 = new cjs.Shape();
	this.shape_185.graphics.bf(img.metaltexturegrungerustspottedagedoldrusteddirtyoxygenated5, null, new cjs.Matrix2D(1,0,0,1,-96.3,-1595.7)).s().p("AiKAhIAAhBIEVAAIAABBg");
	this.shape_185.setTransform(2885.525,371.8);

	this.shape_186 = new cjs.Shape();
	this.shape_186.graphics.bf(img.metaltexturegrungerustspottedagedoldrusteddirtyoxygenated5, null, new cjs.Matrix2D(1,0,0,1,-96.3,-1595.7)).s().p("AiKAhIAAhBIEVAAIAABBg");
	this.shape_186.setTransform(2885.525,322.65);

	this.shape_187 = new cjs.Shape();
	this.shape_187.graphics.bf(img.metaltexturegrungerustspottedagedoldrusteddirtyoxygenated5, null, new cjs.Matrix2D(1,0,0,1,-96.3,-1595.7)).s().p("AhmAhIgkAAIAAhBIEVAAIAABBg");
	this.shape_187.setTransform(2841.925,389.4);

	this.shape_188 = new cjs.Shape();
	this.shape_188.graphics.bf(img.metaltexturegrungerustspottedagedoldrusteddirtyoxygenated5, null, new cjs.Matrix2D(1,0,0,1,-96.3,-1595.7)).s().p("AiKAhIAAhBIEVAAIAABBg");
	this.shape_188.setTransform(2799.225,371.8);

	this.shape_189 = new cjs.Shape();
	this.shape_189.graphics.bf(img.metaltexturegrungerustspottedagedoldrusteddirtyoxygenated5, null, new cjs.Matrix2D(1,0,0,1,-96.3,-1595.7)).s().p("AiKAhIAAhBIEVAAIAABBg");
	this.shape_189.setTransform(2799.225,322.65);

	this.shape_190 = new cjs.Shape();
	this.shape_190.graphics.bf(img.metaltexturegrungerustspottedagedoldrusteddirtyoxygenated5, null, new cjs.Matrix2D(1,0,0,1,-96.3,-1595.7)).s().p("AiKAhIAAhBIEVAAIAABBg");
	this.shape_190.setTransform(2841.925,302);

	this.shape_191 = new cjs.Shape();
	this.shape_191.graphics.bf(img.metaltexturegrungerustspottedagedoldrusteddirtyoxygenated5, null, new cjs.Matrix2D(0.781,0,0,1,-75.1,-1590.1)).s().p("AhANRIAAnQIAAzRICBAAIAAFUIAABCIAAMnIAABCIAAGig");
	this.shape_191.setTransform(2821.5,349.625);

	this.shape_192 = new cjs.Shape();
	this.shape_192.graphics.bf(img.metaltexturegrungerustspottedagedoldrusteddirtyoxygenated5, null, new cjs.Matrix2D(0.781,0,0,1,-75.1,-1590.1)).s().p("AhANRIAAmiIAAhCIAAsnIAAhCIAAlUICBAAIAAIiIAABCIAAGpIAABCIAAJSg");
	this.shape_192.setTransform(2778.8,349.625);

	this.shape_193 = new cjs.Shape();
	this.shape_193.graphics.bf(img.metaltexturegrungerustspottedagedoldrusteddirtyoxygenated5, null, new cjs.Matrix2D(0.781,0,0,1,-75.1,-1590.1)).s().p("AhANRIAApSIAAhCIAAmpIAAhCIAAoiICBAAIAAFUIAABCIAAMnIAABCIAAGig");
	this.shape_193.setTransform(2905.95,349.625);

	this.shape_194 = new cjs.Shape();
	this.shape_194.graphics.bf(img.metaltexturegrungerustspottedagedoldrusteddirtyoxygenated5, null, new cjs.Matrix2D(0.781,0,0,1,-75.1,-1590.1)).s().p("AhANRIAAmiIAAhCIAAsnIAAhCIAAlUICBAAIAAahg");
	this.shape_194.setTransform(2862.35,349.625);

	this.shape_195 = new cjs.Shape();
	this.shape_195.graphics.bf(img.metaltexturegrungerustspottedagedoldrusteddirtyoxygenated5, null, new cjs.Matrix2D(1,0,0,1,-96.3,-1595.7)).s().p("AiKAhIAAhBIEVAAIAABBg");
	this.shape_195.setTransform(2758.375,389.4);

	this.shape_196 = new cjs.Shape();
	this.shape_196.graphics.bf(img.metaltexturegrungerustspottedagedoldrusteddirtyoxygenated5, null, new cjs.Matrix2D(1,0,0,1,-96.3,-1595.7)).s().p("AiKAhIAAhBIEVAAIAABBg");
	this.shape_196.setTransform(2715.275,371.8);

	this.shape_197 = new cjs.Shape();
	this.shape_197.graphics.bf(img.metaltexturegrungerustspottedagedoldrusteddirtyoxygenated5, null, new cjs.Matrix2D(1,0,0,1,-96.3,-1595.7)).s().p("AiKAhIAAhBIEVAAIAABBg");
	this.shape_197.setTransform(2715.275,322.65);

	this.shape_198 = new cjs.Shape();
	this.shape_198.graphics.bf(img.metaltexturegrungerustspottedagedoldrusteddirtyoxygenated5, null, new cjs.Matrix2D(1,0,0,1,-96.3,-1595.7)).s().p("AiKAhIAAhBIEVAAIAABBg");
	this.shape_198.setTransform(2758.375,302);

	this.shape_199 = new cjs.Shape();
	this.shape_199.graphics.bf(img.metaltexturegrungerustspottedagedoldrusteddirtyoxygenated5, null, new cjs.Matrix2D(1,0,0,1,-96.3,-1595.7)).s().p("AiKAhIAAhBIEVAAIAABBg");
	this.shape_199.setTransform(2674.425,389.4);

	this.shape_200 = new cjs.Shape();
	this.shape_200.graphics.bf(img.metaltexturegrungerustspottedagedoldrusteddirtyoxygenated5, null, new cjs.Matrix2D(1,0,0,1,-96.3,-1595.7)).s().p("AiKAhIAAhBIEVAAIAABBg");
	this.shape_200.setTransform(2590.875,389.4);

	this.shape_201 = new cjs.Shape();
	this.shape_201.graphics.bf(img.metaltexturegrungerustspottedagedoldrusteddirtyoxygenated5, null, new cjs.Matrix2D(1,0,0,1,-96.3,-1595.7)).s().p("AiKAhIAAhBIEVAAIAABBg");
	this.shape_201.setTransform(2631.725,371.8);

	this.shape_202 = new cjs.Shape();
	this.shape_202.graphics.bf(img.metaltexturegrungerustspottedagedoldrusteddirtyoxygenated5, null, new cjs.Matrix2D(1,0,0,1,-96.3,-1595.7)).s().p("AiKAhIAAhBIEVAAIAABBg");
	this.shape_202.setTransform(2590.875,302);

	this.shape_203 = new cjs.Shape();
	this.shape_203.graphics.bf(img.metaltexturegrungerustspottedagedoldrusteddirtyoxygenated5, null, new cjs.Matrix2D(1,0,0,1,-96.3,-1595.7)).s().p("AiKAhIAAhBIEVAAIAABBg");
	this.shape_203.setTransform(2631.725,322.65);

	this.shape_204 = new cjs.Shape();
	this.shape_204.graphics.bf(img.metaltexturegrungerustspottedagedoldrusteddirtyoxygenated5, null, new cjs.Matrix2D(1,0,0,1,-96.3,-1595.7)).s().p("AiKAhIAAhBIEVAAIAABBg");
	this.shape_204.setTransform(2674.425,302);

	this.shape_205 = new cjs.Shape();
	this.shape_205.graphics.bf(img.metaltexturegrungerustspottedagedoldrusteddirtyoxygenated5, null, new cjs.Matrix2D(0.781,0,0,1,-75.1,-1590.1)).s().p("AhANRIAA6hICBAAIAAFUIAABCIAAMnIAABCIAAGig");
	this.shape_205.setTransform(2654,349.625);

	this.shape_206 = new cjs.Shape();
	this.shape_206.graphics.bf(img.metaltexturegrungerustspottedagedoldrusteddirtyoxygenated5, null, new cjs.Matrix2D(0.781,0,0,1,-75.1,-1590.1)).s().p("AhANRIAAmiIAAhCIAAsnIAAhCIAAlUICBAAIAAIiIAABCIAAGpIAABCIAAJSg");
	this.shape_206.setTransform(2611.3,349.625);

	this.shape_207 = new cjs.Shape();
	this.shape_207.graphics.bf(img.metaltexturegrungerustspottedagedoldrusteddirtyoxygenated5, null, new cjs.Matrix2D(0.781,0,0,1,-75.1,-1590.1)).s().p("AhANRIAA6hICBAAIAAFUIAABCIAAMnIAABCIAAGig");
	this.shape_207.setTransform(2737.95,349.625);

	this.shape_208 = new cjs.Shape();
	this.shape_208.graphics.bf(img.metaltexturegrungerustspottedagedoldrusteddirtyoxygenated5, null, new cjs.Matrix2D(0.781,0,0,1,-75.1,-1590.1)).s().p("AhANRIAAmiIAAhCIAAsnIAAhCIAAlUICBAAIAAIiIAABCIAAGpIAABCIAAJSg");
	this.shape_208.setTransform(2694.85,349.625);

	this.shape_209 = new cjs.Shape();
	this.shape_209.graphics.bf(img.metaltexturegrungerustspottedagedoldrusteddirtyoxygenated5, null, new cjs.Matrix2D(0.781,0,0,1,-75.1,-1590.1)).s().p("AhANRIAAmiIAAhCIAAsnIAAhCIAAlUICBAAIAAahg");
	this.shape_209.setTransform(3112.25,349.625);

	this.shape_210 = new cjs.Shape();
	this.shape_210.graphics.bf(img.metaltexturegrungerustspottedagedoldrusteddirtyoxygenated5, null, new cjs.Matrix2D(1,0,0,1,-96.2,-1595.7)).s().p("AiKAhIAAhBIEVAAIAABBg");
	this.shape_210.setTransform(3091.825,389.4);

	this.shape_211 = new cjs.Shape();
	this.shape_211.graphics.bf(img.metaltexturegrungerustspottedagedoldrusteddirtyoxygenated5, null, new cjs.Matrix2D(1,0,0,1,-96.2,-1595.7)).s().p("AiKAhIAAhBIEVAAIAABBg");
	this.shape_211.setTransform(3050.725,371.8);

	this.shape_212 = new cjs.Shape();
	this.shape_212.graphics.bf(img.metaltexturegrungerustspottedagedoldrusteddirtyoxygenated5, null, new cjs.Matrix2D(1,0,0,1,-96.2,-1595.7)).s().p("AiKAhIAAhBIEVAAIAABBg");
	this.shape_212.setTransform(3091.825,302);

	this.shape_213 = new cjs.Shape();
	this.shape_213.graphics.bf(img.metaltexturegrungerustspottedagedoldrusteddirtyoxygenated5, null, new cjs.Matrix2D(1,0,0,1,-96.2,-1595.7)).s().p("AiKAhIAAhBIEVAAIAABBg");
	this.shape_213.setTransform(3050.725,322.65);

	this.shape_214 = new cjs.Shape();
	this.shape_214.graphics.bf(img.metaltexturegrungerustspottedagedoldrusteddirtyoxygenated5, null, new cjs.Matrix2D(1,0,0,1,-96.2,-1595.7)).s().p("AiKAhIAAhBIEVAAIAABBg");
	this.shape_214.setTransform(3009.875,389.4);

	this.shape_215 = new cjs.Shape();
	this.shape_215.graphics.bf(img.metaltexturegrungerustspottedagedoldrusteddirtyoxygenated5, null, new cjs.Matrix2D(1,0,0,1,-96.2,-1595.7)).s().p("AiKAhIAAhBIEVAAIAABBg");
	this.shape_215.setTransform(2926.35,389.4);

	this.shape_216 = new cjs.Shape();
	this.shape_216.graphics.bf(img.metaltexturegrungerustspottedagedoldrusteddirtyoxygenated5, null, new cjs.Matrix2D(1,0,0,1,-96.2,-1595.7)).s().p("AiKAhIAAhBIEVAAIAABBg");
	this.shape_216.setTransform(2967.175,371.8);

	this.shape_217 = new cjs.Shape();
	this.shape_217.graphics.bf(img.metaltexturegrungerustspottedagedoldrusteddirtyoxygenated5, null, new cjs.Matrix2D(1,0,0,1,-96.2,-1595.7)).s().p("AiKAhIAAhBIEVAAIAABBg");
	this.shape_217.setTransform(2926.35,302);

	this.shape_218 = new cjs.Shape();
	this.shape_218.graphics.bf(img.metaltexturegrungerustspottedagedoldrusteddirtyoxygenated5, null, new cjs.Matrix2D(1,0,0,1,-96.2,-1595.7)).s().p("AiKAhIAAhBIEVAAIAABBg");
	this.shape_218.setTransform(3009.875,302);

	this.shape_219 = new cjs.Shape();
	this.shape_219.graphics.bf(img.metaltexturegrungerustspottedagedoldrusteddirtyoxygenated5, null, new cjs.Matrix2D(1,0,0,1,-96.2,-1595.7)).s().p("AiKAhIAAhBIEVAAIAABBg");
	this.shape_219.setTransform(2967.175,322.65);

	this.shape_220 = new cjs.Shape();
	this.shape_220.graphics.bf(img.metaltexturegrungerustspottedagedoldrusteddirtyoxygenated5, null, new cjs.Matrix2D(0.781,0,0,1,-75.1,-1590.1)).s().p("AhANRIAA6hICBAAIAAFUIAABCIAAMnIAABCIAAGig");
	this.shape_220.setTransform(2989.45,349.625);

	this.shape_221 = new cjs.Shape();
	this.shape_221.graphics.bf(img.metaltexturegrungerustspottedagedoldrusteddirtyoxygenated5, null, new cjs.Matrix2D(0.781,0,0,1,-75.1,-1590.1)).s().p("AhANRIAAmiIAAhCIAAsnIAAhCIAAlUICBAAIAAIiIAABCIAAGpIAABCIAAJSg");
	this.shape_221.setTransform(2946.75,349.625);

	this.shape_222 = new cjs.Shape();
	this.shape_222.graphics.bf(img.metaltexturegrungerustspottedagedoldrusteddirtyoxygenated5, null, new cjs.Matrix2D(0.781,0,0,1,-75.1,-1590.1)).s().p("AhANRIAA6hICBAAIAAFUIAABCIAAMnIAABCIAAGig");
	this.shape_222.setTransform(3071.4,349.625);

	this.shape_223 = new cjs.Shape();
	this.shape_223.graphics.bf(img.metaltexturegrungerustspottedagedoldrusteddirtyoxygenated5, null, new cjs.Matrix2D(0.781,0,0,1,-75.1,-1590.1)).s().p("AhANRIAAmiIAAhCIAAsnIAAhCIAAlUICBAAIAAIiIAABCIAAGpIAABCIAAJSg");
	this.shape_223.setTransform(3030.3,349.625);

	this.shape_224 = new cjs.Shape();
	this.shape_224.graphics.bf(img.metaltexturegrungerustspottedagedoldrusteddirtyoxygenated5, null, new cjs.Matrix2D(1,0,0,1,-96,-1595.7)).s().p("AhmAhIgkAAIAAhBIEVAAIAABBg");
	this.shape_224.setTransform(4179.375,387.55);

	this.shape_225 = new cjs.Shape();
	this.shape_225.graphics.bf(img.metaltexturegrungerustspottedagedoldrusteddirtyoxygenated5, null, new cjs.Matrix2D(1,0,0,1,-96,-1595.7)).s().p("AiKAhIAAhBIEVAAIAABBg");
	this.shape_225.setTransform(4136.675,369.95);

	this.shape_226 = new cjs.Shape();
	this.shape_226.graphics.bf(img.metaltexturegrungerustspottedagedoldrusteddirtyoxygenated5, null, new cjs.Matrix2D(1,0,0,1,-96,-1595.7)).s().p("AiKAhIAAhBIEVAAIAABBg");
	this.shape_226.setTransform(4095.825,387.55);

	this.shape_227 = new cjs.Shape();
	this.shape_227.graphics.bf(img.metaltexturegrungerustspottedagedoldrusteddirtyoxygenated5, null, new cjs.Matrix2D(1,0,0,1,-96,-1595.7)).s().p("AiKAhIAAhBIEVAAIAABBg");
	this.shape_227.setTransform(4136.675,320.8);

	this.shape_228 = new cjs.Shape();
	this.shape_228.graphics.bf(img.metaltexturegrungerustspottedagedoldrusteddirtyoxygenated5, null, new cjs.Matrix2D(0.781,0,0,1,-74.9,-1592)).s().p("AhANRIAAm1IAAhCIAAsnIAAhCIAAlBICBAAIAAIQIAABCIAAGoIAABCIAAJlg");
	this.shape_228.setTransform(4116.25,349.625);

	this.shape_229 = new cjs.Shape();
	this.shape_229.graphics.bf(img.metaltexturegrungerustspottedagedoldrusteddirtyoxygenated5, null, new cjs.Matrix2D(1,0,0,1,-96,-1595.7)).s().p("AiKAhIAAhBIEVAAIAABBg");
	this.shape_229.setTransform(4095.825,300.15);

	this.shape_230 = new cjs.Shape();
	this.shape_230.graphics.bf(img.metaltexturegrungerustspottedagedoldrusteddirtyoxygenated5, null, new cjs.Matrix2D(0.781,0,0,1,-74.9,-1592)).s().p("AhANRIAA6hICBAAIAAFBIAABCIAAMnIAABCIAAG1g");
	this.shape_230.setTransform(4075.4,349.625);

	this.shape_231 = new cjs.Shape();
	this.shape_231.graphics.bf(img.metaltexturegrungerustspottedagedoldrusteddirtyoxygenated5, null, new cjs.Matrix2D(0.781,0,0,1,-74.9,-1592)).s().p("AhANRIAAm1IAAhCIAAsnIAAhCIAAlBICBAAIAAahg");
	this.shape_231.setTransform(4199.8,349.625);

	this.shape_232 = new cjs.Shape();
	this.shape_232.graphics.bf(img.metaltexturegrungerustspottedagedoldrusteddirtyoxygenated5, null, new cjs.Matrix2D(1,0,0,1,-96,-1595.7)).s().p("AiKAhIAAhBIEVAAIAABBg");
	this.shape_232.setTransform(4179.375,300.15);

	this.shape_233 = new cjs.Shape();
	this.shape_233.graphics.bf(img.metaltexturegrungerustspottedagedoldrusteddirtyoxygenated5, null, new cjs.Matrix2D(0.781,0,0,1,-74.9,-1592)).s().p("AhANRIAAniIAAy/ICBAAIAAFBIAABCIAAMnIAABCIAAG1g");
	this.shape_233.setTransform(4158.95,349.625);

	this.shape_234 = new cjs.Shape();
	this.shape_234.graphics.bf(img.metaltexturegrungerustspottedagedoldrusteddirtyoxygenated5, null, new cjs.Matrix2D(1,0,0,1,-96,-1595.7)).s().p("AiKAhIAAhBIEVAAIAABBg");
	this.shape_234.setTransform(4052.725,369.95);

	this.shape_235 = new cjs.Shape();
	this.shape_235.graphics.bf(img.metaltexturegrungerustspottedagedoldrusteddirtyoxygenated5, null, new cjs.Matrix2D(1,0,0,1,-96.1,-1595.7)).s().p("AiJAhIAAhBIETAAIAABBg");
	this.shape_235.setTransform(4012,387.55);

	this.shape_236 = new cjs.Shape();
	this.shape_236.graphics.bf(img.metaltexturegrungerustspottedagedoldrusteddirtyoxygenated5, null, new cjs.Matrix2D(1,0,0,1,-96,-1595.7)).s().p("AiKAhIAAhBIEVAAIAABBg");
	this.shape_236.setTransform(4052.725,320.8);

	this.shape_237 = new cjs.Shape();
	this.shape_237.graphics.bf(img.metaltexturegrungerustspottedagedoldrusteddirtyoxygenated5, null, new cjs.Matrix2D(1,0,0,1,-96.3,-1595.7)).s().p("AiKAhIAAhBIEVAAIAABBg");
	this.shape_237.setTransform(3969.425,369.95);

	this.shape_238 = new cjs.Shape();
	this.shape_238.graphics.bf(img.metaltexturegrungerustspottedagedoldrusteddirtyoxygenated5, null, new cjs.Matrix2D(1,0,0,1,-96.3,-1595.7)).s().p("AiKAhIAAhBIEVAAIAABBg");
	this.shape_238.setTransform(3928.575,387.55);

	this.shape_239 = new cjs.Shape();
	this.shape_239.graphics.bf(img.metaltexturegrungerustspottedagedoldrusteddirtyoxygenated5, null, new cjs.Matrix2D(1,0,0,1,-96.3,-1595.7)).s().p("AiKAhIAAhBIEVAAIAABBg");
	this.shape_239.setTransform(3887.725,369.95);

	this.shape_240 = new cjs.Shape();
	this.shape_240.graphics.bf(img.metaltexturegrungerustspottedagedoldrusteddirtyoxygenated5, null, new cjs.Matrix2D(1,0,0,1,-96.3,-1595.7)).s().p("AiKAhIAAhBIEVAAIAABBg");
	this.shape_240.setTransform(3887.725,320.8);

	this.shape_241 = new cjs.Shape();
	this.shape_241.graphics.bf(img.metaltexturegrungerustspottedagedoldrusteddirtyoxygenated5, null, new cjs.Matrix2D(1,0,0,1,-96.3,-1595.7)).s().p("AiKAhIAAhBIEVAAIAABBg");
	this.shape_241.setTransform(3969.425,320.8);

	this.shape_242 = new cjs.Shape();
	this.shape_242.graphics.bf(img.metaltexturegrungerustspottedagedoldrusteddirtyoxygenated5, null, new cjs.Matrix2D(0.781,0,0,1,-75.1,-1592)).s().p("AhANRIAAm1IAAhCIAAsnIAAhCIAAlBICBAAIAAIQIAABCIAAGoIAABCIAAJlg");
	this.shape_242.setTransform(3949,349.625);

	this.shape_243 = new cjs.Shape();
	this.shape_243.graphics.bf(img.metaltexturegrungerustspottedagedoldrusteddirtyoxygenated5, null, new cjs.Matrix2D(1,0,0,1,-96.3,-1595.7)).s().p("AiKAhIAAhBIEVAAIAABBg");
	this.shape_243.setTransform(3928.575,300.15);

	this.shape_244 = new cjs.Shape();
	this.shape_244.graphics.bf(img.metaltexturegrungerustspottedagedoldrusteddirtyoxygenated5, null, new cjs.Matrix2D(0.781,0,0,1,-75.1,-1592)).s().p("AhANRIAAplIAAhCIAAmoIAAhCIAAoQICBAAIAAFBIAABCIAAMnIAABCIAAG1g");
	this.shape_244.setTransform(3908.15,349.625);

	this.shape_245 = new cjs.Shape();
	this.shape_245.graphics.bf(img.metaltexturegrungerustspottedagedoldrusteddirtyoxygenated5, null, new cjs.Matrix2D(0.781,0,0,1,-74.9,-1592)).s().p("AhANRIAAm1IAAhCIAAsnIAAhCIAAlBICBAAIAAIQIAABCIAAGoIAABCIAAJlg");
	this.shape_245.setTransform(4032.3,349.625);

	this.shape_246 = new cjs.Shape();
	this.shape_246.graphics.bf(img.metaltexturegrungerustspottedagedoldrusteddirtyoxygenated5, null, new cjs.Matrix2D(1,0,0,1,-96.1,-1595.7)).s().p("AiJAhIAAhBIETAAIAABBg");
	this.shape_246.setTransform(4012,300.15);

	this.shape_247 = new cjs.Shape();
	this.shape_247.graphics.bf(img.metaltexturegrungerustspottedagedoldrusteddirtyoxygenated5, null, new cjs.Matrix2D(0.781,0,0,1,-75.1,-1592)).s().p("AhANRIAA6hICBAAIAAFBIAABCIAAMnIAABCIAAG1g");
	this.shape_247.setTransform(3991.7,349.625);

	this.shape_248 = new cjs.Shape();
	this.shape_248.graphics.bf(img.metaltexturegrungerustspottedagedoldrusteddirtyoxygenated5, null, new cjs.Matrix2D(1,0,0,1,-96,-1595.7)).s().p("AhmAhIgkAAIAAhBIEVAAIAABBg");
	this.shape_248.setTransform(4512.875,387.55);

	this.shape_249 = new cjs.Shape();
	this.shape_249.graphics.bf(img.metaltexturegrungerustspottedagedoldrusteddirtyoxygenated5, null, new cjs.Matrix2D(1,0,0,1,-96,-1595.7)).s().p("AiKAhIAAhBIEVAAIAABBg");
	this.shape_249.setTransform(4470.175,369.95);

	this.shape_250 = new cjs.Shape();
	this.shape_250.graphics.bf(img.metaltexturegrungerustspottedagedoldrusteddirtyoxygenated5, null, new cjs.Matrix2D(1,0,0,1,-96,-1595.7)).s().p("AiKAhIAAhBIEVAAIAABBg");
	this.shape_250.setTransform(4470.175,320.8);

	this.shape_251 = new cjs.Shape();
	this.shape_251.graphics.bf(img.metaltexturegrungerustspottedagedoldrusteddirtyoxygenated5, null, new cjs.Matrix2D(1,0,0,1,-96,-1595.7)).s().p("AiKAhIAAhBIEVAAIAABBg");
	this.shape_251.setTransform(4429.325,387.55);

	this.shape_252 = new cjs.Shape();
	this.shape_252.graphics.bf(img.metaltexturegrungerustspottedagedoldrusteddirtyoxygenated5, null, new cjs.Matrix2D(1,0,0,1,-96,-1595.7)).s().p("AiKAhIAAhBIEVAAIAABBg");
	this.shape_252.setTransform(4388.225,369.95);

	this.shape_253 = new cjs.Shape();
	this.shape_253.graphics.bf(img.metaltexturegrungerustspottedagedoldrusteddirtyoxygenated5, null, new cjs.Matrix2D(1,0,0,1,-96,-1595.7)).s().p("AiKAhIAAhBIEVAAIAABBg");
	this.shape_253.setTransform(4388.225,320.8);

	this.shape_254 = new cjs.Shape();
	this.shape_254.graphics.bf(img.metaltexturegrungerustspottedagedoldrusteddirtyoxygenated5, null, new cjs.Matrix2D(1,0,0,1,-96,-1595.7)).s().p("AiKAhIAAhBIEVAAIAABBg");
	this.shape_254.setTransform(4429.325,300.15);

	this.shape_255 = new cjs.Shape();
	this.shape_255.graphics.bf(img.metaltexturegrungerustspottedagedoldrusteddirtyoxygenated5, null, new cjs.Matrix2D(0.781,0,0,1,-74.9,-1592)).s().p("AhANRIAA6hICBAAIAAFBIAABCIAAMnIAABCIAAG1g");
	this.shape_255.setTransform(4408.9,349.625);

	this.shape_256 = new cjs.Shape();
	this.shape_256.graphics.bf(img.metaltexturegrungerustspottedagedoldrusteddirtyoxygenated5, null, new cjs.Matrix2D(1,0,0,1,-96,-1595.7)).s().p("AiKAhIAAhBIEVAAIAABBg");
	this.shape_256.setTransform(4512.875,300.15);

	this.shape_257 = new cjs.Shape();
	this.shape_257.graphics.bf(img.metaltexturegrungerustspottedagedoldrusteddirtyoxygenated5, null, new cjs.Matrix2D(0.781,0,0,1,-74.9,-1592)).s().p("AhANRIAAm1IAAhCIAAsnIAAhCIAAlBICBAAIAAIQIAABCIAAGoIAABCIAAJlg");
	this.shape_257.setTransform(4449.75,349.625);

	this.shape_258 = new cjs.Shape();
	this.shape_258.graphics.bf(img.metaltexturegrungerustspottedagedoldrusteddirtyoxygenated5, null, new cjs.Matrix2D(0.781,0,0,1,-74.9,-1592)).s().p("AhANRIAAniIAAy/ICBAAIAAFBIAABCIAAMnIAABCIAAG1g");
	this.shape_258.setTransform(4492.45,349.625);

	this.shape_259 = new cjs.Shape();
	this.shape_259.graphics.bf(img.metaltexturegrungerustspottedagedoldrusteddirtyoxygenated5, null, new cjs.Matrix2D(1,0,0,1,-96,-1595.7)).s().p("AiKAhIAAhBIEVAAIAABBg");
	this.shape_259.setTransform(4347.375,387.55);

	this.shape_260 = new cjs.Shape();
	this.shape_260.graphics.bf(img.metaltexturegrungerustspottedagedoldrusteddirtyoxygenated5, null, new cjs.Matrix2D(1,0,0,1,-96,-1595.7)).s().p("AiKAhIAAhBIEVAAIAABBg");
	this.shape_260.setTransform(4304.675,369.95);

	this.shape_261 = new cjs.Shape();
	this.shape_261.graphics.bf(img.metaltexturegrungerustspottedagedoldrusteddirtyoxygenated5, null, new cjs.Matrix2D(1,0,0,1,-96,-1595.7)).s().p("AiKAhIAAhBIEVAAIAABBg");
	this.shape_261.setTransform(4263.825,387.55);

	this.shape_262 = new cjs.Shape();
	this.shape_262.graphics.bf(img.metaltexturegrungerustspottedagedoldrusteddirtyoxygenated5, null, new cjs.Matrix2D(1,0,0,1,-96,-1595.7)).s().p("AiKAhIAAhBIEVAAIAABBg");
	this.shape_262.setTransform(4222.975,369.95);

	this.shape_263 = new cjs.Shape();
	this.shape_263.graphics.bf(img.metaltexturegrungerustspottedagedoldrusteddirtyoxygenated5, null, new cjs.Matrix2D(1,0,0,1,-96,-1595.7)).s().p("AiKAhIAAhBIEVAAIAABBg");
	this.shape_263.setTransform(4222.975,320.8);

	this.shape_264 = new cjs.Shape();
	this.shape_264.graphics.bf(img.metaltexturegrungerustspottedagedoldrusteddirtyoxygenated5, null, new cjs.Matrix2D(1,0,0,1,-96,-1595.7)).s().p("AiKAhIAAhBIEVAAIAABBg");
	this.shape_264.setTransform(4304.675,320.8);

	this.shape_265 = new cjs.Shape();
	this.shape_265.graphics.bf(img.metaltexturegrungerustspottedagedoldrusteddirtyoxygenated5, null, new cjs.Matrix2D(0.781,0,0,1,-74.9,-1592)).s().p("AhANRIAAm1IAAhCIAAsnIAAhCIAAlBICBAAIAAIQIAABCIAAGoIAABCIAAJlg");
	this.shape_265.setTransform(4284.25,349.625);

	this.shape_266 = new cjs.Shape();
	this.shape_266.graphics.bf(img.metaltexturegrungerustspottedagedoldrusteddirtyoxygenated5, null, new cjs.Matrix2D(1,0,0,1,-96,-1595.7)).s().p("AiKAhIAAhBIEVAAIAABBg");
	this.shape_266.setTransform(4263.825,300.15);

	this.shape_267 = new cjs.Shape();
	this.shape_267.graphics.bf(img.metaltexturegrungerustspottedagedoldrusteddirtyoxygenated5, null, new cjs.Matrix2D(0.781,0,0,1,-74.9,-1592)).s().p("AhANRIAAplIAAhCIAAmoIAAhCIAAoQICBAAIAAFBIAABCIAAMnIAABCIAAG1g");
	this.shape_267.setTransform(4243.4,349.625);

	this.shape_268 = new cjs.Shape();
	this.shape_268.graphics.bf(img.metaltexturegrungerustspottedagedoldrusteddirtyoxygenated5, null, new cjs.Matrix2D(0.781,0,0,1,-74.9,-1592)).s().p("AhANRIAAm1IAAhCIAAsnIAAhCIAAlBICBAAIAAIQIAABCIAAGoIAABCIAAJlg");
	this.shape_268.setTransform(4367.8,349.625);

	this.shape_269 = new cjs.Shape();
	this.shape_269.graphics.bf(img.metaltexturegrungerustspottedagedoldrusteddirtyoxygenated5, null, new cjs.Matrix2D(1,0,0,1,-96,-1595.7)).s().p("AiKAhIAAhBIEVAAIAABBg");
	this.shape_269.setTransform(4347.375,300.15);

	this.shape_270 = new cjs.Shape();
	this.shape_270.graphics.bf(img.metaltexturegrungerustspottedagedoldrusteddirtyoxygenated5, null, new cjs.Matrix2D(0.781,0,0,1,-74.9,-1592)).s().p("AhANRIAA6hICBAAIAAFBIAABCIAAMnIAABCIAAG1g");
	this.shape_270.setTransform(4326.95,349.625);

	this.shape_271 = new cjs.Shape();
	this.shape_271.graphics.bf(img.metaltexturegrungerustspottedagedoldrusteddirtyoxygenated5, null, new cjs.Matrix2D(1,0,0,1,-86,-1595.7)).s().p("AgmAhIAAhBIBNAAIAABBg");
	this.shape_271.setTransform(4754.775,387.55);

	this.shape_272 = new cjs.Shape();
	this.shape_272.graphics.bf(img.metaltexturegrungerustspottedagedoldrusteddirtyoxygenated5, null, new cjs.Matrix2D(1,0,0,1,-96.1,-1595.7)).s().p("AiKAhIAAhBIEVAAIAABBg");
	this.shape_272.setTransform(4721.725,369.95);

	this.shape_273 = new cjs.Shape();
	this.shape_273.graphics.bf(img.metaltexturegrungerustspottedagedoldrusteddirtyoxygenated5, null, new cjs.Matrix2D(1,0,0,1,-96.1,-1595.7)).s().p("AiKAhIAAhBIEVAAIAABBg");
	this.shape_273.setTransform(4721.725,320.8);

	this.shape_274 = new cjs.Shape();
	this.shape_274.graphics.bf(img.metaltexturegrungerustspottedagedoldrusteddirtyoxygenated5, null, new cjs.Matrix2D(1,0,0,1,-86,-1595.7)).s().p("AgmAhIAAhBIBNAAIAABBg");
	this.shape_274.setTransform(4754.775,300.15);

	this.shape_275 = new cjs.Shape();
	this.shape_275.graphics.bf(img.metaltexturegrungerustspottedagedoldrusteddirtyoxygenated5, null, new cjs.Matrix2D(0.781,0,0,1,-74.9,-1592)).s().p("AhANRIAA6hICBAAIAAFBIAABCIAAMnIAABCIAAG1g");
	this.shape_275.setTransform(4744.4,349.625);

	this.shape_276 = new cjs.Shape();
	this.shape_276.graphics.bf(img.metaltexturegrungerustspottedagedoldrusteddirtyoxygenated5, null, new cjs.Matrix2D(1,0,0,1,-96.1,-1595.7)).s().p("AiKAhIAAhBIEVAAIAABBg");
	this.shape_276.setTransform(4680.875,387.55);

	this.shape_277 = new cjs.Shape();
	this.shape_277.graphics.bf(img.metaltexturegrungerustspottedagedoldrusteddirtyoxygenated5, null, new cjs.Matrix2D(1,0,0,1,-96,-1595.7)).s().p("AiKAhIAAhBIEVAAIAABBg");
	this.shape_277.setTransform(4638.175,369.95);

	this.shape_278 = new cjs.Shape();
	this.shape_278.graphics.bf(img.metaltexturegrungerustspottedagedoldrusteddirtyoxygenated5, null, new cjs.Matrix2D(1,0,0,1,-96,-1595.7)).s().p("AiKAhIAAhBIEVAAIAABBg");
	this.shape_278.setTransform(4638.175,320.8);

	this.shape_279 = new cjs.Shape();
	this.shape_279.graphics.bf(img.metaltexturegrungerustspottedagedoldrusteddirtyoxygenated5, null, new cjs.Matrix2D(1,0,0,1,-96,-1595.7)).s().p("AiKAhIAAhBIEVAAIAABBg");
	this.shape_279.setTransform(4597.325,387.55);

	this.shape_280 = new cjs.Shape();
	this.shape_280.graphics.bf(img.metaltexturegrungerustspottedagedoldrusteddirtyoxygenated5, null, new cjs.Matrix2D(1,0,0,1,-96,-1595.7)).s().p("AiKAhIAAhBIEVAAIAABBg");
	this.shape_280.setTransform(4556.475,369.95);

	this.shape_281 = new cjs.Shape();
	this.shape_281.graphics.bf(img.metaltexturegrungerustspottedagedoldrusteddirtyoxygenated5, null, new cjs.Matrix2D(1,0,0,1,-96,-1595.7)).s().p("AiKAhIAAhBIEVAAIAABBg");
	this.shape_281.setTransform(4556.475,320.8);

	this.shape_282 = new cjs.Shape();
	this.shape_282.graphics.bf(img.metaltexturegrungerustspottedagedoldrusteddirtyoxygenated5, null, new cjs.Matrix2D(1,0,0,1,-96,-1595.7)).s().p("AiKAhIAAhBIEVAAIAABBg");
	this.shape_282.setTransform(4597.325,300.15);

	this.shape_283 = new cjs.Shape();
	this.shape_283.graphics.bf(img.metaltexturegrungerustspottedagedoldrusteddirtyoxygenated5, null, new cjs.Matrix2D(0.781,0,0,1,-74.9,-1592)).s().p("AhANRIAAm1IAAhCIAAsnIAAhCIAAlBICBAAIAAahg");
	this.shape_283.setTransform(4533.3,349.625);

	this.shape_284 = new cjs.Shape();
	this.shape_284.graphics.bf(img.metaltexturegrungerustspottedagedoldrusteddirtyoxygenated5, null, new cjs.Matrix2D(0.781,0,0,1,-74.9,-1592)).s().p("AhANRIAAplIAAhCIAAmoIAAhCIAAoQICBAAIAAFBIAABCIAAMnIAABCIAAG1g");
	this.shape_284.setTransform(4576.9,349.625);

	this.shape_285 = new cjs.Shape();
	this.shape_285.graphics.bf(img.metaltexturegrungerustspottedagedoldrusteddirtyoxygenated5, null, new cjs.Matrix2D(1,0,0,1,-96.1,-1595.7)).s().p("AiKAhIAAhBIEVAAIAABBg");
	this.shape_285.setTransform(4680.875,300.15);

	this.shape_286 = new cjs.Shape();
	this.shape_286.graphics.bf(img.metaltexturegrungerustspottedagedoldrusteddirtyoxygenated5, null, new cjs.Matrix2D(0.781,0,0,1,-74.9,-1592)).s().p("AhANRIAAm1IAAhCIAAsnIAAhCIAAlBICBAAIAAIQIAABCIAAGoIAABCIAAJlg");
	this.shape_286.setTransform(4701.3,349.625);

	this.shape_287 = new cjs.Shape();
	this.shape_287.graphics.bf(img.metaltexturegrungerustspottedagedoldrusteddirtyoxygenated5, null, new cjs.Matrix2D(0.781,0,0,1,-74.9,-1592)).s().p("AhANRIAAm1IAAhCIAAsnIAAhCIAAlBICBAAIAAIQIAABCIAAGoIAABCIAAJlg");
	this.shape_287.setTransform(4617.75,349.625);

	this.shape_288 = new cjs.Shape();
	this.shape_288.graphics.bf(img.metaltexturegrungerustspottedagedoldrusteddirtyoxygenated5, null, new cjs.Matrix2D(0.781,0,0,1,-74.9,-1592)).s().p("AhANRIAA6hICBAAIAAFBIAABCIAAMnIAABCIAAG1g");
	this.shape_288.setTransform(4660.45,349.625);

	this.shape_289 = new cjs.Shape();
	this.shape_289.graphics.f().s("#000000").ss(2,1,1).p("EAIthayIibAAIAAiEICbAAEAcKhaOIouAAIAAiEIIuAAEhZ2hayIotAAIAAiEIItAAEhHTgw6IHjAAIEEAAIJlAAIEEAAIItAAIEEAAIJRAAIEEAAIItAAIEEAAIJaAAIEEAAMBZBAAAEhMhgw6IEEAAIBKAAEivhgw6IHkAAIEEAAIJjAAIEEAAIIuAAIEEAAIJRAAIEEAAIIuAAIEEAAIIyAAIEEAAIItAAIEEAAIJRAAIAAv/EApggx1IAAugEAutg+6IAANFEhHTg/eIAAOkEjCEhayIouAAIAAiEIIuAAEkq3hayIotAAIAAiEIItAAEkYTgw6IHkAAIEEAAIJjAAIEFAAIIsAAIEEAAIJSAAIEEAAIIqAAIEEAAIJZAAIEEAAIIuAAIEEAAIJRAAIEEAAIBKAAEkdhgw6IEEAAIBKAAEmAcgw6IHkAAIEEAAIJjAAIEEAAIItAAIEEAAIJSAAIEEAAIIuAAIEEAAIIsAAIEEAAIItAAIEEAAIJSAAIAAv/Ei0vgw6IAAv/Eivhg/eIAAOkEkYTg/eIAAOkEmTAhaNIotAAIAAiEIItAAEn72haNIotAAIAAiEIItAAEnpSgw6IHkAAIEEAAIJjAAIEEAAIItAAIEEAAIJSAAIEEAAIIuAAIEEAAIJZAAIEEAAIItAAIEEAAIJSAAIEEAAIBKAAEnuggw6IEEAAIBKAAEpRhgw6IHkAAIEEAAIJkAAIEEAAIItAAIEEAAIJSAAIEEAAIItAAIEEAAIIyAAIEEAAIItAAIEEAAIJSAAIAAvaEmAcg+5IAAN/EmFqgw6IAAvaEnpSg+5IAAN/EpkEhaNIotAAIAAiEIItAAErM6haNIotAAIAAiEIItAAEq6Xgw6IHkAAIEEAAIJkAAIEEAAIItAAIEEAAIJTAAIEEAAIIsAAIEEAAIJaAAIEEAAIItAAIEEAAIJSAAIEEAAIBJAAEq/jgw6IEEAAIBIAAErZrgw6IEEAAIItAAIEEAAIJTAAIAAvaEpWugw6IAAvaEpRhg+5IAAN/Eq6Xg+5IAAN/ELxuhazIibAAIAAiEICbAAEKPLhazIouAAIAAiEIIuAAEIm9hazIotAAIAAiEIItAAEI5gg/fIAANqEI0Tgx1IAAvFEKhug/fIAANqEKchgx1IAAvFEG1fhazIAAiEIItAAEFNWhaOIAAiEIItAAEHQvg/fIAANqEHLigx1IAAvFEDtNhaOIotAAIAAiEIItAAECFAhaOIouAAIAAiEIIuAAECSWgx1IAAugECXjg+6IAANFED/wg+6IAANFED6igx1IAAugEBfTggAMAAAB84MtRAAAA");
	this.shape_289.setTransform(4693.45,1188.1);

	this.shape_290 = new cjs.Shape();
	this.shape_290.graphics.bf(img.metaltexturegrungerustspottedagedoldrusteddirtyoxygenated5, null, new cjs.Matrix2D(2,0,0,2,-192.4,-3191.6)).s().p("AkWBCIAAiDIItAAIAACDg");
	this.shape_290.setTransform(580.45,778.9);

	this.shape_291 = new cjs.Shape();
	this.shape_291.graphics.bf(img.metaltexturegrungerustspottedagedoldrusteddirtyoxygenated5, null, new cjs.Matrix2D(2,0,0,2,-192.4,-3191.6)).s().p("AkWBCIAAiDIItAAIAACDg");
	this.shape_291.setTransform(580.45,604.1);

	this.shape_292 = new cjs.Shape();
	this.shape_292.graphics.bf(img.metaltexturegrungerustspottedagedoldrusteddirtyoxygenated5, null, new cjs.Matrix2D(2,0,0,2,-192.4,-3191.6)).s().p("AkWBCIAAiDIIsAAIAACDg");
	this.shape_292.setTransform(495.05,743.7);

	this.shape_293 = new cjs.Shape();
	this.shape_293.graphics.bf(img.metaltexturegrungerustspottedagedoldrusteddirtyoxygenated5, null, new cjs.Matrix2D(2,0,0,2,-192.4,-3191.6)).s().p("AkWBCIAAiDIIsAAIAACDg");
	this.shape_293.setTransform(413.35,778.9);

	this.shape_294 = new cjs.Shape();
	this.shape_294.graphics.bf(img.metaltexturegrungerustspottedagedoldrusteddirtyoxygenated5, null, new cjs.Matrix2D(2,0,0,2,-192.4,-3191.6)).s().p("AkWBCIAAiDIIsAAIAACDg");
	this.shape_294.setTransform(413.35,604.1);

	this.shape_295 = new cjs.Shape();
	this.shape_295.graphics.bf(img.metaltexturegrungerustspottedagedoldrusteddirtyoxygenated5, null, new cjs.Matrix2D(2,0,0,2,-192.4,-3191.6)).s().p("AkWBCIAAiDIIsAAIAACDg");
	this.shape_295.setTransform(495.05,645.4);

	this.shape_296 = new cjs.Shape();
	this.shape_296.graphics.bf(img.metaltexturegrungerustspottedagedoldrusteddirtyoxygenated5, null, new cjs.Matrix2D(1.561,0,0,2,-150.2,-3183.3)).s().p("AiBa/IAAt+IAAiFIAA5OIAAiEIAAqpIEDAAIAARGIAACDIAANSIAACFIAATeg");
	this.shape_296.setTransform(454.2,702.25);

	this.shape_297 = new cjs.Shape();
	this.shape_297.graphics.bf(img.metaltexturegrungerustspottedagedoldrusteddirtyoxygenated5, null, new cjs.Matrix2D(1.561,0,0,2,-150.2,-3183.3)).s().p("AiBa/IAAzeIAAiFIAAtSIAAiDIAAxGIEDAAIAAKpIAACEIAAZOIAACFIAAN+g");
	this.shape_297.setTransform(372.5,702.25);

	this.shape_298 = new cjs.Shape();
	this.shape_298.graphics.bf(img.metaltexturegrungerustspottedagedoldrusteddirtyoxygenated5, null, new cjs.Matrix2D(1.561,0,0,2,-150.2,-3183.3)).s().p("AiBa/IAAt+IAAiFIAA5OIAAiEIAAqpIEDAAIAARGIAACDIAANSIAACFIAATeg");
	this.shape_298.setTransform(621.3,702.25);

	this.shape_299 = new cjs.Shape();
	this.shape_299.graphics.bf(img.metaltexturegrungerustspottedagedoldrusteddirtyoxygenated5, null, new cjs.Matrix2D(1.561,0,0,2,-150.2,-3183.3)).s().p("AiBa/MAAAg1+IEDAAIAAKpIAACEIAAZOIAACFIAAN+g");
	this.shape_299.setTransform(539.6,702.25);

	this.shape_300 = new cjs.Shape();
	this.shape_300.graphics.bf(img.metaltexturegrungerustspottedagedoldrusteddirtyoxygenated5, null, new cjs.Matrix2D(2,0,0,2,-192.4,-3191.6)).s().p("AkVBCIAAiDIIrAAIAACDg");
	this.shape_300.setTransform(331.65,743.7);

	this.shape_301 = new cjs.Shape();
	this.shape_301.graphics.bf(img.metaltexturegrungerustspottedagedoldrusteddirtyoxygenated5, null, new cjs.Matrix2D(2,0,0,2,-192.4,-3191.6)).s().p("AjMBCIhJAAIAAiDIIsAAIAACDg");
	this.shape_301.setTransform(244.45,778.9);

	this.shape_302 = new cjs.Shape();
	this.shape_302.graphics.bf(img.metaltexturegrungerustspottedagedoldrusteddirtyoxygenated5, null, new cjs.Matrix2D(2,0,0,2,-192.4,-3191.6)).s().p("AkVBCIAAiDIIsAAIAACDg");
	this.shape_302.setTransform(244.45,604.1);

	this.shape_303 = new cjs.Shape();
	this.shape_303.graphics.bf(img.metaltexturegrungerustspottedagedoldrusteddirtyoxygenated5, null, new cjs.Matrix2D(2,0,0,2,-192.4,-3191.6)).s().p("AkVBCIAAiDIIrAAIAACDg");
	this.shape_303.setTransform(331.65,645.4);

	this.shape_304 = new cjs.Shape();
	this.shape_304.graphics.bf(img.metaltexturegrungerustspottedagedoldrusteddirtyoxygenated5, null, new cjs.Matrix2D(2,0,0,2,-191.6,-3191.6)).s().p("AkVBCIAAiDIIsAAIAACDg");
	this.shape_304.setTransform(159.05,743.7);

	this.shape_305 = new cjs.Shape();
	this.shape_305.graphics.bf(img.metaltexturegrungerustspottedagedoldrusteddirtyoxygenated5, null, new cjs.Matrix2D(2,0,0,2,-191.6,-3191.6)).s().p("AkVBCIAAiDIIsAAIAACDg");
	this.shape_305.setTransform(77.35,778.9);

	this.shape_306 = new cjs.Shape();
	this.shape_306.graphics.bf(img.metaltexturegrungerustspottedagedoldrusteddirtyoxygenated5, null, new cjs.Matrix2D(2,0,0,2,-191.6,-3191.6)).s().p("AkVBCIAAiDIIsAAIAACDg");
	this.shape_306.setTransform(77.35,604.1);

	this.shape_307 = new cjs.Shape();
	this.shape_307.graphics.bf(img.metaltexturegrungerustspottedagedoldrusteddirtyoxygenated5, null, new cjs.Matrix2D(2,0,0,2,-191.6,-3191.6)).s().p("AkVBCIAAiDIIsAAIAACDg");
	this.shape_307.setTransform(159.05,645.4);

	this.shape_308 = new cjs.Shape();
	this.shape_308.graphics.bf(img.metaltexturegrungerustspottedagedoldrusteddirtyoxygenated5, null, new cjs.Matrix2D(1.561,0,0,2,-149.4,-3183.3)).s().p("AiBa/IAAt+IAAiFIAA5OIAAiEIAAqpIEDAAIAARGIAACDIAANSIAACFIAATeg");
	this.shape_308.setTransform(118.2,702.25);

	this.shape_309 = new cjs.Shape();
	this.shape_309.graphics.bf(img.metaltexturegrungerustspottedagedoldrusteddirtyoxygenated5, null, new cjs.Matrix2D(1.561,0,0,2,-149.4,-3183.3)).s().p("AiBa/MAAAg1+IEDAAIAAKpIAACEIAAZOIAACFIAAN+g");
	this.shape_309.setTransform(36.5,702.25);

	this.shape_310 = new cjs.Shape();
	this.shape_310.graphics.bf(img.metaltexturegrungerustspottedagedoldrusteddirtyoxygenated5, null, new cjs.Matrix2D(1.561,0,0,2,-150.2,-3183.3)).s().p("AiBa/IAAt+IAAiFIAA5OIAAiEIAAqpIEDAAMAAAA1+g");
	this.shape_310.setTransform(285.3,702.25);

	this.shape_311 = new cjs.Shape();
	this.shape_311.graphics.bf(img.metaltexturegrungerustspottedagedoldrusteddirtyoxygenated5, null, new cjs.Matrix2D(1.561,0,0,2,-150.2,-3183.3)).s().p("AiBa/IAAvZMAAAgmlIEDAAIAAKpIAACEIAAZOIAACFIAAN+g");
	this.shape_311.setTransform(203.6,702.25);

	this.shape_312 = new cjs.Shape();
	this.shape_312.graphics.bf(img.metaltexturegrungerustspottedagedoldrusteddirtyoxygenated5, null, new cjs.Matrix2D(2,0,0,2,-192.4,-3191.6)).s().p("AkWBCIAAiDIIsAAIAACDg");
	this.shape_312.setTransform(1251.45,778.9);

	this.shape_313 = new cjs.Shape();
	this.shape_313.graphics.bf(img.metaltexturegrungerustspottedagedoldrusteddirtyoxygenated5, null, new cjs.Matrix2D(2,0,0,2,-192.4,-3191.6)).s().p("AkVBCIAAiDIIsAAIAACDg");
	this.shape_313.setTransform(1166.05,743.7);

	this.shape_314 = new cjs.Shape();
	this.shape_314.graphics.bf(img.metaltexturegrungerustspottedagedoldrusteddirtyoxygenated5, null, new cjs.Matrix2D(2,0,0,2,-192.4,-3191.6)).s().p("AkVBCIAAiDIIsAAIAACDg");
	this.shape_314.setTransform(1166.05,645.4);

	this.shape_315 = new cjs.Shape();
	this.shape_315.graphics.bf(img.metaltexturegrungerustspottedagedoldrusteddirtyoxygenated5, null, new cjs.Matrix2D(2,0,0,2,-192.4,-3191.6)).s().p("AkWBCIAAiDIIsAAIAACDg");
	this.shape_315.setTransform(1251.45,604.1);

	this.shape_316 = new cjs.Shape();
	this.shape_316.graphics.bf(img.metaltexturegrungerustspottedagedoldrusteddirtyoxygenated5, null, new cjs.Matrix2D(2,0,0,2,-192.4,-3191.6)).s().p("AkVBCIAAiDIIsAAIAACDg");
	this.shape_316.setTransform(1084.35,778.9);

	this.shape_317 = new cjs.Shape();
	this.shape_317.graphics.bf(img.metaltexturegrungerustspottedagedoldrusteddirtyoxygenated5, null, new cjs.Matrix2D(2,0,0,2,-192.4,-3191.6)).s().p("AkWBCIAAiDIItAAIAACDg");
	this.shape_317.setTransform(1002.65,743.7);

	this.shape_318 = new cjs.Shape();
	this.shape_318.graphics.bf(img.metaltexturegrungerustspottedagedoldrusteddirtyoxygenated5, null, new cjs.Matrix2D(2,0,0,2,-192.4,-3191.6)).s().p("AkWBCIAAiDIItAAIAACDg");
	this.shape_318.setTransform(1002.65,645.4);

	this.shape_319 = new cjs.Shape();
	this.shape_319.graphics.bf(img.metaltexturegrungerustspottedagedoldrusteddirtyoxygenated5, null, new cjs.Matrix2D(2,0,0,2,-192.4,-3191.6)).s().p("AkVBCIAAiDIIsAAIAACDg");
	this.shape_319.setTransform(1084.35,604.1);

	this.shape_320 = new cjs.Shape();
	this.shape_320.graphics.bf(img.metaltexturegrungerustspottedagedoldrusteddirtyoxygenated5, null, new cjs.Matrix2D(1.561,0,0,2,-150.2,-3183.3)).s().p("AiBa/IAAzeIAAiFIAAtSIAAiDIAAxGIEDAAIAAKpIAACEIAAZOIAACFIAAN+g");
	this.shape_320.setTransform(1043.5,702.25);

	this.shape_321 = new cjs.Shape();
	this.shape_321.graphics.bf(img.metaltexturegrungerustspottedagedoldrusteddirtyoxygenated5, null, new cjs.Matrix2D(1.561,0,0,2,-150.2,-3183.3)).s().p("AiBa/IAAt+IAAiFIAA5OIAAiEIAAqpIEDAAIAARGIAACDIAANSIAACFIAATeg");
	this.shape_321.setTransform(1125.2,702.25);

	this.shape_322 = new cjs.Shape();
	this.shape_322.graphics.bf(img.metaltexturegrungerustspottedagedoldrusteddirtyoxygenated5, null, new cjs.Matrix2D(1.561,0,0,2,-150.2,-3183.3)).s().p("AiBa/MAAAg1+IEDAAIAAKpIAACEIAAZOIAACFIAAN+g");
	this.shape_322.setTransform(1210.6,702.25);

	this.shape_323 = new cjs.Shape();
	this.shape_323.graphics.bf(img.metaltexturegrungerustspottedagedoldrusteddirtyoxygenated5, null, new cjs.Matrix2D(2,0,0,2,-192.4,-3191.6)).s().p("AjNBCIhJAAIAAiDIIsAAIAACDg");
	this.shape_323.setTransform(915.45,778.9);

	this.shape_324 = new cjs.Shape();
	this.shape_324.graphics.bf(img.metaltexturegrungerustspottedagedoldrusteddirtyoxygenated5, null, new cjs.Matrix2D(2,0,0,2,-192.4,-3191.6)).s().p("AkWBCIAAiDIIsAAIAACDg");
	this.shape_324.setTransform(915.45,604.1);

	this.shape_325 = new cjs.Shape();
	this.shape_325.graphics.bf(img.metaltexturegrungerustspottedagedoldrusteddirtyoxygenated5, null, new cjs.Matrix2D(2,0,0,2,-192.4,-3191.6)).s().p("AkWBCIAAiDIIsAAIAACDg");
	this.shape_325.setTransform(830.05,743.7);

	this.shape_326 = new cjs.Shape();
	this.shape_326.graphics.bf(img.metaltexturegrungerustspottedagedoldrusteddirtyoxygenated5, null, new cjs.Matrix2D(2,0,0,2,-192.4,-3191.6)).s().p("AkVBCIAAiDIIrAAIAACDg");
	this.shape_326.setTransform(748.35,778.9);

	this.shape_327 = new cjs.Shape();
	this.shape_327.graphics.bf(img.metaltexturegrungerustspottedagedoldrusteddirtyoxygenated5, null, new cjs.Matrix2D(2,0,0,2,-192.4,-3191.6)).s().p("AkVBCIAAiDIIsAAIAACDg");
	this.shape_327.setTransform(662.15,743.7);

	this.shape_328 = new cjs.Shape();
	this.shape_328.graphics.bf(img.metaltexturegrungerustspottedagedoldrusteddirtyoxygenated5, null, new cjs.Matrix2D(2,0,0,2,-192.4,-3191.6)).s().p("AkVBCIAAiDIIsAAIAACDg");
	this.shape_328.setTransform(662.15,645.4);

	this.shape_329 = new cjs.Shape();
	this.shape_329.graphics.bf(img.metaltexturegrungerustspottedagedoldrusteddirtyoxygenated5, null, new cjs.Matrix2D(2,0,0,2,-192.4,-3191.6)).s().p("AkVBCIAAiDIIrAAIAACDg");
	this.shape_329.setTransform(748.35,604.1);

	this.shape_330 = new cjs.Shape();
	this.shape_330.graphics.bf(img.metaltexturegrungerustspottedagedoldrusteddirtyoxygenated5, null, new cjs.Matrix2D(2,0,0,2,-192.4,-3191.6)).s().p("AkWBCIAAiDIIsAAIAACDg");
	this.shape_330.setTransform(830.05,645.4);

	this.shape_331 = new cjs.Shape();
	this.shape_331.graphics.bf(img.metaltexturegrungerustspottedagedoldrusteddirtyoxygenated5, null, new cjs.Matrix2D(1.561,0,0,2,-150.2,-3183.3)).s().p("AiBa/IAAt+IAAiFIAA5OIAAiEIAAqpIEDAAIAARGIAACDIAANSIAACFIAATeg");
	this.shape_331.setTransform(789.2,702.25);

	this.shape_332 = new cjs.Shape();
	this.shape_332.graphics.bf(img.metaltexturegrungerustspottedagedoldrusteddirtyoxygenated5, null, new cjs.Matrix2D(1.561,0,0,2,-150.2,-3183.3)).s().p("AiBa/MAAAg1+IEDAAIAAKpIAACEIAAZOIAACFIAAN+g");
	this.shape_332.setTransform(707.5,702.25);

	this.shape_333 = new cjs.Shape();
	this.shape_333.graphics.bf(img.metaltexturegrungerustspottedagedoldrusteddirtyoxygenated5, null, new cjs.Matrix2D(1.561,0,0,2,-150.2,-3183.3)).s().p("AiBa/IAAt+IAAiFIAA5OIAAiEIAAqpIEDAAMAAAA1+g");
	this.shape_333.setTransform(956.3,702.25);

	this.shape_334 = new cjs.Shape();
	this.shape_334.graphics.bf(img.metaltexturegrungerustspottedagedoldrusteddirtyoxygenated5, null, new cjs.Matrix2D(1.561,0,0,2,-150.2,-3183.3)).s().p("AiBa/IAAvZMAAAgmlIEDAAIAAKpIAACEIAAZOIAACFIAAN+g");
	this.shape_334.setTransform(874.6,702.25);

	this.shape_335 = new cjs.Shape();
	this.shape_335.graphics.bf(img.metaltexturegrungerustspottedagedoldrusteddirtyoxygenated5, null, new cjs.Matrix2D(2,0,0,2,-192.4,-3191.6)).s().p("AkVBCIAAiDIIsAAIAACDg");
	this.shape_335.setTransform(1833.05,743.7);

	this.shape_336 = new cjs.Shape();
	this.shape_336.graphics.bf(img.metaltexturegrungerustspottedagedoldrusteddirtyoxygenated5, null, new cjs.Matrix2D(2,0,0,2,-192.4,-3191.6)).s().p("AkVBCIAAiDIIsAAIAACDg");
	this.shape_336.setTransform(1833.05,645.4);

	this.shape_337 = new cjs.Shape();
	this.shape_337.graphics.bf(img.metaltexturegrungerustspottedagedoldrusteddirtyoxygenated5, null, new cjs.Matrix2D(2,0,0,2,-192.4,-3191.6)).s().p("AkVBCIAAiDIIsAAIAACDg");
	this.shape_337.setTransform(1751.35,778.9);

	this.shape_338 = new cjs.Shape();
	this.shape_338.graphics.bf(img.metaltexturegrungerustspottedagedoldrusteddirtyoxygenated5, null, new cjs.Matrix2D(2,0,0,2,-192.4,-3191.6)).s().p("AkWBCIAAiDIIsAAIAACDg");
	this.shape_338.setTransform(1669.65,743.7);

	this.shape_339 = new cjs.Shape();
	this.shape_339.graphics.bf(img.metaltexturegrungerustspottedagedoldrusteddirtyoxygenated5, null, new cjs.Matrix2D(2,0,0,2,-192.4,-3191.6)).s().p("AkWBCIAAiDIIsAAIAACDg");
	this.shape_339.setTransform(1669.65,645.4);

	this.shape_340 = new cjs.Shape();
	this.shape_340.graphics.bf(img.metaltexturegrungerustspottedagedoldrusteddirtyoxygenated5, null, new cjs.Matrix2D(2,0,0,2,-192.4,-3191.6)).s().p("AkVBCIAAiDIIsAAIAACDg");
	this.shape_340.setTransform(1751.35,604.1);

	this.shape_341 = new cjs.Shape();
	this.shape_341.graphics.bf(img.metaltexturegrungerustspottedagedoldrusteddirtyoxygenated5, null, new cjs.Matrix2D(1.561,0,0,2,-150.2,-3183.3)).s().p("AiBa/IAAzeIAAiFIAAtSIAAiDIAAxGIEDAAIAAKpIAACEIAAZOIAACFIAAN+g");
	this.shape_341.setTransform(1710.5,702.25);

	this.shape_342 = new cjs.Shape();
	this.shape_342.graphics.bf(img.metaltexturegrungerustspottedagedoldrusteddirtyoxygenated5, null, new cjs.Matrix2D(1.561,0,0,2,-150.2,-3183.3)).s().p("AiBa/MAAAg1+IEDAAIAAKpIAACEIAAZOIAACFIAAN+g");
	this.shape_342.setTransform(1877.6,702.25);

	this.shape_343 = new cjs.Shape();
	this.shape_343.graphics.bf(img.metaltexturegrungerustspottedagedoldrusteddirtyoxygenated5, null, new cjs.Matrix2D(1.561,0,0,2,-150.2,-3183.3)).s().p("AiBa/IAAt+IAAiFIAA5OIAAiEIAAqpIEDAAIAARGIAACDIAANSIAACFIAATeg");
	this.shape_343.setTransform(1792.2,702.25);

	this.shape_344 = new cjs.Shape();
	this.shape_344.graphics.bf(img.metaltexturegrungerustspottedagedoldrusteddirtyoxygenated5, null, new cjs.Matrix2D(2,0,0,2,-192.4,-3191.6)).s().p("AjNBCIhJAAIAAiDIIsAAIAACDg");
	this.shape_344.setTransform(1582.45,778.9);

	this.shape_345 = new cjs.Shape();
	this.shape_345.graphics.bf(img.metaltexturegrungerustspottedagedoldrusteddirtyoxygenated5, null, new cjs.Matrix2D(2,0,0,2,-192.4,-3191.6)).s().p("AkWBCIAAiDIIsAAIAACDg");
	this.shape_345.setTransform(1497.05,743.7);

	this.shape_346 = new cjs.Shape();
	this.shape_346.graphics.bf(img.metaltexturegrungerustspottedagedoldrusteddirtyoxygenated5, null, new cjs.Matrix2D(2,0,0,2,-192.4,-3191.6)).s().p("AkWBCIAAiDIIsAAIAACDg");
	this.shape_346.setTransform(1497.05,645.4);

	this.shape_347 = new cjs.Shape();
	this.shape_347.graphics.bf(img.metaltexturegrungerustspottedagedoldrusteddirtyoxygenated5, null, new cjs.Matrix2D(2,0,0,2,-192.4,-3191.6)).s().p("AkWBCIAAiDIIsAAIAACDg");
	this.shape_347.setTransform(1582.45,604.1);

	this.shape_348 = new cjs.Shape();
	this.shape_348.graphics.bf(img.metaltexturegrungerustspottedagedoldrusteddirtyoxygenated5, null, new cjs.Matrix2D(2,0,0,2,-192.4,-3191.6)).s().p("AkVBCIAAiDIIrAAIAACDg");
	this.shape_348.setTransform(1415.35,778.9);

	this.shape_349 = new cjs.Shape();
	this.shape_349.graphics.bf(img.metaltexturegrungerustspottedagedoldrusteddirtyoxygenated5, null, new cjs.Matrix2D(2,0,0,2,-192.4,-3191.6)).s().p("AkWBCIAAiDIIsAAIAACDg");
	this.shape_349.setTransform(1333.15,743.7);

	this.shape_350 = new cjs.Shape();
	this.shape_350.graphics.bf(img.metaltexturegrungerustspottedagedoldrusteddirtyoxygenated5, null, new cjs.Matrix2D(2,0,0,2,-192.4,-3191.6)).s().p("AkWBCIAAiDIIsAAIAACDg");
	this.shape_350.setTransform(1333.15,645.4);

	this.shape_351 = new cjs.Shape();
	this.shape_351.graphics.bf(img.metaltexturegrungerustspottedagedoldrusteddirtyoxygenated5, null, new cjs.Matrix2D(2,0,0,2,-192.4,-3191.6)).s().p("AkVBCIAAiDIIrAAIAACDg");
	this.shape_351.setTransform(1415.35,604.1);

	this.shape_352 = new cjs.Shape();
	this.shape_352.graphics.bf(img.metaltexturegrungerustspottedagedoldrusteddirtyoxygenated5, null, new cjs.Matrix2D(1.561,0,0,2,-150.2,-3183.3)).s().p("AiBa/IAAt+IAAiFIAA5OIAAiEIAAqpIEDAAIAARGIAACDIAANSIAACFIAATeg");
	this.shape_352.setTransform(1292.3,702.25);

	this.shape_353 = new cjs.Shape();
	this.shape_353.graphics.bf(img.metaltexturegrungerustspottedagedoldrusteddirtyoxygenated5, null, new cjs.Matrix2D(1.561,0,0,2,-150.2,-3183.3)).s().p("AiBa/MAAAg1+IEDAAIAAKpIAACEIAAZOIAACFIAAN+g");
	this.shape_353.setTransform(1374.5,702.25);

	this.shape_354 = new cjs.Shape();
	this.shape_354.graphics.bf(img.metaltexturegrungerustspottedagedoldrusteddirtyoxygenated5, null, new cjs.Matrix2D(1.561,0,0,2,-150.2,-3183.3)).s().p("AiBa/IAAt+IAAiFIAA5OIAAiEIAAqpIEDAAMAAAA1+g");
	this.shape_354.setTransform(1623.3,702.25);

	this.shape_355 = new cjs.Shape();
	this.shape_355.graphics.bf(img.metaltexturegrungerustspottedagedoldrusteddirtyoxygenated5, null, new cjs.Matrix2D(1.561,0,0,2,-150.2,-3183.3)).s().p("AiBa/IAAt+IAAiFIAA5OIAAiEIAAqpIEDAAIAARGIAACDIAANSIAACFIAATeg");
	this.shape_355.setTransform(1456.2,702.25);

	this.shape_356 = new cjs.Shape();
	this.shape_356.graphics.bf(img.metaltexturegrungerustspottedagedoldrusteddirtyoxygenated5, null, new cjs.Matrix2D(1.561,0,0,2,-150.2,-3183.3)).s().p("AiBa/IAAvZMAAAgmlIEDAAIAAKpIAACEIAAZOIAACFIAAN+g");
	this.shape_356.setTransform(1541.6,702.25);

	this.shape_357 = new cjs.Shape();
	this.shape_357.graphics.bf(img.metaltexturegrungerustspottedagedoldrusteddirtyoxygenated5, null, new cjs.Matrix2D(2,0,0,2,-192.4,-3191.6)).s().p("AkWBCIAAiDIIsAAIAACDg");
	this.shape_357.setTransform(2504.05,743.7);

	this.shape_358 = new cjs.Shape();
	this.shape_358.graphics.bf(img.metaltexturegrungerustspottedagedoldrusteddirtyoxygenated5, null, new cjs.Matrix2D(2,0,0,2,-192.4,-3191.6)).s().p("AkWBCIAAiDIIsAAIAACDg");
	this.shape_358.setTransform(2504.05,645.4);

	this.shape_359 = new cjs.Shape();
	this.shape_359.graphics.bf(img.metaltexturegrungerustspottedagedoldrusteddirtyoxygenated5, null, new cjs.Matrix2D(2,0,0,2,-192.4,-3191.6)).s().p("AkWBCIAAiDIIsAAIAACDg");
	this.shape_359.setTransform(2422.35,778.9);

	this.shape_360 = new cjs.Shape();
	this.shape_360.graphics.bf(img.metaltexturegrungerustspottedagedoldrusteddirtyoxygenated5, null, new cjs.Matrix2D(2,0,0,2,-192.4,-3191.6)).s().p("AkVBCIAAiDIIsAAIAACDg");
	this.shape_360.setTransform(2340.65,743.7);

	this.shape_361 = new cjs.Shape();
	this.shape_361.graphics.bf(img.metaltexturegrungerustspottedagedoldrusteddirtyoxygenated5, null, new cjs.Matrix2D(2,0,0,2,-192.4,-3191.6)).s().p("AkVBCIAAiDIIsAAIAACDg");
	this.shape_361.setTransform(2340.65,645.4);

	this.shape_362 = new cjs.Shape();
	this.shape_362.graphics.bf(img.metaltexturegrungerustspottedagedoldrusteddirtyoxygenated5, null, new cjs.Matrix2D(2,0,0,2,-192.4,-3191.6)).s().p("AkWBCIAAiDIIsAAIAACDg");
	this.shape_362.setTransform(2422.35,604.1);

	this.shape_363 = new cjs.Shape();
	this.shape_363.graphics.bf(img.metaltexturegrungerustspottedagedoldrusteddirtyoxygenated5, null, new cjs.Matrix2D(1.561,0,0,2,-150.2,-3183.3)).s().p("AiBa/IAAzeIAAiFIAAtSIAAiDIAAxGIEDAAIAAKpIAACEIAAZOIAACFIAAN+g");
	this.shape_363.setTransform(2381.5,702.25);

	this.shape_364 = new cjs.Shape();
	this.shape_364.graphics.bf(img.metaltexturegrungerustspottedagedoldrusteddirtyoxygenated5, null, new cjs.Matrix2D(1.561,0,0,2,-150.2,-3183.3)).s().p("AiBa/IAAt+IAAiFIAA5OIAAiEIAAqpIEDAAMAAAA1+g");
	this.shape_364.setTransform(2294.3,702.25);

	this.shape_365 = new cjs.Shape();
	this.shape_365.graphics.bf(img.metaltexturegrungerustspottedagedoldrusteddirtyoxygenated5, null, new cjs.Matrix2D(1.561,0,0,2,-150.2,-3183.3)).s().p("AiBa/MAAAg1+IEDAAIAAKpIAACEIAAZOIAACFIAAN+g");
	this.shape_365.setTransform(2548.6,702.25);

	this.shape_366 = new cjs.Shape();
	this.shape_366.graphics.bf(img.metaltexturegrungerustspottedagedoldrusteddirtyoxygenated5, null, new cjs.Matrix2D(1.561,0,0,2,-150.2,-3183.3)).s().p("AiBa/IAAt+IAAiFIAA5OIAAiEIAAqpIEDAAIAARGIAACDIAANSIAACFIAATeg");
	this.shape_366.setTransform(2463.2,702.25);

	this.shape_367 = new cjs.Shape();
	this.shape_367.graphics.bf(img.metaltexturegrungerustspottedagedoldrusteddirtyoxygenated5, null, new cjs.Matrix2D(2,0,0,2,-192.4,-3191.6)).s().p("AjNBCIhIAAIAAiDIIsAAIAACDg");
	this.shape_367.setTransform(2253.45,778.9);

	this.shape_368 = new cjs.Shape();
	this.shape_368.graphics.bf(img.metaltexturegrungerustspottedagedoldrusteddirtyoxygenated5, null, new cjs.Matrix2D(2,0,0,2,-192.4,-3191.6)).s().p("AkWBCIAAiDIItAAIAACDg");
	this.shape_368.setTransform(2168.05,743.7);

	this.shape_369 = new cjs.Shape();
	this.shape_369.graphics.bf(img.metaltexturegrungerustspottedagedoldrusteddirtyoxygenated5, null, new cjs.Matrix2D(2,0,0,2,-192.4,-3191.6)).s().p("AkVBCIAAiDIIsAAIAACDg");
	this.shape_369.setTransform(2253.45,604.1);

	this.shape_370 = new cjs.Shape();
	this.shape_370.graphics.bf(img.metaltexturegrungerustspottedagedoldrusteddirtyoxygenated5, null, new cjs.Matrix2D(2,0,0,2,-192.4,-3191.6)).s().p("AkWBCIAAiDIItAAIAACDg");
	this.shape_370.setTransform(2168.05,645.4);

	this.shape_371 = new cjs.Shape();
	this.shape_371.graphics.bf(img.metaltexturegrungerustspottedagedoldrusteddirtyoxygenated5, null, new cjs.Matrix2D(2,0,0,2,-192.4,-3191.6)).s().p("AkWBCIAAiDIIsAAIAACDg");
	this.shape_371.setTransform(2086.35,778.9);

	this.shape_372 = new cjs.Shape();
	this.shape_372.graphics.bf(img.metaltexturegrungerustspottedagedoldrusteddirtyoxygenated5, null, new cjs.Matrix2D(2,0,0,2,-192.4,-3191.6)).s().p("AkVBCIAAiDIIsAAIAACDg");
	this.shape_372.setTransform(1918.45,778.9);

	this.shape_373 = new cjs.Shape();
	this.shape_373.graphics.bf(img.metaltexturegrungerustspottedagedoldrusteddirtyoxygenated5, null, new cjs.Matrix2D(2,0,0,2,-192.4,-3191.6)).s().p("AkWBCIAAiDIIsAAIAACDg");
	this.shape_373.setTransform(2000.15,743.7);

	this.shape_374 = new cjs.Shape();
	this.shape_374.graphics.bf(img.metaltexturegrungerustspottedagedoldrusteddirtyoxygenated5, null, new cjs.Matrix2D(2,0,0,2,-192.4,-3191.6)).s().p("AkVBCIAAiDIIsAAIAACDg");
	this.shape_374.setTransform(1918.45,604.1);

	this.shape_375 = new cjs.Shape();
	this.shape_375.graphics.bf(img.metaltexturegrungerustspottedagedoldrusteddirtyoxygenated5, null, new cjs.Matrix2D(2,0,0,2,-192.4,-3191.6)).s().p("AkWBCIAAiDIIsAAIAACDg");
	this.shape_375.setTransform(2086.35,604.1);

	this.shape_376 = new cjs.Shape();
	this.shape_376.graphics.bf(img.metaltexturegrungerustspottedagedoldrusteddirtyoxygenated5, null, new cjs.Matrix2D(2,0,0,2,-192.4,-3191.6)).s().p("AkWBCIAAiDIIsAAIAACDg");
	this.shape_376.setTransform(2000.15,645.4);

	this.shape_377 = new cjs.Shape();
	this.shape_377.graphics.bf(img.metaltexturegrungerustspottedagedoldrusteddirtyoxygenated5, null, new cjs.Matrix2D(1.561,0,0,2,-150.2,-3183.3)).s().p("AiBa/MAAAg1+IEDAAIAAKpIAACEIAAZOIAACFIAAN+g");
	this.shape_377.setTransform(2045.5,702.25);

	this.shape_378 = new cjs.Shape();
	this.shape_378.graphics.bf(img.metaltexturegrungerustspottedagedoldrusteddirtyoxygenated5, null, new cjs.Matrix2D(1.561,0,0,2,-150.2,-3183.3)).s().p("AiBa/IAAt+IAAiFIAA5OIAAiEIAAqpIEDAAIAARGIAACDIAANSIAACFIAATeg");
	this.shape_378.setTransform(1959.3,702.25);

	this.shape_379 = new cjs.Shape();
	this.shape_379.graphics.bf(img.metaltexturegrungerustspottedagedoldrusteddirtyoxygenated5, null, new cjs.Matrix2D(1.561,0,0,2,-150.2,-3183.3)).s().p("AiBa/IAAvZMAAAgmlIEDAAIAAKpIAACEIAAZOIAACFIAAN+g");
	this.shape_379.setTransform(2212.6,702.25);

	this.shape_380 = new cjs.Shape();
	this.shape_380.graphics.bf(img.metaltexturegrungerustspottedagedoldrusteddirtyoxygenated5, null, new cjs.Matrix2D(1.561,0,0,2,-150.2,-3183.3)).s().p("AiBa/IAAt+IAAiFIAA5OIAAiEIAAqpIEDAAIAARGIAACDIAANSIAACFIAATeg");
	this.shape_380.setTransform(2127.2,702.25);

	this.shape_381 = new cjs.Shape();
	this.shape_381.graphics.bf(img.metaltexturegrungerustspottedagedoldrusteddirtyoxygenated5, null, new cjs.Matrix2D(2,0,0,2,-192.4,-3191.6)).s().p("AkWBCIAAiDIItAAIAACDg");
	this.shape_381.setTransform(3170.55,740);

	this.shape_382 = new cjs.Shape();
	this.shape_382.graphics.bf(img.metaltexturegrungerustspottedagedoldrusteddirtyoxygenated5, null, new cjs.Matrix2D(2,0,0,2,-192.4,-3191.6)).s().p("AkWBCIAAiDIItAAIAACDg");
	this.shape_382.setTransform(3170.55,641.7);

	this.shape_383 = new cjs.Shape();
	this.shape_383.graphics.bf(img.metaltexturegrungerustspottedagedoldrusteddirtyoxygenated5, null, new cjs.Matrix2D(2,0,0,2,-192.4,-3191.6)).s().p("AkWBCIAAiDIIsAAIAACDg");
	this.shape_383.setTransform(3088.85,775.2);

	this.shape_384 = new cjs.Shape();
	this.shape_384.graphics.bf(img.metaltexturegrungerustspottedagedoldrusteddirtyoxygenated5, null, new cjs.Matrix2D(2,0,0,2,-192.4,-3191.6)).s().p("AkWBCIAAiDIIsAAIAACDg");
	this.shape_384.setTransform(3007.15,740);

	this.shape_385 = new cjs.Shape();
	this.shape_385.graphics.bf(img.metaltexturegrungerustspottedagedoldrusteddirtyoxygenated5, null, new cjs.Matrix2D(2,0,0,2,-192.4,-3191.6)).s().p("AkWBCIAAiDIIsAAIAACDg");
	this.shape_385.setTransform(3007.15,641.7);

	this.shape_386 = new cjs.Shape();
	this.shape_386.graphics.bf(img.metaltexturegrungerustspottedagedoldrusteddirtyoxygenated5, null, new cjs.Matrix2D(1.561,0,0,2,-150.2,-3187)).s().p("AiBa/IAA0DIAAiEIAAtTIAAiDIAAwhIEDAAIAAKEIAACDIAAZPIAACFIAAOjg");
	this.shape_386.setTransform(3048,702.25);

	this.shape_387 = new cjs.Shape();
	this.shape_387.graphics.bf(img.metaltexturegrungerustspottedagedoldrusteddirtyoxygenated5, null, new cjs.Matrix2D(1.561,0,0,2,-150.2,-3187)).s().p("AiBa/IAAujIAAiFIAA5PIAAiDIAAqEIEDAAMAAAA1+g");
	this.shape_387.setTransform(2960.8,702.25);

	this.shape_388 = new cjs.Shape();
	this.shape_388.graphics.bf(img.metaltexturegrungerustspottedagedoldrusteddirtyoxygenated5, null, new cjs.Matrix2D(1.561,0,0,2,-150.2,-3187)).s().p("AiBa/MAAAg1+IEDAAIAAKEIAACDIAAZPIAACFIAAOjg");
	this.shape_388.setTransform(3215.1,702.25);

	this.shape_389 = new cjs.Shape();
	this.shape_389.graphics.bf(img.metaltexturegrungerustspottedagedoldrusteddirtyoxygenated5, null, new cjs.Matrix2D(2,0,0,2,-192.4,-3191.6)).s().p("AkWBCIAAiDIIsAAIAACDg");
	this.shape_389.setTransform(3088.85,600.4);

	this.shape_390 = new cjs.Shape();
	this.shape_390.graphics.bf(img.metaltexturegrungerustspottedagedoldrusteddirtyoxygenated5, null, new cjs.Matrix2D(1.561,0,0,2,-150.2,-3187)).s().p("AiBa/IAAujIAAiFIAA5PIAAiDIAAqEIEDAAIAAQhIAACDIAANTIAACEIAAUDg");
	this.shape_390.setTransform(3129.7,702.25);

	this.shape_391 = new cjs.Shape();
	this.shape_391.graphics.bf(img.metaltexturegrungerustspottedagedoldrusteddirtyoxygenated5, null, new cjs.Matrix2D(2,0,0,2,-192.4,-3191.6)).s().p("AjNBCIhJAAIAAiDIIsAAIAACDg");
	this.shape_391.setTransform(2919.95,775.2);

	this.shape_392 = new cjs.Shape();
	this.shape_392.graphics.bf(img.metaltexturegrungerustspottedagedoldrusteddirtyoxygenated5, null, new cjs.Matrix2D(2,0,0,2,-192.4,-3191.6)).s().p("AkWBCIAAiDIIsAAIAACDg");
	this.shape_392.setTransform(2834.55,740);

	this.shape_393 = new cjs.Shape();
	this.shape_393.graphics.bf(img.metaltexturegrungerustspottedagedoldrusteddirtyoxygenated5, null, new cjs.Matrix2D(2,0,0,2,-192.4,-3191.6)).s().p("AkWBCIAAiDIIsAAIAACDg");
	this.shape_393.setTransform(2834.55,641.7);

	this.shape_394 = new cjs.Shape();
	this.shape_394.graphics.bf(img.metaltexturegrungerustspottedagedoldrusteddirtyoxygenated5, null, new cjs.Matrix2D(2,0,0,2,-192.4,-3191.6)).s().p("AkVBCIAAiDIIsAAIAACDg");
	this.shape_394.setTransform(2752.85,775.2);

	this.shape_395 = new cjs.Shape();
	this.shape_395.graphics.bf(img.metaltexturegrungerustspottedagedoldrusteddirtyoxygenated5, null, new cjs.Matrix2D(2,0,0,2,-192.4,-3191.6)).s().p("AkWBCIAAiDIIsAAIAACDg");
	this.shape_395.setTransform(2589.45,778.9);

	this.shape_396 = new cjs.Shape();
	this.shape_396.graphics.bf(img.metaltexturegrungerustspottedagedoldrusteddirtyoxygenated5, null, new cjs.Matrix2D(2,0,0,2,-192.4,-3191.6)).s().p("AkVBCIAAiDIIrAAIAACDg");
	this.shape_396.setTransform(2671.15,745.5);

	this.shape_397 = new cjs.Shape();
	this.shape_397.graphics.bf(img.metaltexturegrungerustspottedagedoldrusteddirtyoxygenated5, null, new cjs.Matrix2D(2,0,0,2,-192.4,-3191.6)).s().p("AkWBCIAAiDIIsAAIAACDg");
	this.shape_397.setTransform(2589.45,604.1);

	this.shape_398 = new cjs.Shape();
	this.shape_398.graphics.bf(img.metaltexturegrungerustspottedagedoldrusteddirtyoxygenated5, null, new cjs.Matrix2D(2,0,0,2,-192.4,-3191.6)).s().p("AkVBCIAAiDIIrAAIAACDg");
	this.shape_398.setTransform(2671.15,647.2);

	this.shape_399 = new cjs.Shape();
	this.shape_399.graphics.bf(img.metaltexturegrungerustspottedagedoldrusteddirtyoxygenated5, null, new cjs.Matrix2D(1.561,0,0,2,-150.2,-3187)).s().p("AiBa/IAAzMIAAiFIAAtSIAAiDIAAxYIEDAAIAAKEIAACDIAAZPIAACFIAAOjg");
	this.shape_399.setTransform(2712,702.25);

	this.shape_400 = new cjs.Shape();
	this.shape_400.graphics.bf(img.metaltexturegrungerustspottedagedoldrusteddirtyoxygenated5, null, new cjs.Matrix2D(1.561,0,0,2,-150.2,-3183.3)).s().p("AiBa/IAAt+IAAiFIAA5OIAAiEIAAqpIEDAAIAARYIAACDIAANSIAACFIAATMg");
	this.shape_400.setTransform(2630.3,702.25);

	this.shape_401 = new cjs.Shape();
	this.shape_401.graphics.bf(img.metaltexturegrungerustspottedagedoldrusteddirtyoxygenated5, null, new cjs.Matrix2D(2,0,0,2,-192.4,-3191.6)).s().p("AkWBCIAAiDIIsAAIAACDg");
	this.shape_401.setTransform(2919.95,600.4);

	this.shape_402 = new cjs.Shape();
	this.shape_402.graphics.bf(img.metaltexturegrungerustspottedagedoldrusteddirtyoxygenated5, null, new cjs.Matrix2D(1.561,0,0,2,-150.2,-3187)).s().p("AiBa/IAAv+MAAAgmAIEDAAIAAKEIAACDIAAZPIAACFIAAOjg");
	this.shape_402.setTransform(2879.1,702.25);

	this.shape_403 = new cjs.Shape();
	this.shape_403.graphics.bf(img.metaltexturegrungerustspottedagedoldrusteddirtyoxygenated5, null, new cjs.Matrix2D(2,0,0,2,-192.4,-3191.6)).s().p("AkVBCIAAiDIIsAAIAACDg");
	this.shape_403.setTransform(2752.85,600.4);

	this.shape_404 = new cjs.Shape();
	this.shape_404.graphics.bf(img.metaltexturegrungerustspottedagedoldrusteddirtyoxygenated5, null, new cjs.Matrix2D(1.561,0,0,2,-150.2,-3187)).s().p("AiBa/IAAujIAAiFIAA5PIAAiDIAAqEIEDAAIAAQhIAACDIAANTIAACEIAAUDg");
	this.shape_404.setTransform(2793.7,702.25);

	this.shape_405 = new cjs.Shape();
	this.shape_405.graphics.bf(img.metaltexturegrungerustspottedagedoldrusteddirtyoxygenated5, null, new cjs.Matrix2D(2,0,0,2,-192,-3191.6)).s().p("AkVBCIAAiDIIrAAIAACDg");
	this.shape_405.setTransform(3841.15,740);

	this.shape_406 = new cjs.Shape();
	this.shape_406.graphics.bf(img.metaltexturegrungerustspottedagedoldrusteddirtyoxygenated5, null, new cjs.Matrix2D(2,0,0,2,-192,-3191.6)).s().p("AkVBCIAAiDIIrAAIAACDg");
	this.shape_406.setTransform(3759.45,775.2);

	this.shape_407 = new cjs.Shape();
	this.shape_407.graphics.bf(img.metaltexturegrungerustspottedagedoldrusteddirtyoxygenated5, null, new cjs.Matrix2D(2,0,0,2,-192,-3191.6)).s().p("AkVBCIAAiDIIrAAIAACDg");
	this.shape_407.setTransform(3841.15,641.7);

	this.shape_408 = new cjs.Shape();
	this.shape_408.graphics.bf(img.metaltexturegrungerustspottedagedoldrusteddirtyoxygenated5, null, new cjs.Matrix2D(2,0,0,2,-192,-3191.6)).s().p("AkWBCIAAiDIItAAIAACDg");
	this.shape_408.setTransform(3677.75,740);

	this.shape_409 = new cjs.Shape();
	this.shape_409.graphics.bf(img.metaltexturegrungerustspottedagedoldrusteddirtyoxygenated5, null, new cjs.Matrix2D(2,0,0,2,-192,-3191.6)).s().p("AkWBCIAAiDIItAAIAACDg");
	this.shape_409.setTransform(3677.75,641.7);

	this.shape_410 = new cjs.Shape();
	this.shape_410.graphics.bf(img.metaltexturegrungerustspottedagedoldrusteddirtyoxygenated5, null, new cjs.Matrix2D(1.561,0,0,2,-149.8,-3187)).s().p("AiBa/IAAukIAAiEIAA5OIAAiFIAAqDIEDAAMAAAA1+g");
	this.shape_410.setTransform(3631.4,702.25);

	this.shape_411 = new cjs.Shape();
	this.shape_411.graphics.bf(img.metaltexturegrungerustspottedagedoldrusteddirtyoxygenated5, null, new cjs.Matrix2D(2,0,0,2,-192,-3191.6)).s().p("AkVBCIAAiDIIrAAIAACDg");
	this.shape_411.setTransform(3759.45,600.4);

	this.shape_412 = new cjs.Shape();
	this.shape_412.graphics.bf(img.metaltexturegrungerustspottedagedoldrusteddirtyoxygenated5, null, new cjs.Matrix2D(1.561,0,0,2,-149.8,-3187)).s().p("AiBa/IAA0EIAAiDIAAtTIAAiEIAAwfIEDAAIAAKCIAACEIAAZQIAACEIAAOjg");
	this.shape_412.setTransform(3718.6,702.25);

	this.shape_413 = new cjs.Shape();
	this.shape_413.graphics.bf(img.metaltexturegrungerustspottedagedoldrusteddirtyoxygenated5, null, new cjs.Matrix2D(1.561,0,0,2,-149.8,-3187)).s().p("AiBbAIAAulIAAiEIAA5OIAAiEIAAqEIEDAAIAAQhIAACEIAANRIAACEIAAUFg");
	this.shape_413.setTransform(3800.3,702.25);

	this.shape_414 = new cjs.Shape();
	this.shape_414.graphics.bf(img.metaltexturegrungerustspottedagedoldrusteddirtyoxygenated5, null, new cjs.Matrix2D(2,0,0,2,-192,-3191.6)).s().p("AjNBCIhIAAIAAiDIIsAAIAACDg");
	this.shape_414.setTransform(3590.55,775.2);

	this.shape_415 = new cjs.Shape();
	this.shape_415.graphics.bf(img.metaltexturegrungerustspottedagedoldrusteddirtyoxygenated5, null, new cjs.Matrix2D(2,0,0,2,-192,-3191.6)).s().p("AkVBCIAAiDIIrAAIAACDg");
	this.shape_415.setTransform(3505.15,740);

	this.shape_416 = new cjs.Shape();
	this.shape_416.graphics.bf(img.metaltexturegrungerustspottedagedoldrusteddirtyoxygenated5, null, new cjs.Matrix2D(2,0,0,2,-192,-3191.6)).s().p("AkVBCIAAiDIIrAAIAACDg");
	this.shape_416.setTransform(3505.15,641.7);

	this.shape_417 = new cjs.Shape();
	this.shape_417.graphics.bf(img.metaltexturegrungerustspottedagedoldrusteddirtyoxygenated5, null, new cjs.Matrix2D(2,0,0,2,-192,-3191.6)).s().p("AkVBCIAAiDIIsAAIAACDg");
	this.shape_417.setTransform(3423.45,775.2);

	this.shape_418 = new cjs.Shape();
	this.shape_418.graphics.bf(img.metaltexturegrungerustspottedagedoldrusteddirtyoxygenated5, null, new cjs.Matrix2D(2,0,0,2,-192.2,-3191.6)).s().p("AkTBCIAAiDIInAAIAACDg");
	this.shape_418.setTransform(3255.75,775.2);

	this.shape_419 = new cjs.Shape();
	this.shape_419.graphics.bf(img.metaltexturegrungerustspottedagedoldrusteddirtyoxygenated5, null, new cjs.Matrix2D(2,0,0,2,-192,-3191.6)).s().p("AkWBCIAAiDIIsAAIAACDg");
	this.shape_419.setTransform(3337.25,740);

	this.shape_420 = new cjs.Shape();
	this.shape_420.graphics.bf(img.metaltexturegrungerustspottedagedoldrusteddirtyoxygenated5, null, new cjs.Matrix2D(2,0,0,2,-192,-3191.6)).s().p("AkWBCIAAiDIIsAAIAACDg");
	this.shape_420.setTransform(3337.25,641.7);

	this.shape_421 = new cjs.Shape();
	this.shape_421.graphics.bf(img.metaltexturegrungerustspottedagedoldrusteddirtyoxygenated5, null, new cjs.Matrix2D(1.561,0,0,2,-149.8,-3187)).s().p("AiBa/MAAAg1+IEDAAIAAKEIAACDIAAZPIAACFIAAOjg");
	this.shape_421.setTransform(3382.6,702.25);

	this.shape_422 = new cjs.Shape();
	this.shape_422.graphics.bf(img.metaltexturegrungerustspottedagedoldrusteddirtyoxygenated5, null, new cjs.Matrix2D(2,0,0,2,-192.2,-3191.6)).s().p("AkTBCIAAiDIInAAIAACDg");
	this.shape_422.setTransform(3255.75,600.4);

	this.shape_423 = new cjs.Shape();
	this.shape_423.graphics.bf(img.metaltexturegrungerustspottedagedoldrusteddirtyoxygenated5, null, new cjs.Matrix2D(1.561,0,0,2,-149.8,-3187)).s().p("AiBa/IAAujIAAiFIAA5PIAAiDIAAqEIEDAAIAAQhIAACDIAANTIAACEIAAUDg");
	this.shape_423.setTransform(3296.4,702.25);

	this.shape_424 = new cjs.Shape();
	this.shape_424.graphics.bf(img.metaltexturegrungerustspottedagedoldrusteddirtyoxygenated5, null, new cjs.Matrix2D(2,0,0,2,-192,-3191.6)).s().p("AkVBCIAAiDIIsAAIAACDg");
	this.shape_424.setTransform(3590.55,600.4);

	this.shape_425 = new cjs.Shape();
	this.shape_425.graphics.bf(img.metaltexturegrungerustspottedagedoldrusteddirtyoxygenated5, null, new cjs.Matrix2D(1.561,0,0,2,-149.8,-3187)).s().p("AiBa/IAAv+MAAAgmAIEDAAIAAKEIAACDIAAZPIAACFIAAOjg");
	this.shape_425.setTransform(3549.7,702.25);

	this.shape_426 = new cjs.Shape();
	this.shape_426.graphics.bf(img.metaltexturegrungerustspottedagedoldrusteddirtyoxygenated5, null, new cjs.Matrix2D(2,0,0,2,-192,-3191.6)).s().p("AkVBCIAAiDIIsAAIAACDg");
	this.shape_426.setTransform(3423.45,600.4);

	this.shape_427 = new cjs.Shape();
	this.shape_427.graphics.bf(img.metaltexturegrungerustspottedagedoldrusteddirtyoxygenated5, null, new cjs.Matrix2D(1.561,0,0,2,-149.8,-3187)).s().p("AiBa/IAAujIAAiFIAA5PIAAiDIAAqEIEDAAIAAQhIAACDIAANTIAACEIAAUDg");
	this.shape_427.setTransform(3464.3,702.25);

	this.shape_428 = new cjs.Shape();
	this.shape_428.graphics.bf(img.metaltexturegrungerustspottedagedoldrusteddirtyoxygenated5, null, new cjs.Matrix2D(2,0,0,2,-192,-3191.6)).s().p("AkWBCIAAiDIIsAAIAACDg");
	this.shape_428.setTransform(4426.45,775.2);

	this.shape_429 = new cjs.Shape();
	this.shape_429.graphics.bf(img.metaltexturegrungerustspottedagedoldrusteddirtyoxygenated5, null, new cjs.Matrix2D(2,0,0,2,-192,-3191.6)).s().p("AkWBCIAAiDIItAAIAACDg");
	this.shape_429.setTransform(4344.75,740);

	this.shape_430 = new cjs.Shape();
	this.shape_430.graphics.bf(img.metaltexturegrungerustspottedagedoldrusteddirtyoxygenated5, null, new cjs.Matrix2D(2,0,0,2,-192,-3191.6)).s().p("AjNBCIhIAAIAAiDIIrAAIAACDg");
	this.shape_430.setTransform(4257.55,775.2);

	this.shape_431 = new cjs.Shape();
	this.shape_431.graphics.bf(img.metaltexturegrungerustspottedagedoldrusteddirtyoxygenated5, null, new cjs.Matrix2D(2,0,0,2,-192,-3191.6)).s().p("AkWBCIAAiDIItAAIAACDg");
	this.shape_431.setTransform(4344.75,641.7);

	this.shape_432 = new cjs.Shape();
	this.shape_432.graphics.bf(img.metaltexturegrungerustspottedagedoldrusteddirtyoxygenated5, null, new cjs.Matrix2D(2,0,0,2,-192,-3191.6)).s().p("AkVBCIAAiDIIrAAIAACDg");
	this.shape_432.setTransform(4257.55,600.4);

	this.shape_433 = new cjs.Shape();
	this.shape_433.graphics.bf(img.metaltexturegrungerustspottedagedoldrusteddirtyoxygenated5, null, new cjs.Matrix2D(1.561,0,0,2,-149.8,-3187)).s().p("AiBa/IAAukIAAiDIAA5QIAAiDIAAqDIEDAAMAAAA19g");
	this.shape_433.setTransform(4298.4,702.25);

	this.shape_434 = new cjs.Shape();
	this.shape_434.graphics.bf(img.metaltexturegrungerustspottedagedoldrusteddirtyoxygenated5, null, new cjs.Matrix2D(2,0,0,2,-192,-3191.6)).s().p("AkWBCIAAiDIIsAAIAACDg");
	this.shape_434.setTransform(4426.45,600.4);

	this.shape_435 = new cjs.Shape();
	this.shape_435.graphics.bf(img.metaltexturegrungerustspottedagedoldrusteddirtyoxygenated5, null, new cjs.Matrix2D(1.561,0,0,2,-149.8,-3187)).s().p("AiBbAIAA0FIAAiDIAAtSIAAiFIAAwgIEDAAIAAKDIAACFIAAZOIAACEIAAOlg");
	this.shape_435.setTransform(4385.6,702.25);

	this.shape_436 = new cjs.Shape();
	this.shape_436.graphics.bf(img.metaltexturegrungerustspottedagedoldrusteddirtyoxygenated5, null, new cjs.Matrix2D(1.561,0,0,2,-149.8,-3187)).s().p("AiBbAIAAukIAAiFIAA5OIAAiFIAAqCIEDAAIAAQgIAACDIAANTIAACDIAAUFg");
	this.shape_436.setTransform(4467.3,702.25);

	this.shape_437 = new cjs.Shape();
	this.shape_437.graphics.bf(img.metaltexturegrungerustspottedagedoldrusteddirtyoxygenated5, null, new cjs.Matrix2D(2,0,0,2,-192,-3191.6)).s().p("AkWBCIAAiDIItAAIAACDg");
	this.shape_437.setTransform(4172.15,740);

	this.shape_438 = new cjs.Shape();
	this.shape_438.graphics.bf(img.metaltexturegrungerustspottedagedoldrusteddirtyoxygenated5, null, new cjs.Matrix2D(2,0,0,2,-192,-3191.6)).s().p("AkWBCIAAiDIIsAAIAACDg");
	this.shape_438.setTransform(4090.45,775.2);

	this.shape_439 = new cjs.Shape();
	this.shape_439.graphics.bf(img.metaltexturegrungerustspottedagedoldrusteddirtyoxygenated5, null, new cjs.Matrix2D(2,0,0,2,-192,-3191.6)).s().p("AkWBCIAAiDIItAAIAACDg");
	this.shape_439.setTransform(4172.15,641.7);

	this.shape_440 = new cjs.Shape();
	this.shape_440.graphics.bf(img.metaltexturegrungerustspottedagedoldrusteddirtyoxygenated5, null, new cjs.Matrix2D(2,0,0,2,-192,-3191.6)).s().p("AkWBCIAAiDIIsAAIAACDg");
	this.shape_440.setTransform(4008.25,740);

	this.shape_441 = new cjs.Shape();
	this.shape_441.graphics.bf(img.metaltexturegrungerustspottedagedoldrusteddirtyoxygenated5, null, new cjs.Matrix2D(2,0,0,2,-192,-3191.6)).s().p("AkVBCIAAiDIIsAAIAACDg");
	this.shape_441.setTransform(3926.55,775.2);

	this.shape_442 = new cjs.Shape();
	this.shape_442.graphics.bf(img.metaltexturegrungerustspottedagedoldrusteddirtyoxygenated5, null, new cjs.Matrix2D(2,0,0,2,-192,-3191.6)).s().p("AkWBCIAAiDIIsAAIAACDg");
	this.shape_442.setTransform(4008.25,641.7);

	this.shape_443 = new cjs.Shape();
	this.shape_443.graphics.bf(img.metaltexturegrungerustspottedagedoldrusteddirtyoxygenated5, null, new cjs.Matrix2D(2,0,0,2,-192,-3191.6)).s().p("AkVBCIAAiDIIsAAIAACDg");
	this.shape_443.setTransform(3926.55,600.4);

	this.shape_444 = new cjs.Shape();
	this.shape_444.graphics.bf(img.metaltexturegrungerustspottedagedoldrusteddirtyoxygenated5, null, new cjs.Matrix2D(1.561,0,0,2,-149.8,-3187)).s().p("AiBa/MAAAg19IEDAAIAAKCIAACEIAAZPIAACFIAAOjg");
	this.shape_444.setTransform(3885.7,702.25);

	this.shape_445 = new cjs.Shape();
	this.shape_445.graphics.bf(img.metaltexturegrungerustspottedagedoldrusteddirtyoxygenated5, null, new cjs.Matrix2D(1.561,0,0,2,-149.8,-3187)).s().p("AiBbAIAAulIAAiDIAA5PIAAiEIAAqEIEDAAIAAQgIAACEIAANTIAACDIAAUFg");
	this.shape_445.setTransform(3967.4,702.25);

	this.shape_446 = new cjs.Shape();
	this.shape_446.graphics.bf(img.metaltexturegrungerustspottedagedoldrusteddirtyoxygenated5, null, new cjs.Matrix2D(1.561,0,0,2,-149.8,-3187)).s().p("AiBa/IAAv+MAAAgmAIEDAAIAAKDIAACEIAAZPIAACEIAAOkg");
	this.shape_446.setTransform(4216.7,702.25);

	this.shape_447 = new cjs.Shape();
	this.shape_447.graphics.bf(img.metaltexturegrungerustspottedagedoldrusteddirtyoxygenated5, null, new cjs.Matrix2D(2,0,0,2,-192,-3191.6)).s().p("AkWBCIAAiDIIsAAIAACDg");
	this.shape_447.setTransform(4090.45,600.4);

	this.shape_448 = new cjs.Shape();
	this.shape_448.graphics.bf(img.metaltexturegrungerustspottedagedoldrusteddirtyoxygenated5, null, new cjs.Matrix2D(1.561,0,0,2,-149.8,-3187)).s().p("AiBbAMAAAg1/IEDAAIAAKDIAACEIAAZQIAACDIAAOlg");
	this.shape_448.setTransform(4049.6,702.25);

	this.shape_449 = new cjs.Shape();
	this.shape_449.graphics.bf(img.metaltexturegrungerustspottedagedoldrusteddirtyoxygenated5, null, new cjs.Matrix2D(1.561,0,0,2,-149.8,-3187)).s().p("AiBa/IAAukIAAiDIAA5PIAAiFIAAqDIEDAAIAAQhIAACEIAANRIAACFIAAUDg");
	this.shape_449.setTransform(4131.3,702.25);

	this.shape_450 = new cjs.Shape();
	this.shape_450.graphics.bf(img.metaltexturegrungerustspottedagedoldrusteddirtyoxygenated5, null, new cjs.Matrix2D(2,0,0,2,-192.5,-3191.4)).s().p("AkVBCIAAiDIIsAAIAACDg");
	this.shape_450.setTransform(5100.05,743.6);

	this.shape_451 = new cjs.Shape();
	this.shape_451.graphics.bf(img.metaltexturegrungerustspottedagedoldrusteddirtyoxygenated5, null, new cjs.Matrix2D(2,0,0,2,-192.5,-3191.4)).s().p("AkVBCIAAiDIIsAAIAACDg");
	this.shape_451.setTransform(5100.05,645.3);

	this.shape_452 = new cjs.Shape();
	this.shape_452.graphics.bf(img.metaltexturegrungerustspottedagedoldrusteddirtyoxygenated5, null, new cjs.Matrix2D(2,0,0,2,-192.5,-3191.4)).s().p("AjNBCIhIAAIAAiDIIsAAIAACDg");
	this.shape_452.setTransform(5012.85,778.8);

	this.shape_453 = new cjs.Shape();
	this.shape_453.graphics.bf(img.metaltexturegrungerustspottedagedoldrusteddirtyoxygenated5, null, new cjs.Matrix2D(2,0,0,2,-191.6,-3191.4)).s().p("AkWBCIAAiDIItAAIAACDg");
	this.shape_453.setTransform(4927.45,743.6);

	this.shape_454 = new cjs.Shape();
	this.shape_454.graphics.bf(img.metaltexturegrungerustspottedagedoldrusteddirtyoxygenated5, null, new cjs.Matrix2D(2,0,0,2,-191.6,-3191.4)).s().p("AkWBCIAAiDIItAAIAACDg");
	this.shape_454.setTransform(4927.45,645.3);

	this.shape_455 = new cjs.Shape();
	this.shape_455.graphics.bf(img.metaltexturegrungerustspottedagedoldrusteddirtyoxygenated5, null, new cjs.Matrix2D(2,0,0,2,-192.5,-3191.4)).s().p("AkVBCIAAiDIIsAAIAACDg");
	this.shape_455.setTransform(5012.85,604);

	this.shape_456 = new cjs.Shape();
	this.shape_456.graphics.bf(img.metaltexturegrungerustspottedagedoldrusteddirtyoxygenated5, null, new cjs.Matrix2D(1.561,0,0,2,-150.3,-3180.2)).s().p("AiBaiIAAufMAAAgmkIEDAAIAAKnIAACEIAAZPIAACEIAANFg");
	this.shape_456.setTransform(4972,699.25);

	this.shape_457 = new cjs.Shape();
	this.shape_457.graphics.bf(img.metaltexturegrungerustspottedagedoldrusteddirtyoxygenated5, null, new cjs.Matrix2D(1.561,0,0,2,-149.4,-3180.2)).s().p("AiBaiIAAtEIAAiEIAA5PIAAiFIAAqoIEDAAIAARFIAACEIAANSIAACEIAASlg");
	this.shape_457.setTransform(4886.6,699.25);

	this.shape_458 = new cjs.Shape();
	this.shape_458.graphics.bf(img.metaltexturegrungerustspottedagedoldrusteddirtyoxygenated5, null, new cjs.Matrix2D(1.561,0,0,2,-150.3,-3180.2)).s().p("AiBaiIAAylIAAiEIAAtRIAAiFIAAxFIEDAAIAAKoIAACFIAAZPIAACDIAANFg");
	this.shape_458.setTransform(5140.9,699.25);

	this.shape_459 = new cjs.Shape();
	this.shape_459.graphics.bf(img.metaltexturegrungerustspottedagedoldrusteddirtyoxygenated5, null, new cjs.Matrix2D(1.561,0,0,2,-150.3,-3180.2)).s().p("AiBaiIAAtFIAAiDIAA5QIAAiEIAAqoIEDAAMAAAA1Eg");
	this.shape_459.setTransform(5053.7,699.25);

	this.shape_460 = new cjs.Shape();
	this.shape_460.graphics.bf(img.metaltexturegrungerustspottedagedoldrusteddirtyoxygenated5, null, new cjs.Matrix2D(2,0,0,2,-191.6,-3191.4)).s().p("AkWBCIAAiDIIsAAIAACDg");
	this.shape_460.setTransform(4845.75,778.8);

	this.shape_461 = new cjs.Shape();
	this.shape_461.graphics.bf(img.metaltexturegrungerustspottedagedoldrusteddirtyoxygenated5, null, new cjs.Matrix2D(2,0,0,2,-171.9,-3191.6)).s().p("AhMBCIAAiDICaAAIAACDg");
	this.shape_461.setTransform(4741.35,775.2);

	this.shape_462 = new cjs.Shape();
	this.shape_462.graphics.bf(img.metaltexturegrungerustspottedagedoldrusteddirtyoxygenated5, null, new cjs.Matrix2D(2,0,0,2,-191.6,-3191.4)).s().p("AkWBCIAAiDIIsAAIAACDg");
	this.shape_462.setTransform(4845.75,604);

	this.shape_463 = new cjs.Shape();
	this.shape_463.graphics.bf(img.metaltexturegrungerustspottedagedoldrusteddirtyoxygenated5, null, new cjs.Matrix2D(2,0,0,2,-192,-3191.6)).s().p("AkWBCIAAiDIItAAIAACDg");
	this.shape_463.setTransform(4675.25,740);

	this.shape_464 = new cjs.Shape();
	this.shape_464.graphics.bf(img.metaltexturegrungerustspottedagedoldrusteddirtyoxygenated5, null, new cjs.Matrix2D(2,0,0,2,-192,-3191.6)).s().p("AkWBCIAAiDIIsAAIAACDg");
	this.shape_464.setTransform(4593.55,775.2);

	this.shape_465 = new cjs.Shape();
	this.shape_465.graphics.bf(img.metaltexturegrungerustspottedagedoldrusteddirtyoxygenated5, null, new cjs.Matrix2D(2,0,0,2,-192,-3191.6)).s().p("AkWBCIAAiDIItAAIAACDg");
	this.shape_465.setTransform(4508.15,740);

	this.shape_466 = new cjs.Shape();
	this.shape_466.graphics.bf(img.metaltexturegrungerustspottedagedoldrusteddirtyoxygenated5, null, new cjs.Matrix2D(2,0,0,2,-192,-3191.6)).s().p("AkWBCIAAiDIItAAIAACDg");
	this.shape_466.setTransform(4508.15,641.7);

	this.shape_467 = new cjs.Shape();
	this.shape_467.graphics.bf(img.metaltexturegrungerustspottedagedoldrusteddirtyoxygenated5, null, new cjs.Matrix2D(2,0,0,2,-192,-3191.6)).s().p("AkWBCIAAiDIItAAIAACDg");
	this.shape_467.setTransform(4675.25,641.7);

	this.shape_468 = new cjs.Shape();
	this.shape_468.graphics.bf(img.metaltexturegrungerustspottedagedoldrusteddirtyoxygenated5, null, new cjs.Matrix2D(1.561,0,0,2,-149.8,-3187)).s().p("AiBa/IAAujIAAiFIAA5OIAAiFIAAqCIEDAAIAAQfIAACEIAANSIAACFIAAUDg");
	this.shape_468.setTransform(4634.4,702.25);

	this.shape_469 = new cjs.Shape();
	this.shape_469.graphics.bf(img.metaltexturegrungerustspottedagedoldrusteddirtyoxygenated5, null, new cjs.Matrix2D(2,0,0,2,-192,-3191.6)).s().p("AkWBCIAAiDIIsAAIAACDg");
	this.shape_469.setTransform(4593.55,600.4);

	this.shape_470 = new cjs.Shape();
	this.shape_470.graphics.bf(img.metaltexturegrungerustspottedagedoldrusteddirtyoxygenated5, null, new cjs.Matrix2D(1.561,0,0,2,-149.8,-3187)).s().p("AiBbAMAAAg1/IEDAAIAAKDIAACEIAAZPIAACEIAAOlg");
	this.shape_470.setTransform(4552.7,702.25);

	this.shape_471 = new cjs.Shape();
	this.shape_471.graphics.bf(img.metaltexturegrungerustspottedagedoldrusteddirtyoxygenated5, null, new cjs.Matrix2D(1.561,0,0,2,-149.4,-3180.2)).s().p("AiBajMAAAg1FIEDAAIAAKpIAACEIAAZPIAACEIAANFg");
	this.shape_471.setTransform(4804.9,699.25);

	this.shape_472 = new cjs.Shape();
	this.shape_472.graphics.bf(img.metaltexturegrungerustspottedagedoldrusteddirtyoxygenated5, null, new cjs.Matrix2D(2,0,0,2,-171.9,-3191.6)).s().p("AhMBCIAAiDICaAAIAACDg");
	this.shape_472.setTransform(4741.35,600.4);

	this.shape_473 = new cjs.Shape();
	this.shape_473.graphics.bf(img.metaltexturegrungerustspottedagedoldrusteddirtyoxygenated5, null, new cjs.Matrix2D(1.561,0,0,2,-149.8,-3187)).s().p("AiBbAMAAAg1+IEDAAIAAKCIAACEIAAZPIAACEIAAOlg");
	this.shape_473.setTransform(4720.6,702.25);

	this.shape_474 = new cjs.Shape();
	this.shape_474.graphics.bf(img.metaltexturegrungerustspottedagedoldrusteddirtyoxygenated5, null, new cjs.Matrix2D(2,0,0,2,-192.5,-3191.4)).s().p("AkVBCIAAiDIIsAAIAACDg");
	this.shape_474.setTransform(5771.05,743.6);

	this.shape_475 = new cjs.Shape();
	this.shape_475.graphics.bf(img.metaltexturegrungerustspottedagedoldrusteddirtyoxygenated5, null, new cjs.Matrix2D(2,0,0,2,-192.5,-3191.4)).s().p("AkVBCIAAiDIIsAAIAACDg");
	this.shape_475.setTransform(5771.05,645.3);

	this.shape_476 = new cjs.Shape();
	this.shape_476.graphics.bf(img.metaltexturegrungerustspottedagedoldrusteddirtyoxygenated5, null, new cjs.Matrix2D(2,0,0,2,-192.5,-3191.4)).s().p("AjMBCIhKAAIAAiDIItAAIAACDg");
	this.shape_476.setTransform(5683.85,778.8);

	this.shape_477 = new cjs.Shape();
	this.shape_477.graphics.bf(img.metaltexturegrungerustspottedagedoldrusteddirtyoxygenated5, null, new cjs.Matrix2D(2,0,0,2,-192.5,-3191.4)).s().p("AkVBCIAAiDIIrAAIAACDg");
	this.shape_477.setTransform(5598.45,743.6);

	this.shape_478 = new cjs.Shape();
	this.shape_478.graphics.bf(img.metaltexturegrungerustspottedagedoldrusteddirtyoxygenated5, null, new cjs.Matrix2D(2,0,0,2,-192.5,-3191.4)).s().p("AkVBCIAAiDIIrAAIAACDg");
	this.shape_478.setTransform(5598.45,645.3);

	this.shape_479 = new cjs.Shape();
	this.shape_479.graphics.bf(img.metaltexturegrungerustspottedagedoldrusteddirtyoxygenated5, null, new cjs.Matrix2D(2,0,0,2,-192.5,-3191.4)).s().p("AkWBCIAAiDIItAAIAACDg");
	this.shape_479.setTransform(5683.85,604);

	this.shape_480 = new cjs.Shape();
	this.shape_480.graphics.bf(img.metaltexturegrungerustspottedagedoldrusteddirtyoxygenated5, null, new cjs.Matrix2D(1.561,0,0,2,-150.3,-3180.2)).s().p("AiBaiIAAugMAAAgmkIEDAAIAAKoIAACFIAAZOIAACEIAANFg");
	this.shape_480.setTransform(5643,699.25);

	this.shape_481 = new cjs.Shape();
	this.shape_481.graphics.bf(img.metaltexturegrungerustspottedagedoldrusteddirtyoxygenated5, null, new cjs.Matrix2D(1.561,0,0,2,-150.3,-3180.2)).s().p("AiBaiIAAtEIAAiEIAA5QIAAiDIAAqoIEDAAIAARFIAACEIAANSIAACEIAASkg");
	this.shape_481.setTransform(5557.6,699.25);

	this.shape_482 = new cjs.Shape();
	this.shape_482.graphics.bf(img.metaltexturegrungerustspottedagedoldrusteddirtyoxygenated5, null, new cjs.Matrix2D(1.561,0,0,2,-150.3,-3180.2)).s().p("AiBaiIAAykIAAiFIAAtSIAAiDIAAxFIEDAAIAAKnIAACFIAAZPIAACEIAANEg");
	this.shape_482.setTransform(5811.9,699.25);

	this.shape_483 = new cjs.Shape();
	this.shape_483.graphics.bf(img.metaltexturegrungerustspottedagedoldrusteddirtyoxygenated5, null, new cjs.Matrix2D(1.561,0,0,2,-150.3,-3180.2)).s().p("AiBajIAAtFIAAiEIAA5PIAAiEIAAqoIEDAAMAAAA1Eg");
	this.shape_483.setTransform(5724.7,699.25);

	this.shape_484 = new cjs.Shape();
	this.shape_484.graphics.bf(img.metaltexturegrungerustspottedagedoldrusteddirtyoxygenated5, null, new cjs.Matrix2D(2,0,0,2,-192.5,-3191.4)).s().p("AkWBCIAAiDIIsAAIAACDg");
	this.shape_484.setTransform(5516.75,778.8);

	this.shape_485 = new cjs.Shape();
	this.shape_485.graphics.bf(img.metaltexturegrungerustspottedagedoldrusteddirtyoxygenated5, null, new cjs.Matrix2D(2,0,0,2,-192.5,-3191.4)).s().p("AkWBCIAAiDIItAAIAACDg");
	this.shape_485.setTransform(5430.55,743.6);

	this.shape_486 = new cjs.Shape();
	this.shape_486.graphics.bf(img.metaltexturegrungerustspottedagedoldrusteddirtyoxygenated5, null, new cjs.Matrix2D(2,0,0,2,-192.5,-3191.4)).s().p("AkWBCIAAiDIItAAIAACDg");
	this.shape_486.setTransform(5430.55,645.3);

	this.shape_487 = new cjs.Shape();
	this.shape_487.graphics.bf(img.metaltexturegrungerustspottedagedoldrusteddirtyoxygenated5, null, new cjs.Matrix2D(2,0,0,2,-192.5,-3191.4)).s().p("AkWBCIAAiDIIsAAIAACDg");
	this.shape_487.setTransform(5516.75,604);

	this.shape_488 = new cjs.Shape();
	this.shape_488.graphics.bf(img.metaltexturegrungerustspottedagedoldrusteddirtyoxygenated5, null, new cjs.Matrix2D(2,0,0,2,-192.5,-3191.4)).s().p("AkWBCIAAiDIItAAIAACDg");
	this.shape_488.setTransform(5348.85,778.8);

	this.shape_489 = new cjs.Shape();
	this.shape_489.graphics.bf(img.metaltexturegrungerustspottedagedoldrusteddirtyoxygenated5, null, new cjs.Matrix2D(2,0,0,2,-192.5,-3191.4)).s().p("AkWBCIAAiDIItAAIAACDg");
	this.shape_489.setTransform(5181.75,778.8);

	this.shape_490 = new cjs.Shape();
	this.shape_490.graphics.bf(img.metaltexturegrungerustspottedagedoldrusteddirtyoxygenated5, null, new cjs.Matrix2D(2,0,0,2,-192.5,-3191.4)).s().p("AkWBCIAAiDIIsAAIAACDg");
	this.shape_490.setTransform(5263.45,743.6);

	this.shape_491 = new cjs.Shape();
	this.shape_491.graphics.bf(img.metaltexturegrungerustspottedagedoldrusteddirtyoxygenated5, null, new cjs.Matrix2D(2,0,0,2,-192.5,-3191.4)).s().p("AkWBCIAAiDIItAAIAACDg");
	this.shape_491.setTransform(5181.75,604);

	this.shape_492 = new cjs.Shape();
	this.shape_492.graphics.bf(img.metaltexturegrungerustspottedagedoldrusteddirtyoxygenated5, null, new cjs.Matrix2D(2,0,0,2,-192.5,-3191.4)).s().p("AkWBCIAAiDIIsAAIAACDg");
	this.shape_492.setTransform(5263.45,645.3);

	this.shape_493 = new cjs.Shape();
	this.shape_493.graphics.bf(img.metaltexturegrungerustspottedagedoldrusteddirtyoxygenated5, null, new cjs.Matrix2D(2,0,0,2,-192.5,-3191.4)).s().p("AkWBCIAAiDIItAAIAACDg");
	this.shape_493.setTransform(5348.85,604);

	this.shape_494 = new cjs.Shape();
	this.shape_494.graphics.bf(img.metaltexturegrungerustspottedagedoldrusteddirtyoxygenated5, null, new cjs.Matrix2D(1.561,0,0,2,-150.3,-3180.2)).s().p("AiBaiMAAAg1DIEDAAIAAKnIAACFIAAZPIAACDIAANFg");
	this.shape_494.setTransform(5308,699.25);

	this.shape_495 = new cjs.Shape();
	this.shape_495.graphics.bf(img.metaltexturegrungerustspottedagedoldrusteddirtyoxygenated5, null, new cjs.Matrix2D(1.561,0,0,2,-150.3,-3180.2)).s().p("AiBaiIAAtEIAAiEIAA5QIAAiEIAAqoIEDAAIAARGIAACEIAANSIAACEIAASkg");
	this.shape_495.setTransform(5222.6,699.25);

	this.shape_496 = new cjs.Shape();
	this.shape_496.graphics.bf(img.metaltexturegrungerustspottedagedoldrusteddirtyoxygenated5, null, new cjs.Matrix2D(1.561,0,0,2,-150.3,-3180.2)).s().p("AiBajMAAAg1FIEDAAIAAKpIAACDIAAZPIAACFIAANFg");
	this.shape_496.setTransform(5475.9,699.25);

	this.shape_497 = new cjs.Shape();
	this.shape_497.graphics.bf(img.metaltexturegrungerustspottedagedoldrusteddirtyoxygenated5, null, new cjs.Matrix2D(1.561,0,0,2,-150.3,-3180.2)).s().p("AiBajIAAtGIAAiEIAA5PIAAiEIAAqnIEDAAIAARFIAACEIAANSIAACEIAASlg");
	this.shape_497.setTransform(5389.7,699.25);

	this.shape_498 = new cjs.Shape();
	this.shape_498.graphics.bf(img.metaltexturegrungerustspottedagedoldrusteddirtyoxygenated5, null, new cjs.Matrix2D(1.561,0,0,2,-150.2,-3180.2)).s().p("AiBaiIAAtEIAAiFIAA5PIAAiEIAAqnIEDAAMAAAA1Dg");
	this.shape_498.setTransform(6224.5,699.25);

	this.shape_499 = new cjs.Shape();
	this.shape_499.graphics.bf(img.metaltexturegrungerustspottedagedoldrusteddirtyoxygenated5, null, new cjs.Matrix2D(2,0,0,2,-192.4,-3191.4)).s().p("AkVBCIAAiDIIrAAIAACDg");
	this.shape_499.setTransform(6183.65,778.8);

	this.shape_500 = new cjs.Shape();
	this.shape_500.graphics.bf(img.metaltexturegrungerustspottedagedoldrusteddirtyoxygenated5, null, new cjs.Matrix2D(2,0,0,2,-192.4,-3191.4)).s().p("AkVBCIAAiDIIrAAIAACDg");
	this.shape_500.setTransform(6101.45,743.6);

	this.shape_501 = new cjs.Shape();
	this.shape_501.graphics.bf(img.metaltexturegrungerustspottedagedoldrusteddirtyoxygenated5, null, new cjs.Matrix2D(2,0,0,2,-192.4,-3191.4)).s().p("AkVBCIAAiDIIrAAIAACDg");
	this.shape_501.setTransform(6183.65,604);

	this.shape_502 = new cjs.Shape();
	this.shape_502.graphics.bf(img.metaltexturegrungerustspottedagedoldrusteddirtyoxygenated5, null, new cjs.Matrix2D(2,0,0,2,-192.4,-3191.4)).s().p("AkVBCIAAiDIIrAAIAACDg");
	this.shape_502.setTransform(6101.45,645.3);

	this.shape_503 = new cjs.Shape();
	this.shape_503.graphics.bf(img.metaltexturegrungerustspottedagedoldrusteddirtyoxygenated5, null, new cjs.Matrix2D(2,0,0,2,-192.4,-3191.4)).s().p("AkWBCIAAiDIIsAAIAACDg");
	this.shape_503.setTransform(6019.75,778.8);

	this.shape_504 = new cjs.Shape();
	this.shape_504.graphics.bf(img.metaltexturegrungerustspottedagedoldrusteddirtyoxygenated5, null, new cjs.Matrix2D(2,0,0,2,-192.5,-3191.4)).s().p("AkVBCIAAiDIIrAAIAACDg");
	this.shape_504.setTransform(5852.7,778.8);

	this.shape_505 = new cjs.Shape();
	this.shape_505.graphics.bf(img.metaltexturegrungerustspottedagedoldrusteddirtyoxygenated5, null, new cjs.Matrix2D(2,0,0,2,-192.4,-3191.4)).s().p("AkVBCIAAiDIIrAAIAACDg");
	this.shape_505.setTransform(5934.35,743.6);

	this.shape_506 = new cjs.Shape();
	this.shape_506.graphics.bf(img.metaltexturegrungerustspottedagedoldrusteddirtyoxygenated5, null, new cjs.Matrix2D(2,0,0,2,-192.5,-3191.4)).s().p("AkVBCIAAiDIIrAAIAACDg");
	this.shape_506.setTransform(5852.7,604);

	this.shape_507 = new cjs.Shape();
	this.shape_507.graphics.bf(img.metaltexturegrungerustspottedagedoldrusteddirtyoxygenated5, null, new cjs.Matrix2D(2,0,0,2,-192.4,-3191.4)).s().p("AkWBCIAAiDIIsAAIAACDg");
	this.shape_507.setTransform(6019.75,604);

	this.shape_508 = new cjs.Shape();
	this.shape_508.graphics.bf(img.metaltexturegrungerustspottedagedoldrusteddirtyoxygenated5, null, new cjs.Matrix2D(2,0,0,2,-192.4,-3191.4)).s().p("AkVBCIAAiDIIrAAIAACDg");
	this.shape_508.setTransform(5934.35,645.3);

	this.shape_509 = new cjs.Shape();
	this.shape_509.graphics.bf(img.metaltexturegrungerustspottedagedoldrusteddirtyoxygenated5, null, new cjs.Matrix2D(1.561,0,0,2,-150.2,-3180.2)).s().p("AiBajMAAAg1EIEDAAIAAKnIAACEIAAZQIAACEIAANFg");
	this.shape_509.setTransform(5978.9,699.25);

	this.shape_510 = new cjs.Shape();
	this.shape_510.graphics.bf(img.metaltexturegrungerustspottedagedoldrusteddirtyoxygenated5, null, new cjs.Matrix2D(1.561,0,0,2,-150.2,-3180.2)).s().p("AiBaiIAAtFIAAiEIAA5PIAAiEIAAqnIEDAAIAARFIAACEIAANRIAACFIAASkg");
	this.shape_510.setTransform(5893.5,699.25);

	this.shape_511 = new cjs.Shape();
	this.shape_511.graphics.bf(img.metaltexturegrungerustspottedagedoldrusteddirtyoxygenated5, null, new cjs.Matrix2D(1.561,0,0,2,-150.2,-3180.2)).s().p("AiBajMAAAg1FIEDAAIAAKoIAACEIAAZPIAACFIAANFg");
	this.shape_511.setTransform(6142.8,699.25);

	this.shape_512 = new cjs.Shape();
	this.shape_512.graphics.bf(img.metaltexturegrungerustspottedagedoldrusteddirtyoxygenated5, null, new cjs.Matrix2D(1.561,0,0,2,-150.2,-3180.2)).s().p("AiBaiIAAtEIAAiFIAA5PIAAiEIAAqoIEDAAIAARFIAACEIAANSIAACFIAASkg");
	this.shape_512.setTransform(6060.6,699.25);

	this.shape_513 = new cjs.Shape();
	this.shape_513.graphics.bf(img.metaltexturegrungerustspottedagedoldrusteddirtyoxygenated5, null, new cjs.Matrix2D(2,0,0,2,-192,-3191.4)).s().p("AjNBCIhJAAIAAiDIIsAAIAACDg");
	this.shape_513.setTransform(8358.75,775.1);

	this.shape_514 = new cjs.Shape();
	this.shape_514.graphics.bf(img.metaltexturegrungerustspottedagedoldrusteddirtyoxygenated5, null, new cjs.Matrix2D(2,0,0,2,-192,-3191.4)).s().p("AkWBCIAAiDIItAAIAACDg");
	this.shape_514.setTransform(8273.35,739.9);

	this.shape_515 = new cjs.Shape();
	this.shape_515.graphics.bf(img.metaltexturegrungerustspottedagedoldrusteddirtyoxygenated5, null, new cjs.Matrix2D(2,0,0,2,-192,-3191.4)).s().p("AkVBCIAAiDIIrAAIAACDg");
	this.shape_515.setTransform(8191.65,775.1);

	this.shape_516 = new cjs.Shape();
	this.shape_516.graphics.bf(img.metaltexturegrungerustspottedagedoldrusteddirtyoxygenated5, null, new cjs.Matrix2D(2,0,0,2,-192,-3191.4)).s().p("AkWBCIAAiDIItAAIAACDg");
	this.shape_516.setTransform(8273.35,641.6);

	this.shape_517 = new cjs.Shape();
	this.shape_517.graphics.bf(img.metaltexturegrungerustspottedagedoldrusteddirtyoxygenated5, null, new cjs.Matrix2D(1.561,0,0,2,-149.8,-3183.9)).s().p("AiBaiIAAtpIAAiEIAA5PIAAiEIAAqEIEDAAIAAQhIAACEIAANSIAACEIAATJg");
	this.shape_517.setTransform(8232.5,699.25);

	this.shape_518 = new cjs.Shape();
	this.shape_518.graphics.bf(img.metaltexturegrungerustspottedagedoldrusteddirtyoxygenated5, null, new cjs.Matrix2D(2,0,0,2,-192,-3191.4)).s().p("AkVBCIAAiDIIrAAIAACDg");
	this.shape_518.setTransform(8191.65,600.3);

	this.shape_519 = new cjs.Shape();
	this.shape_519.graphics.bf(img.metaltexturegrungerustspottedagedoldrusteddirtyoxygenated5, null, new cjs.Matrix2D(1.561,0,0,2,-149.8,-3183.9)).s().p("AiBaiMAAAg1DIEDAAIAAKCIAACFIAAZOIAACEIAANqg");
	this.shape_519.setTransform(8150.8,699.25);

	this.shape_520 = new cjs.Shape();
	this.shape_520.graphics.bf(img.metaltexturegrungerustspottedagedoldrusteddirtyoxygenated5, null, new cjs.Matrix2D(1.561,0,0,2,-149.8,-3183.9)).s().p("AiBaiIAAtqIAAiEIAA5PIAAiEIAAqCIEDAAMAAAA1Dg");
	this.shape_520.setTransform(8399.6,699.25);

	this.shape_521 = new cjs.Shape();
	this.shape_521.graphics.bf(img.metaltexturegrungerustspottedagedoldrusteddirtyoxygenated5, null, new cjs.Matrix2D(2,0,0,2,-192,-3191.4)).s().p("AkWBCIAAiDIIsAAIAACDg");
	this.shape_521.setTransform(8358.75,600.3);

	this.shape_522 = new cjs.Shape();
	this.shape_522.graphics.bf(img.metaltexturegrungerustspottedagedoldrusteddirtyoxygenated5, null, new cjs.Matrix2D(1.561,0,0,2,-149.8,-3183.9)).s().p("AiBajIAAvFMAAAgl/IEDAAIAAKDIAACDIAAZQIAACDIAANrg");
	this.shape_522.setTransform(8317.9,699.25);

	this.shape_523 = new cjs.Shape();
	this.shape_523.graphics.bf(img.metaltexturegrungerustspottedagedoldrusteddirtyoxygenated5, null, new cjs.Matrix2D(2,0,0,2,-192,-3191.4)).s().p("AkVBCIAAiDIIrAAIAACDg");
	this.shape_523.setTransform(8105.45,739.9);

	this.shape_524 = new cjs.Shape();
	this.shape_524.graphics.bf(img.metaltexturegrungerustspottedagedoldrusteddirtyoxygenated5, null, new cjs.Matrix2D(2,0,0,2,-192.3,-3191.4)).s().p("AkTBCIAAiDIInAAIAACDg");
	this.shape_524.setTransform(8024,775.1);

	this.shape_525 = new cjs.Shape();
	this.shape_525.graphics.bf(img.metaltexturegrungerustspottedagedoldrusteddirtyoxygenated5, null, new cjs.Matrix2D(2,0,0,2,-192,-3191.4)).s().p("AkVBCIAAiDIIrAAIAACDg");
	this.shape_525.setTransform(8105.45,641.6);

	this.shape_526 = new cjs.Shape();
	this.shape_526.graphics.bf(img.metaltexturegrungerustspottedagedoldrusteddirtyoxygenated5, null, new cjs.Matrix2D(2,0,0,2,-192.5,-3191.4)).s().p("AkWBCIAAiDIItAAIAACDg");
	this.shape_526.setTransform(7938.85,739.9);

	this.shape_527 = new cjs.Shape();
	this.shape_527.graphics.bf(img.metaltexturegrungerustspottedagedoldrusteddirtyoxygenated5, null, new cjs.Matrix2D(2,0,0,2,-192.5,-3191.4)).s().p("AkWBCIAAiDIIsAAIAACDg");
	this.shape_527.setTransform(7857.15,775.1);

	this.shape_528 = new cjs.Shape();
	this.shape_528.graphics.bf(img.metaltexturegrungerustspottedagedoldrusteddirtyoxygenated5, null, new cjs.Matrix2D(2,0,0,2,-192.5,-3191.4)).s().p("AkWBCIAAiDIIsAAIAACDg");
	this.shape_528.setTransform(7775.45,739.9);

	this.shape_529 = new cjs.Shape();
	this.shape_529.graphics.bf(img.metaltexturegrungerustspottedagedoldrusteddirtyoxygenated5, null, new cjs.Matrix2D(2,0,0,2,-192.5,-3191.4)).s().p("AkWBCIAAiDIIsAAIAACDg");
	this.shape_529.setTransform(7775.45,641.6);

	this.shape_530 = new cjs.Shape();
	this.shape_530.graphics.bf(img.metaltexturegrungerustspottedagedoldrusteddirtyoxygenated5, null, new cjs.Matrix2D(2,0,0,2,-192.5,-3191.4)).s().p("AkWBCIAAiDIItAAIAACDg");
	this.shape_530.setTransform(7938.85,641.6);

	this.shape_531 = new cjs.Shape();
	this.shape_531.graphics.bf(img.metaltexturegrungerustspottedagedoldrusteddirtyoxygenated5, null, new cjs.Matrix2D(1.561,0,0,2,-150.3,-3183.9)).s().p("AiBajIAAtrIAAiDIAA5QIAAiDIAAqDIEDAAIAAQgIAACDIAANSIAACFIAATKg");
	this.shape_531.setTransform(7898,699.25);

	this.shape_532 = new cjs.Shape();
	this.shape_532.graphics.bf(img.metaltexturegrungerustspottedagedoldrusteddirtyoxygenated5, null, new cjs.Matrix2D(2,0,0,2,-192.5,-3191.4)).s().p("AkWBCIAAiDIIsAAIAACDg");
	this.shape_532.setTransform(7857.15,600.3);

	this.shape_533 = new cjs.Shape();
	this.shape_533.graphics.bf(img.metaltexturegrungerustspottedagedoldrusteddirtyoxygenated5, null, new cjs.Matrix2D(1.561,0,0,2,-150.3,-3183.9)).s().p("AiBaiIAAzKIAAiEIAAtSIAAiEIAAwgIEDAAIAAKDIAACEIAAZQIAACEIAANpg");
	this.shape_533.setTransform(7816.3,699.25);

	this.shape_534 = new cjs.Shape();
	this.shape_534.graphics.bf(img.metaltexturegrungerustspottedagedoldrusteddirtyoxygenated5, null, new cjs.Matrix2D(1.561,0,0,2,-149.8,-3183.9)).s().p("AiBaiIAAtpIAAiFIAA5OIAAiFIAAqCIEDAAIAAQfIAACFIAANRIAACFIAATJg");
	this.shape_534.setTransform(8064.6,699.25);

	this.shape_535 = new cjs.Shape();
	this.shape_535.graphics.bf(img.metaltexturegrungerustspottedagedoldrusteddirtyoxygenated5, null, new cjs.Matrix2D(2,0,0,2,-192.3,-3191.4)).s().p("AkTBCIAAiDIInAAIAACDg");
	this.shape_535.setTransform(8024,600.3);

	this.shape_536 = new cjs.Shape();
	this.shape_536.graphics.bf(img.metaltexturegrungerustspottedagedoldrusteddirtyoxygenated5, null, new cjs.Matrix2D(1.561,0,0,2,-150.3,-3183.9)).s().p("AiBaiMAAAg1DIEDAAIAAKCIAACFIAAZPIAACDIAANqg");
	this.shape_536.setTransform(7983.4,699.25);

	this.shape_537 = new cjs.Shape();
	this.shape_537.graphics.bf(img.metaltexturegrungerustspottedagedoldrusteddirtyoxygenated5, null, new cjs.Matrix2D(2,0,0,2,-192,-3191.4)).s().p("AjNBCIhIAAIAAiDIIrAAIAACDg");
	this.shape_537.setTransform(9025.75,775.1);

	this.shape_538 = new cjs.Shape();
	this.shape_538.graphics.bf(img.metaltexturegrungerustspottedagedoldrusteddirtyoxygenated5, null, new cjs.Matrix2D(2,0,0,2,-192,-3191.4)).s().p("AkWBCIAAiDIItAAIAACDg");
	this.shape_538.setTransform(8940.35,739.9);

	this.shape_539 = new cjs.Shape();
	this.shape_539.graphics.bf(img.metaltexturegrungerustspottedagedoldrusteddirtyoxygenated5, null, new cjs.Matrix2D(2,0,0,2,-192,-3191.4)).s().p("AkWBCIAAiDIItAAIAACDg");
	this.shape_539.setTransform(8940.35,641.6);

	this.shape_540 = new cjs.Shape();
	this.shape_540.graphics.bf(img.metaltexturegrungerustspottedagedoldrusteddirtyoxygenated5, null, new cjs.Matrix2D(2,0,0,2,-192,-3191.4)).s().p("AkVBCIAAiDIIsAAIAACDg");
	this.shape_540.setTransform(8858.65,775.1);

	this.shape_541 = new cjs.Shape();
	this.shape_541.graphics.bf(img.metaltexturegrungerustspottedagedoldrusteddirtyoxygenated5, null, new cjs.Matrix2D(2,0,0,2,-192,-3191.4)).s().p("AkWBCIAAiDIItAAIAACDg");
	this.shape_541.setTransform(8776.45,739.9);

	this.shape_542 = new cjs.Shape();
	this.shape_542.graphics.bf(img.metaltexturegrungerustspottedagedoldrusteddirtyoxygenated5, null, new cjs.Matrix2D(2,0,0,2,-192,-3191.4)).s().p("AkWBCIAAiDIItAAIAACDg");
	this.shape_542.setTransform(8776.45,641.6);

	this.shape_543 = new cjs.Shape();
	this.shape_543.graphics.bf(img.metaltexturegrungerustspottedagedoldrusteddirtyoxygenated5, null, new cjs.Matrix2D(2,0,0,2,-192,-3191.4)).s().p("AkVBCIAAiDIIsAAIAACDg");
	this.shape_543.setTransform(8858.65,600.3);

	this.shape_544 = new cjs.Shape();
	this.shape_544.graphics.bf(img.metaltexturegrungerustspottedagedoldrusteddirtyoxygenated5, null, new cjs.Matrix2D(1.561,0,0,2,-149.8,-3183.9)).s().p("AiBajMAAAg1FIEDAAIAAKDIAACEIAAZQIAACEIAANqg");
	this.shape_544.setTransform(8817.8,699.25);

	this.shape_545 = new cjs.Shape();
	this.shape_545.graphics.bf(img.metaltexturegrungerustspottedagedoldrusteddirtyoxygenated5, null, new cjs.Matrix2D(2,0,0,2,-192,-3191.4)).s().p("AkVBCIAAiDIIrAAIAACDg");
	this.shape_545.setTransform(9025.75,600.3);

	this.shape_546 = new cjs.Shape();
	this.shape_546.graphics.bf(img.metaltexturegrungerustspottedagedoldrusteddirtyoxygenated5, null, new cjs.Matrix2D(1.561,0,0,2,-149.8,-3183.9)).s().p("AiBajIAAtrIAAiDIAA5PIAAiEIAAqEIEDAAIAAQhIAACDIAANTIAACDIAATLg");
	this.shape_546.setTransform(8899.5,699.25);

	this.shape_547 = new cjs.Shape();
	this.shape_547.graphics.bf(img.metaltexturegrungerustspottedagedoldrusteddirtyoxygenated5, null, new cjs.Matrix2D(1.561,0,0,2,-149.8,-3183.9)).s().p("AiBaiIAAvEMAAAgmAIEDAAIAAKDIAACFIAAZPIAACDIAANqg");
	this.shape_547.setTransform(8984.9,699.25);

	this.shape_548 = new cjs.Shape();
	this.shape_548.graphics.bf(img.metaltexturegrungerustspottedagedoldrusteddirtyoxygenated5, null, new cjs.Matrix2D(2,0,0,2,-192,-3191.4)).s().p("AkWBCIAAiDIIsAAIAACDg");
	this.shape_548.setTransform(8694.75,775.1);

	this.shape_549 = new cjs.Shape();
	this.shape_549.graphics.bf(img.metaltexturegrungerustspottedagedoldrusteddirtyoxygenated5, null, new cjs.Matrix2D(2,0,0,2,-192,-3191.4)).s().p("AkWBCIAAiDIItAAIAACDg");
	this.shape_549.setTransform(8609.35,739.9);

	this.shape_550 = new cjs.Shape();
	this.shape_550.graphics.bf(img.metaltexturegrungerustspottedagedoldrusteddirtyoxygenated5, null, new cjs.Matrix2D(2,0,0,2,-192,-3191.4)).s().p("AkWBCIAAiDIItAAIAACDg");
	this.shape_550.setTransform(8527.65,775.1);

	this.shape_551 = new cjs.Shape();
	this.shape_551.graphics.bf(img.metaltexturegrungerustspottedagedoldrusteddirtyoxygenated5, null, new cjs.Matrix2D(2,0,0,2,-192,-3191.4)).s().p("AkWBCIAAiDIIsAAIAACDg");
	this.shape_551.setTransform(8445.95,739.9);

	this.shape_552 = new cjs.Shape();
	this.shape_552.graphics.bf(img.metaltexturegrungerustspottedagedoldrusteddirtyoxygenated5, null, new cjs.Matrix2D(2,0,0,2,-192,-3191.4)).s().p("AkWBCIAAiDIIsAAIAACDg");
	this.shape_552.setTransform(8445.95,641.6);

	this.shape_553 = new cjs.Shape();
	this.shape_553.graphics.bf(img.metaltexturegrungerustspottedagedoldrusteddirtyoxygenated5, null, new cjs.Matrix2D(2,0,0,2,-192,-3191.4)).s().p("AkWBCIAAiDIItAAIAACDg");
	this.shape_553.setTransform(8609.35,641.6);

	this.shape_554 = new cjs.Shape();
	this.shape_554.graphics.bf(img.metaltexturegrungerustspottedagedoldrusteddirtyoxygenated5, null, new cjs.Matrix2D(1.561,0,0,2,-149.8,-3183.9)).s().p("AiBaiIAAtqIAAiEIAA5OIAAiEIAAqDIEDAAIAAQfIAACEIAANSIAACEIAATKg");
	this.shape_554.setTransform(8568.5,699.25);

	this.shape_555 = new cjs.Shape();
	this.shape_555.graphics.bf(img.metaltexturegrungerustspottedagedoldrusteddirtyoxygenated5, null, new cjs.Matrix2D(2,0,0,2,-192,-3191.4)).s().p("AkWBCIAAiDIItAAIAACDg");
	this.shape_555.setTransform(8527.65,600.3);

	this.shape_556 = new cjs.Shape();
	this.shape_556.graphics.bf(img.metaltexturegrungerustspottedagedoldrusteddirtyoxygenated5, null, new cjs.Matrix2D(1.561,0,0,2,-149.8,-3183.9)).s().p("AiBajIAAzKIAAiEIAAtTIAAiEIAAwgIEDAAIAAKDIAACEIAAZPIAACEIAANrg");
	this.shape_556.setTransform(8486.8,699.25);

	this.shape_557 = new cjs.Shape();
	this.shape_557.graphics.bf(img.metaltexturegrungerustspottedagedoldrusteddirtyoxygenated5, null, new cjs.Matrix2D(1.561,0,0,2,-149.8,-3183.9)).s().p("AiBaiIAAtpIAAiEIAA5QIAAiEIAAqCIEDAAIAAQgIAACEIAANSIAACEIAATJg");
	this.shape_557.setTransform(8735.6,699.25);

	this.shape_558 = new cjs.Shape();
	this.shape_558.graphics.bf(img.metaltexturegrungerustspottedagedoldrusteddirtyoxygenated5, null, new cjs.Matrix2D(2,0,0,2,-192,-3191.4)).s().p("AkWBCIAAiDIIsAAIAACDg");
	this.shape_558.setTransform(8694.75,600.3);

	this.shape_559 = new cjs.Shape();
	this.shape_559.graphics.bf(img.metaltexturegrungerustspottedagedoldrusteddirtyoxygenated5, null, new cjs.Matrix2D(1.561,0,0,2,-149.8,-3183.9)).s().p("AiBajMAAAg1FIEDAAIAAKDIAACFIAAZOIAACFIAANqg");
	this.shape_559.setTransform(8653.9,699.25);

	this.shape_560 = new cjs.Shape();
	this.shape_560.graphics.bf(img.metaltexturegrungerustspottedagedoldrusteddirtyoxygenated5, null, new cjs.Matrix2D(2,0,0,2,-172,-3191.4)).s().p("AhNBCIAAiDICaAAIAACDg");
	this.shape_560.setTransform(9509.55,775.1);

	this.shape_561 = new cjs.Shape();
	this.shape_561.graphics.bf(img.metaltexturegrungerustspottedagedoldrusteddirtyoxygenated5, null, new cjs.Matrix2D(2,0,0,2,-192.1,-3191.4)).s().p("AkWBCIAAiDIItAAIAACDg");
	this.shape_561.setTransform(9443.45,739.9);

	this.shape_562 = new cjs.Shape();
	this.shape_562.graphics.bf(img.metaltexturegrungerustspottedagedoldrusteddirtyoxygenated5, null, new cjs.Matrix2D(2,0,0,2,-192.1,-3191.4)).s().p("AkWBCIAAiDIItAAIAACDg");
	this.shape_562.setTransform(9443.45,641.6);

	this.shape_563 = new cjs.Shape();
	this.shape_563.graphics.bf(img.metaltexturegrungerustspottedagedoldrusteddirtyoxygenated5, null, new cjs.Matrix2D(2,0,0,2,-172,-3191.4)).s().p("AhNBCIAAiDICaAAIAACDg");
	this.shape_563.setTransform(9509.55,600.3);

	this.shape_564 = new cjs.Shape();
	this.shape_564.graphics.bf(img.metaltexturegrungerustspottedagedoldrusteddirtyoxygenated5, null, new cjs.Matrix2D(1.561,0,0,2,-149.9,-3183.9)).s().p("AiBajMAAAg1FIEDAAIAAKEIAACDIAAZPIAACFIAANqg");
	this.shape_564.setTransform(9488.8,699.25);

	this.shape_565 = new cjs.Shape();
	this.shape_565.graphics.bf(img.metaltexturegrungerustspottedagedoldrusteddirtyoxygenated5, null, new cjs.Matrix2D(2,0,0,2,-192.1,-3191.4)).s().p("AkVBCIAAiDIIsAAIAACDg");
	this.shape_565.setTransform(9361.75,775.1);

	this.shape_566 = new cjs.Shape();
	this.shape_566.graphics.bf(img.metaltexturegrungerustspottedagedoldrusteddirtyoxygenated5, null, new cjs.Matrix2D(2,0,0,2,-192,-3191.4)).s().p("AkWBCIAAiDIItAAIAACDg");
	this.shape_566.setTransform(9276.35,739.9);

	this.shape_567 = new cjs.Shape();
	this.shape_567.graphics.bf(img.metaltexturegrungerustspottedagedoldrusteddirtyoxygenated5, null, new cjs.Matrix2D(2,0,0,2,-192,-3191.4)).s().p("AkWBCIAAiDIItAAIAACDg");
	this.shape_567.setTransform(9276.35,641.6);

	this.shape_568 = new cjs.Shape();
	this.shape_568.graphics.bf(img.metaltexturegrungerustspottedagedoldrusteddirtyoxygenated5, null, new cjs.Matrix2D(2,0,0,2,-192,-3191.4)).s().p("AkWBCIAAiDIIsAAIAACDg");
	this.shape_568.setTransform(9194.65,775.1);

	this.shape_569 = new cjs.Shape();
	this.shape_569.graphics.bf(img.metaltexturegrungerustspottedagedoldrusteddirtyoxygenated5, null, new cjs.Matrix2D(2,0,0,2,-192,-3191.4)).s().p("AkWBCIAAiDIItAAIAACDg");
	this.shape_569.setTransform(9112.95,739.9);

	this.shape_570 = new cjs.Shape();
	this.shape_570.graphics.bf(img.metaltexturegrungerustspottedagedoldrusteddirtyoxygenated5, null, new cjs.Matrix2D(2,0,0,2,-192,-3191.4)).s().p("AkWBCIAAiDIItAAIAACDg");
	this.shape_570.setTransform(9112.95,641.6);

	this.shape_571 = new cjs.Shape();
	this.shape_571.graphics.bf(img.metaltexturegrungerustspottedagedoldrusteddirtyoxygenated5, null, new cjs.Matrix2D(2,0,0,2,-192,-3191.4)).s().p("AkWBCIAAiDIIsAAIAACDg");
	this.shape_571.setTransform(9194.65,600.3);

	this.shape_572 = new cjs.Shape();
	this.shape_572.graphics.bf(img.metaltexturegrungerustspottedagedoldrusteddirtyoxygenated5, null, new cjs.Matrix2D(1.561,0,0,2,-149.8,-3183.9)).s().p("AiBaiIAAtpIAAiEIAA5QIAAiDIAAqDIEDAAMAAAA1Dg");
	this.shape_572.setTransform(9066.6,699.25);

	this.shape_573 = new cjs.Shape();
	this.shape_573.graphics.bf(img.metaltexturegrungerustspottedagedoldrusteddirtyoxygenated5, null, new cjs.Matrix2D(1.561,0,0,2,-149.8,-3183.9)).s().p("AiBajIAAzKIAAiEIAAtSIAAiFIAAwgIEDAAIAAKDIAACFIAAZPIAACDIAANrg");
	this.shape_573.setTransform(9153.8,699.25);

	this.shape_574 = new cjs.Shape();
	this.shape_574.graphics.bf(img.metaltexturegrungerustspottedagedoldrusteddirtyoxygenated5, null, new cjs.Matrix2D(2,0,0,2,-192.1,-3191.4)).s().p("AkVBCIAAiDIIsAAIAACDg");
	this.shape_574.setTransform(9361.75,600.3);

	this.shape_575 = new cjs.Shape();
	this.shape_575.graphics.bf(img.metaltexturegrungerustspottedagedoldrusteddirtyoxygenated5, null, new cjs.Matrix2D(1.561,0,0,2,-149.9,-3183.9)).s().p("AiBaiIAAtpIAAiEIAA5QIAAiDIAAqDIEDAAIAAQgIAACEIAANRIAACEIAATKg");
	this.shape_575.setTransform(9402.6,699.25);

	this.shape_576 = new cjs.Shape();
	this.shape_576.graphics.bf(img.metaltexturegrungerustspottedagedoldrusteddirtyoxygenated5, null, new cjs.Matrix2D(1.561,0,0,2,-149.8,-3183.9)).s().p("AiBajIAAtqIAAiEIAA5QIAAiEIAAqCIEDAAIAAQgIAACEIAANRIAACEIAATLg");
	this.shape_576.setTransform(9235.5,699.25);

	this.shape_577 = new cjs.Shape();
	this.shape_577.graphics.bf(img.metaltexturegrungerustspottedagedoldrusteddirtyoxygenated5, null, new cjs.Matrix2D(1.561,0,0,2,-149.9,-3183.9)).s().p("AiBajMAAAg1EIEDAAIAAKCIAACEIAAZPIAACEIAANrg");
	this.shape_577.setTransform(9320.9,699.25);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.shape_577},{t:this.shape_576},{t:this.shape_575},{t:this.shape_574},{t:this.shape_573},{t:this.shape_572},{t:this.shape_571},{t:this.shape_570},{t:this.shape_569},{t:this.shape_568},{t:this.shape_567},{t:this.shape_566},{t:this.shape_565},{t:this.shape_564},{t:this.shape_563},{t:this.shape_562},{t:this.shape_561},{t:this.shape_560},{t:this.shape_559},{t:this.shape_558},{t:this.shape_557},{t:this.shape_556},{t:this.shape_555},{t:this.shape_554},{t:this.shape_553},{t:this.shape_552},{t:this.shape_551},{t:this.shape_550},{t:this.shape_549},{t:this.shape_548},{t:this.shape_547},{t:this.shape_546},{t:this.shape_545},{t:this.shape_544},{t:this.shape_543},{t:this.shape_542},{t:this.shape_541},{t:this.shape_540},{t:this.shape_539},{t:this.shape_538},{t:this.shape_537},{t:this.shape_536},{t:this.shape_535},{t:this.shape_534},{t:this.shape_533},{t:this.shape_532},{t:this.shape_531},{t:this.shape_530},{t:this.shape_529},{t:this.shape_528},{t:this.shape_527},{t:this.shape_526},{t:this.shape_525},{t:this.shape_524},{t:this.shape_523},{t:this.shape_522},{t:this.shape_521},{t:this.shape_520},{t:this.shape_519},{t:this.shape_518},{t:this.shape_517},{t:this.shape_516},{t:this.shape_515},{t:this.shape_514},{t:this.shape_513},{t:this.shape_512},{t:this.shape_511},{t:this.shape_510},{t:this.shape_509},{t:this.shape_508},{t:this.shape_507},{t:this.shape_506},{t:this.shape_505},{t:this.shape_504},{t:this.shape_503},{t:this.shape_502},{t:this.shape_501},{t:this.shape_500},{t:this.shape_499},{t:this.shape_498},{t:this.shape_497},{t:this.shape_496},{t:this.shape_495},{t:this.shape_494},{t:this.shape_493},{t:this.shape_492},{t:this.shape_491},{t:this.shape_490},{t:this.shape_489},{t:this.shape_488},{t:this.shape_487},{t:this.shape_486},{t:this.shape_485},{t:this.shape_484},{t:this.shape_483},{t:this.shape_482},{t:this.shape_481},{t:this.shape_480},{t:this.shape_479},{t:this.shape_478},{t:this.shape_477},{t:this.shape_476},{t:this.shape_475},{t:this.shape_474},{t:this.shape_473},{t:this.shape_472},{t:this.shape_471},{t:this.shape_470},{t:this.shape_469},{t:this.shape_468},{t:this.shape_467},{t:this.shape_466},{t:this.shape_465},{t:this.shape_464},{t:this.shape_463},{t:this.shape_462},{t:this.shape_461},{t:this.shape_460},{t:this.shape_459},{t:this.shape_458},{t:this.shape_457},{t:this.shape_456},{t:this.shape_455},{t:this.shape_454},{t:this.shape_453},{t:this.shape_452},{t:this.shape_451},{t:this.shape_450},{t:this.shape_449},{t:this.shape_448},{t:this.shape_447},{t:this.shape_446},{t:this.shape_445},{t:this.shape_444},{t:this.shape_443},{t:this.shape_442},{t:this.shape_441},{t:this.shape_440},{t:this.shape_439},{t:this.shape_438},{t:this.shape_437},{t:this.shape_436},{t:this.shape_435},{t:this.shape_434},{t:this.shape_433},{t:this.shape_432},{t:this.shape_431},{t:this.shape_430},{t:this.shape_429},{t:this.shape_428},{t:this.shape_427},{t:this.shape_426},{t:this.shape_425},{t:this.shape_424},{t:this.shape_423},{t:this.shape_422},{t:this.shape_421},{t:this.shape_420},{t:this.shape_419},{t:this.shape_418},{t:this.shape_417},{t:this.shape_416},{t:this.shape_415},{t:this.shape_414},{t:this.shape_413},{t:this.shape_412},{t:this.shape_411},{t:this.shape_410},{t:this.shape_409},{t:this.shape_408},{t:this.shape_407},{t:this.shape_406},{t:this.shape_405},{t:this.shape_404},{t:this.shape_403},{t:this.shape_402},{t:this.shape_401},{t:this.shape_400},{t:this.shape_399},{t:this.shape_398},{t:this.shape_397},{t:this.shape_396},{t:this.shape_395},{t:this.shape_394},{t:this.shape_393},{t:this.shape_392},{t:this.shape_391},{t:this.shape_390},{t:this.shape_389},{t:this.shape_388},{t:this.shape_387},{t:this.shape_386},{t:this.shape_385},{t:this.shape_384},{t:this.shape_383},{t:this.shape_382},{t:this.shape_381},{t:this.shape_380},{t:this.shape_379},{t:this.shape_378},{t:this.shape_377},{t:this.shape_376},{t:this.shape_375},{t:this.shape_374},{t:this.shape_373},{t:this.shape_372},{t:this.shape_371},{t:this.shape_370},{t:this.shape_369},{t:this.shape_368},{t:this.shape_367},{t:this.shape_366},{t:this.shape_365},{t:this.shape_364},{t:this.shape_363},{t:this.shape_362},{t:this.shape_361},{t:this.shape_360},{t:this.shape_359},{t:this.shape_358},{t:this.shape_357},{t:this.shape_356},{t:this.shape_355},{t:this.shape_354},{t:this.shape_353},{t:this.shape_352},{t:this.shape_351},{t:this.shape_350},{t:this.shape_349},{t:this.shape_348},{t:this.shape_347},{t:this.shape_346},{t:this.shape_345},{t:this.shape_344},{t:this.shape_343},{t:this.shape_342},{t:this.shape_341},{t:this.shape_340},{t:this.shape_339},{t:this.shape_338},{t:this.shape_337},{t:this.shape_336},{t:this.shape_335},{t:this.shape_334},{t:this.shape_333},{t:this.shape_332},{t:this.shape_331},{t:this.shape_330},{t:this.shape_329},{t:this.shape_328},{t:this.shape_327},{t:this.shape_326},{t:this.shape_325},{t:this.shape_324},{t:this.shape_323},{t:this.shape_322},{t:this.shape_321},{t:this.shape_320},{t:this.shape_319},{t:this.shape_318},{t:this.shape_317},{t:this.shape_316},{t:this.shape_315},{t:this.shape_314},{t:this.shape_313},{t:this.shape_312},{t:this.shape_311},{t:this.shape_310},{t:this.shape_309},{t:this.shape_308},{t:this.shape_307},{t:this.shape_306},{t:this.shape_305},{t:this.shape_304},{t:this.shape_303},{t:this.shape_302},{t:this.shape_301},{t:this.shape_300},{t:this.shape_299},{t:this.shape_298},{t:this.shape_297},{t:this.shape_296},{t:this.shape_295},{t:this.shape_294},{t:this.shape_293},{t:this.shape_292},{t:this.shape_291},{t:this.shape_290},{t:this.shape_289},{t:this.shape_288},{t:this.shape_287},{t:this.shape_286},{t:this.shape_285},{t:this.shape_284},{t:this.shape_283},{t:this.shape_282},{t:this.shape_281},{t:this.shape_280},{t:this.shape_279},{t:this.shape_278},{t:this.shape_277},{t:this.shape_276},{t:this.shape_275},{t:this.shape_274},{t:this.shape_273},{t:this.shape_272},{t:this.shape_271},{t:this.shape_270},{t:this.shape_269},{t:this.shape_268},{t:this.shape_267},{t:this.shape_266},{t:this.shape_265},{t:this.shape_264},{t:this.shape_263},{t:this.shape_262},{t:this.shape_261},{t:this.shape_260},{t:this.shape_259},{t:this.shape_258},{t:this.shape_257},{t:this.shape_256},{t:this.shape_255},{t:this.shape_254},{t:this.shape_253},{t:this.shape_252},{t:this.shape_251},{t:this.shape_250},{t:this.shape_249},{t:this.shape_248},{t:this.shape_247},{t:this.shape_246},{t:this.shape_245},{t:this.shape_244},{t:this.shape_243},{t:this.shape_242},{t:this.shape_241},{t:this.shape_240},{t:this.shape_239},{t:this.shape_238},{t:this.shape_237},{t:this.shape_236},{t:this.shape_235},{t:this.shape_234},{t:this.shape_233},{t:this.shape_232},{t:this.shape_231},{t:this.shape_230},{t:this.shape_229},{t:this.shape_228},{t:this.shape_227},{t:this.shape_226},{t:this.shape_225},{t:this.shape_224},{t:this.shape_223},{t:this.shape_222},{t:this.shape_221},{t:this.shape_220},{t:this.shape_219},{t:this.shape_218},{t:this.shape_217},{t:this.shape_216},{t:this.shape_215},{t:this.shape_214},{t:this.shape_213},{t:this.shape_212},{t:this.shape_211},{t:this.shape_210},{t:this.shape_209},{t:this.shape_208},{t:this.shape_207},{t:this.shape_206},{t:this.shape_205},{t:this.shape_204},{t:this.shape_203},{t:this.shape_202},{t:this.shape_201},{t:this.shape_200},{t:this.shape_199},{t:this.shape_198},{t:this.shape_197},{t:this.shape_196},{t:this.shape_195},{t:this.shape_194},{t:this.shape_193},{t:this.shape_192},{t:this.shape_191},{t:this.shape_190},{t:this.shape_189},{t:this.shape_188},{t:this.shape_187},{t:this.shape_186},{t:this.shape_185},{t:this.shape_184},{t:this.shape_183},{t:this.shape_182},{t:this.shape_181},{t:this.shape_180},{t:this.shape_179},{t:this.shape_178},{t:this.shape_177},{t:this.shape_176},{t:this.shape_175},{t:this.shape_174},{t:this.shape_173},{t:this.shape_172},{t:this.shape_171},{t:this.shape_170},{t:this.shape_169},{t:this.shape_168},{t:this.shape_167},{t:this.shape_166},{t:this.shape_165},{t:this.shape_164},{t:this.shape_163},{t:this.shape_162},{t:this.shape_161},{t:this.shape_160},{t:this.shape_159},{t:this.shape_158},{t:this.shape_157},{t:this.shape_156},{t:this.shape_155},{t:this.shape_154},{t:this.shape_153},{t:this.shape_152},{t:this.shape_151},{t:this.shape_150},{t:this.shape_149},{t:this.shape_148},{t:this.shape_147},{t:this.shape_146},{t:this.shape_145},{t:this.shape_144},{t:this.shape_143},{t:this.shape_142},{t:this.shape_141},{t:this.shape_140},{t:this.shape_139},{t:this.shape_138},{t:this.shape_137},{t:this.shape_136},{t:this.shape_135},{t:this.shape_134},{t:this.shape_133},{t:this.shape_132},{t:this.shape_131},{t:this.shape_130},{t:this.shape_129},{t:this.shape_128},{t:this.shape_127},{t:this.shape_126},{t:this.shape_125},{t:this.shape_124},{t:this.shape_123},{t:this.shape_122},{t:this.shape_121},{t:this.shape_120},{t:this.shape_119},{t:this.shape_118},{t:this.shape_117},{t:this.shape_116},{t:this.shape_115},{t:this.shape_114},{t:this.shape_113},{t:this.shape_112},{t:this.shape_111},{t:this.shape_110},{t:this.shape_109},{t:this.shape_108},{t:this.shape_107},{t:this.shape_106},{t:this.shape_105},{t:this.shape_104},{t:this.shape_103},{t:this.shape_102},{t:this.shape_101},{t:this.shape_100},{t:this.shape_99},{t:this.shape_98},{t:this.shape_97},{t:this.shape_96},{t:this.shape_95},{t:this.shape_94},{t:this.shape_93},{t:this.shape_92},{t:this.shape_91},{t:this.shape_90},{t:this.shape_89},{t:this.shape_88},{t:this.shape_87},{t:this.shape_86},{t:this.shape_85},{t:this.shape_84},{t:this.shape_83},{t:this.shape_82},{t:this.shape_81},{t:this.shape_80},{t:this.shape_79},{t:this.shape_78},{t:this.shape_77},{t:this.shape_76},{t:this.shape_75},{t:this.shape_74},{t:this.shape_73},{t:this.shape_72},{t:this.shape_71},{t:this.shape_70},{t:this.shape_69},{t:this.shape_68},{t:this.shape_67},{t:this.shape_66},{t:this.shape_65},{t:this.shape_64},{t:this.shape_63},{t:this.shape_62},{t:this.shape_61},{t:this.shape_60},{t:this.shape_59},{t:this.shape_58},{t:this.shape_57},{t:this.shape_56},{t:this.shape_55},{t:this.shape_54},{t:this.shape_53},{t:this.shape_52},{t:this.shape_51},{t:this.shape_50},{t:this.shape_49},{t:this.shape_48},{t:this.shape_47},{t:this.shape_46},{t:this.shape_45},{t:this.shape_44},{t:this.shape_43},{t:this.shape_42},{t:this.shape_41},{t:this.shape_40},{t:this.shape_39},{t:this.shape_38},{t:this.shape_37},{t:this.shape_36},{t:this.shape_35},{t:this.shape_34},{t:this.shape_33},{t:this.shape_32},{t:this.shape_31},{t:this.shape_30},{t:this.shape_29},{t:this.shape_28},{t:this.shape_27},{t:this.shape_26},{t:this.shape_25},{t:this.shape_24},{t:this.shape_23},{t:this.shape_22},{t:this.shape_21},{t:this.shape_20},{t:this.shape_19},{t:this.shape_18},{t:this.shape_17},{t:this.shape_16},{t:this.shape_15},{t:this.shape_14},{t:this.shape_13},{t:this.shape_12},{t:this.shape_11},{t:this.shape_10},{t:this.shape_9},{t:this.shape_8},{t:this.shape_7},{t:this.shape_6},{t:this.shape_5},{t:this.shape_4},{t:this.shape_3},{t:this.shape_2},{t:this.shape_1},{t:this.shape},{t:this.instance}]}).wait(815));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();


(lib.Scene_1_end_text = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// end_text
	this.instance = new lib.Tween19("synched",0);
	this.instance.setTransform(896.8,68.05);
	this.instance.alpha = 0;
	this.instance._off = true;

	this.instance_1 = new lib.Tween20("synched",0);
	this.instance_1.setTransform(1508.1,93.3);
	this.instance_1._off = true;

	this.instance_2 = new lib.Tween23("synched",0);
	this.instance_2.setTransform(2585.7,589.65);
	this.instance_2._off = true;

	this.instance_3 = new lib.Tween24("synched",0);
	this.instance_3.setTransform(3206.6,589.5,0.9999,0.9999);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[]}).to({state:[{t:this.instance}]},289).to({state:[{t:this.instance_1}]},45).to({state:[{t:this.instance_1}]},25).to({state:[]},1).to({state:[{t:this.instance_1}]},209).to({state:[{t:this.instance_1}]},23).to({state:[]},23).to({state:[{t:this.instance_2}]},57).to({state:[{t:this.instance_3}]},17).wait(127));
	this.timeline.addTween(cjs.Tween.get(this.instance).wait(289).to({_off:false},0).to({_off:true,x:1508.1,y:93.3,alpha:1},45).wait(482));
	this.timeline.addTween(cjs.Tween.get(this.instance_1).wait(289).to({_off:false},45).wait(25).to({startPosition:0},0).to({_off:true},1).wait(209).to({_off:false,x:1217.75,y:112.5,alpha:0},0).to({regY:0.1,scaleX:0.9999,scaleY:0.9999,x:1800.15,y:112.65,alpha:1},23).to({_off:true},23).wait(201));
	this.timeline.addTween(cjs.Tween.get(this.instance_2).wait(672).to({_off:false},0).to({_off:true,scaleX:0.9999,scaleY:0.9999,x:3206.6,y:589.5},17).wait(127));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();


(lib.Scene_1_buttons = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// buttons
	this.walkbutton1 = new lib.walkbutton1();
	this.walkbutton1.name = "walkbutton1";
	this.walkbutton1.setTransform(810.55,609.05,0.9999,0.9999);
	new cjs.ButtonHelper(this.walkbutton1, 0, 1, 2, false, new lib.walkbutton1(), 3);

	this.walklowbutton = new lib.walklowbutton();
	this.walklowbutton.name = "walklowbutton";
	this.walklowbutton.setTransform(1518.65,594.8,0.9999,0.9999);
	new cjs.ButtonHelper(this.walklowbutton, 0, 1, 2, false, new lib.walklowbutton(), 3);

	this.walkhighbutton = new lib.walkhighbutton();
	this.walkhighbutton.name = "walkhighbutton";
	this.walkhighbutton.setTransform(1248,594.9,0.9999,0.9999);
	new cjs.ButtonHelper(this.walkhighbutton, 0, 1, 2, false, new lib.walkhighbutton(), 3);

	this.instance = new lib.tryagainbutton();
	this.instance.setTransform(1975.75,-148.8,0.9999,0.9999,0,0,0,0.1,0.1);
	this.instance.alpha = 0;
	this.instance._off = true;
	new cjs.ButtonHelper(this.instance, 0, 1, 2, false, new lib.tryagainbutton(), 3);

	this.tryagainbutton = new lib.tryagainbutton();
	this.tryagainbutton.name = "tryagainbutton";
	this.tryagainbutton.setTransform(1975.8,548.45,0.9999,0.9999,0,0,0,0.1,0.1);
	this.tryagainbutton._off = true;
	new cjs.ButtonHelper(this.tryagainbutton, 0, 1, 2, false, new lib.tryagainbutton(), 3);

	this.instance_1 = new lib.runghost_button();
	this.instance_1.setTransform(2333,-73.15,0.9999,0.9999,0,0,0,0.1,0.1);
	this.instance_1._off = true;
	new cjs.ButtonHelper(this.instance_1, 0, 1, 2, false, new lib.runghost_button(), 3);

	this.runghost_button = new lib.runghost_button();
	this.runghost_button.name = "runghost_button";
	this.runghost_button.setTransform(2332.8,612.7,0.9999,0.9999);
	new cjs.ButtonHelper(this.runghost_button, 0, 1, 2, false, new lib.runghost_button(), 3);

	this.tryagain_button = new lib.tryagainbutton();
	this.tryagain_button.name = "tryagain_button";
	this.tryagain_button.setTransform(2321.8,611.8,0.9999,0.9999,0,0,0,0.1,0.1);
	this.tryagain_button._off = true;
	new cjs.ButtonHelper(this.tryagain_button, 0, 1, 2, false, new lib.tryagainbutton(), 3);

	this.playagain_button = new lib.tryagainbutton();
	this.playagain_button.name = "playagain_button";
	this.playagain_button.setTransform(4181.5,583,0.9995,0.9995,0,0,0,0.1,0.2);
	new cjs.ButtonHelper(this.playagain_button, 0, 1, 2, false, new lib.tryagainbutton(), 3);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[]}).to({state:[{t:this.walkbutton1}]},94).to({state:[]},1).to({state:[{t:this.walkhighbutton},{t:this.walklowbutton}]},72).to({state:[]},1).to({state:[{t:this.instance}]},166).to({state:[{t:this.tryagainbutton}]},25).to({state:[]},1).to({state:[{t:this.instance_1}]},77).to({state:[{t:this.runghost_button,p:{regX:0,regY:0,scaleX:0.9999,scaleY:0.9999,x:2332.8,y:612.7}}]},5).to({state:[{t:this.runghost_button,p:{regX:0.1,regY:0.2,scaleX:0.9998,scaleY:0.9998,x:2333.3,y:613}}]},100).to({state:[]},1).to({state:[{t:this.tryagainbutton}]},49).to({state:[{t:this.tryagain_button}]},22).to({state:[]},1).to({state:[{t:this.tryagain_button}]},73).to({state:[{t:this.playagain_button}]},15).wait(137));
	this.timeline.addTween(cjs.Tween.get(this.instance).wait(334).to({_off:false},0).to({_off:true,x:1975.8,y:548.45,alpha:1},25).wait(481));
	this.timeline.addTween(cjs.Tween.get(this.tryagainbutton).wait(334).to({_off:false},25).to({_off:true},1).wait(232).to({_off:false,regX:0,regY:0,x:2314.9,y:-119.45},0).to({_off:true,regX:0.1,regY:0.1,x:2321.8,y:611.8},22).wait(226));
	this.timeline.addTween(cjs.Tween.get(this.instance_1).wait(437).to({_off:false},0).to({_off:true,regX:0,regY:0,x:2332.8,y:612.7},5).wait(398));
	this.timeline.addTween(cjs.Tween.get(this.tryagain_button).wait(592).to({_off:false},22).to({_off:true},1).wait(73).to({_off:false,regX:0,regY:0,scaleX:0.9997,scaleY:0.9997,x:4590.95,y:582.3},0).to({_off:true,regX:0.1,regY:0.2,scaleX:0.9995,scaleY:0.9995,x:4181.5,y:583},15).wait(137));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();


(lib.PlanetSymbol = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.instance = new lib.Tween9("synched",0);
	this.instance.setTransform(181.25,181.25);

	this.instance_1 = new lib.Tween10("synched",0);
	this.instance_1.setTransform(181.25,181.25,1,1,-2.2151);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.instance}]}).to({state:[{t:this.instance}]},359).to({state:[{t:this.instance_1}]},360).wait(1));
	this.timeline.addTween(cjs.Tween.get(this.instance).to({rotation:178.9412},359).to({_off:true,rotation:357.7849},360).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-1.7,-1.7,365.9,365.8);


(lib.house_chimneypatch2_symbol = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.instance = new lib.house_chimneypatch1_symbol();
	this.instance.setTransform(36.9,16.95,0.7578,0.7885,0,0,0,48.7,21.5);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = getMCSymbolPrototype(lib.house_chimneypatch2_symbol, new cjs.Rectangle(0,0,73.8,34), null);


(lib.grabmonsterhand_symbol = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {grabmonsterhand_animframe:1};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// timeline functions:
	this.frame_49 = function() {
		var _this = this;
		_this.stop();
	}

	// actions tween:
	this.timeline.addTween(cjs.Tween.get(this).wait(49).call(this.frame_49).wait(1));

	// handlayer
	this.shape = new cjs.Shape();
	this.shape.graphics.f().s("#373535").p("AAQuYQgFAGgzAjQg3AjgKAKIhCA6QhRBDhOApQg7AfhCgGQgsgEhGgbQhSgfgbgGQg7gNguAUQg5AahECXQgPAghwEhQBDBOAzgMQAUgEAPgUQAIgKAWgmQAHgLA+h5QAvhaAYgYQA7g3BcAMQAhAEAcAMQAZALADAIQADAJhGAnQhlA4g6AsQhKA4hBCAQgrBUhWDcQAQAdBIA2QBJA3AWgCQAUgCAMhUQAOhpACgFQAWg5AmgnQBEg9BDhDQBZhYC6hEQBAgXA6gOQAygMAEAEQACADgaARQgzAkgXARQiGBlh8CMQiHCXg+BfQhMB1ASAzQAHASAoCBQApB3ATgDQATgDBgh6QBdh0AFgQQAGgQBah4QB/imBKhjQCSjCEdBEQA3ANgOAnQgGAShGBlQgfAtiwB0QioBvgbAzQhuDMgfBEQhnDdAqAcQBLAzE8iCQB6gyBug7QBrg5AiggQBrhmCmlKQCbkxAKhWIB9n/g");
	this.shape.setTransform(97.3451,276.96,0.9999,0.9999);

	this.shape_1 = new cjs.Shape();
	this.shape_1.graphics.f("#000000").s().p("AkiOLQgrgdBnjcQAfhFBujMQAbgyCohwQCwhzAfguQBGhkAHgTQANgmg3gNQkdhFiSDDIjIEJQhbB4gGAPQgEAQheB1QhgB5gTADQgSADgph3QgoiAgIgTQgSgzBMh0QA/hgCHiXQB7iLCGhlQAXgSA0gjQAZgSgCgDQgDgEgzAMQg5AOhBAYQi6BDhZBZQhDBDhEA9QgmAngWA5QgCAFgOBoQgLBUgVACQgWADhJg3QhHg2gRgeQBWjbArhUQBBiBBLg4QA5grBlg4QBGgogDgJQgDgIgZgLQgcgMgggEQhdgMg7A4QgXAXgwBbQg9B4gHAMQgXAmgIAJQgPAUgUAFQgzAMhDhOQBxkhAOghQBEiXA5gZQAvgUA7AMQAaAGBSAfQBGAbAtAFQBCAGA6gfQBOgqBRhCIBDg6QAJgKA3gkQA0giAEgGIP8DYIh8H/QgLBWibEwQimFKhrBmQghAghsA6QhuA6h6AzQjiBdhnAAQgoAAgVgOg");
	this.shape_1.setTransform(97.3286,276.9858,0.9999,0.9999);

	this.instance = new lib.Tween15("synched",0);
	this.instance.setTransform(97.3,276.95);
	this.instance._off = true;

	this.instance_1 = new lib.Tween16("synched",0);
	this.instance_1.setTransform(534.95,254.15,0.6524,0.9208,0,-128.0813,-130.8527,-0.2,0.1);
	this.instance_1.alpha = 0;

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.shape_1},{t:this.shape}]}).to({state:[{t:this.instance}]},1).to({state:[{t:this.instance_1}]},48).wait(1));
	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1).to({_off:false},0).to({_off:true,regX:-0.2,regY:0.1,scaleX:0.6524,scaleY:0.9208,skewX:-128.0813,skewY:-130.8527,x:534.95,y:254.15,alpha:0},48).wait(1));

	// armlayer
	this.shape_2 = new cjs.Shape();
	this.shape_2.graphics.f().s("#373535").p("AfPAdQi/j9j0jLQmElEnWiYQkvhjjsgcQmwg1l3B+QqtDnmQMIQiAD4hTEVQgtCWgTBoQKrFVDtjCQAoghAWgtQASgmAPhGQAijKAtisQBVlHA8iUQBjj4COiCQDOi7FogNQDLgHFRA9QGoBLF7DxQEBCiDcDjg");
	this.shape_2.setTransform(305.018,104.6517);

	this.shape_3 = new cjs.Shape();
	this.shape_3.graphics.f("#000000").s().p("A/PM9QAShoAtiWQBUkVCAj4QGPsIKujnQF3h+GvA1QDtAcEvBjQHVCYGFFEQD0DLC/D9IiFBdQjdjjkAiiQl7jxmohLQlRg9jLAHQloANjOC7QiOCChjD4Qg8CUhVFHQguCsghDKQgPBGgTAmQgVAtgoAhQhWBHiRAAQj+gBmzjZg");
	this.shape_3.setTransform(304.9414,104.6517);

	this.instance_2 = new lib.Tween17("synched",0);
	this.instance_2.setTransform(304.95,104.65);
	this.instance_2._off = true;

	this.instance_3 = new lib.Tween18("synched",0);
	this.instance_3.setTransform(439.8,115.05,0.5741,0.902,0,-61.8369,-58.1581,-0.1,0.2);
	this.instance_3.alpha = 0;

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.shape_3},{t:this.shape_2}]}).to({state:[{t:this.instance_2}]},1).to({state:[{t:this.instance_3}]},48).wait(1));
	this.timeline.addTween(cjs.Tween.get(this.instance_2).wait(1).to({_off:false},0).to({_off:true,regX:-0.1,regY:0.2,scaleX:0.5741,scaleY:0.902,skewX:-61.8369,skewY:-58.1581,x:439.8,y:115.05,alpha:0},48).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-7.2,-1,621.2,372.8);


(lib.ghost_symbol = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {ghostmoveleft_frame:25};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// timeline functions:
	this.frame_24 = function() {
		var _this = this;
		_this.gotoAndPlay(0);
	}
	this.frame_48 = function() {
		var _this = this;
		_this.gotoAndPlay('ghostmoveleft_frame');
	}

	// actions tween:
	this.timeline.addTween(cjs.Tween.get(this).wait(24).call(this.frame_24).wait(24).call(this.frame_48).wait(1));

	// ghost_mouth
	this.instance = new lib.ghost_mouth_symbol();
	this.instance.setTransform(185,111.75,1,1,0,0,0,37.3,18.6);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1).to({regY:19,y:109.65},0).wait(1).to({y:107.15},0).wait(1).to({y:104.65},0).wait(1).to({y:102.15},0).wait(1).to({y:99.65},0).wait(1).to({y:97.15},0).wait(1).to({y:94.65},0).wait(1).to({y:92.15},0).wait(1).to({y:96},0).wait(1).to({y:99.9},0).wait(1).to({y:103.8},0).wait(1).to({x:276,y:87.7},0).wait(1).to({x:185,y:111.55},0).wait(1).to({y:115.45},0).wait(1).to({y:119.35},0).wait(1).to({y:123.25},0).wait(1).to({y:127.15},0).wait(1).to({y:124.8},0).wait(1).to({y:122.45},0).wait(1).to({y:120.1},0).wait(1).to({y:117.8},0).wait(1).to({y:115.45},0).wait(1).to({y:113.1},0).wait(1).to({regY:18.6,y:110.4},0).wait(1).to({skewY:180,x:-9.6},0).wait(1).to({regY:19,y:108.05},0).wait(1).to({y:105.35},0).wait(1).to({y:102.65},0).wait(1).to({y:99.9},0).wait(1).to({y:97.2},0).wait(1).to({y:94.5},0).wait(1).to({y:91.8},0).wait(1).to({y:95.2},0).wait(1).to({y:98.65},0).wait(1).to({x:-102.6,y:131.05},0).wait(1).to({x:-9.6,y:105.55},0).wait(1).to({y:109},0).wait(1).to({y:112.45},0).wait(1).to({y:115.9},0).wait(1).to({y:119.35},0).wait(1).to({y:122.8},0).wait(1).to({y:120.35},0).wait(1).to({y:117.9},0).wait(1).to({y:115.5},0).wait(1).to({y:113.05},0).wait(1).to({y:110.65},0).wait(1).to({y:108.2},0).wait(1).to({y:105.8},0).wait(1));

	// ghost_righteye
	this.instance_1 = new lib.ghost_righteye_symbol();
	this.instance_1.setTransform(221.6,64.15,1,1,0,0,0,15.9,12.8);

	this.timeline.addTween(cjs.Tween.get(this.instance_1).wait(1).to({regX:16.3,regY:12.7,x:222,y:61.55},0).wait(1).to({y:59.05},0).wait(1).to({y:56.55},0).wait(1).to({y:54.05},0).wait(1).to({y:51.55},0).wait(1).to({y:49.05},0).wait(1).to({y:46.55},0).wait(1).to({y:44.05},0).wait(1).to({y:47.9},0).wait(1).to({y:51.8},0).wait(1).to({y:55.7},0).wait(1).to({x:313,y:39.6},0).wait(1).to({x:222,y:63.45},0).wait(1).to({y:67.35},0).wait(1).to({y:71.25},0).wait(1).to({y:75.15},0).wait(1).to({y:79.05},0).wait(1).to({y:76.9},0).wait(1).to({y:74.75},0).wait(1).to({y:72.6},0).wait(1).to({y:70.45},0).wait(1).to({y:68.3},0).wait(1).to({y:66.15},0).wait(1).to({regX:15.9,regY:12.8,x:221.6,y:64.15},0).wait(1).to({skewY:180,x:-46.2},0).wait(1).to({regX:16.3,regY:12.7,x:-46.6,y:61.3},0).wait(1).to({y:58.6},0).wait(1).to({y:55.9},0).wait(1).to({y:53.15},0).wait(1).to({y:50.45},0).wait(1).to({y:47.75},0).wait(1).to({y:45.05},0).wait(1).to({y:48.45},0).wait(1).to({y:51.9},0).wait(1).to({x:-139.6,y:84.3},0).wait(1).to({x:-46.6,y:58.8},0).wait(1).to({y:62.25},0).wait(1).to({y:65.7},0).wait(1).to({y:69.15},0).wait(1).to({y:72.6},0).wait(1).to({y:76.05},0).wait(1).to({y:73.6},0).wait(1).to({y:71.15},0).wait(1).to({y:68.75},0).wait(1).to({y:66.3},0).wait(1).to({y:63.9},0).wait(1).to({y:61.45},0).wait(1).to({y:59.05},0).wait(1));

	// ghost_lefteye
	this.instance_2 = new lib.ghost_lefteye_symbol();
	this.instance_2.setTransform(166,77.1,1,1,0,0,0,26.3,16.1);

	this.timeline.addTween(cjs.Tween.get(this.instance_2).wait(1).to({y:74.6},0).wait(1).to({y:72.1},0).wait(1).to({y:69.6},0).wait(1).to({y:67.1},0).wait(1).to({y:64.6},0).wait(1).to({y:62.1},0).wait(1).to({y:59.6},0).wait(1).to({y:57.1},0).wait(1).to({y:60.95},0).wait(1).to({y:64.85},0).wait(1).to({y:68.75},0).wait(1).to({x:257,y:52.65},0).wait(1).to({x:166,y:76.5},0).wait(1).to({y:80.4},0).wait(1).to({y:84.3},0).wait(1).to({y:88.2},0).wait(1).to({y:92.1},0).wait(1).to({y:89.75},0).wait(1).to({y:87.4},0).wait(1).to({y:85.05},0).wait(1).to({y:82.75},0).wait(1).to({y:80.4},0).wait(1).to({y:78.05},0).wait(1).to({y:75.75},0).wait(1).to({skewY:180,x:9.4},0).wait(1).to({y:73},0).wait(1).to({y:70.3},0).wait(1).to({y:67.6},0).wait(1).to({y:64.85},0).wait(1).to({y:62.15},0).wait(1).to({y:59.45},0).wait(1).to({y:56.75},0).wait(1).to({y:60.15},0).wait(1).to({y:63.6},0).wait(1).to({x:-83.6,y:96},0).wait(1).to({x:9.4,y:70.5},0).wait(1).to({y:73.95},0).wait(1).to({y:77.4},0).wait(1).to({y:80.85},0).wait(1).to({y:84.3},0).wait(1).to({y:87.75},0).wait(1).to({y:85.3},0).wait(1).to({y:82.85},0).wait(1).to({y:80.45},0).wait(1).to({y:78},0).wait(1).to({y:75.6},0).wait(1).to({y:73.15},0).wait(1).to({y:70.75},0).wait(1));

	// ghost_body
	this.instance_3 = new lib.ghost_body_symbol();
	this.instance_3.setTransform(121.5,202,1,1,0,0,0,121.5,202);

	this.timeline.addTween(cjs.Tween.get(this.instance_3).wait(1).to({y:199.5},0).wait(1).to({y:197},0).wait(1).to({y:194.5},0).wait(1).to({y:192},0).wait(1).to({y:189.5},0).wait(1).to({y:187},0).wait(1).to({y:184.5},0).wait(1).to({y:182},0).wait(1).to({y:185.9},0).wait(1).to({y:189.8},0).wait(1).to({y:193.7},0).wait(1).to({x:212.5,y:177.6},0).wait(1).to({x:121.5,y:201.45},0).wait(1).to({y:205.3},0).wait(1).to({y:209.2},0).wait(1).to({y:213.1},0).wait(1).to({y:217},0).wait(1).to({y:214.85},0).wait(1).to({y:212.7},0).wait(1).to({y:210.55},0).wait(1).to({y:208.4},0).wait(1).to({y:206.25},0).wait(1).to({y:204.1},0).wait(1).to({y:202},0).wait(1).to({skewY:180,x:53.9},0).wait(1).to({y:199.3},0).wait(1).to({y:196.6},0).wait(1).to({y:193.9},0).wait(1).to({y:191.15},0).wait(1).to({y:188.45},0).wait(1).to({y:185.75},0).wait(1).to({y:183},0).wait(1).to({y:186.45},0).wait(1).to({y:189.9},0).wait(1).to({x:-39.1,y:222.25},0).wait(1).to({x:53.9,y:196.8},0).wait(1).to({y:200.25},0).wait(1).to({y:203.65},0).wait(1).to({y:207.1},0).wait(1).to({y:210.55},0).wait(1).to({y:214},0).wait(1).to({y:211.55},0).wait(1).to({y:209.1},0).wait(1).to({y:206.7},0).wait(1).to({y:204.25},0).wait(1).to({y:201.9},0).wait(1).to({y:199.45},0).wait(1).to({y:197},0).wait(1));

	// ghost_shadow
	this.instance_4 = new lib.ghost_shadow_symbol();
	this.instance_4.setTransform(87.7,421.95,1,1,0,0,0,87.7,11.8);

	this.timeline.addTween(cjs.Tween.get(this.instance_4).wait(49));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-161.5,-25.4,496.5,459.79999999999995);


(lib.character_symbol = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {walkright_frame:1,captured_frame:25};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// timeline functions:
	this.frame_0 = function() {
		var _this = this;
		_this.stop();
	}
	this.frame_24 = function() {
		var _this = this;
		_this.gotoAndPlay('walkright_frame');
	}
	this.frame_47 = function() {
		var _this = this;
		_this.gotoAndPlay('captured_frame');
	}

	// actions tween:
	this.timeline.addTween(cjs.Tween.get(this).call(this.frame_0).wait(24).call(this.frame_24).wait(23).call(this.frame_47).wait(1));

	// hair
	this.instance = new lib.character_hair_symbol();
	this.instance.setTransform(72.25,31.3,1,1,0,0,0,68.7,31.3);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(48));

	// mouth
	this.instance_1 = new lib.character_mouth_symbol();
	this.instance_1.setTransform(77.7,107.6,1,1,0,0,0,5.6,1.9);

	this.instance_2 = new lib.character_open_mouth_symbol();
	this.instance_2.setTransform(74.05,105.25,1,1,0,0,0,5.6,1.9);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.instance_1}]}).to({state:[{t:this.instance_1}]},1).to({state:[{t:this.instance_2}]},24).to({state:[{t:this.instance_2}]},22).wait(1));

	// nose
	this.instance_3 = new lib.character_nose_symbol();
	this.instance_3.setTransform(79.6,89.65,1,1,0,0,0,4,2.1);

	this.timeline.addTween(cjs.Tween.get(this.instance_3).wait(48));

	// ears
	this.instance_4 = new lib.character_ears_symbol();
	this.instance_4.setTransform(71.15,74.1,1.0281,1,0,0,0,69.2,12.6);

	this.timeline.addTween(cjs.Tween.get(this.instance_4).wait(48));

	// eyeballs
	this.instance_5 = new lib.character_eyeballs_symbol();
	this.instance_5.setTransform(71.4,62.05,1,1,0,0,0,33.3,9.6);

	this.timeline.addTween(cjs.Tween.get(this.instance_5).wait(32).to({x:67.6},0).wait(3).to({x:71.4},0).wait(6).to({x:74.75},0).wait(2).to({x:71.4},0).wait(5));

	// eyes
	this.instance_6 = new lib.character_eyes_symbol();
	this.instance_6.setTransform(71.4,64.65,1,1,0,0,0,39.4,12.2);

	this.timeline.addTween(cjs.Tween.get(this.instance_6).wait(48));

	// bags
	this.instance_7 = new lib.character_eyebags_symbol();
	this.instance_7.setTransform(70.7,63.45,1,1,0,0,0,43.2,23.5);

	this.timeline.addTween(cjs.Tween.get(this.instance_7).wait(48));

	// face
	this.instance_8 = new lib.character_face_symbol();
	this.instance_8.setTransform(68.35,83.6,1,1,0,0,0,50.6,59.1);

	this.timeline.addTween(cjs.Tween.get(this.instance_8).wait(48));

	// left_forearm
	this.instance_9 = new lib.character_leftforearm_symbol();
	this.instance_9.setTransform(46.75,170.2,1,1,6.6876,0,0,32.8,29.9);

	this.timeline.addTween(cjs.Tween.get(this.instance_9).wait(25).to({regX:32.6,rotation:0,skewX:8.3122,skewY:-171.6878,x:-9.05,y:159.35},5).to({regX:32.7,scaleX:0.9999,scaleY:0.9999,skewX:-56.6397,skewY:-236.6397,x:-22.65,y:199.1},4).to({skewX:16.0996,skewY:-163.9004,x:-4.65,y:155.5},7).to({regX:32.8,scaleX:1,scaleY:1,rotation:6.6876,skewX:0,skewY:0,x:46.75,y:170.2},6).wait(1));

	// right_forearm
	this.instance_10 = new lib.character_leftforearm_symbol();
	this.instance_10.setTransform(112.7,172.4,1,1,0,0,180,32.8,29.9);

	this.timeline.addTween(cjs.Tween.get(this.instance_10).wait(25).to({skewY:0,x:162.55,y:162.2},5).to({regX:32.7,rotation:-64.4989,x:123.45,y:149.7},4).to({rotation:52.2525,x:173.35,y:193.95},7).to({regX:32.8,rotation:0,skewY:180,x:112.7,y:172.4},6).wait(1));

	// body
	this.instance_11 = new lib.character_body_symbol();
	this.instance_11.setTransform(76.7,176.85,1,1,0,0,0,53.1,44.4);

	this.timeline.addTween(cjs.Tween.get(this.instance_11).wait(48));

	// left_top_leg
	this.instance_12 = new lib.character_left_top_leg();
	this.instance_12.setTransform(71.6,232.75,1,1,0,0,0,5.4,11.5);

	this.timeline.addTween(cjs.Tween.get(this.instance_12).wait(2).to({rotation:4.9999,x:72,y:232.95},0).wait(1).to({rotation:9.9997,x:72.35,y:233.2},0).wait(1).to({rotation:14.9996,x:72.75,y:233.4},0).wait(1).to({rotation:19.9995,x:73.15,y:233.65},0).wait(1).to({rotation:24.9993,x:73.6,y:233.85},0).wait(1).to({rotation:29.9992,x:74,y:234.1},0).wait(1).to({rotation:21.6659,x:74.35,y:234.35},0).wait(1).to({rotation:13.3326,x:74.75,y:234.6},0).wait(1).to({rotation:4.9993,x:75.2,y:234.75},0).wait(1).to({rotation:-3.334,x:75.55,y:235.05},0).wait(1).to({rotation:-11.6672,x:76,y:235.25},0).wait(1).to({rotation:-20.0005,x:76.35,y:235.5},0).wait(1).to({rotation:-28.3338,x:76.75,y:235.7},0).wait(1).to({rotation:-36.6671,x:77.2,y:235.95},0).wait(1).to({rotation:-45.0004,x:77.55,y:236.2},0).wait(1).to({rotation:-39.3753,x:76.75,y:235.8},0).wait(1).to({rotation:-33.7503,x:75.95,y:235.4},0).wait(1).to({rotation:-28.1252,x:75.1,y:235.05},0).wait(1).to({rotation:-22.5002,x:74.35,y:234.65},0).wait(1).to({rotation:-16.8751,x:73.5,y:234.3},0).wait(1).to({rotation:-11.2501,x:72.7,y:233.95},0).wait(1).to({rotation:-5.625,x:71.9,y:233.55},0).wait(1).to({rotation:0,x:71.1,y:233.2},0).wait(24));

	// right_top_leg
	this.shape = new cjs.Shape();
	this.shape.graphics.f().s("#373535").p("Ag1kBIAAIDIBrAAIAAoDg");
	this.shape.setTransform(84.262,232.7565,0.9999,0.4456);

	this.shape_1 = new cjs.Shape();
	this.shape_1.graphics.f("#292929").s().p("Ag1ECIAAoDIBrAAIAAIDg");
	this.shape_1.setTransform(84.262,232.7565,0.9999,0.4456);

	this.instance_13 = new lib.character_left_top_leg();
	this.instance_13.setTransform(84.25,232.75,1,1,0,0,0,5.4,11.5);
	this.instance_13._off = true;

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.shape_1},{t:this.shape}]}).to({state:[{t:this.instance_13}]},1).to({state:[{t:this.instance_13}]},1).to({state:[{t:this.instance_13}]},1).to({state:[{t:this.instance_13}]},1).to({state:[{t:this.instance_13}]},1).to({state:[{t:this.instance_13}]},1).to({state:[{t:this.instance_13}]},1).to({state:[{t:this.instance_13}]},1).to({state:[{t:this.instance_13}]},1).to({state:[{t:this.instance_13}]},1).to({state:[{t:this.instance_13}]},1).to({state:[{t:this.instance_13}]},1).to({state:[{t:this.instance_13}]},1).to({state:[{t:this.instance_13}]},1).to({state:[{t:this.instance_13}]},1).to({state:[{t:this.instance_13}]},1).to({state:[{t:this.instance_13}]},1).to({state:[{t:this.instance_13}]},1).to({state:[{t:this.instance_13}]},1).to({state:[{t:this.instance_13}]},1).to({state:[{t:this.instance_13}]},1).to({state:[{t:this.instance_13}]},1).to({state:[{t:this.instance_13}]},1).to({state:[{t:this.instance_13}]},1).to({state:[{t:this.instance_13}]},1).to({state:[{t:this.instance_13}]},1).to({state:[{t:this.instance_13}]},1).to({state:[{t:this.instance_13}]},1).to({state:[{t:this.instance_13}]},1).to({state:[{t:this.instance_13}]},1).to({state:[{t:this.instance_13}]},1).to({state:[{t:this.instance_13}]},1).to({state:[{t:this.instance_13}]},1).to({state:[{t:this.instance_13}]},1).to({state:[{t:this.instance_13}]},1).to({state:[{t:this.instance_13}]},1).to({state:[{t:this.instance_13}]},1).to({state:[{t:this.instance_13}]},1).to({state:[{t:this.instance_13}]},1).to({state:[{t:this.instance_13}]},1).to({state:[{t:this.instance_13}]},1).to({state:[{t:this.instance_13}]},1).to({state:[{t:this.instance_13}]},1).to({state:[{t:this.instance_13}]},1).to({state:[{t:this.instance_13}]},1).to({state:[{t:this.instance_13}]},1).to({state:[{t:this.instance_13}]},1).wait(1));
	this.timeline.addTween(cjs.Tween.get(this.instance_13).wait(1).to({_off:false},0).wait(1).to({rotation:-7.4999,x:85.6,y:232.65},0).wait(1).to({rotation:-14.9999,x:87.05,y:232.6},0).wait(1).to({rotation:-22.4998,x:88.45,y:232.5},0).wait(1).to({rotation:-29.9997,x:89.85,y:232.45},0).wait(1).to({rotation:-37.4997,x:91.25,y:232.35},0).wait(1).to({rotation:-44.9996,x:92.6},0).wait(1).to({rotation:-34.9996,x:91.65,y:232.75},0).wait(1).to({rotation:-24.9996,x:90.7,y:233.15},0).wait(1).to({rotation:-14.9996,x:89.75,y:233.6},0).wait(1).to({rotation:-4.9996,x:88.8,y:234.05},0).wait(1).to({rotation:5.0004,x:87.85,y:234.45},0).wait(1).to({rotation:15.0004,x:86.85,y:234.9},0).wait(1).to({rotation:25.0004,x:85.95,y:235.3},0).wait(1).to({rotation:35.0004,x:84.95,y:235.75},0).wait(1).to({rotation:45.0004,x:84,y:236.15},0).wait(1).to({rotation:39.3754,y:235.85},0).wait(1).to({rotation:33.7503,y:235.4},0).wait(1).to({rotation:28.1253,x:84.05,y:235.05},0).wait(1).to({rotation:22.5002,y:234.65},0).wait(1).to({rotation:16.8752,x:84,y:234.3},0).wait(1).to({rotation:11.2501,y:233.95},0).wait(1).to({rotation:5.6251,y:233.6},0).wait(1).to({rotation:0,x:84.05,y:233.2},0).wait(24));

	// left_shoe
	this.instance_14 = new lib.character_shoe_symbol();
	this.instance_14.setTransform(55.85,266.4,1,1,0,0,180,22.8,9.6);

	this.timeline.addTween(cjs.Tween.get(this.instance_14).wait(1).to({regX:22.9,regY:9.7,skewY:0,x:84.35,y:268.25},0).wait(1).to({regX:22.8,scaleX:0.9964,rotation:7.4999,x:78.35,y:268.05},0).wait(1).to({scaleX:0.9928,rotation:14.9999,x:72.5,y:267.85},0).wait(1).to({scaleX:0.9891,rotation:22.4998,x:66.7,y:267.75},0).wait(1).to({scaleX:0.9855,rotation:29.9997,x:60.8,y:267.6},0).wait(1).to({scaleX:0.9819,rotation:37.4997,x:54.95,y:267.4},0).wait(1).to({scaleX:0.9783,rotation:44.9996,x:49.1,y:267.2},0).wait(1).to({scaleX:0.9746,rotation:37.243,x:55.2,y:267.05},0).wait(1).to({scaleX:0.971,rotation:29.4865,x:61.3,y:266.95},0).wait(1).to({scaleX:0.9674,rotation:21.7299,x:67.35,y:266.8},0).wait(1).to({scaleX:0.9638,rotation:13.9734,x:73.4,y:266.65},0).wait(1).to({scaleX:0.9601,rotation:6.2168,x:79.55,y:266.5},0).wait(1).to({scaleX:0.9565,rotation:-1.5397,x:85.6,y:266.35},0).wait(1).to({scaleX:0.9529,rotation:-9.2963,x:91.7,y:266.2},0).wait(1).to({scaleX:0.9493,rotation:-17.0528,x:97.8,y:266.05},0).wait(1).to({scaleX:0.9457,rotation:-24.8094,x:103.85,y:265.95},0).wait(1).to({scaleX:0.942,rotation:-21.6922,x:101.65,y:266.7},0).wait(1).to({scaleX:0.9384,rotation:-18.5749,x:99.45,y:267.5},0).wait(1).to({scaleX:0.9348,rotation:-15.4577,x:97.2,y:268.2},0).wait(1).to({scaleX:0.9311,rotation:-12.3404,x:94.95,y:269},0).wait(1).to({scaleX:0.9275,rotation:-9.2232,x:92.65,y:269.75},0).wait(1).to({scaleX:0.9239,rotation:-6.106,x:90.5,y:270.55},0).wait(1).to({scaleX:0.9203,rotation:-2.9887,x:88.2,y:271.3},0).wait(1).to({scaleX:0.9167,rotation:0.1285,x:86,y:272.1},0).wait(1).to({scaleX:1,rotation:0,skewX:0.1285,skewY:-179.8715,x:54.95,y:268.9},0).wait(1).to({y:268.85},0).wait(22));

	// right_shoe
	this.instance_15 = new lib.character_shoe_symbol();
	this.instance_15.setTransform(101.1,266.4,1,1,0,0,0,22.8,9.6);

	this.timeline.addTween(cjs.Tween.get(this.instance_15).wait(1).to({x:98.55,y:267.5},0).wait(1).to({regY:9.7,rotation:-6.4503,x:104.55,y:266},0).wait(1).to({rotation:-12.9006,x:110.5,y:264.3},0).wait(1).to({rotation:-19.3509,x:116.55,y:262.7},0).wait(1).to({rotation:-25.8013,x:122.6,y:261.15},0).wait(1).to({rotation:-32.2516,x:128.65,y:259.5},0).wait(1).to({rotation:-38.7019,x:134.65,y:257.85},0).wait(1).to({rotation:-25.628,x:123.05,y:257.95},0).wait(1).to({rotation:-12.5542,x:111.45,y:258},0).wait(1).to({rotation:0.5197,x:99.85,y:258.1},0).wait(1).to({rotation:13.5936,x:88.25,y:258.15},0).wait(1).to({rotation:26.6674,x:76.7,y:258.2},0).wait(1).to({rotation:39.7413,x:65.15,y:258.3},0).wait(1).to({rotation:52.8152,x:53.55},0).wait(1).to({rotation:65.889,x:41.95,y:258.35},0).wait(1).to({rotation:78.9629,x:30.4,y:258.45},0).wait(1).to({rotation:69.1908,x:39.25,y:259.75},0).wait(1).to({rotation:59.4187,x:48.15,y:261.15},0).wait(1).to({rotation:49.6465,x:57,y:262.45},0).wait(1).to({rotation:39.8744,x:65.95,y:263.75},0).wait(1).to({rotation:30.1023,x:74.8,y:265.15},0).wait(1).to({rotation:20.3302,x:83.75,y:266.4},0).wait(1).to({rotation:10.558,x:92.55,y:267.8},0).wait(1).to({rotation:0.7859,x:101.45,y:269.05},0).wait(1).to({rotation:0.7859,x:100.7},0).wait(5).to({x:100.65},0).wait(8).to({x:100.6},0).wait(4).to({y:269},0).wait(3).to({x:100.55},0).wait(3));

	// left_bottom_leg
	this.instance_16 = new lib.character_right_bottom_leg();
	this.instance_16.setTransform(71.6,259.4,1,1,0,0,0,5.4,13.2);

	this.timeline.addTween(cjs.Tween.get(this.instance_16).wait(1).to({y:258.8},0).wait(1).to({rotation:7.4999,x:69.35,y:256.4},0).wait(1).to({rotation:14.9999,x:67.05,y:254.05},0).wait(1).to({rotation:22.4998,x:64.8,y:251.65},0).wait(1).to({rotation:29.9997,x:62.55,y:249.3},0).wait(1).to({rotation:37.4997,x:60.25,y:246.9},0).wait(1).to({rotation:44.9996,x:57.95,y:244.5},0).wait(1).to({rotation:37.243,x:62.35,y:246.1},0).wait(1).to({rotation:29.4865,x:66.7,y:247.75},0).wait(1).to({rotation:21.7299,x:71.05,y:249.35},0).wait(1).to({rotation:13.9734,x:75.4,y:250.95},0).wait(1).to({rotation:6.2168,x:79.75,y:252.55},0).wait(1).to({rotation:-1.5397,x:84.1,y:254.2},0).wait(1).to({rotation:-9.2963,x:88.5,y:255.85},0).wait(1).to({rotation:-17.0528,x:92.8,y:257.4},0).wait(1).to({rotation:-24.8094,x:97.2,y:259.05},0).wait(1).to({rotation:-21.6922,x:93.95,y:259},0).wait(1).to({rotation:-18.5749,x:90.65,y:259.05},0).wait(1).to({rotation:-15.4577,x:87.4},0).wait(1).to({rotation:-12.3404,x:84.15,y:259.1},0).wait(1).to({rotation:-9.2232,x:80.85},0).wait(1).to({rotation:-6.106,x:77.6,y:259.15},0).wait(1).to({rotation:-2.9887,x:74.35,y:259.1},0).wait(1).to({rotation:0.1285,x:71.05},0).wait(1).to({rotation:0.1285},0).wait(23));

	// right_bottom_leg
	this.instance_17 = new lib.character_right_bottom_leg();
	this.instance_17.setTransform(84.25,259.4,1,1,0,0,0,5.4,13.2);

	this.timeline.addTween(cjs.Tween.get(this.instance_17).wait(1).to({y:258.8},0).wait(1).to({rotation:-7.4999,x:88.7,y:257.7},0).wait(1).to({rotation:-14.9999,x:93.25,y:256.6},0).wait(1).to({rotation:-22.4998,x:97.8,y:255.55},0).wait(1).to({rotation:-29.9997,x:102.35,y:254.5},0).wait(1).to({rotation:-37.4997,x:106.85,y:253.35},0).wait(1).to({rotation:-44.9996,x:111.35,y:252.35},0).wait(1).to({rotation:-33.5923,x:105.9,y:252.4},0).wait(1).to({rotation:-22.1851,x:100.45,y:252.45},0).wait(1).to({rotation:-10.7778,x:94.9,y:252.6},0).wait(1).to({rotation:0.6294,x:89.45,y:252.65},0).wait(1).to({rotation:12.0367,x:84,y:252.8},0).wait(1).to({rotation:23.4439,x:78.5,y:252.85},0).wait(1).to({rotation:34.8512,x:73.05,y:252.95},0).wait(1).to({rotation:46.2584,x:67.55,y:253.05},0).wait(1).to({rotation:57.6657,x:62.1,y:253.1},0).wait(1).to({rotation:50.5349,x:64.8,y:253.85},0).wait(1).to({rotation:43.404,x:67.55,y:254.6},0).wait(1).to({rotation:36.2732,x:70.3,y:255.4},0).wait(1).to({rotation:29.1423,x:72.95,y:256.15},0).wait(1).to({rotation:22.0115,x:75.7,y:256.85},0).wait(1).to({rotation:14.8806,x:78.45,y:257.65},0).wait(1).to({rotation:7.7498,x:81.15,y:258.4},0).wait(1).to({rotation:0.619,x:83.9,y:259.1},0).wait(1).to({rotation:0.619},0).wait(23));

	// left_arm
	this.instance_18 = new lib.character_left_arm_symbol();
	this.instance_18.setTransform(23.05,179.9,1,1,0,0,0,9.6,12);

	this.timeline.addTween(cjs.Tween.get(this.instance_18).wait(48));

	// right_arm
	this.instance_19 = new lib.character_right_arm_symbol();
	this.instance_19.setTransform(126.8,177.6,1,1,0,0,0,9.5,11.3);

	this.timeline.addTween(cjs.Tween.get(this.instance_19).wait(48));

	// backpack
	this.instance_20 = new lib.character_backpack_symbol();
	this.instance_20.setTransform(76.3,176.9,1,1,0,0,0,46,47.4);

	this.timeline.addTween(cjs.Tween.get(this.instance_20).wait(48));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-66.6,-0.5,293.29999999999995,291.1);


(lib.Scene_1_planet_texture_mask = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// planet_texture_mask
	this.instance = new lib.PlanetSymbol();
	this.instance.setTransform(-626.8,-426.35,2.9383,2.9383,0,0,0,181.1,181.1);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(815));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();


(lib.Scene_1_gramonster_arm = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// gramonster_arm
	this.instance = new lib.grabmonsterhand_symbol();
	this.instance.setTransform(1787.3,213.2,0.0965,0.0965,87.3258,0,0,253.3,185.1);
	this.instance.alpha = 0;
	this.instance._off = true;

	this.grabmonsterhand_symbol = new lib.grabmonsterhand_symbol();
	this.grabmonsterhand_symbol.name = "grabmonsterhand_symbol";
	this.grabmonsterhand_symbol.setTransform(1534.9,167.75,0.9999,0.9999,-12.462,0,0,252.6,185.9);
	this.grabmonsterhand_symbol.alpha = 0.8984;

	this.timeline.addTween(cjs.Tween.get({}).to({state:[]}).to({state:[{t:this.instance}]},224).to({state:[{t:this.grabmonsterhand_symbol}]},16).to({state:[{t:this.grabmonsterhand_symbol}]},48).wait(1));
	this.timeline.addTween(cjs.Tween.get(this.instance).wait(224).to({_off:false},0).to({_off:true,regX:252.6,regY:185.9,scaleX:0.9999,scaleY:0.9999,rotation:-12.462,x:1534.9,y:167.75,alpha:0.8984},16).wait(49));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();


(lib.Scene_1_ghost = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// ghost
	this.ghost_symbol = new lib.ghost_symbol();
	this.ghost_symbol.name = "ghost_symbol";
	this.ghost_symbol.setTransform(1318.8,612,0.9999,0.9999,0,0,0,121.5,217);
	this.ghost_symbol._off = true;

	this.timeline.addTween(cjs.Tween.get(this.ghost_symbol).wait(431).to({_off:false},0).to({x:1433.9,y:584.4},11).wait(101).to({x:2071.9,y:431.3},0).to({regY:217.1,x:2071.85,y:986.1},26).wait(71));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();


(lib.Scene_1_character = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// character
	this.character_symbol = new lib.character_symbol();
	this.character_symbol.name = "character_symbol";
	this.character_symbol.setTransform(160,454.35,1,1,0,0,0,69.8,138);

	this.timeline.addTween(cjs.Tween.get(this.character_symbol).wait(95).to({regX:69.9,scaleX:0.9999,scaleY:0.9999,x:1016.95,y:454.4},71).wait(2).to({regY:138.1,x:1221.3,y:330.4},35).to({regX:70,regY:138.2,scaleX:0.9998,scaleY:0.9998,x:1404.45,y:328.4},21).wait(16).to({x:1867.05,y:299.65,alpha:0.1094},48).wait(1).to({alpha:0},0).wait(71).to({regY:138.5,scaleX:0.9997,scaleY:0.9997,x:952.85,y:466.35,alpha:1},0).to({regX:70.2,regY:138.6,scaleX:0.9996,scaleY:0.9996,x:2049.25,y:466.45},71).wait(112).to({regX:70.4,regY:138.7,scaleX:0.9995,scaleY:0.9995,x:2067.5,y:937.9},26).wait(46).to({regX:70.3,x:2067.4,y:474.65},0).to({regX:70.2,scaleX:0.9996,scaleY:0.9996,x:3036,y:326.6},56).wait(144));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();


(lib.house_symbol = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// houseroofpatch
	this.instance = new lib.house_roofpatch_symbol();
	this.instance.setTransform(106.35,-105.3,1,1,0,0,0,65.3,55.1);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(70));

	// housechimney
	this.instance_1 = new lib.house_roofchimney_symbol();
	this.instance_1.setTransform(442.7,-328.25,1,1,0,0,0,74.7,64.2);

	this.timeline.addTween(cjs.Tween.get(this.instance_1).wait(70));

	// houseroof
	this.instance_2 = new lib.house_roof_symbol();
	this.instance_2.setTransform(319.5,-155.7,1,1,0,0,0,491.6,155.7);

	this.timeline.addTween(cjs.Tween.get(this.instance_2).wait(70));

	// housesidechimneypatches
	this.instance_3 = new lib.house_chimneypatch2_symbol();
	this.instance_3.setTransform(803.3,61.2,1,1,0,0,0,36.9,16.9);

	this.instance_4 = new lib.house_chimneypatch1_symbol();
	this.instance_4.setTransform(832.5,-10.65,1,1,0,0,0,48.6,21.5);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.instance_4,p:{regY:21.5,rotation:0,x:832.5,y:-10.65}},{t:this.instance_3,p:{regY:16.9,rotation:0,x:803.3,y:61.2}}]}).to({state:[{t:this.instance_4,p:{regY:21.4,rotation:14.9992,x:826.95,y:-7.3}},{t:this.instance_3,p:{regY:17,rotation:14.9992,x:780.1,y:54.65}}]},12).to({state:[{t:this.instance_4,p:{regY:21.5,rotation:0,x:832.5,y:-10.65}},{t:this.instance_3,p:{regY:16.9,rotation:0,x:803.3,y:61.2}}]},11).to({state:[{t:this.instance_4,p:{regY:21.4,rotation:14.9992,x:823.9,y:-7.3}},{t:this.instance_3,p:{regY:17,rotation:14.9992,x:777.05,y:54.65}}]},12).to({state:[{t:this.instance_4,p:{regY:21.5,rotation:0,x:832.5,y:-10.65}},{t:this.instance_3,p:{regY:16.9,rotation:0,x:803.3,y:61.2}}]},13).to({state:[{t:this.instance_4,p:{regY:21.4,rotation:14.9992,x:825.95,y:-7.3}},{t:this.instance_3,p:{regY:17,rotation:14.9992,x:779.1,y:54.65}}]},11).to({state:[{t:this.instance_4,p:{regY:21.5,rotation:0,x:832.5,y:-10.65}},{t:this.instance_3,p:{regY:16.9,rotation:0,x:803.3,y:61.2}}]},10).wait(1));

	// housesidechimneysmoke
	this.instance_5 = new lib.house_smoke3_symbol();
	this.instance_5.setTransform(948.55,-325.05,1,1,0,0,0,67.3,67.4);

	this.instance_6 = new lib.house_smoke2_symbol();
	this.instance_6.setTransform(862.1,-260.2,1,1,0,0,0,37.9,37.9);

	this.instance_7 = new lib.house_smoke1_symbol();
	this.instance_7.setTransform(876.9,-199.2,1,1,0,0,0,23.1,23.1);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.instance_7,p:{x:876.9}},{t:this.instance_6,p:{x:862.1,y:-260.2}},{t:this.instance_5,p:{x:948.55,y:-325.05}}]}).to({state:[{t:this.instance_7,p:{x:899.65}},{t:this.instance_6,p:{x:838.65,y:-260.2}},{t:this.instance_5,p:{x:995.45,y:-289.7}}]},23).to({state:[{t:this.instance_7,p:{x:841.4}},{t:this.instance_6,p:{x:902.4,y:-273.5}},{t:this.instance_5,p:{x:832.55,y:-325.05}}]},25).to({state:[{t:this.instance_7,p:{x:876.9}},{t:this.instance_6,p:{x:862.1,y:-260.2}},{t:this.instance_5,p:{x:948.55,y:-325.05}}]},21).wait(1));

	// housewindows
	this.instance_8 = new lib.house_windows_symbol();
	this.instance_8.setTransform(454.4,307.75,1,1,0,0,0,113.8,197.3);

	this.timeline.addTween(cjs.Tween.get(this.instance_8).wait(70));

	// housedoor
	this.instance_9 = new lib.house_door_symbol();
	this.instance_9.setTransform(149.55,285.9,1,1,0,0,0,108.5,256.6);

	this.timeline.addTween(cjs.Tween.get(this.instance_9).wait(70));

	// housebody
	this.instance_10 = new lib.house_body_symbol();
	this.instance_10.setTransform(322.7,271.3,1,1,0,0,0,322.7,271.3);

	this.timeline.addTween(cjs.Tween.get(this.instance_10).wait(70));

	// housesidechimney
	this.instance_11 = new lib.house_chimney_symbol();
	this.instance_11.setTransform(808.05,-40.95,1,1,0,0,0,162.7,164.2);

	this.timeline.addTween(cjs.Tween.get(this.instance_11).wait(12).to({regX:162.6,regY:164.1,rotation:14.9992,x:808,y:-41},0).wait(11).to({regX:162.7,rotation:0,x:808.05},0).wait(12).to({rotation:14.9994,y:-40.95},0).wait(13).to({rotation:0},0).wait(11).to({regY:164,rotation:14.9996,y:-41},0).wait(10).to({scaleX:0.9999,scaleY:0.9999,rotation:0},0).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-173.2,-425.2,1204.4,968.5);


(lib.Scene_1_house = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// house
	this.instance = new lib.house_symbol();
	this.instance.setTransform(3561.7,54.05,0.9999,0.9999,0,0,0,405.5,58.9);
	this.instance._off = true;

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(615).to({_off:false},0).wait(200));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();


// stage content:
(lib.WilliamBlairFinalProject = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {charwalk1:95,characterwalkhigh:168,characterwalklow:360,startghostchase_frame:444,ghostfail_frame:543,ghostsuccess_frame:615,endsceneloop_frame:704};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	this.actionFrames = [0,94,95,166,167,168,203,224,240,288,289,359,360,431,442,542,543,569,592,614,615,671,688,703,814,839];
	this.streamSoundSymbolsList[95] = [{id:"mixkitcrunchyfootstepsloop535",startFrame:95,endFrame:224,loop:1,offset:0}];
	this.streamSoundSymbolsList[224] = [{id:"electricdrill06_editedwav",startFrame:224,endFrame:289,loop:1,offset:0}];
	this.streamSoundSymbolsList[360] = [{id:"mixkitcrunchyfootstepsloop535",startFrame:360,endFrame:431,loop:1,offset:0}];
	this.streamSoundSymbolsList[442] = [{id:"dialupmodem02_editwav",startFrame:442,endFrame:569,loop:1,offset:0}];
	this.streamSoundSymbolsList[615] = [{id:"mixkitcrunchyfootstepsloop535",startFrame:615,endFrame:671,loop:1,offset:0}];
	this.streamSoundSymbolsList[671] = [{id:"househeater1wav",startFrame:671,endFrame:839,loop:1,offset:0}];
	this.___GetDepth___ = function(obj) {
		var depth = obj.depth;
		var cameraObj = this.___camera___instance;
		if(cameraObj && cameraObj.depth && obj.isAttachedToCamera)
		{
			depth += depth + cameraObj.depth;
		}
		return depth;
		}
	this.___needSorting___ = function() {
		for (var i = 0; i < this.numChildren - 1; i++)
		{
			var prevDepth = this.___GetDepth___(this.getChildAt(i));
			var nextDepth = this.___GetDepth___(this.getChildAt(i + 1));
			if (prevDepth < nextDepth)
				return true;
		}
		return false;
	}
	this.___sortFunction___ = function(obj1, obj2) {
		return (this.exportRoot.___GetDepth___(obj2) - this.exportRoot.___GetDepth___(obj1));
	}
	this.on('tick', function (event){
		var curTimeline = event.currentTarget;
		if (curTimeline.___needSorting___()){
			this.sortChildren(curTimeline.___sortFunction___);
		}
	});

	// timeline functions:
	this.frame_0 = function() {
		this.clearAllSoundStreams();
		 
		this.character_symbol = this.character.character_symbol;
		var _this = this;
		_this.character_symbol.gotoAndStop(0);
		playSound("mixkitspacealieninvasion2477",-1);
	}
	this.frame_94 = function() {
		this.character_symbol = undefined;this.walkbutton1 = this.buttons.walkbutton1;
		this.character_symbol = this.character.character_symbol;
		var _this = this;
		_this.stop();
		var _this = this;
		/*
		Clicking on the specified symbol instance executes a function.
		*/
		_this.walkbutton1.on('click', function(){
		/*
		Moves the playhead to the specified frame label in the timeline and continues playback from that frame.
		Can be used on the main timeline or on movie clip timelines.
		*/
		_this.gotoAndPlay('charwalk1');
		});
	}
	this.frame_95 = function() {
		var soundInstance = playSound("mixkitcrunchyfootstepsloop535",0);
		this.InsertIntoSoundStreamData(soundInstance,95,224,1);
		this.character_symbol = undefined;this.walkbutton1 = undefined;this.character_symbol = this.character.character_symbol;
		var _this = this;
		/*
		Moves the playhead to the specified frame label in the timeline and continues playback from that frame.
		Can be used on the main timeline or on movie clip timelines.
		*/
		_this.character_symbol.gotoAndPlay('walkright_frame');
	}
	this.frame_166 = function() {
		this.character_symbol = undefined;this.character_symbol = this.character.character_symbol;
	}
	this.frame_167 = function() {
		this.walkhighbutton = this.buttons.walkhighbutton;
		this.walklowbutton = this.buttons.walklowbutton;
		var _this = this;
		_this.character_symbol.gotoAndStop(0);
		_this.stop();
		var _this = this;
		/*
		Clicking on the specified symbol instance executes a function.
		*/
		_this.walkhighbutton.on('click', function(){
		/*
		Moves the playhead to the specified frame label in the timeline and continues playback from that frame.
		Can be used on the main timeline or on movie clip timelines.
		*/
		_this.gotoAndPlay('characterwalkhigh');
		});
		
		/*
		Clicking on the specified symbol instance executes a function.
		*/
		_this.walklowbutton.on('click', function(){
		/*
		Moves the playhead to the specified frame label in the timeline and continues playback from that frame.
		Can be used on the main timeline or on movie clip timelines.
		*/
		_this.gotoAndPlay('characterwalklow');
		});
	}
	this.frame_168 = function() {
		this.character_symbol = undefined;this.walkhighbutton = undefined;this.walklowbutton = undefined;this.character_symbol = this.character.character_symbol;
		var _this = this;
		_this.character_symbol.gotoAndPlay('walkright_frame');
	}
	this.frame_203 = function() {
		this.character_symbol = undefined;this.character_symbol = this.character.character_symbol;
	}
	this.frame_224 = function() {
		var soundInstance = playSound("electricdrill06_editedwav",0);
		this.InsertIntoSoundStreamData(soundInstance,224,289,1);
		this.character_symbol = undefined;this.character_symbol = this.character.character_symbol;
		var _this = this;
		_this.character_symbol.gotoAndStop(0);
	}
	this.frame_240 = function() {
		this.character_symbol = undefined;this.grabmonsterhand_symbol = this.gramonster_arm.grabmonsterhand_symbol;
		this.character_symbol = this.character.character_symbol;
		var _this = this;
		_this.character_symbol.gotoAndPlay('captured_frame');
		var _this = this;
		/*
		Moves the playhead to the specified frame label in the timeline and continues playback from that frame.
		Can be used on the main timeline or on movie clip timelines.
		*/
		console.log('grabmonsterhand_symbol call gotoAndPlay');
		_this.grabmonsterhand_symbol.gotoAndPlay('grabmonsterhand_animframe');
	}
	this.frame_288 = function() {
		this.character_symbol = undefined;this.grabmonsterhand_symbol = undefined;this.grabmonsterhand_symbol = this.gramonster_arm.grabmonsterhand_symbol;
		this.character_symbol = this.character.character_symbol;
	}
	this.frame_289 = function() {
		this.character_symbol = undefined;this.character_symbol = this.character.character_symbol;
	}
	this.frame_359 = function() {
		this.tryagainbutton = this.buttons.tryagainbutton;
		var _this = this;
		_this.stop();
		
		
		/*
		Clicking on the specified symbol instance executes a function.
		*/
		_this.tryagainbutton.on('click', function(){
		/*
		Moves the playhead to the specified frame number in the timeline and stops the movie.
		Can be used on the main timeline or on movie clip timelines.
		*/
		_this.gotoAndPlay(0);
		});
	}
	this.frame_360 = function() {
		var soundInstance = playSound("mixkitcrunchyfootstepsloop535",0);
		this.InsertIntoSoundStreamData(soundInstance,360,431,1);
		this.character_symbol = undefined;this.tryagainbutton = undefined;this.character_symbol = this.character.character_symbol;
		var _this = this;
		_this.character_symbol.gotoAndPlay('walkright_frame');
	}
	this.frame_431 = function() {
		this.character_symbol = undefined;this.ghost_symbol = this.ghost.ghost_symbol;
		this.character_symbol = this.character.character_symbol;
		var _this = this;
		/* Stop the character animation */
		_this.character_symbol.gotoAndStop(0);
	}
	this.frame_442 = function() {
		var soundInstance = playSound("dialupmodem02_editwav",0);
		this.InsertIntoSoundStreamData(soundInstance,442,569,1);
		this.ghost_symbol = undefined;this.runghost_button = this.buttons.runghost_button;
		this.ghost_symbol = this.ghost.ghost_symbol;
		var _this = this;
		
		var lastCharX = _this.character_symbol.x;
		var lastCharY = _this.character_symbol.y;
		const initCharX = lastCharX;
		const initCharY = _this.character_symbol.y;
		const ghostStartX = _this.ghost_symbol.x;
		const ghostStartY = _this.ghost_symbol.y;
		var lastGhostX = ghostStartX;
		var lastGhostY = ghostStartY;
		var lastCharacterFrame = 1;
		
		var ghostRunning = false;
		var doneGhostAnim = false;
		_this.addEventListener('tick', moveGhost);
		function moveGhost() {
		
			if (doneGhostAnim) {
				_this.removeEventListener('tick', moveGhost);
				console.log('done ghost anim; returning');
				return;
			}
			
			_this.character_symbol.x = lastCharX;
			_this.character_symbol.y = lastCharY;
			
			if (!ghostRunning)
			{
				if (doneGhostAnim) {
					console.log('done ghost anim; returning');
					return;
				}
				
				//console.log('move ghost tick');
				const ghostSpeed = 5;
				var curGhostX = lastGhostX;
				var curGhostY = lastGhostY;
				curGhostX += ghostSpeed;
				curGhostY -= ghostSpeed;
				if (curGhostY < initCharY) {
					curGhostY = initCharY;
				}
				if (curGhostX > initCharX) {
					curGhostX = initCharX;
				}
				_this.ghost_symbol.x = curGhostX;
				_this.ghost_symbol.y = curGhostY;
				
				lastGhostX = curGhostX;
				lastGhostY = curGhostY;
				
				if (Math.abs(initCharX - curGhostX) < 0.01 &&
					Math.abs(initCharY - curGhostY) < 0.01 &&
					!doneGhostAnim && !ghostRunning)
				{
					console.log('Done init moving ghost');
					//_this.removeEventListener('tick', moveGhost);
					if (_this.character_symbol.x <= curGhostX + 50) {
						console.log('Lost condition!');
						doneGhostAnim = true;
						_this.removeEventListener('tick', moveGhost);
						_this.character_symbol.x = initCharX;
						_this.character_symbol.gotoAndStop(0);
						_this.gotoAndPlay('ghostfail_frame');
					}
					else {
						console.log('Win condition! doneGhostAnim, ghostRunning:');
						ghostRunning = true;
						//_this.runghost_button.visible = false;
						//_this.runghost_button.removeEventListener('click', ghostButtonClick);
						_this.ghost_symbol.gotoAndPlay('ghostmoveleft_frame');
					}
				}
			
			}
			else
			{
				/* Random character movement so he looks glitchy */
				//_this.character_symbol.gotoAndStop(1 + Math.floor(Math.random()*23));
				
				const ghostSpeed = 5;
				var curGhostX = lastGhostX;
				var curGhostY = lastGhostY;
				curGhostX -= ghostSpeed;
				curGhostY += ghostSpeed;
				if (curGhostY > ghostStartY) {
					curGhostY = ghostStartY;
				}
				if (curGhostX < ghostStartX) {
					curGhostX = ghostStartX;
				}
				_this.ghost_symbol.x = curGhostX;
				_this.ghost_symbol.y = curGhostY;
				lastGhostX = curGhostX;
				lastGhostY = curGhostY;
				if (Math.abs(curGhostX - ghostStartX) < 0.01 &&
					Math.abs(curGhostY - ghostStartY) < 0.01)
				{
					console.log('Ghost done running!');
					_this.removeEventListener('tick', moveGhost);
					doneGhostAnim = true;
					_this.gotoAndPlay('ghostsuccess_frame');
				}
			}
		}
		
		/*
		Clicking on the specified symbol instance executes a function.
		*/
		_this.runghost_button.addEventListener('click', ghostButtonClick);
		
		function ghostButtonClick() {
			/*
			Moves the specified symbol instance to the left or right by decreasing or increasing its x property by the specified number of pixels.
			To move the instance to the left input a negative number.
			*/
			lastCharX = lastCharX + 5;
			_this.character_symbol.gotoAndStop(lastCharacterFrame);
			lastCharacterFrame = (lastCharacterFrame + 1) % 24; // TODO - not hardcode
			//console.log('this character symbol x: ', _this.character_symbol.x);	
		}
	}
	this.frame_542 = function() {
		this.runghost_button = undefined;this.runghost_button = this.buttons.runghost_button;
		var _this = this;
		_this.gotoAndPlay('startghostchase_frame');
	}
	this.frame_543 = function() {
		this.character_symbol = undefined;this.ghost_symbol = undefined;this.runghost_button = undefined;this.ghost_symbol = this.ghost.ghost_symbol;
		this.character_symbol = this.character.character_symbol;
		var _this = this;
		_this.character_symbol.gotoAndPlay('captured_frame');
	}
	this.frame_569 = function() {
		this.character_symbol = undefined;this.ghost_symbol = undefined;this.ghost_symbol = this.ghost.ghost_symbol;
		this.character_symbol = this.character.character_symbol;
	}
	this.frame_592 = function() {
		this.tryagainbutton = this.buttons.tryagainbutton;
	}
	this.frame_614 = function() {
		this.tryagainbutton = undefined;this.tryagain_button = this.buttons.tryagain_button;
		var _this = this;
		_this.stop();
		
		
		/*
		Clicking on the specified symbol instance executes a function.
		*/
		_this.tryagain_button.on('click', function(){
		/*
		Moves the playhead to the specified frame label in the timeline and continues playback from that frame.
		Can be used on the main timeline or on movie clip timelines.
		*/
		_this.gotoAndPlay(0);
		});
	}
	this.frame_615 = function() {
		var soundInstance = playSound("mixkitcrunchyfootstepsloop535",0);
		this.InsertIntoSoundStreamData(soundInstance,615,671,1);
		this.character_symbol = undefined;this.tryagain_button = undefined;this.character_symbol = this.character.character_symbol;
		var _this = this;
		_this.character_symbol.gotoAndPlay('walkright_frame');
	}
	this.frame_671 = function() {
		var soundInstance = playSound("househeater1wav",0);
		this.InsertIntoSoundStreamData(soundInstance,671,839,1);
		this.character_symbol = undefined;this.character_symbol = this.character.character_symbol;
		var _this = this;
		_this.character_symbol.gotoAndStop(0);
	}
	this.frame_688 = function() {
		this.tryagain_button = this.buttons.tryagain_button;
	}
	this.frame_703 = function() {
		this.tryagain_button = undefined;this.playagain_button = this.buttons.playagain_button;
		var _this = this;
		/*
		Clicking on the specified symbol instance executes a function.
		*/
		_this.playagain_button.on('click', function(){
		/*
		Moves the playhead to the specified frame label in the timeline and continues playback from that frame.
		Can be used on the main timeline or on movie clip timelines.
		*/
		_this.gotoAndPlay(0);
		});
	}
	this.frame_814 = function() {
		var _this = this;
		_this.gotoAndPlay('endsceneloop_frame');
	}
	this.frame_839 = function() {
		this.___loopingOver___ = true;
	}

	// actions tween:
	this.timeline.addTween(cjs.Tween.get(this).call(this.frame_0).wait(94).call(this.frame_94).wait(1).call(this.frame_95).wait(71).call(this.frame_166).wait(1).call(this.frame_167).wait(1).call(this.frame_168).wait(35).call(this.frame_203).wait(21).call(this.frame_224).wait(16).call(this.frame_240).wait(48).call(this.frame_288).wait(1).call(this.frame_289).wait(70).call(this.frame_359).wait(1).call(this.frame_360).wait(71).call(this.frame_431).wait(11).call(this.frame_442).wait(100).call(this.frame_542).wait(1).call(this.frame_543).wait(26).call(this.frame_569).wait(23).call(this.frame_592).wait(22).call(this.frame_614).wait(1).call(this.frame_615).wait(56).call(this.frame_671).wait(17).call(this.frame_688).wait(15).call(this.frame_703).wait(111).call(this.frame_814).wait(25).call(this.frame_839).wait(1));

	// Camera
	this.___camera___instance = new lib.___Camera___();
	this.___camera___instance.name = "___camera___instance";
	this.___camera___instance.setTransform(491.05,346.8,0.9872,0.9872,0,0,0,0.2,0.2);
	this.___camera___instance.depth = 0;
	this.___camera___instance.visible = false;

	this.timeline.addTween(cjs.Tween.get(this.___camera___instance).wait(123).to({regX:0.3,regY:0.3,x:1225.65,y:346.85},43).wait(37).to({regX:0.5,regY:0.5,scaleX:1.0754,scaleY:1.0754,x:1636,y:279.25},21).wait(136).to({regX:0.6,regY:0.6,scaleX:1.0753,scaleY:1.0753,x:1295.1,y:350.1},0).to({regY:0.7,scaleX:1.0752,scaleY:1.0752,x:1968.85,y:350.15},71).wait(184).to({regX:0.7,scaleX:1.5888,scaleY:1.5888,x:3614.05,y:154.5},56).wait(169));

	// buttons_obj_
	this.buttons = new lib.Scene_1_buttons();
	this.buttons.name = "buttons";
	this.buttons.setTransform(0,0,1.013,1.013,0,0,0,46.6,25.7);
	this.buttons.depth = 0;
	this.buttons.isAttachedToCamera = 0
	this.buttons.isAttachedToMask = 0
	this.buttons.layerDepth = 0
	this.buttons.layerIndex = 0
	this.buttons.maskLayerName = 0

	this.timeline.addTween(cjs.Tween.get(this.buttons).wait(167).to({regX:781.1,y:0.05},0).wait(167).to({regX:1151.5,regY:-70.7,scaleX:0.9299,scaleY:0.9299,y:0},0).wait(26).to({regX:810.6,regY:0,scaleX:0.93,scaleY:0.93,x:0.05},0).wait(77).to({regX:1484.2,x:-0.1},0).wait(251).to({regX:2898,regY:-362.9,scaleX:0.6294,scaleY:0.6294,x:0},0).wait(152));

	// end_text_obj_
	this.end_text = new lib.Scene_1_end_text();
	this.end_text.name = "end_text";
	this.end_text.setTransform(0,0,1.013,1.013,0,0,0,46.6,25.7);
	this.end_text.depth = 0;
	this.end_text.isAttachedToCamera = 0
	this.end_text.isAttachedToMask = 0
	this.end_text.layerDepth = 0
	this.end_text.layerIndex = 1
	this.end_text.maskLayerName = 0

	this.timeline.addTween(cjs.Tween.get(this.end_text).wait(289).to({regX:1151.5,regY:-70.7,scaleX:0.9299,scaleY:0.9299},0).wait(71).to({regX:810.6,regY:0,scaleX:0.93,scaleY:0.93,x:0.05},0).wait(209).to({regX:1484.2,x:-0.1},0).wait(103).to({regX:2898,regY:-362.9,scaleX:0.6294,scaleY:0.6294,x:0},0).wait(17).to({_off:true},127).wait(24));

	// titletext_obj_
	this.titletext = new lib.Scene_1_titletext();
	this.titletext.name = "titletext";
	this.titletext.setTransform(489.9,286.85,1.013,1.013,0,0,0,530.2,308.9);
	this.titletext.depth = 0;
	this.titletext.isAttachedToCamera = 0
	this.titletext.isAttachedToMask = 0
	this.titletext.layerDepth = 0
	this.titletext.layerIndex = 2
	this.titletext.maskLayerName = 0

	this.timeline.addTween(cjs.Tween.get(this.titletext).wait(47).to({_off:true},193).wait(600));

	// titletext2_obj_
	this.titletext2 = new lib.Scene_1_titletext2();
	this.titletext2.name = "titletext2";
	this.titletext2.setTransform(0,0,1.013,1.013,0,0,0,46.6,25.7);
	this.titletext2.depth = 0;
	this.titletext2.isAttachedToCamera = 0
	this.titletext2.isAttachedToMask = 0
	this.titletext2.layerDepth = 0
	this.titletext2.layerIndex = 3
	this.titletext2.maskLayerName = 0

	this.timeline.addTween(cjs.Tween.get(this.titletext2).wait(94).to({_off:true},146).wait(600));

	// titletext_background_obj_
	this.titletext_background = new lib.Scene_1_titletext_background();
	this.titletext_background.name = "titletext_background";
	this.titletext_background.setTransform(489.8,286.15,1.013,1.013,0,0,0,530.1,308.2);
	this.titletext_background.depth = 0;
	this.titletext_background.isAttachedToCamera = 0
	this.titletext_background.isAttachedToMask = 0
	this.titletext_background.layerDepth = 0
	this.titletext_background.layerIndex = 4
	this.titletext_background.maskLayerName = 0

	this.timeline.addTween(cjs.Tween.get(this.titletext_background).wait(94).to({_off:true},146).wait(600));

	// gramonster_arm_obj_
	this.gramonster_arm = new lib.Scene_1_gramonster_arm();
	this.gramonster_arm.name = "gramonster_arm";
	this.gramonster_arm.setTransform(0,0,1.013,1.013,0,0,0,46.6,25.7);
	this.gramonster_arm.depth = 0;
	this.gramonster_arm.isAttachedToCamera = 0
	this.gramonster_arm.isAttachedToMask = 0
	this.gramonster_arm.layerDepth = 0
	this.gramonster_arm.layerIndex = 5
	this.gramonster_arm.maskLayerName = 0

	this.timeline.addTween(cjs.Tween.get(this.gramonster_arm).wait(224).to({regX:1151.5,regY:-70.7,scaleX:0.9299,scaleY:0.9299},0).wait(64).to({_off:true},1).wait(551));

	// ghost_obj_
	this.ghost = new lib.Scene_1_ghost();
	this.ghost.name = "ghost";
	this.ghost.setTransform(0,0,1.013,1.013,0,0,0,46.6,25.7);
	this.ghost.depth = 0;
	this.ghost.isAttachedToCamera = 0
	this.ghost.isAttachedToMask = 0
	this.ghost.layerDepth = 0
	this.ghost.layerIndex = 6
	this.ghost.maskLayerName = 0

	this.timeline.addTween(cjs.Tween.get(this.ghost).wait(431).to({regX:1484.2,regY:0,scaleX:0.93,scaleY:0.93,x:-0.1},0).wait(138).to({_off:true},71).wait(200));

	// character_obj_
	this.character = new lib.Scene_1_character();
	this.character.name = "character";
	this.character.setTransform(163.1,454.5,1.013,1.013,0,0,0,207.6,474.4);
	this.character.depth = 0;
	this.character.isAttachedToCamera = 0
	this.character.isAttachedToMask = 0
	this.character.layerDepth = 0
	this.character.layerIndex = 7
	this.character.maskLayerName = 0

	this.timeline.addTween(cjs.Tween.get(this.character).wait(95).to({regX:942.1,regY:474.3,y:454.45},71).wait(37).to({regX:1326.8,regY:418,scaleX:0.9299,scaleY:0.9299,x:163},21).wait(136).to({regX:985.9,regY:488.7,scaleX:0.93,scaleY:0.93,x:163.1,y:454.5},0).to({regX:1659.6,x:163.05},71).wait(184).to({regX:3157,regY:359.2,scaleX:0.6294,scaleY:0.6294,x:163,y:454.45},56).to({_off:true},144).wait(25));

	// lamp_obj_
	this.lamp = new lib.Scene_1_lamp();
	this.lamp.name = "lamp";
	this.lamp.setTransform(861.65,264.35,1.013,1.013,0,0,0,897.2,286.7);
	this.lamp.depth = 0;
	this.lamp.isAttachedToCamera = 0
	this.lamp.isAttachedToMask = 0
	this.lamp.layerDepth = 0
	this.lamp.layerIndex = 8
	this.lamp.maskLayerName = 0

	this.timeline.addTween(cjs.Tween.get(this.lamp).to({_off:true},720).wait(120));

	// fence_obj_
	this.fence = new lib.Scene_1_fence();
	this.fence.name = "fence";
	this.fence.setTransform(4533.9,1024.1,1.013,1.013,0,0,0,4522.4,1036.7);
	this.fence.depth = 0;
	this.fence.isAttachedToCamera = 0
	this.fence.isAttachedToMask = 0
	this.fence.layerDepth = 0
	this.fence.layerIndex = 9
	this.fence.maskLayerName = 0

	this.timeline.addTween(cjs.Tween.get(this.fence).to({_off:true},815).wait(25));

	// grabmonster_obj_
	this.grabmonster = new lib.Scene_1_grabmonster();
	this.grabmonster.name = "grabmonster";
	this.grabmonster.setTransform(0,0,1.013,1.013,0,0,0,46.6,25.7);
	this.grabmonster.depth = 0;
	this.grabmonster.isAttachedToCamera = 0
	this.grabmonster.isAttachedToMask = 0
	this.grabmonster.layerDepth = 0
	this.grabmonster.layerIndex = 10
	this.grabmonster.maskLayerName = 0

	this.timeline.addTween(cjs.Tween.get(this.grabmonster).wait(189).to({regX:781.1,y:0.05},0).to({regX:1151.5,regY:-70.7,scaleX:0.9299,scaleY:0.9299,y:0},35).wait(64).to({_off:true},253).wait(299));

	// house_obj_
	this.house = new lib.Scene_1_house();
	this.house.name = "house";
	this.house.setTransform(0,0,1.013,1.013,0,0,0,46.6,25.7);
	this.house.depth = 0;
	this.house.isAttachedToCamera = 0
	this.house.isAttachedToMask = 0
	this.house.layerDepth = 0
	this.house.layerIndex = 11
	this.house.maskLayerName = 0

	this.timeline.addTween(cjs.Tween.get(this.house).wait(615).to({regX:1484.2,regY:0,scaleX:0.93,scaleY:0.93,x:-0.1},0).to({_off:true},200).wait(25));

	// horizon_obj_
	this.horizon = new lib.Scene_1_horizon();
	this.horizon.name = "horizon";
	this.horizon.setTransform(4004.75,638.95,0.5144,0.5144,0,0,0,7401.3,957);
	this.horizon.depth = 512;
	this.horizon.isAttachedToCamera = 0
	this.horizon.isAttachedToMask = 0
	this.horizon.layerDepth = 0
	this.horizon.layerIndex = 12
	this.horizon.maskLayerName = 0

	this.timeline.addTween(cjs.Tween.get(this.horizon).to({_off:true},815).wait(25));

	// planet_texture_mask_obj_
	this.planet_texture_mask = new lib.Scene_1_planet_texture_mask();
	this.planet_texture_mask.name = "planet_texture_mask";
	this.planet_texture_mask.setTransform(-626.3,-425.9,0.3447,0.3447,0,0,0,-2631.3,-1831.5);
	this.planet_texture_mask.depth = 1024;
	this.planet_texture_mask.isAttachedToCamera = 0
	this.planet_texture_mask.isAttachedToMask = 0
	this.planet_texture_mask.layerDepth = 0
	this.planet_texture_mask.layerIndex = 13
	this.planet_texture_mask.maskLayerName = 0

	this.timeline.addTween(cjs.Tween.get(this.planet_texture_mask).to({_off:true},815).wait(25));

	// sky_bg_obj_
	this.sky_bg = new lib.Scene_1_sky_bg();
	this.sky_bg.name = "sky_bg";
	this.sky_bg.setTransform(6701.3,-371,0.3447,0.3447,0,0,0,18625.9,-1672.2);
	this.sky_bg.depth = 1024;
	this.sky_bg.isAttachedToCamera = 0
	this.sky_bg.isAttachedToMask = 0
	this.sky_bg.layerDepth = 0
	this.sky_bg.layerIndex = 14
	this.sky_bg.maskLayerName = 0

	this.timeline.addTween(cjs.Tween.get(this.sky_bg).to({_off:true},815).wait(25));

	this._renderFirstFrame();

}).prototype = p = new lib.AnMovieClip();
p.nominalBounds = new cjs.Rectangle(-1140.6,-1539.3,16134.5,3322.8);
// library properties:
lib.properties = {
	id: '5A4E41B0DDE74148A51B8DA060E6CC67',
	width: 900,
	height: 650,
	fps: 24,
	color: "#FFFFFF",
	opacity: 1.00,
	manifest: [
		{src:"images/CachedBmp_3.png", id:"CachedBmp_3"},
		{src:"images/marble_liquid_texture.jpg", id:"marble_liquid_texture"},
		{src:"images/metaltexturegrungerustspottedagedoldrusteddirtyoxygenated5.jpg", id:"metaltexturegrungerustspottedagedoldrusteddirtyoxygenated5"},
		{src:"images/WilliamBlairAssignmentFinalProject_atlas_1.png", id:"WilliamBlairAssignmentFinalProject_atlas_1"},
		{src:"images/WilliamBlairAssignmentFinalProject_atlas_2.png", id:"WilliamBlairAssignmentFinalProject_atlas_2"},
		{src:"images/WilliamBlairAssignmentFinalProject_atlas_3.png", id:"WilliamBlairAssignmentFinalProject_atlas_3"},
		{src:"sounds/dialupmodem02_editwav.mp3", id:"dialupmodem02_editwav"},
		{src:"sounds/electricdrill06_editedwav.mp3", id:"electricdrill06_editedwav"},
		{src:"sounds/househeater1wav.mp3", id:"househeater1wav"},
		{src:"sounds/mixkitcrunchyfootstepsloop535.mp3", id:"mixkitcrunchyfootstepsloop535"},
		{src:"sounds/mixkitspacealieninvasion2477.mp3", id:"mixkitspacealieninvasion2477"}
	],
	preloads: []
};



// bootstrap callback support:

(lib.Stage = function(canvas) {
	createjs.Stage.call(this, canvas);
}).prototype = p = new createjs.Stage();

p.setAutoPlay = function(autoPlay) {
	this.tickEnabled = autoPlay;
}
p.play = function() { this.tickEnabled = true; this.getChildAt(0).gotoAndPlay(this.getTimelinePosition()) }
p.stop = function(ms) { if(ms) this.seek(ms); this.tickEnabled = false; }
p.seek = function(ms) { this.tickEnabled = true; this.getChildAt(0).gotoAndStop(lib.properties.fps * ms / 1000); }
p.getDuration = function() { return this.getChildAt(0).totalFrames / lib.properties.fps * 1000; }

p.getTimelinePosition = function() { return this.getChildAt(0).currentFrame / lib.properties.fps * 1000; }

an.bootcompsLoaded = an.bootcompsLoaded || [];
if(!an.bootstrapListeners) {
	an.bootstrapListeners=[];
}

an.bootstrapCallback=function(fnCallback) {
	an.bootstrapListeners.push(fnCallback);
	if(an.bootcompsLoaded.length > 0) {
		for(var i=0; i<an.bootcompsLoaded.length; ++i) {
			fnCallback(an.bootcompsLoaded[i]);
		}
	}
};

an.compositions = an.compositions || {};
an.compositions['5A4E41B0DDE74148A51B8DA060E6CC67'] = {
	getStage: function() { return exportRoot.stage; },
	getLibrary: function() { return lib; },
	getSpriteSheet: function() { return ss; },
	getImages: function() { return img; }
};

an.compositionLoaded = function(id) {
	an.bootcompsLoaded.push(id);
	for(var j=0; j<an.bootstrapListeners.length; j++) {
		an.bootstrapListeners[j](id);
	}
}

an.getComposition = function(id) {
	return an.compositions[id];
}

p._getProjectionMatrix = function(container, totalDepth) {	var focalLength = 528.25;
	var projectionCenter = { x : lib.properties.width/2, y : lib.properties.height/2 };
	var scale = (totalDepth + focalLength)/focalLength;
	var scaleMat = new createjs.Matrix2D;
	scaleMat.a = 1/scale;
	scaleMat.d = 1/scale;
	var projMat = new createjs.Matrix2D;
	projMat.tx = -projectionCenter.x;
	projMat.ty = -projectionCenter.y;
	projMat = projMat.prependMatrix(scaleMat);
	projMat.tx += projectionCenter.x;
	projMat.ty += projectionCenter.y;
	return projMat;
}
p._handleTick = function(event) {
	var cameraInstance = exportRoot.___camera___instance;
	if(cameraInstance !== undefined && cameraInstance.pinToObject !== undefined)
	{
		cameraInstance.x = cameraInstance.pinToObject.x + cameraInstance.pinToObject.pinOffsetX;
		cameraInstance.y = cameraInstance.pinToObject.y + cameraInstance.pinToObject.pinOffsetY;
		if(cameraInstance.pinToObject.parent !== undefined && cameraInstance.pinToObject.parent.depth !== undefined)
		cameraInstance.depth = cameraInstance.pinToObject.parent.depth + cameraInstance.pinToObject.pinOffsetZ;
	}
	stage._applyLayerZDepth(exportRoot);
}
p._applyLayerZDepth = function(parent)
{
	var cameraInstance = parent.___camera___instance;
	var focalLength = 528.25;
	var projectionCenter = { 'x' : 0, 'y' : 0};
	if(parent === exportRoot)
	{
		var stageCenter = { 'x' : lib.properties.width/2, 'y' : lib.properties.height/2 };
		projectionCenter.x = stageCenter.x;
		projectionCenter.y = stageCenter.y;
	}
	for(child in parent.children)
	{
		var layerObj = parent.children[child];
		if(layerObj == cameraInstance)
			continue;
		stage._applyLayerZDepth(layerObj, cameraInstance);
		if(layerObj.layerDepth === undefined)
			continue;
		if(layerObj.currentFrame != layerObj.parent.currentFrame)
		{
			layerObj.gotoAndPlay(layerObj.parent.currentFrame);
		}
		var matToApply = new createjs.Matrix2D;
		var cameraMat = new createjs.Matrix2D;
		var totalDepth = layerObj.layerDepth ? layerObj.layerDepth : 0;
		var cameraDepth = 0;
		if(cameraInstance && !layerObj.isAttachedToCamera)
		{
			var mat = cameraInstance.getMatrix();
			mat.tx -= projectionCenter.x;
			mat.ty -= projectionCenter.y;
			cameraMat = mat.invert();
			cameraMat.prependTransform(projectionCenter.x, projectionCenter.y, 1, 1, 0, 0, 0, 0, 0);
			cameraMat.appendTransform(-projectionCenter.x, -projectionCenter.y, 1, 1, 0, 0, 0, 0, 0);
			if(cameraInstance.depth)
				cameraDepth = cameraInstance.depth;
		}
		if(layerObj.depth)
		{
			totalDepth = layerObj.depth;
		}
		//Offset by camera depth
		totalDepth -= cameraDepth;
		if(totalDepth < -focalLength)
		{
			matToApply.a = 0;
			matToApply.d = 0;
		}
		else
		{
			if(layerObj.layerDepth)
			{
				var sizeLockedMat = stage._getProjectionMatrix(parent, layerObj.layerDepth);
				if(sizeLockedMat)
				{
					sizeLockedMat.invert();
					matToApply.prependMatrix(sizeLockedMat);
				}
			}
			matToApply.prependMatrix(cameraMat);
			var projMat = stage._getProjectionMatrix(parent, totalDepth);
			if(projMat)
			{
				matToApply.prependMatrix(projMat);
			}
		}
		layerObj.transformMatrix = matToApply;
	}
}
an.makeResponsive = function(isResp, respDim, isScale, scaleType, domContainers) {		
	var lastW, lastH, lastS=1;		
	window.addEventListener('resize', resizeCanvas);		
	resizeCanvas();		
	function resizeCanvas() {			
		var w = lib.properties.width, h = lib.properties.height;			
		var iw = window.innerWidth, ih=window.innerHeight;			
		var pRatio = window.devicePixelRatio || 1, xRatio=iw/w, yRatio=ih/h, sRatio=1;			
		if(isResp) {                
			if((respDim=='width'&&lastW==iw) || (respDim=='height'&&lastH==ih)) {                    
				sRatio = lastS;                
			}				
			else if(!isScale) {					
				if(iw<w || ih<h)						
					sRatio = Math.min(xRatio, yRatio);				
			}				
			else if(scaleType==1) {					
				sRatio = Math.min(xRatio, yRatio);				
			}				
			else if(scaleType==2) {					
				sRatio = Math.max(xRatio, yRatio);				
			}			
		}
		domContainers[0].width = w * pRatio * sRatio;			
		domContainers[0].height = h * pRatio * sRatio;
		domContainers.forEach(function(container) {				
			container.style.width = w * sRatio + 'px';				
			container.style.height = h * sRatio + 'px';			
		});
		stage.scaleX = pRatio*sRatio;			
		stage.scaleY = pRatio*sRatio;
		lastW = iw; lastH = ih; lastS = sRatio;            
		stage.tickOnUpdate = false;            
		stage.update();            
		stage.tickOnUpdate = true;		
	}
}

// Virtual camera API : 

an.VirtualCamera = new function() {
var _camera = new Object();
function VC(timeline) {
	this.timeline = timeline;
	this.camera = timeline.___camera___instance;
	this.centerX = lib.properties.width / 2;
	this.centerY = lib.properties.height / 2;
	this.camAxisX = this.camera.x;
	this.camAxisY = this.camera.y;
	if(timeline.___camera___instance == null || timeline.___camera___instance == undefined ) {
		timeline.___camera___instance = new cjs.MovieClip();
		timeline.___camera___instance.visible = false;
		timeline.___camera___instance.parent = timeline;
		timeline.___camera___instance.setTransform(this.centerX, this.centerY);
	}
	this.camera = timeline.___camera___instance;
}

VC.prototype.moveBy = function(x, y, z) {
z = typeof z !== 'undefined' ? z : 0;
	var position = this.___getCamPosition___();
	var rotAngle = this.getRotation()*Math.PI/180;
	var sinTheta = Math.sin(rotAngle);
	var cosTheta = Math.cos(rotAngle);
	var offX= x*cosTheta + y*sinTheta;
	var offY = y*cosTheta - x*sinTheta;
	this.camAxisX = this.camAxisX - x;
	this.camAxisY = this.camAxisY - y;
	var posX = position.x + offX;
	var posY = position.y + offY;
	this.camera.x = this.centerX - posX;
	this.camera.y = this.centerY - posY;
	this.camera.depth += z;
};

VC.prototype.setPosition = function(x, y, z) {
	z = typeof z !== 'undefined' ? z : 0;

	const MAX_X = 10000;
	const MIN_X = -10000;
	const MAX_Y = 10000;
	const MIN_Y = -10000;
	const MAX_Z = 10000;
	const MIN_Z = -5000;

	if(x > MAX_X)
	  x = MAX_X;
	else if(x < MIN_X)
	  x = MIN_X;
	if(y > MAX_Y)
	  y = MAX_Y;
	else if(y < MIN_Y)
	  y = MIN_Y;
	if(z > MAX_Z)
	  z = MAX_Z;
	else if(z < MIN_Z)
	  z = MIN_Z;

	var rotAngle = this.getRotation()*Math.PI/180;
	var sinTheta = Math.sin(rotAngle);
	var cosTheta = Math.cos(rotAngle);
	var offX= x*cosTheta + y*sinTheta;
	var offY = y*cosTheta - x*sinTheta;
	
	this.camAxisX = this.centerX - x;
	this.camAxisY = this.centerY - y;
	this.camera.x = this.centerX - offX;
	this.camera.y = this.centerY - offY;
	this.camera.depth = z;
};

VC.prototype.getPosition = function() {
	var loc = new Object();
	loc['x'] = this.centerX - this.camAxisX;
	loc['y'] = this.centerY - this.camAxisY;
	loc['z'] = this.camera.depth;
	return loc;
};

VC.prototype.resetPosition = function() {
	this.setPosition(0, 0);
};

VC.prototype.zoomBy = function(zoom) {
	this.setZoom( (this.getZoom() * zoom) / 100);
};

VC.prototype.setZoom = function(zoom) {
	const MAX_zoom = 10000;
	const MIN_zoom = 1;
	if(zoom > MAX_zoom)
	zoom = MAX_zoom;
	else if(zoom < MIN_zoom)
	zoom = MIN_zoom;
	this.camera.scaleX = 100 / zoom;
	this.camera.scaleY = 100 / zoom;
};

VC.prototype.getZoom = function() {
	return 100 / this.camera.scaleX;
};

VC.prototype.resetZoom = function() {
	this.setZoom(100);
};

VC.prototype.rotateBy = function(angle) {
	this.setRotation( this.getRotation() + angle );
};

VC.prototype.setRotation = function(angle) {
	const MAX_angle = 180;
	const MIN_angle = -179;
	if(angle > MAX_angle)
		angle = MAX_angle;
	else if(angle < MIN_angle)
		angle = MIN_angle;
	this.camera.rotation = -angle;
};

VC.prototype.getRotation = function() {
	return -this.camera.rotation;
};

VC.prototype.resetRotation = function() {
	this.setRotation(0);
};

VC.prototype.reset = function() {
	this.resetPosition();
	this.resetZoom();
	this.resetRotation();
	this.unpinCamera();
};
VC.prototype.setZDepth = function(zDepth) {
	const MAX_zDepth = 10000;
	const MIN_zDepth = -5000;
	if(zDepth > MAX_zDepth)
		zDepth = MAX_zDepth;
	else if(zDepth < MIN_zDepth)
		zDepth = MIN_zDepth;
	this.camera.depth = zDepth;
}
VC.prototype.getZDepth = function() {
	return this.camera.depth;
}
VC.prototype.resetZDepth = function() {
	this.camera.depth = 0;
}

VC.prototype.pinCameraToObject = function(obj, offsetX, offsetY, offsetZ) {

	offsetX = typeof offsetX !== 'undefined' ? offsetX : 0;

	offsetY = typeof offsetY !== 'undefined' ? offsetY : 0;

	offsetZ = typeof offsetZ !== 'undefined' ? offsetZ : 0;
	if(obj === undefined)
		return;
	this.camera.pinToObject = obj;
	this.camera.pinToObject.pinOffsetX = offsetX;
	this.camera.pinToObject.pinOffsetY = offsetY;
	this.camera.pinToObject.pinOffsetZ = offsetZ;
};

VC.prototype.setPinOffset = function(offsetX, offsetY, offsetZ) {
	if(this.camera.pinToObject != undefined) {
	this.camera.pinToObject.pinOffsetX = offsetX;
	this.camera.pinToObject.pinOffsetY = offsetY;
	this.camera.pinToObject.pinOffsetZ = offsetZ;
	}
};

VC.prototype.unpinCamera = function() {
	this.camera.pinToObject = undefined;
};
VC.prototype.___getCamPosition___ = function() {
	var loc = new Object();
	loc['x'] = this.centerX - this.camera.x;
	loc['y'] = this.centerY - this.camera.y;
	loc['z'] = this.depth;
	return loc;
};

this.getCamera = function(timeline) {
	timeline = typeof timeline !== 'undefined' ? timeline : null;
	if(timeline === null) timeline = exportRoot;
	if(_camera[timeline] == undefined)
	_camera[timeline] = new VC(timeline);
	return _camera[timeline];
}

this.getCameraAsMovieClip = function(timeline) {
	timeline = typeof timeline !== 'undefined' ? timeline : null;
	if(timeline === null) timeline = exportRoot;
	return this.getCamera(timeline).camera;
}
}


// Layer depth API : 

an.Layer = new function() {
	this.getLayerZDepth = function(timeline, layerName)
	{
		if(layerName === "Camera")
		layerName = "___camera___instance";
		var script = "if(timeline." + layerName + ") timeline." + layerName + ".depth; else 0;";
		return eval(script);
	}
	this.setLayerZDepth = function(timeline, layerName, zDepth)
	{
		const MAX_zDepth = 10000;
		const MIN_zDepth = -5000;
		if(zDepth > MAX_zDepth)
			zDepth = MAX_zDepth;
		else if(zDepth < MIN_zDepth)
			zDepth = MIN_zDepth;
		if(layerName === "Camera")
		layerName = "___camera___instance";
		var script = "if(timeline." + layerName + ") timeline." + layerName + ".depth = " + zDepth + ";";
		eval(script);
	}
	this.removeLayer = function(timeline, layerName)
	{
		if(layerName === "Camera")
		layerName = "___camera___instance";
		var script = "if(timeline." + layerName + ") timeline.removeChild(timeline." + layerName + ");";
		eval(script);
	}
	this.addNewLayer = function(timeline, layerName, zDepth)
	{
		if(layerName === "Camera")
		layerName = "___camera___instance";
		zDepth = typeof zDepth !== 'undefined' ? zDepth : 0;
		var layer = new createjs.MovieClip();
		layer.name = layerName;
		layer.depth = zDepth;
		layer.layerIndex = 0;
		timeline.addChild(layer);
	}
}
an.handleSoundStreamOnTick = function(event) {
	if(!event.paused){
		var stageChild = stage.getChildAt(0);
		if(!stageChild.paused || stageChild.ignorePause){
			stageChild.syncStreamSounds();
		}
	}
}
an.handleFilterCache = function(event) {
	if(!event.paused){
		var target = event.target;
		if(target){
			if(target.filterCacheList){
				for(var index = 0; index < target.filterCacheList.length ; index++){
					var cacheInst = target.filterCacheList[index];
					if((cacheInst.startFrame <= target.currentFrame) && (target.currentFrame <= cacheInst.endFrame)){
						cacheInst.instance.cache(cacheInst.x, cacheInst.y, cacheInst.w, cacheInst.h);
					}
				}
			}
		}
	}
}


})(createjs = createjs||{}, AdobeAn = AdobeAn||{});
var createjs, AdobeAn;