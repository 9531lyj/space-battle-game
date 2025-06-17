import * as THREE from 'three';

export class Crosshair {
  private crosshairElement!: HTMLElement;
  private targetIndicators: HTMLElement[] = [];
  private camera: THREE.PerspectiveCamera;

  private raycaster: THREE.Raycaster;
  private mouse: THREE.Vector2;
  private canvas: HTMLCanvasElement;
  private isAiming: boolean = false;
  private zoomLevel: number = 1;
  private maxZoom: number = 3;
  private minZoom: number = 1;

  constructor(camera: THREE.PerspectiveCamera, _scene: THREE.Scene, canvas: HTMLCanvasElement) {
    this.camera = camera;
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
    // 只保留鼠标移动事件用于更新鼠标位置
    this.canvas.addEventListener('mousemove', (event) => {
      this.updateMousePosition(event);
    });
  }

  private updateMousePosition(event: MouseEvent): void {
    const rect = this.canvas.getBoundingClientRect();
    this.mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    this.mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
  }

  public startAiming(): void {
    this.isAiming = true;
    this.crosshairElement.classList.add('aiming');

    // 轻微缩放相机视野
    this.camera.fov = 75 / this.zoomLevel;
    this.camera.updateProjectionMatrix();

    console.log('🎯 进入瞄准模式');
  }

  public stopAiming(): void {
    this.isAiming = false;
    this.crosshairElement.classList.remove('aiming');

    // 恢复相机视野
    this.camera.fov = 75;
    this.camera.updateProjectionMatrix();

    console.log('🎯 退出瞄准模式');
  }

  public handleZoom(deltaY: number): void {
    if (!this.isAiming) return;

    const zoomSpeed = 0.1;
    const oldZoomLevel = this.zoomLevel;

    if (deltaY > 0) {
      this.zoomLevel = Math.max(this.minZoom, this.zoomLevel - zoomSpeed);
    } else {
      this.zoomLevel = Math.min(this.maxZoom, this.zoomLevel + zoomSpeed);
    }

    // 只有缩放级别真正改变时才更新相机
    if (Math.abs(this.zoomLevel - oldZoomLevel) > 0.01) {
      this.camera.fov = 75 / this.zoomLevel;
      this.camera.updateProjectionMatrix();

      // 更新缩放指示器
      const zoomText = this.crosshairElement.querySelector('.zoom-text');
      if (zoomText) {
        zoomText.textContent = `${this.zoomLevel.toFixed(1)}x`;
      }

      console.log(`🔍 瞄准镜缩放: ${this.zoomLevel.toFixed(1)}x`);
    }
  }

  public update(enemies: any[], playerPosition?: THREE.Vector3): void {
    // 清除旧的目标指示器
    this.clearTargetIndicators();

    // 更新瞄准镜动画
    this.updateCrosshairAnimation();

    if (!this.isAiming) {
      // 非瞄准状态下显示附近敌机
      this.showNearbyEnemies(enemies, playerPosition);
      return;
    }

    // 瞄准状态下的精确检测
    this.raycaster.setFromCamera(this.mouse, this.camera);

    let closestEnemy = null;
    let closestDistance = Infinity;

    // 检测所有敌机，找到最近的目标
    enemies.forEach(enemy => {
      const intersects = this.raycaster.intersectObject(enemy.mesh, true);
      if (intersects.length > 0) {
        const distance = intersects[0].distance;
        if (distance < closestDistance) {
          closestDistance = distance;
          closestEnemy = enemy;
        }
        this.createTargetIndicator(enemy, distance, distance === closestDistance);
      }
    });

    // 更新瞄准精度指示器
    this.updateAimingAccuracy(closestEnemy, closestDistance);
  }

  private createTargetIndicator(enemy: any, distance: number, isPrimary: boolean = false): void {
    // 将3D位置转换为屏幕坐标
    const vector = enemy.position.clone();
    vector.project(this.camera);

    const x = (vector.x * 0.5 + 0.5) * window.innerWidth;
    const y = (vector.y * -0.5 + 0.5) * window.innerHeight;

    // 创建目标指示器
    const indicator = document.createElement('div');
    indicator.className = isPrimary ? 'target-indicator primary-target' : 'target-indicator';
    indicator.style.left = `${x}px`;
    indicator.style.top = `${y}px`;

    // 主要目标使用不同样式
    if (isPrimary) {
      indicator.style.borderColor = '#ff0000';
      indicator.style.borderWidth = '3px';
      indicator.style.boxShadow = '0 0 20px rgba(255, 0, 0, 0.8)';
    }

    // 添加距离和健康状态指示器
    const infoDiv = document.createElement('div');
    infoDiv.className = 'target-info';
    infoDiv.innerHTML = `
      <div class="distance">${Math.round(distance)}m</div>
      <div class="health">${Math.round(enemy.health)}HP</div>
    `;
    infoDiv.style.cssText = `
      position: absolute;
      top: -40px;
      left: 50%;
      transform: translateX(-50%);
      background: rgba(0, 0, 0, 0.8);
      color: ${isPrimary ? '#ff0000' : '#ffffff'};
      padding: 2px 6px;
      border-radius: 3px;
      font-size: 10px;
      font-weight: bold;
      white-space: nowrap;
      text-align: center;
    `;
    indicator.appendChild(infoDiv);

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

  private updateCrosshairAnimation(): void {
    const time = Date.now() * 0.001;

    // 瞄准镜呼吸效果
    const breathScale = 1 + Math.sin(time * 2) * 0.02;
    this.crosshairElement.style.transform = `translate(-50%, -50%) scale(${breathScale})`;

    // 准星闪烁效果
    const center = this.crosshairElement.querySelector('.crosshair-center') as HTMLElement;
    if (center) {
      center.style.opacity = (0.8 + Math.sin(time * 4) * 0.2).toString();
    }
  }

  private showNearbyEnemies(enemies: any[], playerPosition?: THREE.Vector3): void {
    if (!playerPosition) return;

    // 显示附近敌机的方向指示器
    enemies.forEach(enemy => {
      const distance = enemy.position.distanceTo(playerPosition);
      if (distance < 200) { // 200单位范围内
        this.createDirectionIndicator(enemy, distance);
      }
    });
  }

  private createDirectionIndicator(enemy: any, distance: number): void {
    // 计算敌机在屏幕边缘的指示位置
    const vector = enemy.position.clone();
    vector.project(this.camera);

    // 限制在屏幕边缘
    const margin = 50;
    let x = (vector.x * 0.5 + 0.5) * window.innerWidth;
    let y = (vector.y * -0.5 + 0.5) * window.innerHeight;

    x = Math.max(margin, Math.min(window.innerWidth - margin, x));
    y = Math.max(margin, Math.min(window.innerHeight - margin, y));

    const indicator = document.createElement('div');
    indicator.className = 'direction-indicator';
    indicator.style.cssText = `
      position: fixed;
      left: ${x}px;
      top: ${y}px;
      width: 20px;
      height: 20px;
      border: 2px solid #ffaa00;
      border-radius: 50%;
      transform: translate(-50%, -50%);
      pointer-events: none;
      z-index: 998;
      opacity: ${Math.max(0.3, 1 - distance / 200)};
    `;

    document.body.appendChild(indicator);
    this.targetIndicators.push(indicator);
  }

  private updateAimingAccuracy(closestEnemy: any, distance: number): void {
    const accuracyElement = this.crosshairElement.querySelector('.accuracy-indicator');
    if (!accuracyElement) {
      // 创建精度指示器
      const accuracy = document.createElement('div');
      accuracy.className = 'accuracy-indicator';
      accuracy.style.cssText = `
        position: absolute;
        bottom: -80px;
        left: 50%;
        transform: translateX(-50%);
        background: rgba(0, 0, 0, 0.8);
        padding: 5px 10px;
        border-radius: 5px;
        border: 1px solid #00ff00;
        color: #00ff00;
        font-size: 12px;
        font-weight: bold;
        text-align: center;
        min-width: 100px;
      `;
      this.crosshairElement.appendChild(accuracy);
    }

    const accuracy = this.crosshairElement.querySelector('.accuracy-indicator') as HTMLElement;
    if (closestEnemy && distance < 300) {
      const hitChance = Math.max(20, 100 - distance / 3);
      accuracy.textContent = `命中率: ${Math.round(hitChance)}%`;
      accuracy.style.color = hitChance > 70 ? '#00ff00' : hitChance > 40 ? '#ffff00' : '#ff4400';
      accuracy.style.borderColor = accuracy.style.color;
    } else {
      accuracy.textContent = '无目标';
      accuracy.style.color = '#666666';
      accuracy.style.borderColor = '#666666';
    }
  }

  public dispose(): void {
    this.clearTargetIndicators();
    if (this.crosshairElement.parentNode) {
      this.crosshairElement.parentNode.removeChild(this.crosshairElement);
    }
  }

  /**
   * 重置瞄准镜状态
   * 用于游戏重新开始时恢复初始状态
   */
  public reset(): void {
    // 重置瞄准状态
    this.isAiming = false;
    this.zoomLevel = 1;

    // 重置鼠标位置
    this.mouse.set(0, 0);

    // 清除所有目标指示器
    this.clearTargetIndicators();

    // 重置瞄准镜样式
    this.crosshairElement.classList.remove('aiming');
    this.crosshairElement.style.transform = 'translate(-50%, -50%) scale(1)';

    // 重置相机视野
    this.camera.fov = 75;
    this.camera.updateProjectionMatrix();

    // 重置缩放指示器
    const zoomText = this.crosshairElement.querySelector('.zoom-text');
    if (zoomText) {
      zoomText.textContent = '1.0x';
    }

    // 重置精度指示器
    const accuracyElement = this.crosshairElement.querySelector('.accuracy-indicator') as HTMLElement;
    if (accuracyElement) {
      accuracyElement.textContent = '无目标';
      accuracyElement.style.color = '#666666';
      accuracyElement.style.borderColor = '#666666';
    }

    console.log('✅ 瞄准镜状态已重置');
  }
}
