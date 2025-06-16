// 导入Three.js 3D图形库
import * as THREE from 'three';

/**
 * 游戏世界管理类
 * 负责3D场景的创建、管理和渲染
 *
 * 主要功能:
 * - 3D场景初始化和管理
 * - 相机系统配置
 * - WebGL渲染器设置
 * - 光照系统设计
 * - 星空背景生成
 * - 粒子效果管理
 * - 窗口自适应处理
 *
 * @author 9531lyj
 * @version 2.0
 */
export class GameWorld {
  public scene!: THREE.Scene;              // 3D场景对象
  public camera!: THREE.PerspectiveCamera; // 透视相机
  public renderer!: THREE.WebGLRenderer;   // WebGL渲染器
  public canvas: HTMLCanvasElement;         // HTML5画布元素

  /**
   * 构造函数 - 初始化游戏世界
   * @param canvas HTML5 Canvas画布元素
   */
  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.initScene();      // 初始化3D场景
    this.initCamera();     // 初始化相机系统
    this.initRenderer();   // 初始化渲染器
    this.initLighting();   // 初始化光照系统
    this.createStarField(); // 创建星空背景
  }

  private initScene(): void {
    this.scene = new THREE.Scene();
    this.scene.fog = new THREE.Fog(0x000000, 1000, 10000);
  }

  private initCamera(): void {
    this.camera = new THREE.PerspectiveCamera(
      75, // 视野角度
      window.innerWidth / window.innerHeight, // 宽高比
      0.1, // 近裁剪面
      10000 // 远裁剪面
    );
    this.camera.position.set(0, 50, 100);
  }

  private initRenderer(): void {
    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      antialias: true,
      alpha: true
    });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.setClearColor(0x000011, 1);
  }

  private initLighting(): void {
    // 环境光 - 增强亮度
    const ambientLight = new THREE.AmbientLight(0x404080, 0.4);
    this.scene.add(ambientLight);

    // 主方向光（模拟恒星光）
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1.2);
    directionalLight.position.set(200, 200, 100);
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.width = 4096;
    directionalLight.shadow.mapSize.height = 4096;
    directionalLight.shadow.camera.near = 0.5;
    directionalLight.shadow.camera.far = 1000;
    directionalLight.shadow.camera.left = -200;
    directionalLight.shadow.camera.right = 200;
    directionalLight.shadow.camera.top = 200;
    directionalLight.shadow.camera.bottom = -200;
    this.scene.add(directionalLight);

    // 蓝色点光源（营造太空氛围）
    const bluePointLight = new THREE.PointLight(0x0088ff, 0.8, 500);
    bluePointLight.position.set(-100, 50, -50);
    this.scene.add(bluePointLight);

    // 红色点光源（战斗氛围）
    const redPointLight = new THREE.PointLight(0xff4400, 0.6, 300);
    redPointLight.position.set(100, -50, 50);
    this.scene.add(redPointLight);

    // 动态光源（跟随玩家）
    const dynamicLight = new THREE.PointLight(0x00ffaa, 0.5, 200);
    dynamicLight.name = 'dynamicLight';
    this.scene.add(dynamicLight);
  }

  private createStarField(): void {
    // 创建多层星空
    this.createStarLayer(15000, 1.5, 0xffffff, 'nearStars');
    this.createStarLayer(8000, 1.0, 0xaaccff, 'midStars');
    this.createStarLayer(5000, 0.5, 0x8899ff, 'farStars');

    // 创建星云效果
    this.createNebula();
  }

  private createStarLayer(count: number, size: number, color: number, name: string): void {
    const starGeometry = new THREE.BufferGeometry();
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);

    for (let i = 0; i < count * 3; i += 3) {
      positions[i] = (Math.random() - 0.5) * 30000; // x
      positions[i + 1] = (Math.random() - 0.5) * 30000; // y
      positions[i + 2] = (Math.random() - 0.5) * 30000; // z

      // 随机星星颜色变化
      const colorVariation = 0.3;
      const r = ((color >> 16) & 255) / 255;
      const g = ((color >> 8) & 255) / 255;
      const b = (color & 255) / 255;

      colors[i] = Math.min(1, r + (Math.random() - 0.5) * colorVariation);
      colors[i + 1] = Math.min(1, g + (Math.random() - 0.5) * colorVariation);
      colors[i + 2] = Math.min(1, b + (Math.random() - 0.5) * colorVariation);
    }

    starGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    starGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const starMaterial = new THREE.PointsMaterial({
      size: size,
      sizeAttenuation: false,
      vertexColors: true,
      transparent: true,
      opacity: 0.8
    });

    const stars = new THREE.Points(starGeometry, starMaterial);
    stars.name = name;
    this.scene.add(stars);
  }

  private createNebula(): void {
    // 创建星云粒子效果
    const nebulaGeometry = new THREE.BufferGeometry();
    const nebulaCount = 2000;
    const positions = new Float32Array(nebulaCount * 3);
    const colors = new Float32Array(nebulaCount * 3);

    for (let i = 0; i < nebulaCount * 3; i += 3) {
      positions[i] = (Math.random() - 0.5) * 25000;
      positions[i + 1] = (Math.random() - 0.5) * 25000;
      positions[i + 2] = (Math.random() - 0.5) * 25000;

      // 星云颜色（紫色和蓝色）
      colors[i] = 0.5 + Math.random() * 0.5; // 红
      colors[i + 1] = 0.2 + Math.random() * 0.3; // 绿
      colors[i + 2] = 0.8 + Math.random() * 0.2; // 蓝
    }

    nebulaGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    nebulaGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const nebulaMaterial = new THREE.PointsMaterial({
      size: 8,
      sizeAttenuation: true,
      vertexColors: true,
      transparent: true,
      opacity: 0.3,
      blending: THREE.AdditiveBlending
    });

    const nebula = new THREE.Points(nebulaGeometry, nebulaMaterial);
    nebula.name = 'nebula';
    this.scene.add(nebula);
  }

  public onWindowResize(): void {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }

  public render(): void {
    this.renderer.render(this.scene, this.camera);
  }

  public addToScene(object: THREE.Object3D): void {
    this.scene.add(object);
  }

  public removeFromScene(object: THREE.Object3D): void {
    this.scene.remove(object);
  }
}
