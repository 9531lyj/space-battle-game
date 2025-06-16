import * as THREE from 'three';

export class Crosshair {
  private crosshairElement: HTMLElement;
  private targetIndicators: HTMLElement[] = [];
  private camera: THREE.PerspectiveCamera;
  private scene: THREE.Scene;
  private raycaster: THREE.Raycaster;
  private mouse: THREE.Vector2;
  private canvas: HTMLCanvasElement;
  private isAiming: boolean = false;
  private zoomLevel: number = 1;
  private maxZoom: number = 3;
  private minZoom: number = 1;

  constructor(camera: THREE.PerspectiveCamera, scene: THREE.Scene, canvas: HTMLCanvasElement) {
    this.camera = camera;
    this.scene = scene;
    this.canvas = canvas;
    this.raycaster = new THREE.Raycaster();
    this.mouse = new THREE.Vector2();
    
    this.createCrosshair();
    this.initEventListeners();
  }

  private createCrosshair(): void {
    // 创建瞄准镜容器
    this.crosshairElement = document.createElement('div');
    this.crosshairElement.id = 'crosshair';
    this.crosshairElement.innerHTML = `
      <div class="crosshair-center"></div>
      <div class="crosshair-line crosshair-top"></div>
      <div class="crosshair-line crosshair-bottom"></div>
      <div class="crosshair-line crosshair-left"></div>
      <div class="crosshair-line crosshair-right"></div>
      <div class="crosshair-circle"></div>
      <div class="zoom-indicator">
        <span class="zoom-text">1.0x</span>
      </div>
    `;
    
    document.body.appendChild(this.crosshairElement);
    this.addCrosshairStyles();
  }

  private addCrosshairStyles(): void {
    const style = document.createElement('style');
    style.textContent = `
      #crosshair {
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        pointer-events: none;
        z-index: 1000;
        transition: all 0.3s ease;
      }

      .crosshair-center {
        width: 4px;
        height: 4px;
        background: #00ff00;
        border-radius: 50%;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        box-shadow: 0 0 10px #00ff00;
      }

      .crosshair-line {
        background: #00ff00;
        position: absolute;
        box-shadow: 0 0 5px #00ff00;
      }

      .crosshair-top, .crosshair-bottom {
        width: 2px;
        height: 20px;
        left: 50%;
        transform: translateX(-50%);
      }

      .crosshair-top {
        top: -30px;
      }

      .crosshair-bottom {
        bottom: -30px;
      }

      .crosshair-left, .crosshair-right {
        width: 20px;
        height: 2px;
        top: 50%;
        transform: translateY(-50%);
      }

      .crosshair-left {
        left: -30px;
      }

      .crosshair-right {
        right: -30px;
      }

      .crosshair-circle {
        width: 80px;
        height: 80px;
        border: 1px solid #00ff00;
        border-radius: 50%;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        opacity: 0.6;
        box-shadow: 0 0 15px rgba(0, 255, 0, 0.3);
      }

      .zoom-indicator {
        position: absolute;
        top: -60px;
        left: 50%;
        transform: translateX(-50%);
        background: rgba(0, 0, 0, 0.8);
        padding: 5px 10px;
        border-radius: 5px;
        border: 1px solid #00ff00;
      }

      .zoom-text {
        color: #00ff00;
        font-size: 14px;
        font-weight: bold;
        text-shadow: 0 0 5px #00ff00;
      }

      #crosshair.aiming {
        transform: translate(-50%, -50%) scale(1.2);
      }

      #crosshair.aiming .crosshair-center {
        background: #ff4400;
        box-shadow: 0 0 15px #ff4400;
      }

      #crosshair.aiming .crosshair-line {
        background: #ff4400;
        box-shadow: 0 0 8px #ff4400;
      }

      #crosshair.aiming .crosshair-circle {
        border-color: #ff4400;
        box-shadow: 0 0 20px rgba(255, 68, 0, 0.5);
      }

      .target-indicator {
        position: fixed;
        width: 30px;
        height: 30px;
        border: 2px solid #ff0000;
        border-radius: 50%;
        pointer-events: none;
        z-index: 999;
        animation: targetPulse 1s infinite;
        transform: translate(-50%, -50%);
      }

      @keyframes targetPulse {
        0%, 100% { 
          transform: translate(-50%, -50%) scale(1);
          opacity: 1;
        }
        50% { 
          transform: translate(-50%, -50%) scale(1.2);
          opacity: 0.7;
        }
      }

      .distance-indicator {
        position: absolute;
        top: -25px;
        left: 50%;
        transform: translateX(-50%);
        background: rgba(0, 0, 0, 0.8);
        color: #ff0000;
        padding: 2px 6px;
        border-radius: 3px;
        font-size: 10px;
        font-weight: bold;
        white-space: nowrap;
      }
    `;
    document.head.appendChild(style);
  }

  private initEventListeners(): void {
    // 鼠标移动事件
    this.canvas.addEventListener('mousemove', (event) => {
      this.updateMousePosition(event);
    });

    // 右键瞄准
    this.canvas.addEventListener('mousedown', (event) => {
      if (event.button === 2) { // 右键
        this.startAiming();
      }
    });

    this.canvas.addEventListener('mouseup', (event) => {
      if (event.button === 2) { // 右键
        this.stopAiming();
      }
    });

    // 滚轮缩放
    this.canvas.addEventListener('wheel', (event) => {
      event.preventDefault();
      this.handleZoom(event.deltaY);
    });

    // 防止右键菜单
    this.canvas.addEventListener('contextmenu', (event) => {
      event.preventDefault();
    });
  }

  private updateMousePosition(event: MouseEvent): void {
    const rect = this.canvas.getBoundingClientRect();
    this.mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    this.mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
  }

  private startAiming(): void {
    this.isAiming = true;
    this.crosshairElement.classList.add('aiming');
    
    // 轻微缩放相机视野
    this.camera.fov = 75 / this.zoomLevel;
    this.camera.updateProjectionMatrix();
  }

  private stopAiming(): void {
    this.isAiming = false;
    this.crosshairElement.classList.remove('aiming');
    
    // 恢复相机视野
    this.camera.fov = 75;
    this.camera.updateProjectionMatrix();
  }

  private handleZoom(deltaY: number): void {
    if (!this.isAiming) return;

    const zoomSpeed = 0.1;
    if (deltaY > 0) {
      this.zoomLevel = Math.max(this.minZoom, this.zoomLevel - zoomSpeed);
    } else {
      this.zoomLevel = Math.min(this.maxZoom, this.zoomLevel + zoomSpeed);
    }

    this.camera.fov = 75 / this.zoomLevel;
    this.camera.updateProjectionMatrix();

    // 更新缩放指示器
    const zoomText = this.crosshairElement.querySelector('.zoom-text');
    if (zoomText) {
      zoomText.textContent = `${this.zoomLevel.toFixed(1)}x`;
    }
  }

  public update(enemies: any[]): void {
    // 清除旧的目标指示器
    this.clearTargetIndicators();

    if (!this.isAiming) return;

    // 射线检测
    this.raycaster.setFromCamera(this.mouse, this.camera);
    
    // 检测敌机
    enemies.forEach(enemy => {
      const intersects = this.raycaster.intersectObject(enemy.mesh, true);
      if (intersects.length > 0) {
        this.createTargetIndicator(enemy, intersects[0].distance);
      }
    });
  }

  private createTargetIndicator(enemy: any, distance: number): void {
    // 将3D位置转换为屏幕坐标
    const vector = enemy.position.clone();
    vector.project(this.camera);

    const x = (vector.x * 0.5 + 0.5) * window.innerWidth;
    const y = (vector.y * -0.5 + 0.5) * window.innerHeight;

    // 创建目标指示器
    const indicator = document.createElement('div');
    indicator.className = 'target-indicator';
    indicator.style.left = `${x}px`;
    indicator.style.top = `${y}px`;

    // 添加距离指示器
    const distanceDiv = document.createElement('div');
    distanceDiv.className = 'distance-indicator';
    distanceDiv.textContent = `${Math.round(distance)}m`;
    indicator.appendChild(distanceDiv);

    document.body.appendChild(indicator);
    this.targetIndicators.push(indicator);
  }

  private clearTargetIndicators(): void {
    this.targetIndicators.forEach(indicator => {
      if (indicator.parentNode) {
        indicator.parentNode.removeChild(indicator);
      }
    });
    this.targetIndicators = [];
  }

  public getAimingDirection(): THREE.Vector3 {
    this.raycaster.setFromCamera(this.mouse, this.camera);
    return this.raycaster.ray.direction.clone();
  }

  public isCurrentlyAiming(): boolean {
    return this.isAiming;
  }

  public getZoomLevel(): number {
    return this.zoomLevel;
  }

  public dispose(): void {
    this.clearTargetIndicators();
    if (this.crosshairElement.parentNode) {
      this.crosshairElement.parentNode.removeChild(this.crosshairElement);
    }
  }
}
