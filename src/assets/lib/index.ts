import type { BarrageOptions } from "./baseBarrage";
import type { RenderFn } from "./baseBarrage/barrageClass"
import type BaseBarrage from "./baseBarrage/barrageClass"
import BarrageLayoutCalculate from "./core"
import Utils from './utils';
//渲染器实例
//弹幕渲染器
export default class BarrageRenderer {
    //容器dom
    container!: HTMLElement | null
    video!: HTMLVideoElement
    canvas!: HTMLCanvasElement
    ctx!: CanvasRenderingContext2D
    //默认渲染配置
    defalutRenderConfig: RenderConfig = {
        heightReduce: 0,
        speed: 200,
        opacity: 1,
        renderRegion: 1,
        avoidOverlap: true,
        minSpace: 10,
        fontWeight: "normal",
        barrageFilter: function (barrage: BaseBarrage): boolean {
            throw new Error("Function not implemented.");
        },
        fontFamily: undefined
    }
    defalurtDeviceConfig: DevConfig = {
        isRenderFPS: false,
        isRenderBarrageBorder: false,
        isLogKeyData: false,
    }
    devConfig:DevConfig=this.defalurtDeviceConfig
    renderConfig: RenderConfig = this.defalutRenderConfig
    isOpen=true
    animationHandle?: number;
    lastContainerHeight = { width: 0, height: 0 }
    offscreenCanvans!: HTMLCanvasElement
    offerscreenCtx: CanvasRenderingContext2D
    dpr = Utils.Canvas.getDevicePixelRatio();
    fps = ''
    lastFrameTime?: number
    lastScalcTime = 0
    //布局计算器
    barrageLayoutCalculate = new BarrageLayoutCalculate({ barrageRenderer: this, })
    offscreenCanvasCtx: any;
    constructor({
        container,
        video,
        renderConfig,
        devConfig,
        barrages,
    }: RendererOptions) {
        this.video = video;
        // 先设置好渲染配置
        this.setRenderConfigInternal(renderConfig || {}, true);
        // 先设置好开发配置
        this.setDevConfig(devConfig || {});
        // 创建、处理相关 DOM
        this.container =
            typeof container === 'string'
                ? document.getElementById(container)
                : container;
        this.canvas = document.createElement('canvas');
        this.ctx = this.canvas.getContext('2d') as CanvasRenderingContext2D;
        this.offscreenCanvans=document.createElement('canvas')
        this.offerscreenCtx = this.offscreenCanvans.getContext('2d') as CanvasRenderingContext2D;
        this.setDom(this.container,this.canvas,this.ctx)
        //设置弹幕数据
        this.setBarrage(barrages)
    }
    setDevConfig(devConfig: Partial<DevConfig>) {
		Object.assign(this.devConfig, devConfig);
	}
    //弹幕是否被打开
    private setRenderConfigInternal(renderConfig: any, init = false) {
        //获取弹幕渲染配置属性
        const renderCofigKeys = Object.keys(renderConfig)
        const isSpeedChange = renderCofigKeys.includes('speed') && renderConfig.speed !== this.renderConfig.speed;
        const isHeightReduceChange = renderCofigKeys.includes('heightReduce') && renderConfig.heightReduce !== this.renderConfig.heightReduce;
        const isRenderRegionChange = renderCofigKeys.includes('renderRegion') && renderConfig.renderRegion !== this.renderConfig.renderRegion;
        const isAvoidOverlapChange = renderCofigKeys.includes('avoidOverlap') && renderConfig.avoidOverlap !== this.renderConfig.avoidOverlap;
        const isMinSpaceChange = renderCofigKeys.includes('minSpace') && renderConfig.minSpace !== this.renderConfig.minSpace;
        Object.assign(this.renderConfig, renderConfig)
        if (!init && (isSpeedChange || isHeightReduceChange || isRenderRegionChange || isAvoidOverlapChange)) {
			// 高度缩减需要重新处理 DOM
			if (isHeightReduceChange) this.setDom(this.container, this.canvas, this.ctx);
			this.barrageLayoutCalculate.renderConfigChange(
				isSpeedChange,
				isHeightReduceChange,
				isRenderRegionChange,
				isAvoidOverlapChange,
				isMinSpaceChange,
			);
		}
		// 触发一帧的渲染
		if (!this.animationHandle && !init) {
            this.renderShow();
            
        }
    }
    setRenderConfig(renderConfig: any) {
        this.setRenderConfigInternal(renderConfig)
    }
    private setDom(container:HTMLElement|null,canvas:HTMLCanvasElement,ctx:CanvasRenderingContext2D){
        if(!container){console.log('没有容器');}
        if(!ctx){console.log('没有设置画布')}
        if(!container||!ctx) return
        container.style.position='realtive'
        canvas.style.position='absolute'
        canvas.style.left='0px'
        canvas.style.top = '0px';
        canvas.width=container.clientWidth
        canvas.height=container.clientHeight-(this.renderConfig.heightReduce|0)
        container.appendChild(canvas)
        this.handleHighDprVague(canvas, ctx);
		
		// 需要同步处理离屏 canvas
		this.offscreenCanvans.width = container.clientWidth;
		this.offscreenCanvans.height = container.clientHeight - (this.renderConfig.heightReduce ?? 0);
		this.handleHighDprVague(this.offscreenCanvans, this.offerscreenCtx);
    }
    //设置弹幕数据
    setBarrage(barrage?:BarrageOptions[]){
        if(!barrage) return
        //判断弹幕是不是合规的
        console.log(barrage,'111111');
        
        barrage=barrage.filter(barrage=>{return this.deleteNoRulues(barrage)==true})
        this.barrageLayoutCalculate.setBarrages(barrage);
        this.lastContainerHeight = {
			width: this.container?.clientWidth || 0,
			height: this.container?.clientHeight || 0,
		}
    }
    private handleHighDprVague(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) {
		const logicalWidth = canvas.width;
		const logicalHeight = canvas.height;
		canvas.width = logicalWidth * this.dpr;
		canvas.height = logicalHeight * this.dpr;
		canvas.style.width = logicalWidth + 'px';
		canvas.style.height = logicalHeight + 'px';
		
		ctx.scale(this.dpr, this.dpr);
		ctx.textBaseline = 'hanging';
	}
    //判断弹幕是否合法 还有高级 已经error返回的具体形式没写
    
    private deleteNoRulues(barrage:BarrageOptions){
        if(barrage.barrageType=='top'|| barrage.barrageType=='bottom'){
            if(barrage.duration<=0){
                return false
            }
        }
        return true

    }
    //发送新的弹幕
    send(barrage:BarrageOptions){
        const result=this.deleteNoRulues(barrage)
        if(result!==true){
            console.log(result);
            return
        }
        this.barrageLayoutCalculate.send(barrage)
    }
    //重新计算
    resize(){
        this.setDom(this.container,this.canvas,this.ctx)
        const nowSizecontainer={
            width:this.container?.clientWidth||0,
            height:this.container?.clientHeight||0
        }
        const {width,height}=this.lastContainerHeight
        const widthDiff=width!==nowSizecontainer.width
        const heightDiff=height!==nowSizecontainer.height
        if(widthDiff||heightDiff){
            //记录一下
            this.lastContainerHeight=nowSizecontainer
            if(widthDiff && !heightDiff){
                //宽度发生变化
                this.barrageLayoutCalculate.resize('width')
            }else if(heightDiff && !widthDiff){
                //宽度发生变化
                this.barrageLayoutCalculate.resize('height')
            }else{
                this.barrageLayoutCalculate.resize('both')
            }
        }
        this.renderFrame()
    }
    renderFrame(){
        if(!this.animationHandle){this.renderShow()}
    }
    private renderShow(){
        if(!this.isOpen) return
        let renderBarrages=this.barrageLayoutCalculate.getRenderBarrages(this.progress)

        if(this.renderConfig.barrageFilter){
            renderBarrages=renderBarrages.filter(barrage=>this.renderConfig.barrageFilter!(barrage))
        } 
        this.offerscreenCtx.clearRect(0,0,this.offscreenCanvans.width,this.offscreenCanvans.height)
        this.offerscreenCtx.globalAlpha=this.renderConfig.opacity
        renderBarrages.forEach((barrage:BaseBarrage) => {            
            barrage.render(this.offerscreenCtx)
        });
        if(this.devConfig.isRenderFPS) this.renderFPS()
       
		this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
		this.offscreenCanvans.width && this.ctx.drawImage(
			this.offscreenCanvans,
			0, 0, this.offscreenCanvans.width, this.offscreenCanvans.height,
			0, 0, this.canvas.width / this.dpr, this.canvas.height / this.dpr,
		);

            if(this.animationHandle){
                requestAnimationFrame(()=>this.renderShow())
            }
    }
    get progress(){
        return this.viedoStatus.currentTime;
    }
    get viedoStatus(){
        return{
            // currenTime
            currentTime:this.video.currentTime*1000,
            playing:!this.video.paused
        }
    }
    private renderFPS(){
        const now=Date.now();
        if(this.lastFrameTime && now -this.lastScalcTime>200){
            this.fps = `${Math.floor(1000 / (now - this.lastFrameTime))}FPS`;
			this.lastScalcTime = now;
        }
        this.lastFrameTime = now;

		if (this.fps) {
			this.offerscreenCtx.font = 'bold 32px Microsoft YaHei';
			this.offerscreenCtx.fillStyle = 'blue';
			this.offerscreenCtx.fillText(this.fps, 20, 30);
		}
    }
    private createAnimation(){
        if(!this.animationHandle && this.isOpen){
            this.animationHandle=requestAnimationFrame(()=>
            {this.renderShow()})
        }
    }
    play(){        
        this.createAnimation()
    }
    pause() {
		this.animationHandle && cancelAnimationFrame(this.animationHandle);
		this.animationHandle = undefined;
	}
    get canvaSize(){
        return {
            width:this.canvas.width/this.dpr,
            height:this.canvas.height/this.dpr
        }
    }
    getRenderBarrages(time: number): BaseBarrage[] {
        // 获取需要渲染的滚动弹幕
        const renderScrollBarrages = this.getRenderBarrages(time);
        // 获取需要渲染的固定弹幕
        const renderFixedBarrages = this.getRenderBarrages(time);
        // 获取需要渲染的高级弹幕
        const renderSeniorBarrages = this.getRenderBarrages(time);
        // 整合排序
        return [
          ...renderScrollBarrages,
          ...renderFixedBarrages,
          ...renderSeniorBarrages,
        ].sort((a, b) => {
          if (a.prior !== b.prior) {
            // 如果 a 的 prior 为 true，则返回 1，否则返回 -1
            // 这意味着 true 的值会在最后面
            return a.prior ? 1 : -1;
          } else {
            // 如果 prior 属性相同，则按照 time 属性排序
            return a.time - b.time;
          }
        });
      }
      switch(isOpen: boolean) {
		this.isOpen = isOpen;
		if (isOpen) {
			// 进行打开操作，根据当前是不是播放状态进行不同的处理
			this.viedoStatus.playing ? this.createAnimation() : this.renderShow();
		} else {
			// 进行关闭操作
			this.animationHandle && cancelAnimationFrame(this.animationHandle);
			this.animationHandle = undefined;
			this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
		}
	}

}

export type RenderConfig = {
    fontFamily: any;
    barrageFilter: (barrage: BaseBarrage) => boolean
    priorBorderCustomRender?: RenderFn;
    heightReduce: number;
    speed: number;
    renderRegion: number;
    minSpace: number;
    avoidOverlap: boolean;
    opacity: number;
    fontWeight:string
}
export type RendererOptions = {
    // 容器 DOM
    container: string | HTMLElement;
    // video 元素（获取 video 元素，只是为了获取播放状态，不会对 video 执行其他操作）
    video: HTMLVideoElement;
    // 弹幕数据
    barrages?: BarrageOptions[];
    // // 渲染相关配置
    renderConfig?: Partial<RenderConfig>;
    // // 开发相关配置
    devConfig?: Partial<DevConfig>,
}
//开发相关配置
export type DevConfig = {
    // 是否渲染 fps
    isRenderFPS: boolean;
    // 是否渲染弹幕边框
    isRenderBarrageBorder: boolean;
    // 是否打印关键数据
    isLogKeyData: boolean;
}
export {
    BarrageRenderer,
};