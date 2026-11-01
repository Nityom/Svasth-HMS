import { useEffect, useRef, useState, type CSSProperties } from 'react';
import type * as ThreeTypes from 'three';
import { AnimatePresence, motion, useMotionValueEvent, useReducedMotion, useScroll } from 'framer-motion';
import { Activity, Check, Plus, RotateCcw, ShieldCheck, Users } from 'lucide-react';

type Variant = 'glass' | 'organic';
type Props = { variant: Variant; className?: string; width?: CSSProperties['width']; height?: CSSProperties['height']; transparent?: boolean; speed?: number };

const stages = [
  { name: 'Origin', line: 'A living form takes shape.' },
  { name: 'Medical form', line: 'A symbol of care emerges.' },
  { name: 'Connection', line: 'Every point finds its place.' },
  { name: 'The pulse', line: 'Care moves through the network.' },
  { name: 'Identity', line: 'A familiar mark comes together.' },
  { name: 'Svaasth', line: 'Healthcare. Connected.' },
];

function getLogoCanvas(image: HTMLImageElement) {
  const width = image.naturalWidth; const height = image.naturalHeight;
  const canvas = document.createElement('canvas'); canvas.width = width; canvas.height = height;
  const context = canvas.getContext('2d', { willReadFrequently: true });
  if (!context) throw new Error('Canvas unavailable');
  context.drawImage(image, 0, 0, width, height);
  return { canvas, width, height, pixels: context.getImageData(0, 0, width, height).data };
}

function sampleLogoSurface(pixels: Uint8ClampedArray, width: number, height: number, count: number, random: () => number) {
  const points = new Float32Array(count * 3); let filled = 0; let attempts = 0;
  while (filled < count && attempts++ < count * 40) {
    const x = Math.floor(random() * width); const y = Math.floor(random() * height);
    if (pixels[(y * width + x) * 4 + 3] < 80) continue;
    points.set([(x / width - .5) * 3.2, (.5 - y / height) * 4.11, .03], filled * 3); filled++;
  }
  while (filled < count) { const x = random() * 3.2 - 1.6; const y = random() * 4.11 - 2.055; points.set([x,y,.03],filled*3); filled++; }
  return points;
}

function makeCrossPoints(count: number, random: () => number) {
  const result = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    const vertical = random() > .5;
    const x = vertical ? (random() - .5) * .52 : (random() - .5) * 2.65;
    const y = vertical ? (random() - .5) * 2.65 : (random() - .5) * .52;
    result.set([x, y, (random() - .5) * .34], i * 3);
  }
  return result;
}

const particleVertex = `
  attribute vec3 aOrigin; attribute vec3 aCross; attribute vec3 aNetwork; attribute vec3 aPulse; attribute vec3 aLogo;
  uniform float uProgress; uniform float uTime; uniform float uPixelRatio;
  varying float vAlpha; varying float vPhase;
  vec3 morph(vec3 a, vec3 b, float p) { return mix(a,b,smoothstep(0.0,1.0,p)); }
  void main(){
    vec3 p=aOrigin;
    p=morph(p,aCross,uProgress/.2);
    p=morph(p,aNetwork,(uProgress-.18)/.2);
    p=morph(p,aPulse,(uProgress-.38)/.2);
    p=morph(p,aLogo,(uProgress-.58)/.23);
    p += normalize(aOrigin+vec3(.001))*sin(uTime*1.3+position.x*5.0)*.018*(1.0-uProgress);
    vec4 mv=modelViewMatrix*vec4(p,1.0);
    gl_Position=projectionMatrix*mv;
    gl_PointSize=(2.1+2.2*sin(uTime*1.5+position.y*13.0))*uPixelRatio*(5.5/-mv.z);
    vAlpha=(1.0-smoothstep(.72,.96,uProgress))*.8;
    vPhase=sin(uTime+position.y*7.0)*.5+.5;
  }
`;
const particleFragment = `
  varying float vAlpha; varying float vPhase;
  void main(){ vec2 p=gl_PointCoord-.5; float d=length(p); if(d>.5) discard; float glow=1.0-smoothstep(.08,.5,d); vec3 teal=mix(vec3(.15,.78,.58),vec3(.12,.48,.88),vPhase*.7); gl_FragColor=vec4(teal,glow*vAlpha); }
`;

export default function SvaasthMorphingLogo({ variant, className = '', width, height, transparent = true, speed = 1 }: Props) {
  const sectionRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef(variant === 'glass' ? 1 : 0);
  const [activeStage, setActiveStage] = useState(variant === 'glass' ? 5 : 0);
  const reducedMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start start', 'end end'] });
  useMotionValueEvent(scrollYProgress, 'change', (value) => { progressRef.current = variant === 'glass' ? 1 : value; const next = variant === 'glass' ? 5 : Math.min(5, Math.floor(value * 6)); setActiveStage((current) => current === next ? current : next); });

  useEffect(() => {
    // The hero uses the exact source logo artwork. Keep its original gradient
    // and clean finish; reserve WebGL morphing for the scroll story below.
    if ((variant as Variant) === 'glass') return;
    const root = canvasRef.current; if (!root) return;
    let cancelled = false; let cleanup = () => {};
    let visible = false; let frame = 0;
    let sceneRef: ThreeTypes.Scene | undefined;
    let cameraRef: ThreeTypes.PerspectiveCamera | undefined;
    let rendererRef: ThreeTypes.WebGLRenderer | undefined;
    let animateRef: (() => void) | undefined;
    const intersection = typeof IntersectionObserver === 'undefined' ? undefined : new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible && !frame && animateRef) animateRef();
    }, { rootMargin: '160px' });
    if (intersection) intersection.observe(root); else visible = true;

    const boot = async () => {
      try {
        const THREE = await import('three');
        const image = new Image(); image.src = '/Svaasth_logo.png'; await image.decode();
        if (cancelled || !root) return;
        if (window.matchMedia('(max-width: 520px)').matches) { root.classList.add('Svaasth-mobile-fallback'); return; }
        const traced = getLogoCanvas(image);
        const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: 'low-power' });
        renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, window.innerWidth < 700 ? 1.35 : 1.8));
        renderer.setSize(root.clientWidth, root.clientHeight); renderer.setClearColor(transparent ? 0x000000 : 0xf7faf7, transparent ? 0 : 1); renderer.outputColorSpace = THREE.SRGBColorSpace;
        renderer.domElement.setAttribute('aria-hidden', 'true'); root.appendChild(renderer.domElement); rendererRef = renderer;
        const scene = new THREE.Scene(); sceneRef = scene;
        const camera = new THREE.PerspectiveCamera(34, root.clientWidth / root.clientHeight, .1, 100); camera.position.set(0, 0, 8.2); cameraRef = camera;
        scene.add(new THREE.HemisphereLight(0xeafff4, 0x153f3b, 2.2));
        const key = new THREE.DirectionalLight(0xffffff, 3.1); key.position.set(-3, 4, 6); scene.add(key);
        const rim = new THREE.PointLight(0x51d4bc, 10, 10); rim.position.set(2.8, 1.7, 3); scene.add(rim);
        const cool = new THREE.PointLight(0x547eff, 4, 8); cool.position.set(-3, -2, 2); scene.add(cool);

        const rootGroup = new THREE.Group(); scene.add(rootGroup);
        const geometry = new THREE.PlaneGeometry(3.2, 4.11, 112, 144);
        const logoTexture = new THREE.CanvasTexture(traced.canvas); logoTexture.colorSpace = THREE.SRGBColorSpace; logoTexture.anisotropy = renderer.capabilities.getMaxAnisotropy();
        const glassUniforms = { uMap:{value:logoTexture},uTime:{value:0},uOrganic:{value:0},uRippleTime:{value:-100},uRippleCenter:{value:new THREE.Vector2(0,0)},uMouse:{value:new THREE.Vector2(0,0)},uOpacity:{value:1},uTexel:{value:new THREE.Vector2(1/traced.width,1/traced.height)},uTint:{value:new THREE.Color(0xffffff)},uBack:{value:0} };
        const backUniforms = { ...glassUniforms, uTint:{value:new THREE.Color(0x0b6355)}, uBack:{value:1}, uOpacity:{value:1} };
        const logoVertex = `
          varying vec2 vUv; uniform sampler2D uMap; uniform float uTime; uniform float uOrganic; uniform float uRippleTime; uniform vec2 uRippleCenter; uniform vec2 uMouse;
          void main(){ vUv=uv; vec4 tex=texture2D(uMap,uv); vec3 p=position; float a=tex.a;
            float organic=(sin(uv.y*10.0+uTime*.7)+cos(uv.x*8.0-uTime*.55))*.009*uOrganic;
            float d=length(position.xy-uRippleCenter); float age=max(0.0,uTime-uRippleTime);
            float ripple=sin(d*18.0-age*8.0)*exp(-d*1.6)*exp(-age*1.7)*.025;
            p.z+=organic+ripple; p.xy+=uMouse*.018;
            gl_Position=projectionMatrix*modelViewMatrix*vec4(p,1.0);
          }
        `;
        const logoFragment = `
          varying vec2 vUv; uniform sampler2D uMap; uniform float uOpacity; uniform vec2 uTexel; uniform vec3 uTint; uniform float uBack;
          #include <colorspace_pars_fragment>
          #include <tonemapping_pars_fragment>
          void main(){ vec4 tex=texture2D(uMap,vUv); if(tex.a<.025) discard;
            float l=texture2D(uMap,vUv-vec2(uTexel.x,0.0)).a; float r=texture2D(uMap,vUv+vec2(uTexel.x,0.0)).a;
            float d=texture2D(uMap,vUv-vec2(0.0,uTexel.y)).a; float u=texture2D(uMap,vUv+vec2(0.0,uTexel.y)).a;
            vec3 n=normalize(vec3((l-r)*2.6,(d-u)*2.6,1.0)); vec3 light=normalize(vec3(-.45,.72,.8));
            float diffuse=.985+.015*max(dot(n,light),0.0); float spec=pow(max(dot(reflect(-light,n),vec3(0.0,0.0,1.0)),0.0),28.0)*.055;
            float rim=pow(1.0-clamp(n.z,0.0,1.0),2.0); vec3 source=sRGBTransferEOTF(tex).rgb; vec3 base=mix(source,uTint,uBack);
            vec3 color=base*diffuse+vec3(.02,.07,.08)*rim+vec3(.12,.2,.22)*spec;
            gl_FragColor=vec4(color,tex.a*uOpacity);
            #include <tonemapping_fragment>
            #include <colorspace_fragment>
          }
        `;
        const makeLogoMaterial = (uniforms: typeof glassUniforms) => new THREE.ShaderMaterial({uniforms,vertexShader:logoVertex,fragmentShader:logoFragment,transparent:true,depthWrite:false,side:THREE.DoubleSide});
        // Use Three's built-in texture material for the brand face. Unlike a
        // hand-written shader it reliably handles the PNG alpha and sRGB colors
        // on every supported WebGL driver.
        const face = new THREE.MeshBasicMaterial({ map: logoTexture, transparent: true, opacity: 1, alphaTest: .025, side: THREE.DoubleSide, toneMapped: false });
        const back = new THREE.MeshBasicMaterial({ map: logoTexture, color: 0x397865, transparent: true, opacity: .38, alphaTest: .025, depthWrite: false, side: THREE.DoubleSide, toneMapped: false });
        const logo = new THREE.Mesh(geometry,face); logo.castShadow=true; rootGroup.add(logo);
        const logoBack = new THREE.Mesh(geometry,back); logoBack.scale.set(1.006,1.004,1); logoBack.position.z=-.075; rootGroup.add(logoBack);
        const originalScale = variant === 'glass' ? .91 : .84; rootGroup.scale.setScalar(originalScale);

        // A restrained glass seed gives the first stage depth without swallowing
        // the mark as it resolves. Keep it behind the logo and particle field.
        const blobGeometry = new THREE.SphereGeometry(.72, 64, 64);
        const blobMaterial = new THREE.MeshPhysicalMaterial({ color: 0x7bc6ae, roughness: .2, metalness: .04, transmission: .22, thickness: .45, ior: 1.28, clearcoat: .8, clearcoatRoughness: .16, transparent: true, opacity: variant === 'organic' ? .075 : 0, side: THREE.DoubleSide, depthWrite: false });
        const blobUniforms = { uTime: { value: 0 }, uOrganic: { value: 1 } };
        blobMaterial.onBeforeCompile = (shader) => {
          Object.assign(shader.uniforms, blobUniforms);
          shader.vertexShader = shader.vertexShader.replace('#include <common>', '#include <common>\nuniform float uTime; uniform float uOrganic;')
            .replace('#include <begin_vertex>', `#include <begin_vertex>
              float flow = sin(position.x*2.8+uTime*.65)*cos(position.y*2.2-uTime*.45)+sin(position.z*2.6+uTime*.35);
              transformed += normal * flow * .095 * uOrganic;
            `);
        };
        blobMaterial.customProgramCacheKey = () => 'Svaasth-organic-glass-v1';
        const blob = new THREE.Mesh(blobGeometry, blobMaterial); blob.position.z = -1.05; scene.add(blob);

        const random = (() => { let seed = 4127; return () => { seed = (seed * 16807) % 2147483647; return (seed - 1) / 2147483646; }; })();
        const count = window.innerWidth < 700 ? 380 : 720;
        const origins = new Float32Array(count * 3); const crosses = makeCrossPoints(count, random); const networks = new Float32Array(count * 3); const pulses = new Float32Array(count * 3); const logos = sampleLogoSurface(traced.pixels,traced.width,traced.height,count,random);
        const networkNodes: ThreeTypes.Vector3[] = [];
        for (let i = 0; i < 76; i++) { const u = random()*Math.PI*2; const v = Math.acos(2*random()-1); networkNodes.push(new THREE.Vector3(1.55*Math.sin(v)*Math.cos(u),1.65*Math.cos(v),(.7+random()*.5)*Math.sin(v)*Math.sin(u))); }
        for (let i = 0; i < count; i++) {
          const u = random()*Math.PI*2; const v = Math.acos(2*random()-1); const radius = 1.2+random()*.9;
          origins.set([radius*Math.sin(v)*Math.cos(u),radius*Math.cos(v),radius*Math.sin(v)*Math.sin(u)],i*3);
          const node = networkNodes[Math.floor(random()*networkNodes.length)]; networks.set([node.x+(random()-.5)*.1,node.y+(random()-.5)*.1,node.z+(random()-.5)*.1],i*3);
          const x = -1.72+random()*3.44; const ax = Math.abs(x); const peak = Math.exp(-Math.pow((ax-.35)/.12,2)); const pulseY = ax < .25 ? 0 : (ax < .5 ? (x<0?-1:1)*peak*.95 : Math.sin(x*2.1)*.04);
          pulses.set([x,pulseY+(random()-.5)*.045,(random()-.5)*.06],i*3);
        }
        const particleGeometry = new THREE.BufferGeometry();
        particleGeometry.setAttribute('position',new THREE.BufferAttribute(origins,3));
        particleGeometry.setAttribute('aOrigin',new THREE.BufferAttribute(origins,3)); particleGeometry.setAttribute('aCross',new THREE.BufferAttribute(crosses,3)); particleGeometry.setAttribute('aNetwork',new THREE.BufferAttribute(networks,3)); particleGeometry.setAttribute('aPulse',new THREE.BufferAttribute(pulses,3)); particleGeometry.setAttribute('aLogo',new THREE.BufferAttribute(logos,3));
        const particleUniforms = { uProgress:{value:variant==='glass'?1:0},uTime:{value:0},uPixelRatio:{value:renderer.getPixelRatio()} };
        const particleMaterial = new THREE.ShaderMaterial({ uniforms:particleUniforms,vertexShader:particleVertex,fragmentShader:particleFragment,transparent:true,depthWrite:false,blending:THREE.AdditiveBlending });
        const particleCloud = new THREE.Points(particleGeometry,particleMaterial); scene.add(particleCloud);

        const crossShape = new THREE.Shape(); crossShape.moveTo(-.28,-1.15);crossShape.lineTo(.28,-1.15);crossShape.lineTo(.28,-.28);crossShape.lineTo(1.05,-.28);crossShape.lineTo(1.05,.28);crossShape.lineTo(.28,.28);crossShape.lineTo(.28,1.15);crossShape.lineTo(-.28,1.15);crossShape.lineTo(-.28,.28);crossShape.lineTo(-1.05,.28);crossShape.lineTo(-1.05,-.28);crossShape.lineTo(-.28,-.28);crossShape.closePath();
        const crossGeometry = new THREE.ExtrudeGeometry(crossShape,{depth:.17,bevelEnabled:true,bevelSegments:3,bevelSize:.035,bevelThickness:.035});crossGeometry.center();
        const crossMaterial = new THREE.MeshPhysicalMaterial({color:0x65cbb0,roughness:.18,metalness:.38,transmission:.28,thickness:.6,clearcoat:1,transparent:true,opacity:0});
        const cross = new THREE.Mesh(crossGeometry,crossMaterial); scene.add(cross);

        const linePositions:number[]=[];
        for(let i=0;i<networkNodes.length;i++) for(let j=i+1;j<networkNodes.length;j++) if(networkNodes[i].distanceTo(networkNodes[j])<.85 && random()>.32) linePositions.push(networkNodes[i].x,networkNodes[i].y,networkNodes[i].z,networkNodes[j].x,networkNodes[j].y,networkNodes[j].z);
        const networkGeometry=new THREE.BufferGeometry();networkGeometry.setAttribute('position',new THREE.Float32BufferAttribute(linePositions,3));
        const networkMaterial=new THREE.LineBasicMaterial({color:0x62cab1,transparent:true,opacity:0,blending:THREE.AdditiveBlending});
        const network=new THREE.LineSegments(networkGeometry,networkMaterial);scene.add(network);
        const wavePoints:ThreeTypes.Vector3[]=[];for(let i=0;i<=180;i++){const x=-1.85+i/180*3.7;const ax=Math.abs(x);let y=0;if(ax>.18&&ax<.36)y=(x<0?-1:1)*Math.sin((ax-.18)/.18*Math.PI)*.92;else y=Math.sin(x*2)*.025;wavePoints.push(new THREE.Vector3(x,y,0));}
        const waveGeometry=new THREE.BufferGeometry().setFromPoints(wavePoints);const waveMaterial=new THREE.LineBasicMaterial({color:0x47bda4,transparent:true,opacity:0,linewidth:2});const wave=new THREE.Line(waveGeometry,waveMaterial);scene.add(wave);

        const pointer=new THREE.Vector2();const targetPointer=new THREE.Vector2();const raycaster=new THREE.Raycaster();const ndc=new THREE.Vector2();
        const onPointerMove=(event:PointerEvent)=>{const rect=root!.getBoundingClientRect();targetPointer.set((event.clientX-rect.left)/rect.width-.5,(event.clientY-rect.top)/rect.height-.5);};
        const onPointerLeave=()=>targetPointer.set(0,0);
        const onPointerDown=(event:PointerEvent)=>{const rect=root!.getBoundingClientRect();ndc.set(((event.clientX-rect.left)/rect.width)*2-1,-(((event.clientY-rect.top)/rect.height)*2-1));raycaster.setFromCamera(ndc,camera);const hit=raycaster.intersectObject(logo,false)[0];if(hit){glassUniforms.uRippleCenter.value.set(hit.point.x,hit.point.y);glassUniforms.uRippleTime.value=clock.getElapsedTime();root!.classList.remove('ripple-fired');void root!.offsetWidth;root!.classList.add('ripple-fired');}};
        root.addEventListener('pointermove',onPointerMove,{passive:true});root.addEventListener('pointerleave',onPointerLeave);root.addEventListener('pointerdown',onPointerDown);
        const resize=new ResizeObserver(()=>{if(!root||!cameraRef||!rendererRef)return;const w=root.clientWidth,h=root.clientHeight;if(!w||!h)return;cameraRef.aspect=w/h;cameraRef.updateProjectionMatrix();rendererRef.setSize(w,h);particleUniforms.uPixelRatio.value=rendererRef.getPixelRatio();});resize.observe(root);
        const clock=new THREE.Clock();
        const smooth=(a:number,b:number,x:number)=>THREE.MathUtils.smoothstep(x,a,b);
        const render=()=>{
          if(cancelled||!visible){frame=0;return;}
          const elapsed=clock.getElapsedTime()*speed;const p=variant==='glass'?1:THREE.MathUtils.clamp(progressRef.current,0,1);
          pointer.lerp(targetPointer,.055);rootGroup.rotation.y+=(pointer.x*.45-rootGroup.rotation.y)*.035;rootGroup.rotation.x+=(-pointer.y*.32-rootGroup.rotation.x)*.035;rootGroup.rotation.y+=reducedMotion?0:.001;
          rootGroup.position.y=reducedMotion?0:Math.sin(elapsed*.72)*.055;rootGroup.scale.setScalar(originalScale*(variant==='organic'?.72+smooth(.48,.78,p)*.28:1));
          blobMaterial.opacity=variant==='glass'?0:.075*(1-smooth(.08,.3,p));blobUniforms.uTime.value=elapsed;blobUniforms.uOrganic.value=variant==='glass'?0:1-smooth(.1,.38,p);
          crossMaterial.opacity=variant==='glass'?0:.8*smooth(.13,.22,p)*(1-smooth(.31,.4,p));networkMaterial.opacity=variant==='glass'?0:.52*smooth(.33,.43,p)*(1-smooth(.48,.58,p));waveMaterial.opacity=variant==='glass'?0:.95*smooth(.5,.6,p)*(1-smooth(.63,.72,p));
          glassUniforms.uOpacity.value=variant==='glass'?1:smooth(.61,.8,p);backUniforms.uOpacity.value=glassUniforms.uOpacity.value;face.opacity=glassUniforms.uOpacity.value;back.opacity=variant==='glass'?.38:glassUniforms.uOpacity.value*.38;
          glassUniforms.uTime.value=elapsed;glassUniforms.uOrganic.value=variant==='glass'?.22:(1-smooth(.7,.94,p))*.82;glassUniforms.uMouse.value.set(pointer.x,pointer.y);
          backUniforms.uTime.value=glassUniforms.uTime.value;backUniforms.uOrganic.value=glassUniforms.uOrganic.value;backUniforms.uMouse.value.set(pointer.x,pointer.y);backUniforms.uRippleTime.value=glassUniforms.uRippleTime.value;backUniforms.uRippleCenter.value.copy(glassUniforms.uRippleCenter.value);
          particleUniforms.uTime.value=elapsed;particleUniforms.uProgress.value=p;particleCloud.rotation.y=elapsed*.025*(reducedMotion?0:1);
          camera.position.z=variant==='glass'?8.2:8.3-(smooth(.55,.95,p)*.6);camera.position.x+=(pointer.x*.18-camera.position.x)*.025;camera.lookAt(0,0,0);
          renderer.render(scene,camera);frame=window.requestAnimationFrame(render);
        };
        animateRef=()=>{if(!frame&&!cancelled)render();};
        root.classList.add('Svaasth-webgl-ready');if(visible)animateRef();
        cleanup=()=>{cancelled=true;window.cancelAnimationFrame(frame);resize.disconnect();root.removeEventListener('pointermove',onPointerMove);root.removeEventListener('pointerleave',onPointerLeave);root.removeEventListener('pointerdown',onPointerDown);root.classList.remove('Svaasth-webgl-ready');scene.traverse((object)=>{if(object instanceof THREE.Mesh||object instanceof THREE.Points||object instanceof THREE.LineSegments||object instanceof THREE.Line){object.geometry.dispose();const material=object.material;if(Array.isArray(material))material.forEach((item)=>item.dispose());else material.dispose();}});logoTexture.dispose();renderer.dispose();if(renderer.domElement.parentElement===root)root.removeChild(renderer.domElement);};
      } catch { /* The original logo remains as the no-WebGL fallback. */ }
    };
    boot();
    return()=>{cancelled=true;intersection?.disconnect();cleanup();};
  },[variant,reducedMotion,transparent,speed]);

  const dimensions = { ...(width ? { width } : {}), ...(height ? { height } : {}) };
  if (variant === 'glass') return <div className={`Svaasth-glass-hero ${className}`} style={dimensions}>
    <div className="Svaasth-glass-canvas original-mark-stage" aria-label="Svaasth logo"><img src="/Svaasth_logo.png" alt="Svaasth HMS"/></div>
    <motion.div className="Svaasth-hero-wordmark" initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} transition={{delay:.35}}><b>Svaasth</b><span>Healthcare. Connected.</span></motion.div>
    <span className="Svaasth-interaction-hint"><span>Move to explore</span><i/></span>
  </div>;

  const jumpToStage = (index: number) => {
    const section = sectionRef.current; if (!section) return;
    const top = section.getBoundingClientRect().top + window.scrollY;
    const scrollRange = Math.max(0, section.offsetHeight - window.innerHeight);
    window.scrollTo({ top: top + scrollRange * (index / 5), behavior: reducedMotion ? 'auto' : 'smooth' });
  };

  return <section className={`Svaasth-morph-section ${className}`} ref={sectionRef} style={dimensions} aria-label="Svaasth logo transformation controlled by scrolling">
    <div className={`Svaasth-morph-sticky morph-stage-${activeStage}`}><div className="morph-copy"><span className="eyebrow">THE Svaasth MARK, IN MOTION</span><AnimatePresence mode="wait"><motion.div key={activeStage} className="morph-stage-copy" initial={reducedMotion?false:{opacity:0,y:12}} animate={{opacity:1,y:0}} exit={reducedMotion?undefined:{opacity:0,y:-8}} transition={{duration:.32}}><small>{stages[activeStage].name.toUpperCase()}</small><h2>{stages[activeStage].line}</h2></motion.div></AnimatePresence><p>Scroll to watch the original Svaasth symbol form from living light, then settle into its glass finish.</p><div className="morph-wordmark"><b>Svaasth</b><span>Healthcare. Connected.</span></div></div>
      <div className="Svaasth-organic-canvas" ref={canvasRef}><img src="/Svaasth_logo.png" alt="Svaasth logo"/><span className="morph-click-hint">Click the mark for a ripple</span></div>
      <div className="morph-timeline" aria-label="Transformation timeline">{stages.map((stage,index)=>{const Icon=[Activity,Plus,Users,Activity,ShieldCheck,Check][index];return <button type="button" key={stage.name} className={activeStage===index?'active':''} aria-label={`Go to stage ${stage.name}`} aria-current={activeStage===index?'step':undefined} onClick={()=>jumpToStage(index)}><span><Icon size={13}/></span><small>{stage.name}</small></button>;})}<button className="morph-reset" onClick={()=>jumpToStage(0)} aria-label="Replay transformation"><RotateCcw size={14}/><small>Replay</small></button></div>
      <span className="morph-scroll-cue"><span>SCROLL TO TRANSFORM</span><i/></span>
    </div>
  </section>;
}
